'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X, ZoomIn, ZoomOut, FileText, Maximize, Minimize } from "lucide-react";

const PDF_WORKER_SRC = "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/build/pdf.worker.min.mjs";

function getPdfApi() {
  return import("pdfjs-dist").then((pdfjs) => {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
    }
    return pdfjs;
  });
}

// Render a single PDF page into an offscreen canvas for one of our on-page canvases.
async function renderPageIntoCanvas(pdfjs, pdfDoc, pageNo, canvas) {
  const page = await pdfDoc.getPage(pageNo);
  const baseViewport = page.getViewport({ scale: 1 });
  const cssWidth = 900;
  const scale = cssWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(viewport.width * ratio);
  canvas.height = Math.floor(viewport.height * ratio);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  await page.render({ canvasContext: ctx, viewport }).promise;
  page.cleanup();
}

const PdfPageReader = ({ url, fileName, onClose, embedded = false }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(null);
  const [isFullscreen, setFullscreen] = useState(false);
  const pdfDocRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRefs = useRef([]);
  const rootRef = useRef(null);

  const toggleFullscreen = useCallback(async () => {
    const el = rootRef.current;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el?.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen can be rejected by the browser; ignore.
    }
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Load the document once per URL.
  useEffect(() => {
    let cancelled = false;

    getPdfApi()
      .then(async (pdfjs) => {
        const doc = await pdfjs.getDocument({ url }).promise;
        if (cancelled) {
          doc?.destroy?.();
          return;
        }
        pdfDocRef.current?.destroy?.();
        pdfDocRef.current = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        canvasRefs.current = Array.from({ length: doc.numPages }, () => null);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load the PDF");
      });

    return () => {
      cancelled = true;
      pdfDocRef.current?.destroy?.();
      pdfDocRef.current = null;
      canvasRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Render all pages once the doc is ready.
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    (async () => {
      const pdfjs = await getPdfApi().catch(() => null);
      if (!pdfjs || cancelled) return;
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        if (cancelled) break;
        const canvas = canvasRefs.current[i - 1];
        if (!canvas) continue;
        try {
          await renderPageIntoCanvas(pdfjs, pdfDoc, i, canvas);
        } catch {
          // Ignore per-page failures; keep the rest readable.
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc]);

  const fullscreenLabel = isFullscreen ? "Exit full screen" : "View in full screen";

  return (
    <div className={`studocu-reader${embedded ? " studocu-reader--embedded" : ""}`} style={{ ["--reader-zoom" ]: zoom }} ref={rootRef}>
      {!embedded && (
        <div className="studocu-reader-toolbar">
          <div className="studocu-reader-title">
            <FileText size={15} aria-hidden="true" />
            <span>{fileName}</span>
            {numPages ? <span className="studocu-reader-pages">{numPages} pages</span> : null}
          </div>
          <div className="studocu-reader-controls">
            <button type="button" onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))} aria-label="Zoom in">
              <ZoomIn size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))} aria-label="Zoom out">
              <ZoomOut size={16} aria-hidden="true" />
            </button>
            <span className="studocu-reader-zoom-pct">{Math.round(zoom * 100)}%</span>
            <button type="button" className="studocu-reader-fullscreen-btn" onClick={toggleFullscreen} aria-label={fullscreenLabel}>
              {isFullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
            </button>
            {onClose ? (
              <button type="button" className="studocu-reader-close-btn" onClick={onClose} aria-label="Close notes reader">
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div className="studocu-reader-body">
        {error && (
          <div className="studocu-reader-error">
            <strong>Could not render the note:</strong> {error}
          </div>
        )}

        {!pdfDoc && !error && (
          <div className="studocu-reader-loading">
            <Loader2 className="spin" size={20} aria-hidden="true" />
            Loading document…
          </div>
        )}

        <div className="studocu-reader-page-stage" style={{ ["--stage-zoom"]: zoom }} ref={stageRef}>
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="studocu-reader-page-card">
              <canvas
                ref={(el) => {
                  canvasRefs.current[i] = el;
                }}
                className="studocu-reader-canvas"
              />
              <span className="studocu-reader-page-label">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {embedded && !error && (
        <button
          type="button"
          className="studocu-reader-fullscreen-btn studocu-reader-fullscreen-btn--float"
          onClick={toggleFullscreen}
          aria-label={fullscreenLabel}
        >
          {isFullscreen ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
};

export default PdfPageReader;