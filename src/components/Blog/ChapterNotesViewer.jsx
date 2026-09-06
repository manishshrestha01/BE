'use client'
import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  BookOpen,
  Eye,
  X,
  Loader2,
  Image as ImageIcon,
  FolderOpen,
} from "lucide-react";
import { getFeaturedNoteForSubject, getNoteFolderForSubject, getNoteChapterConfig } from "../../lib/chapterNotesConfig";

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

function formatSize(bytes = 0) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getViewerUrl(url) {
  // View-only PDF.js embed — toolbar hidden, no download affordance.
  return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}#toolbar=0&navpanes=0&scrollbar=1`;
}

const NotesList = ({ files, featuredName, chapterActive, onOpen }) => {
  const visible = featuredName
    ? files.filter((file) => file.name !== featuredName)
    : files;

  if (!visible.length) {
    return chapterActive ? (
      <p className="chapter-notes-empty">
        No notes are linked to this chapter yet. Try the StudyMate dashboard to
        browse the full subject folder.
      </p>
    ) : (
      <p className="chapter-notes-empty">
        No notes are published for this subject yet. Check back soon.
      </p>
    );
  }

  return (
    <>
      {chapterActive ? (
        <p className="chapter-notes-subheader">Notes for this chapter:</p>
      ) : (
        <p className="chapter-notes-subheader">More files for this subject:</p>
      )}
      <ul className="chapter-notes-list">
        {visible.map((file, index) => {
          const type = getFileType(file.name);
          return (
            <li key={`${file.path}-${index}`} className="chapter-notes-item">
              <span className="chapter-notes-file-icon">
                {type === "img" ? (
                  <ImageIcon size={18} aria-hidden="true" />
                ) : (
                  <FileText size={18} aria-hidden="true" />
                )}
              </span>
              <span className="chapter-notes-name">{file.name}</span>
              <span className="chapter-notes-meta">
                {FILE_TYPE_LABELS[type]}
                {file.size ? ` • ${formatSize(file.size)}` : ""}
              </span>
              <button
                type="button"
                className="blog-btn chapter-notes-open-btn"
                onClick={() => onOpen(file, type)}
              >
                <Eye size={14} aria-hidden="true" />
                {type === "pdf" || type === "img" ? "Read Online" : "Open in Dashboard"}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const AutoRenderedViewer = ({ active, subjectName, file }) => (
  <div className="chapter-notes-embedded">
    <div className="chapter-notes-embedded-head">
      <span className="chapter-notes-viewer-title" title={file?.name}>
        {file?.name || subjectName}
      </span>
      <a
        href="/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="blog-btn chapter-notes-open-btn"
      >
        <FolderOpen size={14} aria-hidden="true" />
        Open in Dashboard
      </a>
    </div>
    {active?.type === "pdf" ? (
      <iframe
        src={getViewerUrl(active.url)}
        title={file?.name || subjectName}
        className="chapter-notes-pdf-frame chapter-notes-embedded-frame"
        sandbox="allow-scripts allow-same-origin"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={active.url} alt={file?.name || subjectName} className="chapter-notes-image-viewer" />
    )}
  </div>
);

const ChapterNotesViewer = ({ semesterId, subjectSlug, subjectName, chapterNumber }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

  const featuredName = getFeaturedNoteForSubject(subjectSlug);
  const noteFolder = getNoteFolderForSubject(subjectSlug);
  const chapterConfig = getNoteChapterConfig(subjectSlug);
  const chapterAllowlist = chapterConfig
    ? chapterConfig.chapters[chapterNumber] || null
    : null;

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({ resource: "subject", format: "json" });
    if (noteFolder) {
      // Folder mode: list files directly from the configured subfolder.
      params.set("path", noteFolder);
    } else if (chapterConfig) {
      params.set("path", chapterConfig.folder);
    } else {
      params.set("semester", semesterId);
      params.set("subject", subjectSlug);
    }
    const url = `/api/notes?${params.toString()}`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Unable to load notes (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        let list = (json?.files || []).map((file) => ({
          name: file.name,
          path: file.path,
          size: file.size || 0,
          url: file.rawUrl || file.downloadUrl || file.url || "",
          type: getFileType(file.name),
        }));

        // Per-chapter mode: keep only this chapter's linked files.
        if (chapterAllowlist) {
          list = list.filter((file) => chapterAllowlist.includes(file.name));
        }

        setFiles(list);

        // Auto-render a single inline note when:
        //   - this subject has a featured master note, OR
        //   - this chapter is linked to exactly one file.
        const autoCandidate =
          list.find((file) => file.name === featuredName) ||
          (chapterAllowlist?.length === 1
            ? list.find((file) => file.name === chapterAllowlist[0])
            : null);
        if (autoCandidate && (autoCandidate.type === "pdf" || autoCandidate.type === "img")) {
          setActive(autoCandidate);
        }
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
  }, [semesterId, subjectSlug]);

  const open = useCallback((file, type) => {
    if (type !== "pdf" && type !== "img") {
      window.open("/dashboard", "_blank", "noopener,noreferrer");
      return;
    }
    setActive({ ...file, type });
  }, []);

  const featuredFile = featuredName
    ? files.find((file) => file.name === featuredName)
    : null;
  const singleChapterFile = chapterAllowlist?.length === 1
    ? files.find((file) => file.name === chapterAllowlist[0])
    : null;

  const inlineActive =
    Boolean(active) && (featuredFile && active.name === featuredName || singleChapterFile && active.name === singleChapterFile.name);
  const autoFile = featuredFile || singleChapterFile || null;
  const showList =
    !chapterAllowlist ||          // folder-mode (BEE, others) or no config
    chapterAllowlist.length > 1;  // multi-file chapters (E.D.C)

  return (
    <section className="chapter-notes" id="chapter-notes">
      <h2 className="subject-heading">
        <BookOpen className="blog-inline-icon" aria-hidden="true" />
        Read {subjectName} Notes
      </h2>
      <p className="chapter-lead">
        Read the complete {subjectName} notes right on this page — no login required.
        Built for researchers and students. Downloads are available in the StudyMate
        dashboard.
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

      {!loading && !error && inlineActive && autoFile && (
        <AutoRenderedViewer active={active} subjectName={subjectName} file={autoFile} />
      )}

      {!loading && !error && active && !inlineActive && (
        <div className="chapter-notes-viewer-overlay" role="dialog" aria-modal="true" aria-label={`${subjectName} notes viewer`}>
          <div className="chapter-notes-viewer-panel">
            <div className="chapter-notes-viewer-head">
              <span className="chapter-notes-viewer-title">{active.name}</span>
              <button
                type="button"
                className="chapter-notes-viewer-close"
                onClick={() => setActive(null)}
                aria-label="Close notes viewer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="chapter-notes-viewer-body">
              {active.type === "pdf" ? (
                <iframe
                  src={getViewerUrl(active.url)}
                  title={active.name}
                  className="chapter-notes-pdf-frame"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.url} alt={active.name} className="chapter-notes-image-viewer" />
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && showList && (
        <NotesList
          files={files}
          featuredName={featuredName}
          chapterActive={Boolean(chapterAllowlist)}
          onOpen={open}
        />
      )}
    </section>
  );
};

export default ChapterNotesViewer;