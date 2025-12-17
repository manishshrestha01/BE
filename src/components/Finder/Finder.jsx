import React, { useState, useRef, useEffect } from 'react'
import { useGitHubNotes } from '../../hooks/useGitHubNotes'
import { useAuth } from '../../context/AuthContext'
import { toggleFavorite, getUserFavorites, getUserRecents, upsertRecentTab, removeFavorite } from '../../lib/database'
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
    image: '🌠',
    video: '🎬',
    text: '🗒️',
    rtf: '📝',
    heif: '🌠',
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

  const { user } = useAuth()

  const [selectedItem, setSelectedItem] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [activeTab, setActiveTab] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [recents, setRecents] = useState([])
  const [displayedItems, setDisplayedItems] = useState([])
  const [windowState, setWindowState] = useState('normal') // 'normal', 'maximized', 'minimized'
  
  const finderRef = useRef(null)

  // Auto-focus finder on mount
  useEffect(() => {
    if (finderRef.current) {
      finderRef.current.focus()
    }
  }, [])

  // Update displayed items based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setDisplayedItems(items)
    } else if (activeTab === 'starred') {
      setDisplayedItems(favorites)
    } else if (activeTab === 'recent') {
      setDisplayedItems(recents)
    }
  }, [activeTab, items, favorites, recents])

  // Fetch favorites and recents when user changes
  useEffect(() => {
    if (user?.id) {
      fetchFavoritesAndRecents()
    }
  }, [user?.id])

  const fetchFavoritesAndRecents = async () => {
    if (!user?.id) return
    
    const favResult = await getUserFavorites(user.id)
    const recResult = await getUserRecents(user.id)
    
    if (favResult.data) setFavorites(favResult.data)
    if (recResult.data) setRecents(recResult.data)
  }

  // Handle spacebar press to add/remove favorites
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === 'Space' && selectedItem && user?.id) {
        e.preventDefault()
        
        // Search in items first (original GitHub items), then in displayedItems
        let item = items.find(i => i.id === selectedItem)
        
        if (!item) {
          // If not found in items, search in displayedItems and parse if needed
          const displayItem = displayedItems.find(i => i.id === selectedItem)
          if (displayItem && displayItem.item_data) {
            try {
              item = JSON.parse(displayItem.item_data)
              item.id = displayItem.id || item.id
            } catch (e) {
              item = displayItem
            }
          } else {
            item = displayItem
          }
        }

        if (!item) return

        // Don't allow folders to be added to favorites
        if (item.type === 'folder') {
          console.log('Folders cannot be added to favorites')
          return
        }

        // Use item_id for comparison (more reliable than path)
        const itemId = item.id || item.item_id
        const isAlreadyFavorited = favorites.some(fav => fav.item_id === itemId)
        
        console.log('Item ID:', itemId, 'Already favorited:', isAlreadyFavorited, 'Favorites:', favorites)

        if (isAlreadyFavorited) {
          // Remove from favorites
          const itemPath = item.path || item.name
          const result = await removeFavorite(user.id, itemPath)
          if (!result.error) {
            console.log('Removed from favorites')
            await fetchFavoritesAndRecents()
          } else {
            console.error('Error removing from favorites:', result.error)
          }
        } else {
          // Add to favorites
          const itemPath = item.path || item.name
          const favoriteItem = {
            item_id: item.id,
            item_name: item.name,
            item_path: itemPath,
            item_type: item.type || 'file',
            item_data: JSON.stringify({
              id: item.id,
              name: item.name,
              type: item.type,
              path: item.path,
              fileType: item.fileType || item.file_type,
              url: item.url,
              ...item
            })
          }

          const result = await toggleFavorite({ userId: user.id, item: favoriteItem })
          if (!result.error) {
            console.log('Added to favorites')
            await fetchFavoritesAndRecents()
          } else {
            console.error('Error adding to favorites:', result.error)
          }
        }
      }
    }

    const finder = finderRef.current
    if (finder) {
      finder.addEventListener('keydown', handleKeyDown)
      return () => finder.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedItem, items, displayedItems, user?.id, favorites])

  const handleMinimize = () => {
    setWindowState('minimized')
  }

  const handleMaximize = () => {
    setWindowState(prev => prev === 'maximized' ? 'normal' : 'maximized')
  }

  const getWindowClassName = () => {
    let className = 'finder glass-dark'
    if (windowState === 'maximized') className += ' maximized'
    if (windowState === 'minimized') className += ' minimized'
    return className
  }

  // Minimized state - show as small bar
  if (windowState === 'minimized') {
    return (
      <div className="finder-minimized" onClick={() => setWindowState('normal')}>
        <span>📁</span>
        <span>Finder</span>
      </div>
    )
  }

  const handleItemClick = (item) => {
    setSelectedItem(item.id)
    if ((item.type || item.item_type) !== 'folder') {
      onFileSelect?.(item)
    }
  }

  const handleItemDoubleClick = async (item) => {
    const itemType = item.type || item.item_type
    
    // Only track recents for files, not folders
    if (itemType !== 'folder' && user?.id) {
      const recentItem = {
        item_id: item.id || item.item_id,
        item_name: item.name || item.item_name,
        item_path: item.path || item.item_path || item.name || item.item_name,
        item_type: itemType,
        item_data: item.item_data ? item.item_data : JSON.stringify({
          id: item.id,
          name: item.name || item.item_name,
          type: itemType,
          path: item.path || item.item_path,
          fileType: item.fileType || item.file_type,
          url: item.url,
          ...item
        })
      }
      await upsertRecentTab({ userId: user.id, item: recentItem })
    }

    // Parse item data if it's stored as JSON (from favorites/recents)
    let itemToProcess = item
    if (item.item_data && typeof item.item_data === 'string') {
      try {
        itemToProcess = JSON.parse(item.item_data)
      } catch (e) {
        itemToProcess = item
      }
    }

    const itemTypeToCheck = itemToProcess.type || item.type || item.item_type
    
    if (itemTypeToCheck === 'folder') {
      // Navigate to folder - use parsed data if available
      const folderId = itemToProcess.id || item.id || item.item_id
      const folderName = itemToProcess.name || item.name || item.item_name
      const folderPath = itemToProcess.path || item.path || item.item_path
      
      if (folderId && folderName) {
        navigateToFolder(folderId, folderName, folderPath)
        setSelectedItem(null)
      }
    } else {
      // Open file
      const itemWithUrl = { 
        ...itemToProcess, 
        name: itemToProcess.name || item.name || item.item_name,
        fileType: itemToProcess.fileType || item.fileType || item.file_type,
        url: itemToProcess.url || getFileUrl(itemToProcess) 
      }
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
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => setActiveTab('all')}
              >
                📚 All Notes
              </li>
              <li 
                className={activeTab === 'starred' ? 'active' : ''}
                onClick={() => setActiveTab('starred')}
              >
                ⭐ Starred {favorites.length > 0 && `(${favorites.length})`}
              </li>
              <li 
                className={activeTab === 'recent' ? 'active' : ''}
                onClick={() => setActiveTab('recent')}
              >
                🕐 Recent {recents.length > 0 && `(${recents.length})`}
              </li>
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
          {!loading && displayedItems.length === 0 && (
            <div className="finder-empty">
              <span className="empty-icon">📂</span>
              <p>{activeTab === 'starred' ? 'No starred items' : activeTab === 'recent' ? 'No recent items' : 'This folder is empty'}</p>
            </div>
          )}

          {/* Items */}
          {!loading && displayedItems.map(item => {
            // Parse item data if stored as JSON
            let displayItem = item
            if (item.item_data && typeof item.item_data === 'string') {
              try {
                displayItem = JSON.parse(item.item_data)
              } catch (e) {
                displayItem = item
              }
            }
            
            return (
              <div
                key={item.id}
                className={`finder-item ${selectedItem === item.id ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="item-icon">
                  {(displayItem.type || item.type || item.item_type) === 'folder' 
                    ? '📁' 
                    : getFileIcon(displayItem.fileType || item.fileType || item.file_type)
                  }
                </div>
                <span className="item-name">{displayItem.name || item.name || item.item_name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="finder-statusbar">
        <span>{displayedItems.length} items</span>
        {selectedItem && (() => {
          const item = items.find(i => i.id === selectedItem) || displayedItems.find(i => i.id === selectedItem)
          if (item?.type === 'folder') {
            return <span>Folders cannot be added to favorites</span>
          }
          
          const itemPath = item?.path || item?.name
          const isFavorited = favorites.some(fav => (fav.item_path || fav.path) === itemPath)
          
          return isFavorited 
            ? <span>⭐ Press Space to Remove from Favorites</span>
            : <span>Press Space to Add to Favorites</span>
        })()}
        {!isConfigured && <span className="demo-notice">Demo Mode - Configure GitHub repo</span>}
      </div>
    </div>
  )
}

export default Finder