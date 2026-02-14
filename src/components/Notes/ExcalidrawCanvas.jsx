import { useCallback, useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const LOCAL_STORAGE_KEY = "excalidraw-data";

const EMPTY_SCENE = {
  elements: [],
  appState: {},
  files: {}
};

const toTimestamp = (value) => {
  const ts = Date.parse(value || "");
  return Number.isFinite(ts) ? ts : 0;
};

const isTableMissingError = (error) => {
  const message = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`.toLowerCase();
  return (
    error?.status === 404 ||
    error?.code === "42P01" ||
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("excalidraw_notes")
  );
};

const normalizeAppStateForRuntime = (appState) => {
  const normalized = appState && typeof appState === "object" ? { ...appState } : {};
  normalized.collaborators =
    normalized.collaborators instanceof Map ? normalized.collaborators : new Map();
  return normalized;
};

const normalizeSceneForRuntime = (scene) => {
  if (!scene || typeof scene !== "object") {
    return {
      ...EMPTY_SCENE,
      appState: normalizeAppStateForRuntime({})
    };
  }

  return {
    elements: Array.isArray(scene.elements) ? scene.elements : [],
    appState: normalizeAppStateForRuntime(scene.appState),
    files: scene.files && typeof scene.files === "object" ? scene.files : {}
  };
};

const normalizeSceneForStorage = (scene) => {
  const runtimeScene = normalizeSceneForRuntime(scene);
  const appState = { ...runtimeScene.appState };
  delete appState.collaborators;

  return {
    elements: runtimeScene.elements,
    appState,
    files: runtimeScene.files
  };
};

const readLocalSnapshot = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.scene) {
      return {
        scene: normalizeSceneForRuntime(parsed.scene),
        updated_at: typeof parsed.updated_at === "string" ? parsed.updated_at : null
      };
    }

    return {
      scene: normalizeSceneForRuntime(parsed),
      updated_at: null
    };
  } catch (error) {
    console.error("[Excalidraw] Failed to parse local scene:", error);
    return null;
  }
};

export const ExcalidrawCanvas = () => {
  const localSnapshotRef = useRef(readLocalSnapshot());
  const [mounted, setMounted] = useState(false);
  const [initialData, setInitialData] = useState(localSnapshotRef.current?.scene ?? null);

  const wrapperRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const excalidrawApiRef = useRef(null);
  const userIdRef = useRef(null);
  const supabaseUnavailableRef = useRef(false);

  const persistLocal = useCallback((scene, updatedAt) => {
    const runtimeScene = normalizeSceneForRuntime(scene);
    const storageScene = normalizeSceneForStorage(runtimeScene);
    const snapshot = {
      scene: runtimeScene,
      updated_at: updatedAt || new Date().toISOString()
    };

    localSnapshotRef.current = snapshot;

    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          scene: storageScene,
          updated_at: snapshot.updated_at
        })
      );
    } catch (error) {
      console.error("[Excalidraw] Failed to persist local scene:", error);
    }

    return snapshot;
  }, []);

  const applyScene = useCallback((scene, updatedAt) => {
    const snapshot = persistLocal(scene, updatedAt);
    setInitialData(snapshot.scene);

    if (excalidrawApiRef.current) {
      excalidrawApiRef.current.updateScene(snapshot.scene);
    }
  }, [persistLocal]);

  const upsertSceneNow = useCallback(async (scene, updatedAt) => {
    if (!isSupabaseConfigured() || !supabase || supabaseUnavailableRef.current) return;

    const userId = userIdRef.current;
    if (!userId) return;

    const { error } = await supabase
      .from("excalidraw_notes")
      .upsert(
        {
          user_id: userId,
          scene: normalizeSceneForStorage(scene),
          updated_at: updatedAt || new Date().toISOString()
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("[Excalidraw] Supabase upsert failed:", error);
      if (isTableMissingError(error)) {
        supabaseUnavailableRef.current = true;
        console.error("[Excalidraw] public.excalidraw_notes table not available. Using local storage fallback.");
      }
    }
  }, []);

  const scheduleSupabaseSave = useCallback((scene, updatedAt) => {
    if (!isSupabaseConfigured() || !supabase || supabaseUnavailableRef.current || !userIdRef.current) {
      return;
    }

    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await upsertSceneNow(scene, updatedAt);
    }, 800);
  }, [upsertSceneNow]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    let cancelled = false;

    const syncWithSupabase = async () => {
      if (!isSupabaseConfigured() || !supabase) return;

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("[Excalidraw] Failed to fetch auth user:", authError);
        return;
      }

      const userId = authData?.user?.id;
      userIdRef.current = userId || null;
      if (!userId || cancelled) return;

      const { data, error } = await supabase
        .from("excalidraw_notes")
        .select("scene, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[Excalidraw] Failed to load Supabase scene:", error);
        if (isTableMissingError(error)) {
          supabaseUnavailableRef.current = true;
          console.error("[Excalidraw] public.excalidraw_notes table not available. Using local storage fallback.");
        }
        return;
      }

      const localSnapshot = localSnapshotRef.current;
      const localScene = localSnapshot?.scene || null;
      const localTs = toTimestamp(localSnapshot?.updated_at);

      if (data?.scene) {
        const serverScene = normalizeSceneForRuntime(data.scene);
        const serverTs = toTimestamp(data.updated_at);

        if (!localScene || serverTs > localTs) {
          applyScene(serverScene, data.updated_at || new Date().toISOString());
          return;
        }

        await upsertSceneNow(localScene, localSnapshot?.updated_at || new Date().toISOString());
        return;
      }

      const seedScene = localScene || EMPTY_SCENE;
      const seedUpdatedAt = localSnapshot?.updated_at || new Date().toISOString();
      await upsertSceneNow(seedScene, seedUpdatedAt);
    };

    syncWithSupabase();

    return () => {
      cancelled = true;
    };
  }, [applyScene, upsertSceneNow]);

  useEffect(() => {
    return () => {
      clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleChange = (elements, appState, files) => {
    const scene = normalizeSceneForRuntime({
      elements,
      appState,
      files
    });
    const updatedAt = new Date().toISOString();

    persistLocal(scene, updatedAt);
    scheduleSupabaseSave(scene, updatedAt);
  };

  if (!mounted) {
    return <div className="notes-canvas-loading">Loading canvas...</div>;
  }

  return (
    <div ref={wrapperRef} className="excalidraw-wrapper">
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawApiRef.current = api;
        }}
        initialData={initialData}
        onChange={handleChange}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
