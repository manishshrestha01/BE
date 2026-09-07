'use client'
import { useEffect, useState } from "react";
import { FileText, Loader2, Image as ImageIcon } from "lucide-react";
import { getNoteChapterConfig, getChapterNumberFromFileName } from "../../lib/chapterNotesConfig";
import PdfPageReader from "./PdfPageReader";

const FILE_TYPE_LABELS = {
  pdf: "PDF",
  img: "Image",
  txt: "Text",
  docx: "Word",
  pptx: "Slides",
  other: "File",
};

function getFileType(name = "") {
  const ext = name.toLowerCase().split(".").pop() || "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(ext)) return "img";
  if (["txt", "md", "rtf"].includes(ext)) return "txt";
  if (["doc", "docx"].includes(ext)) return "docx";
  if (["ppt", "pptx"].includes(ext)) return "pptx";
  return "other";
}

const DRIVE_FILE_RE = /drive\.google\.com\/file\/d\/([^/]+)/;

const ExternalLink = ({ file }) => {
  const driveMatch = DRIVE_FILE_RE.test(file.url || "") ? file.url.match(DRIVE_FILE_RE) : null;
  const driveId = driveMatch ? driveMatch[1] : null;
  return (
    <div className="chapter-notes-embedded">
      <div className="chapter-notes-embedded-head">
        <span className="chapter-notes-viewer-title" title={file.name}>
          <FileText size={15} aria-hidden="true" />
          {file.name}
        </span>
        <span className="chapter-notes-embedded-type">Link</span>
      </div>
      <div style={{ padding: "10px 14px" }}>
        <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: "#6ea8fe", fontWeight: 500 }}>
          Open document →
        </a>
      </div>
      {driveId ? (
        <div className="chapter-notes-drive-wrap">
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            title={file.name}
            className="chapter-notes-drive-frame"
            allow="autoplay"
          />
        </div>
      ) : null}
    </div>
  );
};

const EmbeddedFile = ({ file }) => {
  const type = getFileType(file.name);
  return (
    <div className="chapter-notes-embedded">
      <div className="chapter-notes-embedded-head">
        <span className="chapter-notes-viewer-title" title={file.name}>
          {type === "img" ? (
            <ImageIcon size={15} aria-hidden="true" />
          ) : (
            <FileText size={15} aria-hidden="true" />
          )}
          {file.name}
        </span>
        <span className="chapter-notes-embedded-type">{FILE_TYPE_LABELS[type]}</span>
      </div>
      {type === "pdf" ? (
        <PdfPageReader url={file.url} fileName={file.name} embedded />
      ) : type === "img" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.url} alt={file.name} className="chapter-notes-image-viewer" />
      ) : type === "docx" || type === "pptx" ? (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
          title={file.name}
          className="chapter-notes-office-frame"
        />
      ) : (
        <p className="chapter-notes-empty">This file type can't be previewed in the browser.</p>
      )}
    </div>
  );
};

const ChapterNotesViewer = ({
  semesterId,
  subjectSlug,
  subjectName,
  chapterNumber,
  chapterId = "chapter-notes",
  heading,
  lead,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(getNoteChapterConfig(subjectSlug)));
  const [error, setError] = useState(null);

  const chapterConfig = getNoteChapterConfig(subjectSlug);
  const hasNotes = Boolean(chapterConfig);

  useEffect(() => {
    if (!chapterConfig) {
      setLoading(false);
      setFiles([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ resource: "subject", format: "json" });
    params.set("path", chapterConfig.folder);
    fetch(`/api/notes?${params.toString()}`, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Unable to load notes (${res.status})`);
        return res.json();
      })
      .then(async (json) => {
        if (cancelled) return;

        // Allowlist entries may be repo file names, external-URL entries
        // ({ name, url }), or repo file paths in subfolders ({ name, path }).
        const allowlist = chapterConfig.chapters?.[chapterNumber] || [];

        const repoFiles = (json?.files || []).map((file) => ({
          name: file.name,
          path: file.path,
          size: file.size || 0,
          url: file.rawUrl || file.downloadUrl || file.url || "",
        }));

        const hasAllowlist = Boolean(chapterConfig.chapters?.[chapterNumber]);
        const resolved = await Promise.all(
          allowlist.map(async (entry) => {
            if (typeof entry === "string") {
              if (hasAllowlist) {
                return repoFiles.find((file) => file.name === entry) || null;
              }
              return null;
            }
            if (entry?.path) {
              const params = new URLSearchParams({
                resource: "subject",
                format: "json",
                path: entry.path,
              });
              try {
                const res = await fetch(`/api/notes?${params.toString()}`, {
                  headers: { Accept: "application/json" },
                });
                if (!res.ok) return null;
                const subJson = await res.json();
                const file = subJson?.files?.[0];
                return file
                  ? {
                      name: file.name,
                      path: file.path,
                      size: file.size || 0,
                      url: file.rawUrl || file.downloadUrl || file.url || "",
                    }
                  : null;
              } catch {
                return null;
              }
            }
            if (entry?.url) {
              return {
                name: entry.name,
                url: entry.url,
                _external: true,
                path: `external-${chapterNumber}`,
              };
            }
            return null;
          })
        );

        let list = resolved.filter(Boolean);
        if (!hasAllowlist) {
          list = repoFiles.filter(
            (file) => getChapterNumberFromFileName(file.name) === chapterNumber
          );
        }
        setFiles(list);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load notes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterId, subjectSlug, chapterNumber, chapterConfig?.folder]);

  return (
    <section className="chapter-notes" id={chapterId}>
      <h2 className="subject-heading">
        {heading ?? `Read ${subjectName} Syllabus`}
      </h2>
      <p className="chapter-lead">
        {lead ?? "Read the full syllabus notes for this chapter right here."}
      </p>

      {loading && (
        <div className="chapter-notes-loading">
          <Loader2 className="spin" size={18} aria-hidden="true" />
          Loading notes…
        </div>
      )}

      {error && (
        <p className="chapter-notes-error">
          <strong>Notes unavailable:</strong> {error}
        </p>
      )}

      {!loading && !error && !hasNotes && (
        <p className="chapter-notes-empty">
          This chapter is covered by the syllabus topics above. Downloadable note files aren&apos;t
          published for this subject on the web — find them in the StudyMate app.
        </p>
      )}

      {!loading && !error && hasNotes && files.length === 0 && (
        <p className="chapter-notes-empty">No notes are linked to this chapter yet.</p>
      )}

      {!loading && !error && files.length > 0 && (
        <div className="chapter-notes-embeds">
          {files.map((file, index) =>
            file._external ? (
              <ExternalLink key={file.path} file={file} />
            ) : (
              <EmbeddedFile key={`${file.path}-${index}`} file={file} />
            )
          )}
        </div>
      )}
    </section>
  );
};

export default ChapterNotesViewer;