import { useEffect, useState, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { ExcalidrawCanvas } from "./ExcalidrawCanvas";
import NoteReader from "../NoteReader";
import "./Notes.css";

const DEFAULT_NOTES_STATE = {
  noteId: null,
  chapterId: null,
  mode: "draw",
  windowState: "normal"
};

const Notes = ({ onClose, initialState = DEFAULT_NOTES_STATE, onStateChange }) => {
  const [noteId, setNoteId] = useState(initialState?.noteId ?? DEFAULT_NOTES_STATE.noteId);
  const [chapterId, setChapterId] = useState(initialState?.chapterId ?? DEFAULT_NOTES_STATE.chapterId);
  const [mode, setMode] = useState(initialState?.mode ?? DEFAULT_NOTES_STATE.mode);
  const [windowState, setWindowState] = useState(initialState?.windowState ?? DEFAULT_NOTES_STATE.windowState); // 'normal' | 'maximized' | 'minimized'
  const containerRef = useRef(null);

  /* auto-create single drawing */
  useEffect(() => {
    if (noteId) return;

    const init = async () => {
      if (!isSupabaseConfigured()) return;

      // get user
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      // check if one already exists
      const { data: existing } = await supabase
        .from("excalidraw_notes")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        setNoteId(existing.id);
        return;
      }

      // otherwise create silently
      const { data: created } = await supabase
        .from("excalidraw_notes")
        .insert({
          user_id: user.id,
          title: "Default Drawing",
          elements: [],
          app_state: {},
          files: {}
        })
        .select("id")
        .single();

      setNoteId(created.id);
    };

    init();
  }, [noteId]);

  useEffect(() => {
    onStateChange?.({
      noteId,
      chapterId,
      mode,
      windowState
    });
  }, [chapterId, mode, noteId, onStateChange, windowState]);

  const handleMinimize = () => setWindowState("minimized");
  const handleMaximize = () => {
    setWindowState((p) => (p === "maximized" ? "normal" : "maximized"));
    setTimeout(() => { containerRef.current?.focus(); }, 60);
  };

  const handleSetReadMode = () => {
    setMode("read");
    if (!chapterId && noteId) {
      setChapterId(noteId);
    }
  };

  const handleSetDrawMode = () => {
    setMode("draw");
  };

  const getWindowClassName = () => {
    let cls = "notes-app";
    if (windowState === "maximized") cls += " maximized";
    if (windowState === "minimized") cls += " minimized";
    return cls;
  };

  if (windowState === "minimized") {
    return (
      <div className="notes-minimized" onClick={() => setWindowState("normal")} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setWindowState('normal')}>
        <span>📝</span>
        <span>Draw</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${getWindowClassName()} glass-dark`} tabIndex={-1}>
      <div className="notes-toolbar">
        <div className="window-controls">
          <button className="window-btn close" onClick={onClose} title="Close">×</button>
          <button className="window-btn minimize" onClick={handleMinimize} title="Minimize">−</button>
          <button className="window-btn maximize" onClick={handleMaximize} title={windowState === 'maximized' ? 'Restore' : 'Maximize'}>+</button>
        </div>
        <div className="notes-title">Draw ({mode === "read" ? "Read Mode" : "Drawing Mode"})</div>
        <div className="notes-toolbar-actions">
          <button
            className="notes-btn"
            onClick={handleSetReadMode}
            title="Read mode"
            aria-label="Read mode"
            aria-pressed={mode === "read"}
          >
            📖
          </button>
          <button
            className="notes-btn"
            onClick={handleSetDrawMode}
            title="Draw mode"
            aria-label="Draw mode"
            aria-pressed={mode === "draw"}
          >
            ✏️
          </button>
        </div>
      </div>

      {mode === "draw" ? (
        <div className="notes-editor">
          <ExcalidrawCanvas noteId={noteId} />
        </div>
      ) : (
        <NoteReader
          noteId={chapterId || noteId || "default"}
          mode={mode}
          className="notes-editor"
        >
          <div style={{ padding: 20, color: "var(--text-primary)" }}>
            <h3 style={{ marginBottom: 12 }}>Reading Note</h3>
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              Resume point is remembered for this note and mode.
            </p>
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              Current note id: <strong>{chapterId || noteId || "default"}</strong>
            </p>
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              Scroll this area, switch tabs/apps, then return to continue from the same position.
            </p>
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              Add your note/chapter content here to use this reader view with persisted scroll.
            </p>
            <div style={{ height: 1200 }} />
          </div>
        </NoteReader>
      )}
    </div>
  );
};

export default Notes;
