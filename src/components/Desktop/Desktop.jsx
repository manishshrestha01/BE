import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBackground } from '../../context/BackgroundContext'
import { COLLEGES } from '../../lib/colleges'
import { SUBJECT_FOLDER_MAP, slugToFolderName } from '../../lib/subjectMap'
import Finder from '../Finder/Finder'
import Dock from '../Dock/Dock'
import QuickLook from '../QuickLook/QuickLook'
import Settings from '../Settings/Settings'
import Notes from '../Notes/Notes'
import ContactApp from '../Contact/ContactApp'
import SpotifyApp from '../Spotify/SpotifyApp'
import './Desktop.css'

// Convert search params into a GitHub folder path for the Finder.
// Supports:
//  - Legacy ?college=pec&semester=3&subject=operating-systems
//  - Full-chain ?path=semester-3/operating-systems/unit-1 (every folder level)
// Both are also honored with an optional ?file=<name-slug>.<type-marker> so a
// deep link can open a specific file.
function buildInitialPathFromParams(searchParams) {
  if (!searchParams) return null

  const fullPath = searchParams.get('path')
  if (fullPath) {
    // Generic full-chain param — reverse each slug to a folder name.
    const parts = fullPath.split('/').filter(Boolean).map(seg => slugToFolderName(seg))
    return parts.length > 0 ? parts.join('/') : null
  }

  const college = searchParams.get('college')
  const semester = searchParams.get('semester')
  const subject = searchParams.get('subject')

  const parts = []

  if (college) {
    // Resolve college slug/abbreviation to full folder name from COLLEGES list.
    // Match against both the full value ("Pokhara Engineering College (PEC)")
    // and the abbreviation in parentheses ("PEC").
    const collegeLower = college.toLowerCase()
    const match = COLLEGES.find(c => {
      if (c.value.toLowerCase() === collegeLower) return true
      const abbrMatch = c.value.match(/\(([^)]+)\)/)
      return abbrMatch && abbrMatch[1].toLowerCase() === collegeLower
    })
    if (match) {
      parts.push(match.value)
    }
  }

  if (semester) parts.push(`Semester ${semester}`)
  if (subject) {
    parts.push(slugToFolderName(subject))
  }

  return parts.length > 0 ? parts.join('/') : null
}

// Extract the ?file=<name-slug>.<type-marker> param into a coarse fileType.
function parseFileParam(searchParams) {
  const fileSlug = searchParams && searchParams.get('file')
  if (!fileSlug) return { fileSlug: null, fileType: null }
  const lastDot = fileSlug.lastIndexOf('.')
  if (lastDot === -1) return { fileSlug, fileType: null }
  return { fileSlug, fileType: fileSlug.slice(lastDot + 1) }
}

const DASHBOARD_UI_STATE_KEY = 'studymate:dashboard-ui:v1'
const QUICKLOOK_STATE_KEY = 'studymate:quicklook:v1'
const SHOW_SHORTCUTS_KEY = 'studymate:show-shortcuts:v1'
const VALID_ACTIVE_APPS = ['finder', 'notes', 'settings', 'contact', 'spotify']
const DEFAULT_NOTES_VIEW_STATE = {
  noteId: null,
  chapterId: null,
  mode: 'draw',
  windowState: 'normal'
}

const toSerializableQuickLookFile = (file) => {
  if (!file || typeof file !== 'object') return null

  const serialized = {
    id: file.id ?? file.item_id ?? null,
    name: file.name ?? file.item_name ?? null,
    url: file.url ?? null,
    fileType: file.fileType ?? file.file_type ?? null,
    type: file.type ?? file.item_type ?? 'file',
    path: file.path ?? file.item_path ?? null
  }

  if (!serialized.url || !serialized.name || !serialized.fileType) {
    return null
  }

  return serialized
}

const readQuickLookState = () => {
  try {
    const raw = sessionStorage.getItem(QUICKLOOK_STATE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return toSerializableQuickLookFile(parsed)
  } catch {
    return null
  }
}

const persistQuickLookState = (file) => {
  try {
    const serialized = toSerializableQuickLookFile(file)
    if (!serialized) {
      sessionStorage.removeItem(QUICKLOOK_STATE_KEY)
      return
    }

    sessionStorage.setItem(QUICKLOOK_STATE_KEY, JSON.stringify(serialized))
  } catch {
    // Ignore storage failures.
  }
}

const readShowShortcuts = () => {
  try {
    return localStorage.getItem(SHOW_SHORTCUTS_KEY) !== '0'
  } catch {
    return true
  }
}

const readDashboardUiState = () => {
  try {
    const raw = localStorage.getItem(DASHBOARD_UI_STATE_KEY)
    if (!raw) return { activeApp: null, notes: DEFAULT_NOTES_VIEW_STATE }

    const parsed = JSON.parse(raw)
    const activeApp = VALID_ACTIVE_APPS.includes(parsed?.activeApp) ? parsed.activeApp : null
    const notes = {
      ...DEFAULT_NOTES_VIEW_STATE,
      ...(parsed?.notes || {})
    }

    return { activeApp, notes }
  } catch {
    return { activeApp: null, notes: DEFAULT_NOTES_VIEW_STATE }
  }
}

const Desktop = () => {
  const { currentBg, customBg } = useBackground()
  const router = useRouter()
  const searchParams = useSearchParams()
  const restoredState = useMemo(() => readDashboardUiState(), [])

  // Derive initial Finder path from URL params (?college=pec&semester=3&subject=operating-systems or ?path=...)
  const initialFinderPath = useMemo(() => {
    return buildInitialPathFromParams(searchParams)
  }, [searchParams])

  // ?file=<slug> deep-link — Finder resolves the file once its folder loads.
  const initialFileSlug = useMemo(() => parseFileParam(searchParams).fileSlug, [searchParams])

  // If URL has navigation params, open Finder immediately; otherwise restore last state
  const [activeApp, setActiveApp] = useState(() => {
    if (initialFinderPath) return 'finder'
    return restoredState.activeApp
  })
  const [notesViewState, setNotesViewState] = useState(restoredState.notes)
  const [quickLookFile, setQuickLookFile] = useState(() => readQuickLookState())
  const quickLookFileRef = useRef(quickLookFile)
  const [spotifyMounted, setSpotifyMounted] = useState(restoredState.activeApp === 'spotify')
  const [settingsInitialSection, setSettingsInitialSection] = useState('profile')
  const [showShortcuts, setShowShortcuts] = useState(() => readShowShortcuts())

  const toggleShowShortcuts = () => {
    setShowShortcuts(prev => {
      const next = !prev
      try {
        localStorage.setItem(SHOW_SHORTCUTS_KEY, next ? '1' : '0')
      } catch { /* ignore */ }
      return next
    })
  }

  const openTips = () => {
    setSettingsInitialSection('download-guide')
    openApp('settings')
  }

  const openSettings = () => {
    setSettingsInitialSection('profile')
    openApp('settings')
  }

  const showFinder = activeApp === 'finder'
  const showNotes = activeApp === 'notes'
  const showSettings = activeApp === 'settings'
  const showContact = activeApp === 'contact'
  const showSpotify = activeApp === 'spotify'

    // Live wallpapers: gradient is the base layer, animated ::before sits on top
  // Video wallpapers use a <video> element instead
  const isVideoWallpaper = currentBg.type === 'video'
  const backgroundStyle = customBg
    ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover' }
    : isVideoWallpaper
    ? { background: 'transparent' }
    : { background: currentBg.value }

  const handleQuickLook = (file) => {
    setQuickLookFile(toSerializableQuickLookFile(file))
  }

  const closeFinder = () => {
    setActiveApp((prev) => (prev === 'finder' ? null : prev))
  }

  const closeNotes = () => {
    setActiveApp((prev) => (prev === 'notes' ? null : prev))
  }

  const closeContact = () => {
    setActiveApp((prev) => (prev === 'contact' ? null : prev))
  }

  const closeSettings = () => {
    setActiveApp((prev) => (prev === 'settings' ? null : prev))
  }

  const closeSpotify = () => {
    setActiveApp((prev) => (prev === 'spotify' ? null : prev))
  }

  const openSpotify = () => {
    setSpotifyMounted(true)
    openApp('spotify')
  }

  // Open exactly one app at a time. If the requested app is already open, close it (toggle).
  // This prevents apps from opening *behind* the currently focused app (e.g. Contact).
  const openApp = (app) => {
    const isOpen = activeApp === app

    // toggle: close if already open
    if (isOpen) {
      setActiveApp(null)
      return
    }

    // Open requested app and close others
    setActiveApp(app)
  }

  useEffect(() => {
    const persistUiState = () => {
      try {
        localStorage.setItem(
          DASHBOARD_UI_STATE_KEY,
          JSON.stringify({
            activeApp,
            notes: notesViewState
          })
        )
      } catch {
        // Ignore storage failures.
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistUiState()
      }
    }

    persistUiState()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', persistUiState)

    return () => {
      persistUiState()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', persistUiState)
    }
  }, [activeApp, notesViewState])

  useEffect(() => {
    quickLookFileRef.current = quickLookFile
    persistQuickLookState(quickLookFile)
  }, [quickLookFile])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistQuickLookState(quickLookFileRef.current)
        return
      }

      if (document.visibilityState === 'visible') {
        const restored = readQuickLookState()
        setQuickLookFile((prev) => {
          const prevSerialized = toSerializableQuickLookFile(prev)
          const restoredSerialized = toSerializableQuickLookFile(restored)

          if (!prevSerialized && !restoredSerialized) return prev
          if (!restoredSerialized) return null
          if (
            prevSerialized &&
            prevSerialized.url === restoredSerialized.url &&
            prevSerialized.name === restoredSerialized.name &&
            prevSerialized.fileType === restoredSerialized.fileType
          ) {
            return prev
          }

          return restoredSerialized
        })
      }
    }

    const handleBeforeUnload = () => {
      persistQuickLookState(quickLookFileRef.current)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <div className={`desktop${currentBg.live ? ' desktop-live desktop-live-' + currentBg.id : ''}`} style={backgroundStyle}>
      {/* Video wallpaper background */}
      {isVideoWallpaper && (
        <video
          className="desktop-video-bg"
          autoPlay
          loop
          muted
          playsInline
          src={currentBg.value}
        />
      )}
      {/* Main Content Area */}
      <div className="desktop-content">
        {showFinder && (
          <Finder
            onQuickLook={handleQuickLook}
            onClose={closeFinder}
            initialPath={initialFinderPath}
            initialFileSlug={initialFileSlug}
          />
        )}
        {showNotes && (
          <Notes
            onClose={closeNotes}
            initialState={notesViewState}
            onStateChange={setNotesViewState}
          />
        )}
        {showContact && (
          <ContactApp onClose={closeContact} />
        )}
      </div>

      {/* Desktop shortcuts (non-invasive) */}
      {showShortcuts && (
      <div className="desktop-shortcuts" aria-hidden={false}>
        <button
          className="desktop-shortcut desktop-shortcut--finder"
          title="Finder"
          aria-label="Open Finder"
          onClick={() => openApp('finder')}
        >
          <div className="desktop-shortcut-png"><img src="/icons/finder.webp" alt="Finder" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Finder</div>
        </button>

        <button
          className="desktop-shortcut desktop-shortcut--finder"
          title="Draw"
          aria-label="Open Draw"
          onClick={() => openApp('notes')}
        >
          <div className="desktop-shortcut-png"><img src="/icons/notes.webp" alt="Draw" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Draw</div>
        </button>

        <button
          className="desktop-shortcut"
          title="Spotify"
          aria-label="Open Spotify"
          onClick={openSpotify}
        >
          <div className="desktop-shortcut-png"><img src="/icons/spotify.webp" alt="Spotify" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Spotify</div>
        </button>
        
        <button className="desktop-shortcut" onClick={() => openApp('contact')} title="Contact Me" aria-label="Open Contact">
          <div className="desktop-shortcut-png"><img src="/icons/contacts.webp" alt="Contact" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Contact</div>
        </button>

        <button
          className="desktop-shortcut desktop-shortcut--finder"
          title="Settings"
          aria-label="Open Settings"
          onClick={openSettings}
        >
          <div className="desktop-shortcut-png"><img src="/icons/settings.webp" alt="Settings" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Settings</div>
        </button>

        <button
          className="desktop-shortcut"
          title="Banner"
          aria-label="View Banner"
          onClick={() => router.push('/banner')}
        >
          <div className="desktop-shortcut-png"><img src="/icons/photos.webp" alt="Banner" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Banner</div>
        </button>

      </div>
      )}

      {/* Tips shortcut (top-left) */}
      {showShortcuts && (
      <button
        className="desktop-tips-shortcut"
        title="Tips"
        aria-label="Open Tips (Download Guide)"
        onClick={openTips}
      >
        <div className="desktop-shortcut-png"><img src="/icons/tips.webp" alt="Tips" className="desktop-shortcut-img"/></div>
        <div className="desktop-shortcut-label">Tips</div>
      </button>
      )}

      {/* Dock */}
      <Dock 
        activeApp={activeApp}
        onFinderClick={() => openApp('finder')}
        onNotesClick={() => openApp('notes')}
        onSettingsClick={() => openApp('settings')}
        onContactClick={() => openApp('contact')}
        onSpotifyClick={openSpotify}
      />

      {/* Spotify (stays mounted so music continues in the background) */}
      {spotifyMounted && (
        <SpotifyApp
          open={showSpotify}
          onClose={closeSpotify}
          onReopen={openSpotify}
        />
      )}

      {/* Quick Look Modal */}
      {quickLookFile && (
        <QuickLook 
          file={quickLookFile}
          onClose={() => setQuickLookFile(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={closeSettings}
          initialSection={settingsInitialSection}
          showShortcuts={showShortcuts}
          onToggleShortcuts={toggleShowShortcuts}
        />
      )}

    </div>
  )
}

export default Desktop
