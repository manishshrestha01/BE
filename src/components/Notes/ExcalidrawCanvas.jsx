import { useEffect, useState, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export const ExcalidrawCanvas = () => {
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Dispatch resize events so Excalidraw recalculates its internal bounding boxes
    const fireResize = () => window.dispatchEvent(new Event('resize'));
    fireResize();
    const t1 = setTimeout(fireResize, 100);
    const t2 = setTimeout(fireResize, 300);

    const ro = new ResizeObserver(() => {
      fireResize();
    });
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted]);

  const handleChange = (elements, appState, files) => {
    localStorage.setItem("excalidraw-data", JSON.stringify({
      elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor
      },
      files
    }));
  };

  const getInitialData = () => {
    const saved = localStorage.getItem("excalidraw-data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="notes-canvas-loading" style={{ width: '100%', height: '100%' }}>
        Loading canvas...
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="excalidraw-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Excalidraw 
        initialData={getInitialData()} 
        onChange={handleChange} 
        style={{ width: '100%', height: '100%' }}
        UIOptions={{
          canvasActions: {
            loadScene: true,
            export: {
              saveFileToDisk: true
            }
          }
        }} 
      />
    </div>
  );
};
