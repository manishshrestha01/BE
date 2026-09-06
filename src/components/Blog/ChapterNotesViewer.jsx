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
  FileArchive,
} from "lucide-react";

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

const NotesList = ({ files, onOpen }) => {
  if (!files.length) {
    return (
      <p className="chapter-notes-empty">
        No notes are published for this subject yet. Check back soon.
      </p>
    );
  }

  return (
    <ul className="chapter-notes-list">
      {files.map((file, index) => {
        const type = getFileType(file.name);
        return (
          <li key={`${file.path}-${index}`} className="chapter-notes-item">
            <span className="chapter-notes-file-icon">
              {type === "img" ? (
                <ImageIcon size={18} aria-hidden="true" />
              ) : type === "pdf" ? (
                <FileText size={18} aria-hidden="true" />
              ) : type === "txt" ? (
                <FileText size={18} aria-hidden="true" />
              ) : (
                <FileArchive size={18} aria-hidden="true" />
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
  );
};

const ChapterNotesViewer = ({ semesterId, subjectSlug, subjectName }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const url = `/api/notes?resource=subject&semester=${semesterId}&subject=${subjectSlug}&format=json`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Unable to load notes (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const list = (json?.files || []).map((file) => ({
          name: file.name,
          path: file.path,
          size: file.size || 0,
          url: file.rawUrl || file.downloadUrl || file.url || "",
        }));
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
  }, [semesterId, subjectSlug]);

  const open = useCallback((file, type) => {
    if (type !== "pdf" && type !== "img") {
      window.open("/dashboard", "_blank", "noopener,noreferrer");
      return;
    }
    setActive({ ...file, type });
  }, []);

  const close = useCallback(() => setActive(null), []);

  const isPdf = active?.type === "pdf";
  const isImg = active?.type === "img";

  return (
    <section className="chapter-notes" id="chapter-notes">
      <h2 className="subject-heading">
        <BookOpen className="blog-inline-icon" aria-hidden="true" />
        Read {subjectName} Notes
      </h2>
      <p className="chapter-lead">
        Browse and read the {subjectName} study notes right on this page — no login
        required. Built for researchers and students. Downloads are available in the
        StudyMate dashboard.
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

      {!loading && !error && <NotesList files={files} onOpen={open} />}

      {active && (
        <div className="chapter-notes-viewer-overlay" role="dialog" aria-modal="true" aria-label={`${subjectName} notes viewer`}>
          <div className="chapter-notes-viewer-panel">
            <div className="chapter-notes-viewer-head">
              <span className="chapter-notes-viewer-title">
                {active.name}
              </span>
              <button
                type="button"
                className="chapter-notes-viewer-close"
                onClick={close}
                aria-label="Close notes viewer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="chapter-notes-viewer-body">
              {isPdf ? (
                <iframe
                  src={getViewerUrl(active.url)}
                  title={active.name}
                  className="chapter-notes-pdf-frame"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : isImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.url} alt={active.name} className="chapter-notes-image-viewer" />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChapterNotesViewer;