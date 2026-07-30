import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useBackground } from '../../context/BackgroundContext'
import { COLLEGES } from '../../lib/colleges'
import { SUBJECT_FOLDER_MAP, slugToFolderName } from '../../lib/subjectMap'
import Finder from '../Finder/Finder'
import Dock from '../Dock/Dock'
import QuickLook from '../QuickLook/QuickLook'
import Settings from '../Settings/Settings'
import Notes from '../Notes/Notes'
import ContactApp from '../Contact/ContactApp'
import './Desktop.css'

// Convert ?semester=3&subject=operating-systems&college=pec into a GitHub folder path.
// Mirrors the folder structure in the manishshrestha01/BE-Computer repo.
function buildInitialPathFromParams(searchParams) {
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

const DASHBOARD_UI_STATE_KEY = 'studymate:dashboard-ui:v1'
const QUICKLOOK_STATE_KEY = 'studymate:quicklook:v1'
const VALID_ACTIVE_APPS = ['finder', 'notes', 'settings', 'contact']
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
  const location = useLocation()
  const restoredState = useMemo(() => readDashboardUiState(), [])
  const [iosDialogOpen, setIosDialogOpen] = useState(false)

  // Derive initial Finder path from URL params (?college=pec&semester=3&subject=operating-systems)
  const initialFinderPath = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return buildInitialPathFromParams(params)
  }, [location.search])

  // If URL has navigation params, open Finder immediately; otherwise restore last state
  const [activeApp, setActiveApp] = useState(() => {
    if (initialFinderPath) return 'finder'
    return restoredState.activeApp
  })
  const [notesViewState, setNotesViewState] = useState(restoredState.notes)
  const [quickLookFile, setQuickLookFile] = useState(() => readQuickLookState())
  const quickLookFileRef = useRef(quickLookFile)

  const showFinder = activeApp === 'finder'
  const showNotes = activeApp === 'notes'
  const showSettings = activeApp === 'settings'
  const showContact = activeApp === 'contact'

  const backgroundStyle = customBg 
    ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover' }
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

  const handleGetApp = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    if (isIOS) {
      setIosDialogOpen(true)
    } else {
      window.open('https://play.google.com/store/apps/details?id=com.manish.studymate', '_blank', 'noopener,noreferrer')
    }
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
    <div className="desktop" style={backgroundStyle}>
      {/* Main Content Area */}
      <div className="desktop-content">
        {showFinder && (
          <Finder
            onQuickLook={handleQuickLook}
            onClose={closeFinder}
            initialPath={initialFinderPath}
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

      {/* Get App – centered card (desktop) / sidebar icon (mobile) */}
      <button
        className={`get-app-card ${activeApp ? 'get-app-card--hidden' : ''}`}
        onClick={handleGetApp}
        title="Get StudyMate App"
        aria-label="Get StudyMate App on Play Store"
      >
        <div className="get-app-card-inner">
          <img src="/black.svg" alt="StudyMate" className="get-app-logo" />
          <div className="get-app-text">
            <span className="get-app-title">Get StudyMate</span>
            <span className="get-app-sub">Available on Android</span>
          </div>
          <span className="get-app-badge">Play Store</span>
        </div>
      </button>

      {/* Desktop shortcuts (non-invasive) */}
      <div className="desktop-shortcuts" aria-hidden={false}>
        <button
          className="desktop-shortcut desktop-shortcut--finder"
          title="Finder"
          aria-label="Open Finder"
          onClick={() => openApp('finder')}
        >
          <div className="desktop-shortcut-icon"><span>📁</span></div>
          <div className="desktop-shortcut-label">Finder</div>
        </button>

        <button
          className="desktop-shortcut desktop-shortcut--finder"
          title="Draw"
          aria-label="Open Draw"
          onClick={() => openApp('notes')}
        >
          <div className="desktop-shortcut-icon"><span>📝</span></div>
          <div className="desktop-shortcut-label">Draw</div>
        </button>
        
        <button className="desktop-shortcut" onClick={() => openApp('contact')} title="Contact Me" aria-label="Open Contact">
          <div className="desktop-shortcut-png"><img src="/gedit.png" alt="Contact" className="desktop-shortcut-img"/></div>
          <div className="desktop-shortcut-label">Contact</div>
        </button>

        <button
          className="desktop-shortcut desktop-shortcut--finder"
          title="Settings"
          aria-label="Open Settings"
          onClick={() => openApp('settings')}
        >
          <div className="desktop-shortcut-icon"><span>⚙️</span></div>
          <div className="desktop-shortcut-label">Settings</div>
        </button>

        {/* Mobile-only sidebar Get App icon */}
        <button
          className="desktop-shortcut get-app-sidebar"
          title="Get StudyMate App"
          aria-label="Get StudyMate App on Play Store"
          onClick={handleGetApp}
        >
          <div className="desktop-shortcut-icon"><img src="/black.svg" alt="StudyMate" style={{ width: 36, height: 36 }} /></div>
          <div className="desktop-shortcut-label">Get App</div>
        </button>
      </div>

      {/* Dock */}
      <Dock 
        activeApp={activeApp}
        onFinderClick={() => openApp('finder')}
        onNotesClick={() => openApp('notes')}
        onSettingsClick={() => openApp('settings')}
        onContactClick={() => openApp('contact')}
      />

      {/* Quick Look Modal */}
      {quickLookFile && (
        <QuickLook 
          file={quickLookFile}
          onClose={() => setQuickLookFile(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={closeSettings} />
      )}

      {/* iOS not-available dialog */}
      {iosDialogOpen && (
        <div className="ios-dialog-overlay" onClick={() => setIosDialogOpen(false)}>
          <div className="ios-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ios-dialog-icon">📱</div>
            <h3 className="ios-dialog-title">StudyMate is not on the App Store</h3>
            <p className="ios-dialog-text">
              StudyMate is currently available only on Android. We're working on bringing it to iOS soon!
            </p>
            <p className="ios-dialog-text ios-dialog-hint">
              If you have an Android device, you can download it on the Play Store.
            </p>
            <button className="ios-dialog-btn" onClick={() => setIosDialogOpen(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Desktop
