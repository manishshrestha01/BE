import { useState, useEffect } from 'react'
import './Notes.css'

const Notes = ({ onClose }) => {
  const [notes, setNotes] = useState([])
  const [activeNote, setActiveNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes')
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes)
      setNotes(parsed)
      if (parsed.length > 0) {
        setActiveNote(parsed[0])
      }
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('userNotes', JSON.stringify(notes))
  }, [notes])

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setActiveNote(newNote)
  }

  const updateNote = (field, value) => {
    if (!activeNote) return
    
    const updatedNote = {
      ...activeNote,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }
    
    // Auto-generate title from first line of content
    if (field === 'content') {
      const firstLine = value.split('\n')[0].trim()
      updatedNote.title = firstLine || 'New Note'
    }
    
    setActiveNote(updatedNote)
    setNotes(notes.map(n => n.id === activeNote.id ? updatedNote : n))
  }

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId)
    setNotes(updatedNotes)
    
    if (activeNote?.id === noteId) {
      setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getPreview = (content) => {
    const lines = content.split('\n').filter(l => l.trim())
    return lines.slice(1, 3).join(' ').substring(0, 100) || 'No additional text'
  }

  return (
    <div className="notes-app glass-dark">
      {/* Toolbar */}
      <div className="notes-toolbar">
        <div className="window-controls">
          <button className="window-btn close" onClick={onClose} title="Close">
            <span>×</span>
          </button>
          <button className="window-btn minimize" title="Minimize">
            <span>−</span>
          </button>
          <button className="window-btn maximize" title="Maximize">
            <span>+</span>
          </button>
        </div>
        <div className="notes-title">Notes</div>
        <div className="notes-toolbar-actions">
          <button className="notes-btn" onClick={createNewNote} title="New Note">
            ✏️
          </button>
        </div>
      </div>

      <div className="notes-layout">
        {/* Sidebar - Notes List */}
        <div className="notes-sidebar">
          <div className="notes-search">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="notes-list">
            {filteredNotes.length === 0 ? (
              <div className="notes-empty">
                {notes.length === 0 ? (
                  <>
                    <span className="empty-icon">📝</span>
                    <p>No notes yet</p>
                    <button onClick={createNewNote}>Create your first note</button>
                  </>
                ) : (
                  <p>No notes found</p>
                )}
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${activeNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => setActiveNote(note)}
                >
                  <div className="note-item-header">
                    <span className="note-item-title">{note.title}</span>
                    <button 
                      className="note-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                      title="Delete note"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="note-item-meta">
                    <span className="note-item-date">{formatDate(note.updatedAt)}</span>
                    <span className="note-item-preview">{getPreview(note.content)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="notes-editor">
          {activeNote ? (
            <textarea
              className="note-content"
              value={activeNote.content}
              onChange={(e) => updateNote('content', e.target.value)}
              placeholder="Start typing your note..."
            />
          ) : (
            <div className="notes-no-selection">
              <span className="empty-icon">📝</span>
              <p>Select a note or create a new one</p>
              <button onClick={createNewNote}>New Note</button>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="notes-statusbar">
        <span>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        {activeNote && (
          <span>Last edited: {formatDate(activeNote.updatedAt)}</span>
        )}
      </div>
    </div>
  )
}

export default Notes
