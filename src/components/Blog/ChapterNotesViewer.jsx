'use client'
import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Loader2, Image as ImageIcon } from "lucide-react";
import { getNoteChapterConfig, getChapterNumberFromFileName } from "../../lib/chapterNotesConfig";
import { getSubjectArticle } from "../../data/subjectArticles";
import { parseUnitNumber } from "../../lib/subjectChapters";
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
      ) : (
        <p className="chapter-notes-empty">This file type can't be previewed in the browser.</p>
      )}
    </div>
  );
};

const ChapterNotesViewer = ({ semesterId, subjectSlug, subjectName, chapterNumber }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chapterConfig = getNoteChapterConfig(subjectSlug);
  const hasNotes = Boolean(chapterConfig);

  const inlineNotes = useMemo(() => {
    if (hasNotes) return null;
    const article = getSubjectArticle(semesterId, subjectSlug);
    if (!article) return null;
    const syllabus = article.sections.find((section) => section.id === "syllabus-overview");
    const units = syllabus?.units || [];
    const unit = units.find((item, index) => parseUnitNumber(item.title, index) === Number(chapterNumber));
    if (!unit?.content?.length && !unit?.bullets?.length) return null;
    return unit;
  }, [chapterNumber, hasNotes, semesterId, subjectSlug]);

  useEffect(() => {
    if (!chapterConfig || inlineNotes) {
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
      .then((json) => {
        if (cancelled) return;
        let list = (json?.files || []).map((file) => ({
          name: file.name,
          path: file.path,
          size: file.size || 0,
          url: file.rawUrl || file.downloadUrl || file.url || "",
        }));

        // Explicit per-chapter list (curriculum-accurate) overrides the default
        // "leading number = chapter number" rule.
        const allowlist = chapterConfig.chapters?.[chapterNumber];
        if (allowlist?.length) {
          list = list.filter((file) => allowlist.includes(file.name));
        } else {
          list = list.filter((file) => getChapterNumberFromFileName(file.name) === chapterNumber);
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
    <section className="chapter-notes" id="chapter-notes">
      <h2 className="subject-heading">
        <BookOpen className="blog-inline-icon" aria-hidden="true" />
        Read {subjectName} Syllabus
      </h2>
      <p className="chapter-lead">Read the full syllabus notes for this chapter right here.</p>

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

      {!loading && !error && !hasNotes && !inlineNotes && (
        <p className="chapter-notes-empty">No notes are published for this subject yet.</p>
      )}

      {!loading && !error && hasNotes && files.length === 0 && (
        <p className="chapter-notes-empty">No notes are linked to this chapter yet.</p>
      )}

      {!loading && !error && inlineNotes && (
        <div className="chapter-notes-inline">
          {inlineNotes.content?.length
            ? inlineNotes.content.map((paragraph, index) => (
                <p key={`inline-p-${index}`}>{paragraph}</p>
              ))
            : null}
          {inlineNotes.bullets?.length ? (
            <ul className="chapter-notes-inline-bullets">
              {inlineNotes.bullets.map((bullet, index) => (
                <li key={`inline-b-${index}`}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {!loading && !error && files.length > 0 && (
        <div className="chapter-notes-embeds">
          {files.map((file, index) => (
            <EmbeddedFile key={`${file.path}-${index}`} file={file} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ChapterNotesViewer;