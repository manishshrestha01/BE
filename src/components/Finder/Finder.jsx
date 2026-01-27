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
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimerRef = useRef(null)
  const longPressTimeoutRef = useRef(null)
  const longPressActiveRef = useRef(false)
  const longPressStartPos = useRef({ x: 0, y: 0 })
  const suppressClickRef = useRef(false)
  const [pressedItemId, setPressedItemId] = useState(null)
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

  const showToast = (msg, timeout = 1400) => {
    setToastMessage(msg)
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastMessage(null), timeout)
  }

  // Long-press handlers for touch devices
  const startLongPress = (e, item) => {
    if (!e.touches || e.touches.length === 0) return
    const t = e.touches[0]
    longPressStartPos.current = { x: t.clientX, y: t.clientY }
    longPressActiveRef.current = false
    clearTimeout(longPressTimeoutRef.current)
    longPressTimeoutRef.current = setTimeout(async () => {
      longPressActiveRef.current = true
      suppressClickRef.current = true
      setPressedItemId(item.id)
      // light haptic feedback when long-press action fires
      try { navigator.vibrate?.(12) } catch (e) {}
      await toggleFavoriteForItem(item)
      // brief pressed visual
      setTimeout(() => setPressedItemId(null), 600)
      // keep suppressing click briefly
      setTimeout(() => { suppressClickRef.current = false }, 500)
    }, 650)
  }

  const cancelLongPress = () => {
    clearTimeout(longPressTimeoutRef.current)
    longPressTimeoutRef.current = null
  }

  const moveCancelLongPress = (e) => {
    if (!e.touches || e.touches.length === 0) return
    const t = e.touches[0]
    const dx = Math.abs(t.clientX - longPressStartPos.current.x)
    const dy = Math.abs(t.clientY - longPressStartPos.current.y)
    if (dx > 10 || dy > 10) cancelLongPress()
  }

  const endTouch = () => {
    cancelLongPress()
    longPressActiveRef.current = false
  }

  // Centralized favorite toggle helper (used by Spacebar and long-press)
  const toggleFavoriteForItem = async (item) => {
    if (!user?.id) {
      showToast('Sign in to add favorites')
      return
    }

    // Normalize item
    let itemToProcess = item
    if (item.item_data && typeof item.item_data === 'string') {
      try { itemToProcess = JSON.parse(item.item_data) } catch (e) { itemToProcess = item }
    }

    const itemType = itemToProcess.type || item.type || item.item_type
    if (itemType === 'folder') {
      showToast('Folders cannot be added to favorites')
      return
    }

    const itemId = itemToProcess.id || item.id || item.item_id
    const itemPath = itemToProcess.path || item.path || item.item_path || itemToProcess.name || item.name
    const isAlreadyFavorited = favorites.some(fav => String(fav.item_id) === String(itemId) || (fav.item_path || fav.path) === itemPath)

    try {
      if (isAlreadyFavorited) {
        const result = await removeFavorite(user.id, itemPath)
        if (!result.error) {
          await fetchFavoritesAndRecents()
          showToast('Removed from favorites')
        } else {
          showToast('Failed to remove favorite')
        }
      } else {
        const favoriteItem = {
          item_id: itemId,
          item_name: itemToProcess.name || item.name || item.item_name,
          item_path: itemPath,
          item_type: itemType || 'file',
          item_data: JSON.stringify({
            id: itemToProcess.id,
            name: itemToProcess.name || item.name || item.item_name,
            type: itemType,
            path: itemToProcess.path || item.path || item.item_path,
            fileType: itemToProcess.fileType || item.fileType || item.file_type,
            url: itemToProcess.url,
            ...itemToProcess
          })
        }
        const result = await toggleFavorite({ userId: user.id, item: favoriteItem })
        if (!result.error) {
          await fetchFavoritesAndRecents()
          showToast('Added to favorites')
        } else {
          showToast('Failed to add favorite')
        }
      }
    } catch (err) {
      console.error('Favorite error:', err)
      showToast('Failed to update favorite')
    }
  }

  // Handle spacebar press to add/remove favorites
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === 'Space' && selectedItem && user?.id) {
        e.preventDefault()
        // find the selected item from original items or displayedItems
        let item = items.find(i => i.id === selectedItem)
        if (!item) item = displayedItems.find(i => i.id === selectedItem)
        if (!item) return
        await toggleFavoriteForItem(item)
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
    if (suppressClickRef.current) {
      // suppress intentional click after long-press
      suppressClickRef.current = false
      return
    }
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
          name: item.name,
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
      className={getWindowClassName()}
      tabIndex={0}
    >

      {/* Toolbar */}
      <div className="finder-toolbar">
        {/* Window Controls */}
        <div className="window-controls">
          <button className="window-btn close" onClick={onClose} title="Close">
            <span>×</span>
          </button>
          <button className="window-btn minimize" onClick={handleMinimize} title="Minimize">
            <span>−</span>
          </button>
          <button className="window-btn maximize" onClick={handleMaximize} title="Maximize">
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
                className={`finder-item ${selectedItem === item.id ? 'selected' : ''} ${pressedItemId === item.id ? 'pressed' : ''}`}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                onTouchStart={(e) => startLongPress(e, item)}
                onTouchMove={moveCancelLongPress}
                onTouchEnd={endTouch}
                onTouchCancel={cancelLongPress}
              >
                 <div className="item-icon">
                   {(displayItem.type || item.type || item.item_type) === 'folder' 
                     ? '📁' 
                     : getFileIcon(displayItem.fileType || item.fileType || item.file_type)
                   }
                 </div>
                 {/* show full name on hover via title and aria-label for accessibility */}
                 <span
                   className="item-name"
                   title={displayItem.name || item.name || item.item_name}
                   aria-label={displayItem.name || item.name || item.item_name}
                 >
                   {displayItem.name || item.name || item.item_name}
                 </span>
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

      {/* Toast message */}
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default Finder