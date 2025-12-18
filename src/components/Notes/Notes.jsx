import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { ExcalidrawCanvas } from "./ExcalidrawCanvas";
import "./Notes.css";

const Notes = ({ onClose }) => {
  const [noteId, setNoteId] = useState(null);

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

  return (
    <div className="notes-app glass-dark">
      <div className="notes-toolbar">
        <button className="window-btn close" onClick={onClose}>×</button>
        <div className="notes-title">Notes (Drawing Mode)</div>
      </div>

      <div className="notes-editor">
        <ExcalidrawCanvas noteId={noteId} />
      </div>
    </div>
  );
};

export default Notes;
