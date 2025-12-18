import { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export const ExcalidrawCanvas = ({ noteId }) => {
  const [mounted, setMounted] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const wrapperRef = useRef(null);
  const saveTimeout = useRef(null);

  /* mount safety */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* resize fix */
  useEffect(() => {
    if (!mounted) return;

    const fireResize = () => window.dispatchEvent(new Event("resize"));
    fireResize();

    const t1 = setTimeout(fireResize, 100);
    const t2 = setTimeout(fireResize, 300);

    const ro = new ResizeObserver(fireResize);
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted]);

  /* load from DB (or fallback local) */
  useEffect(() => {
    if (!noteId || !isSupabaseConfigured()) {
      const local = localStorage.getItem("excalidraw-data");
      if (local) setInitialData(JSON.parse(local));
      return;
    }

    const load = async () => {
      const { data } = await supabase
        .from("excalidraw_notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (data) {
        setInitialData({
          elements: data.elements,
          appState: data.app_state,
          files: data.files
        });
      }
    };

    load();
  }, [noteId]);

  /* save local + DB */
  const handleChange = (elements, appState, files) => {
    const payload = {
      elements,
      appState: { viewBackgroundColor: appState.viewBackgroundColor },
      files
    };

    localStorage.setItem("excalidraw-data", JSON.stringify(payload));

    if (!noteId || !isSupabaseConfigured()) return;

    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await supabase
        .from("excalidraw_notes")
        .update({
          elements,
          app_state: payload.appState,
          files
        })
        .eq("id", noteId);
    }, 800);
  };

  if (!mounted) {
    return (
      <div className="notes-canvas-loading">
        Loading canvas...
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="excalidraw-wrapper">
      <Excalidraw
        initialData={initialData}
        onChange={handleChange}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
