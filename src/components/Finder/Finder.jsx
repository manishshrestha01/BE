import React, { useState, useRef, useEffect } from 'react'
import { useGitHubNotes } from '../../hooks/useGitHubNotes'
import './Finder.css'

// File type icons - returns emoji or JSX for custom icons
const getFileIcon = (type) => {
  if (type === 'docx') {
    return <img src="/Word/icons8-microsoft-word-2025-24.svg" alt="Word" className="file-icon-svg" />
  }
  if (type === 'pptx') {
    return <img src="/PowerPoint/icons8-powerpoint-48.svg" alt="PowerPoint" className="file-icon-svg" />
  }
  if (type === 'pdf') {
    return <img src="/PDF_file_icon.svg" alt="PDF" className="file-icon-svg" />
  }
  
  const icons = {
    folder: '📁',
    image: '🖼️',
    video: '🎬',
    text: '📄',
    unknown: '📄'
  }
  return icons[type] || icons.unknown
}

const Finder = ({ onFileSelect, onQuickLook, onClose }) => {
  const {
    items,
    loading,
    error,
    folderPath,
    isConfigured,
    navigateToFolder,
    navigateBack,
    navigateToPathIndex,
    refresh,
    getFileUrl,
  } = useGitHubNotes()

  const [selectedItem, setSelectedItem] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  
  const finderRef = useRef(null)

  // Auto-focus finder on mount
  useEffect(() => {
    if (finderRef.current) {
      finderRef.current.focus()
    }
  }, [])

  const handleItemClick = (item) => {
    setSelectedItem(item.id)
    if (item.type !== 'folder') {
      onFileSelect?.(item)
    }
  }

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id, item.name, item.path)
      setSelectedItem(null)
    } else {
      // Add URL for viewing
      const itemWithUrl = { ...item, url: item.url || getFileUrl(item) }
      onQuickLook?.(itemWithUrl)
    }
  }

  return (
    <div 
      ref={finderRef}
      className="finder glass-dark"
      tabIndex={0}
    >

      {/* Toolbar */}
      <div className="finder-toolbar">
        {/* Window Controls */}
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

        <div className="finder-controls">
          <button 
            className="finder-btn" 
            onClick={navigateBack}
            disabled={folderPath.length <= 1}
            title="Back"
          >
            ←
          </button>
          <button className="finder-btn" disabled title="Forward">→</button>
        </div>
        
        <div className="finder-breadcrumb">
          {folderPath.map((folder, index) => (
            <span key={folder.id || 'root'}>
              <button 
                className="breadcrumb-item"
                onClick={() => navigateToPathIndex(index)}
              >
                {folder.name}
              </button>
              {index < folderPath.length - 1 && <span className="breadcrumb-sep">/</span>}
            </span>
          ))}
        </div>

        <div className="finder-actions">
          <button 
            className="finder-btn action-btn"
            onClick={refresh}
            title="Refresh"
          >
            🔄
          </button>
        </div>

        <div className="finder-view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="finder-layout">
        {/* Sidebar */}
        <div className="finder-sidebar">
          <div className="sidebar-section">
            <h3>Favorites</h3>
            <ul>
              <li 
                className={folderPath.length === 1 ? 'active' : ''}
                onClick={() => navigateToPathIndex(0)}
              >
                📚 All Notes
              </li>
              <li>⭐ Starred</li>
              <li>🕐 Recent</li>
            </ul>
          </div>
          
          {!isConfigured && (
            <div className="sidebar-section">
              <div className="demo-badge">
                🎮 Demo Mode
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className={`finder-content ${viewMode}`}>
          {/* Loading state */}
          {loading && (
            <div className="finder-loading">
              <span className="loading-spinner">⏳</span>
              <p>Loading...</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="finder-error">
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && (
            <div className="finder-empty">
              <span className="empty-icon">📂</span>
              <p>This folder is empty</p>
            </div>
          )}

          {/* Items */}
          {!loading && items.map(item => (
            <div
              key={item.id}
              className={`finder-item ${selectedItem === item.id ? 'selected' : ''}`}
              onClick={() => handleItemClick(item)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <div className="item-icon">
                {item.type === 'folder' 
                  ? '📁' 
                  : getFileIcon(item.fileType || item.file_type)
                }
              </div>
              <span className="item-name">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="finder-statusbar">
        <span>{items.length} items</span>
        {selectedItem && <span>Press Space to Quick Look</span>}
        {!isConfigured && <span className="demo-notice">Demo Mode - Configure GitHub repo</span>}
      </div>
    </div>
  )
}

export default Finder