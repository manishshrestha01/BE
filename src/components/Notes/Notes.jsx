import { useState, useEffect } from 'react'
import './Notes.css';

const Notes = ({ onClose }) => {
  return (
    <div className="notes-app glass-dark" style={{ height: '100%', width: '100%' }}>
      <div className="notes-toolbar">
        <div className="window-controls">
          <button className="window-btn close" onClick={onClose} title="Close">
            <span>×</span>
          </button>
        </div>
        <div className="notes-title">Notes (Drawing Mode)</div>
      </div>
      <div className="notes-editor" style={{ height: 'calc(100vh - 100px)', padding: 0 }}>
        <iframe
          src="https://excalidraw.com/"
          title="Excalidraw Whiteboard"
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Notes;
