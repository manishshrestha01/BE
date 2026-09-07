import { FileText, Images } from "lucide-react";

import PdfPageReader from "../Blog/PdfPageReader";

// Keep the papers view-only: right-clicking a canvas (PDF page) or an image
// normally offers "Copy image" / "Save image as…". Suppress that context menu.
const blockContextMenu = (event) => event.preventDefault();

const PaperCard = ({ card }) => {
  if (card.kind === "pdf" && card.url) {
    return (
      <div className="oldq-paper-card" onContextMenu={blockContextMenu}>
        <div className="oldq-paper-head">
          <span className="chapter-notes-viewer-title" title={card.name}>
            <FileText size={15} aria-hidden="true" />
            {card.name}
          </span>
          <span className="chapter-notes-embedded-type">PDF</span>
        </div>
        <PdfPageReader url={card.url} fileName={card.name} embedded />
      </div>
    );
  }

  if (card.kind === "image") {
    return (
      <div className="oldq-paper-card oldq-image-card" onContextMenu={blockContextMenu}>
        <div className="oldq-paper-head">
          <span className="chapter-notes-viewer-title" title={card.name}>
            <Images size={15} aria-hidden="true" />
            {card.name}
          </span>
          <span className="chapter-notes-embedded-type">
            {card.urls.length} image{card.urls.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="oldq-image-stack">
          {card.urls.map((url, index) => (
            <img
              key={`${card.name}-${index}`}
              src={url}
              alt={`${card.name} — page ${index + 1}`}
              loading="lazy"
              onContextMenu={blockContextMenu}
              draggable={false}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="oldq-paper-card" onContextMenu={blockContextMenu}>
      <div className="oldq-paper-head">
        <span className="chapter-notes-viewer-title" title={card.name}>
          <FileText size={15} aria-hidden="true" />
          {card.name}
        </span>
        <span className="chapter-notes-embedded-type">File</span>
      </div>
      <p className="chapter-notes-empty">
        This question paper file can&apos;t be previewed in the browser yet.
      </p>
    </div>
  );
};

export default PaperCard;