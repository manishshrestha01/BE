import { ExcalidrawCanvas } from './ExcalidrawCanvas';
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
        <ExcalidrawCanvas />
      </div>
    </div>
  );
};

export default Notes;
