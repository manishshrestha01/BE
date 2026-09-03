import React, { useState, useRef, useEffect, useMemo } from 'react'
import { gooeyToast } from 'goey-toast'
import {
  X, Minus, Plus,
  ChevronLeft, ChevronRight,
  RotateCw, LayoutGrid, List,
  BookOpen, Star, Clock, Folder
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGitHubNotes } from '../../hooks/useGitHubNotes'
import { useAuth } from '../../context/AuthContext'
import useFolderColors from '../../hooks/useFolderColors'
import FolderIcon from '../FolderIcon'
import { toggleFavorite, getUserFavorites, getUserRecents, upsertRecentTab, removeFavorite } from '../../lib/database'
import { COLLEGES } from '../../lib/colleges'
import { folderNameToSlug } from '../../lib/subjectMap'
import './Finder.css'

// File type icons - returns emoji or JSX for custom icons
const getFileIcon = (type) => {
  if (type === 'docx' || type === 'odt') {
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

const getColorFromMap = (colorMap, normalizedColorMap, candidate) => {
  const normalizedCandidate = typeof candidate === 'string' ? candidate.trim() : ''
  if (!normalizedCandidate) return ''

  return (
    colorMap?.[normalizedCandidate] ||
    normalizedColorMap?.[normalizedCandidate.toLowerCase()] ||
    ''
  )
}

const Finder = ({ onFileSelect, onQuickLook, onClose, initialPath = null }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
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
  } = useGitHubNotes({ initialPath })

  const { user } = useAuth()
  const { folderColors } = useFolderColors()

  const [selectedItem, setSelectedItem] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [activeTab, setActiveTab] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [recents, setRecents] = useState([])
  const longPressTimeoutRef = useRef(null)
  const longPressActiveRef = useRef(false)
  const longPressStartPos = useRef({ x: 0, y: 0 })
  const suppressClickRef = useRef(false)
  const [pressedItemId, setPressedItemId] = useState(null)
   const [windowState, setWindowState] = useState('normal') // 'normal', 'maximized', 'minimized'
   
   const finderRef = useRef(null)

  const normalizedFolderColorMap = React.useMemo(() => (
    Object.fromEntries(
      Object.entries(folderColors || {}).map(([key, value]) => [key.trim().toLowerCase(), value])
    )
  ), [folderColors])

  const getFolderColor = (item) => {
    const path = (item?.path || item?.item_path || '').trim()
    const name = (item?.name || item?.item_name || '').trim()

    if (path) {
      const segments = path.split('/').filter(Boolean)

      for (let index = segments.length; index > 0; index -= 1) {
        const ancestorPath = segments.slice(0, index).join('/')
        const ancestorName = segments[index - 1]
        const inheritedColor =
          getColorFromMap(folderColors, normalizedFolderColorMap, ancestorPath) ||
          getColorFromMap(folderColors, normalizedFolderColorMap, ancestorName)

        if (inheritedColor) {
          return inheritedColor
        }
      }
    }

    const directNameColor = getColorFromMap(folderColors, normalizedFolderColorMap, name)
    if (directNameColor) {
      return directNameColor
    }

    return '#007bff'
  }

  // Auto-focus finder on mount
  useEffect(() => {
    if (finderRef.current) {
      finderRef.current.focus()
    }
  }, [])

  // Sync URL params as user navigates folders inside Finder.
  // We keep the legacy ?college&?semester&?subject params for old shared links,
  // and ALSO encode the full breadcrumb chain into ?path= so every subfolder is
  // deep-linkable.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let dirty = false

    // --- Legacy params (college/semester/subject) for backward compatibility.
    if (folderPath.length <= 1) {
      if (params.has('college') || params.has('semester') || params.has('subject') || params.has('path')) {
        params.delete('college')
        params.delete('semester')
        params.delete('subject')
        params.delete('path')
        dirty = true
      }
    } else {
      const segments = folderPath.slice(1) // drop ROOT
      const firstSeg = segments[0]
      const firstSegName = firstSeg?.name?.toLowerCase() || ''
      const isCollege = COLLEGES.some(c => c.value.toLowerCase() === firstSegName)

      // Full chain slug (every folder level).
      const pathSlug = segments.map(seg => folderNameToSlug(seg.name)).join('/')
      if (params.get('path') !== pathSlug) {
        params.set('path', pathSlug)
        dirty = true
      }

      // Legacy college/semester/subject (first 3 levels).
      if (isCollege) {
        params.set('college', firstSegName)
        const semesterSeg = segments[1]
        if (semesterSeg) {
          const semNum = semesterSeg.name.replace(/semester\s*/i, '').trim()
          if (semNum) params.set('semester', semNum)
          else params.delete('semester')
        } else params.delete('semester')
        const subjectSeg = segments[2]
        if (subjectSeg) {
          params.set('subject', folderNameToSlug(subjectSeg.name))
        } else params.delete('subject')
      } else if (firstSeg) {
        // No college — check if this segment is a semester folder
        const semNum = firstSeg.name.replace(/semester\s*/i, '').trim()
        if (/^\d+$/.test(semNum)) {
          params.set('semester', semNum)
          const subjectSeg = segments[1]
          if (subjectSeg) {
            params.set('subject', folderNameToSlug(subjectSeg.name))
          } else params.delete('subject')
          params.delete('college')
        } else if (semNum) {
          // First segment doesn't look like a semester — treat it as subject
          params.set('subject', folderNameToSlug(firstSeg.name))
          params.delete('college')
          params.delete('semester')
        } else {
          params.delete('college')
          params.delete('semester')
          params.delete('subject')
        }
      } else {
        params.delete('college')
        params.delete('semester')
        params.delete('subject')
      }
    }

    // --- Opened file param removed (file deep-linking removed).

    if (!dirty) return

    const newSearch = `?${params.toString()}`
    if (searchParams.toString() !== newSearch) {
      router.replace(`/dashboard${newSearch}`)
    }
  }, [folderPath, searchParams])

  // Derive displayed items from the active tab
  const displayedItems = useMemo(() => {
    if (activeTab === 'starred') return favorites
    if (activeTab === 'recent') return recents
    return items
  }, [activeTab, items, favorites, recents])

  // Current location title shown at the top of the toolbar (macOS-style)
  const currentTitle = useMemo(() => {
    if (activeTab === 'starred') return 'Starred'
    if (activeTab === 'recent') return 'Recent'
    if (activeTab === 'all' && folderPath.length > 1) {
      return folderPath[folderPath.length - 1].name
    }
    return 'All Notes'
  }, [activeTab, folderPath])

  const formatItemSize = (item) => {
    const size = Number(item?.size || item?.item_size)
    if (!Number.isFinite(size) || size <= 0) return '—'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatItemDate = (item) => {
    const raw = item?.date || item?.modified || item?.created_at
    if (!raw) return '—'
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getItemKind = (item) => {
    const type = item?.type || item?.item_type
    if (type === 'folder') return 'Folder'
    const ft = (item?.fileType || item?.file_type || 'Document').toUpperCase()
    return ft === 'PDF' ? 'PDF' : ft.slice(0, 12)
  }

  const fetchFavoritesAndRecents = async () => {
    if (!user?.id) return

    const favResult = await getUserFavorites(user.id)
    const recResult = await getUserRecents(user.id)

    if (favResult.data) setFavorites(favResult.data)
    if (recResult.data) setRecents(recResult.data)
  }

  // Fetch favorites and recents when user changes
  useEffect(() => {
    if (user?.id) {
      Promise.resolve().then(fetchFavoritesAndRecents)
    }
  }, [user?.id])

  const showToast = (msg, type = 'default') => {
    const opts = { showTimestamp: false, spring: false, timing: { displayDuration: 1600 } }
    if (type === 'success') gooeyToast.success(msg, opts)
    else if (type === 'error') gooeyToast.error(msg, opts)
    else if (type === 'warning') gooeyToast.warning(msg, opts)
    else gooeyToast(msg, opts)
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
      try { navigator.vibrate?.(12) } catch {}
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
      showToast('Sign in to add favorites', 'warning')
      return
    }

    // Normalize item
    let itemToProcess = item
    if (item.item_data && typeof item.item_data === 'string') {
      try { itemToProcess = JSON.parse(item.item_data) } catch { itemToProcess = item }
    }

    const itemType = itemToProcess.type || item.type || item.item_type
    if (itemType === 'folder') {
      showToast('Folders cannot be added to favorites', 'warning')
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
          showToast('Removed from favorites', 'success')
        } else {
          showToast('Failed to remove favorite', 'error')
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
          showToast('Added to favorites', 'success')
        } else {
          showToast('Failed to add favorite', 'error')
        }
      }
    } catch (err) {
      console.error('Favorite error:', err)
      showToast('Failed to update favorite', 'error')
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

  // All Notes – return to root level and clear any selected tab
  const handleAllNotes = () => {
    setActiveTab('all')
    if (folderPath.length > 1) {
      navigateToPathIndex(0)
    }
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
        <img src="/icons/finder.webp" alt="Finder" className="minimized-icon" />
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
      } catch {
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
          <button className="window-btn close" onClick={onClose} title="Close" aria-label="Close">
            <span><X strokeWidth={2.4} /></span>
          </button>
          <button className="window-btn minimize" onClick={handleMinimize} title="Minimize" aria-label="Minimize">
            <span><Minus strokeWidth={2.4} /></span>
          </button>
          <button className="window-btn maximize" onClick={handleMaximize} title="Maximize" aria-label="Maximize">
            <span><Plus strokeWidth={2.4} /></span>
          </button>
        </div>

        <div className="finder-controls">
          <button 
            className="finder-btn" 
            onClick={navigateBack}
            disabled={folderPath.length <= 1}
            title="Back"
            aria-label="Back"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <button className="finder-btn" disabled title="Forward" aria-label="Forward">
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="finder-title" title={currentTitle}>{currentTitle}</div>

        <div className="finder-toolbar-right">
          <button
            className="finder-btn finder-refresh"
            onClick={refresh}
            title="Refresh"
            aria-label="Refresh"
          >
            <RotateCw size={14} strokeWidth={2.2} />
          </button>

          <div className="finder-view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Icon view"
              aria-label="Icon view"
            >
              <LayoutGrid size={15} strokeWidth={2} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
              aria-label="List view"
            >
              <List size={16} strokeWidth={2} />
            </button>
          </div>
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
                onClick={handleAllNotes}
              >
                <BookOpen size={15} className="sidebar-icon" />
                <span>All Notes</span>
              </li>
              <li 
                className={activeTab === 'starred' ? 'active' : ''}
                onClick={() => setActiveTab('starred')}
              >
                <Star size={15} className="sidebar-icon" />
                <span>Starred {favorites.length > 0 && `(${favorites.length})`}</span>
              </li>
              <li 
                className={activeTab === 'recent' ? 'active' : ''}
                onClick={() => setActiveTab('recent')}
              >
                <Clock size={15} className="sidebar-icon" />
                <span>Recent {recents.length > 0 && `(${recents.length})`}</span>
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
          {error && activeTab === 'all' && (
            <div className="finder-error">
              <p>⚠️ {error}</p>
              <button className="finder-retry" onClick={refresh}>Retry</button>
            </div>
          )}

          {/* Column headers (list view, macOS style) */}
          {!loading && viewMode === 'list' && (
            <div className="finder-list-header" aria-hidden>
              <span className="list-col list-col-name">Name</span>
              <span className="list-col list-col-date">Date Modified</span>
              <span className="list-col list-col-size">Size</span>
              <span className="list-col list-col-kind">Kind</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && displayedItems.length === 0 && (
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
              } catch {
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
                 <div className="finder-item-name-cell">
                   <div className="item-icon">
                     {(displayItem.type || item.type || item.item_type) === 'folder' 
                       ? (
                           <FolderIcon
                             className="folder-icon-svg"
                             color={getFolderColor(displayItem)}
                             title={displayItem.name || item.name || item.item_name || 'Folder'}
                           />
                         )
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
                 {viewMode === 'list' && (
                   <>
                     <span className="item-meta item-date">{formatItemDate(displayItem)}</span>
                     <span className="item-meta item-size">{formatItemSize(displayItem)}</span>
                     <span className="item-meta item-kind">{getItemKind(displayItem)}</span>
                   </>
                 )}
               </div>
             )
          })}
        </div>
      </div>

      {/* Path bar (macOS) */}
      <div className="finder-pathbar" aria-label="Path bar">
        <span className="pathbar-root"><Folder size={12} /></span>
        {folderPath.map((folder, index) => (
          <span className="pathbar-segment" key={folder.id || 'root'}>
            {index > 0 && <ChevronRight size={10} className="pathbar-sep" aria-hidden />}
            <button
              className="pathbar-label"
              onClick={() => navigateToPathIndex(index)}
              title={index === 0 ? 'Home' : folder.name}
            >
              {index === 0 ? 'Finder' : folder.name}
            </button>
          </span>
        ))}
      </div>

      {/* Status bar */}
      <div className="finder-statusbar">
        <span>{displayedItems.length} {displayedItems.length === 1 ? 'item' : 'items'}</span>
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
