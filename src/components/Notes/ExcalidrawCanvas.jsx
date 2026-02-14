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

const PERSISTED_APP_STATE_KEYS = new Set([
  "viewBackgroundColor",
  "theme",
  "gridSize"
]);

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

const pickPersistedAppState = (appState) => {
  if (!appState || typeof appState !== "object") return {};

  const persisted = {};
  for (const key of PERSISTED_APP_STATE_KEYS) {
    if (key in appState) {
      persisted[key] = appState[key];
    }
  }

  return persisted;
};

const normalizeAppStateForRuntime = (appState) => {
  const normalized = pickPersistedAppState(appState);
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
  const appState = pickPersistedAppState(runtimeScene.appState);

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
  const ignoreChangesUntilRef = useRef(0);
  const syncInFlightRef = useRef(false);
  const hasAutoFittedRef = useRef(false);
  const lastLocalInputAtRef = useRef(0);

  const fitSceneToViewport = useCallback(() => {
    const api = excalidrawApiRef.current;
    if (!api || typeof api.scrollToContent !== "function") return;

    const elements = api.getSceneElements?.() || [];
    if (!elements.length) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        api.scrollToContent(elements, {
          fitToViewport: true,
          viewportZoomFactor: 0.92,
          animate: false
        });
      });
    });
  }, []);

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

  const updateLocalSnapshotTimestamp = useCallback((updatedAt) => {
    if (!updatedAt) return;

    const current = localSnapshotRef.current;
    if (!current?.scene) return;

    const nextTs = toTimestamp(updatedAt);
    const currentTs = toTimestamp(current.updated_at);
    if (nextTs <= currentTs) return;

    current.updated_at = updatedAt;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          scene: normalizeSceneForStorage(current.scene),
          updated_at: updatedAt
        })
      );
    } catch (error) {
      console.error("[Excalidraw] Failed to persist local timestamp:", error);
    }
  }, []);

  const applyScene = useCallback((scene, updatedAt, options = {}) => {
    const { suppressNextChange = false, fitViewport = false } = options;
    const snapshot = persistLocal(scene, updatedAt);
    setInitialData(snapshot.scene);

    if (excalidrawApiRef.current) {
      if (suppressNextChange) {
        ignoreChangesUntilRef.current = Date.now() + 300;
      }
      excalidrawApiRef.current.updateScene(snapshot.scene);
      if (fitViewport) {
        fitSceneToViewport();
      }
    }
  }, [fitSceneToViewport, persistLocal]);

  const upsertSceneNow = useCallback(async (scene, updatedAt) => {
    if (!isSupabaseConfigured() || !supabase || supabaseUnavailableRef.current) return;

    const userId = userIdRef.current;
    if (!userId) return;

    const { data, error } = await supabase
      .from("excalidraw_notes")
      .upsert(
        {
          user_id: userId,
          scene: normalizeSceneForStorage(scene),
          updated_at: updatedAt || new Date().toISOString()
        },
        { onConflict: "user_id" }
      )
      .select("updated_at")
      .maybeSingle();

    if (error) {
      console.error("[Excalidraw] Supabase upsert failed:", error);
      if (isTableMissingError(error)) {
        supabaseUnavailableRef.current = true;
        console.error("[Excalidraw] public.excalidraw_notes table not available. Using local storage fallback.");
      }
      return;
    }

    if (data?.updated_at) {
      updateLocalSnapshotTimestamp(data.updated_at);
    }
  }, [updateLocalSnapshotTimestamp]);

  const scheduleSupabaseSave = useCallback((scene, updatedAt) => {
    if (!isSupabaseConfigured() || !supabase || supabaseUnavailableRef.current || !userIdRef.current) {
      return;
    }

    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      const latestLocalTs = toTimestamp(localSnapshotRef.current?.updated_at);
      const queuedTs = toTimestamp(updatedAt);
      if (queuedTs > 0 && latestLocalTs > queuedTs) return;
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

    const pullAndReconcile = async ({ seedWhenMissing = false } = {}) => {
      if (syncInFlightRef.current) return;
      syncInFlightRef.current = true;

      try {
        const userId = userIdRef.current;
        if (!userId || supabaseUnavailableRef.current) return;

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
            if (Date.now() - lastLocalInputAtRef.current < 2000) return;
            applyScene(serverScene, data.updated_at || new Date().toISOString(), {
              suppressNextChange: true,
              fitViewport: !hasAutoFittedRef.current
            });
            return;
          }

          if (localScene && localTs > serverTs) {
            await upsertSceneNow(
              localScene,
              localSnapshot?.updated_at || new Date().toISOString()
            );
          }
          return;
        }

        if (!seedWhenMissing) return;

        const seedScene = localScene || EMPTY_SCENE;
        const seedUpdatedAt = localSnapshot?.updated_at || new Date().toISOString();
        await upsertSceneNow(seedScene, seedUpdatedAt);
      } finally {
        syncInFlightRef.current = false;
      }
    };

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

      await pullAndReconcile({ seedWhenMissing: true });

      if (cancelled || supabaseUnavailableRef.current) return;

      const channel = supabase
        .channel(`excalidraw-notes-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "excalidraw_notes",
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            if (cancelled || !payload?.new?.scene) return;

            const serverTs = toTimestamp(payload.new.updated_at);
            const localTs = toTimestamp(localSnapshotRef.current?.updated_at);
            if (serverTs <= localTs) return;
            if (Date.now() - lastLocalInputAtRef.current < 2000) return;

            applyScene(payload.new.scene, payload.new.updated_at || new Date().toISOString(), {
              suppressNextChange: true
            });
          }
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error("[Excalidraw] Supabase realtime channel error.");
          }
        });

      const poller = setInterval(() => {
        if (!cancelled && !document.hidden) {
          pullAndReconcile();
        }
      }, 15000);

      const onVisibilityChange = () => {
        if (!document.hidden) {
          pullAndReconcile();
        }
      };

      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        clearInterval(poller);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        supabase.removeChannel(channel);
      };
    };

    let unsubscribe = null;
    let disposed = false;
    syncWithSupabase().then((cleanup) => {
      if (disposed && cleanup) {
        cleanup();
        return;
      }
      unsubscribe = cleanup || null;
    }).catch((error) => {
      console.error("[Excalidraw] Unexpected Supabase sync error:", error);
    });

    return () => {
      disposed = true;
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [applyScene, upsertSceneNow]);

  useEffect(() => {
    return () => {
      clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted || hasAutoFittedRef.current) return;

    const api = excalidrawApiRef.current;
    if (!api) return;

    const elements = api.getSceneElements?.() || [];
    if (!elements.length) return;

    hasAutoFittedRef.current = true;
    fitSceneToViewport();
  }, [fitSceneToViewport, initialData, mounted]);

  const handleChange = (elements, appState, files) => {
    if (Date.now() < ignoreChangesUntilRef.current) return;

    const scene = normalizeSceneForRuntime({
      elements,
      appState,
      files
    });
    const updatedAt = new Date().toISOString();
    lastLocalInputAtRef.current = Date.now();

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
          if (!hasAutoFittedRef.current) {
            const elements = api?.getSceneElements?.() || [];
            if (elements.length) {
              hasAutoFittedRef.current = true;
              fitSceneToViewport();
            }
          }
        }}
        initialData={initialData}
        onChange={handleChange}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
