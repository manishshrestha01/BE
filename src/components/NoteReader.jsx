import { useEffect, useMemo, useRef } from "react";

const NOTE_SCROLL_KEY_PREFIX = "studymate:note-scroll";

const sanitizeValue = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  const normalized = String(value).trim();
  return normalized || fallback;
};

const NoteReader = ({
  children,
  noteId,
  mode = "read",
  className = "",
  style = {}
}) => {
  const containerRef = useRef(null);

  const scrollKey = useMemo(() => {
    const safeNoteId = sanitizeValue(noteId, "default");
    const safeMode = sanitizeValue(mode, "read");
    return `${NOTE_SCROLL_KEY_PREFIX}:${safeNoteId}:${safeMode}`;
  }, [mode, noteId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const restoreScroll = () => {
      try {
        const raw = sessionStorage.getItem(scrollKey);
        if (raw === null) return;

        const scrollTop = Number(raw);
        if (!Number.isNaN(scrollTop)) {
          container.scrollTop = scrollTop;
        }
      } catch {
        // Ignore storage errors.
      }
    };

    const persistScroll = () => {
      try {
        sessionStorage.setItem(scrollKey, String(container.scrollTop));
      } catch {
        // Ignore storage errors.
      }
    };

    const handleScroll = () => {
      persistScroll();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persistScroll();
      }
    };

    restoreScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", persistScroll);

    return () => {
      persistScroll();
      container.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", persistScroll);
    };
  }, [scrollKey]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: "100%",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default NoteReader;
