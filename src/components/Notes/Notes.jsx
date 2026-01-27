import { useEffect, useState, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { ExcalidrawCanvas } from "./ExcalidrawCanvas";
import "./Notes.css";

const Notes = ({ onClose }) => {
  const [noteId, setNoteId] = useState(null);
  const [windowState, setWindowState] = useState("normal"); // 'normal' | 'maximized' | 'minimized'
  const containerRef = useRef(null);

  /* auto-create single drawing */
  useEffect(() => {
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
  }, []);

  const handleMinimize = () => setWindowState("minimized");
  const handleMaximize = () => {
    setWindowState((p) => (p === "maximized" ? "normal" : "maximized"));
    setTimeout(() => { try { containerRef.current?.focus() } catch (e) {} }, 60);
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
        <span>Notes</span>
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
        <div className="notes-title">Notes (Drawing Mode)</div>
      </div>

      <div className="notes-editor">
        <ExcalidrawCanvas noteId={noteId} />
      </div>
    </div>
  );
};

export default Notes;
