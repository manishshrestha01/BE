import { useEffect, useMemo, useRef, useState } from 'react'
import { useBackground } from '../../context/BackgroundContext'
import Finder from '../Finder/Finder'
import Dock from '../Dock/Dock'
import QuickLook from '../QuickLook/QuickLook'
import Settings from '../Settings/Settings'
import Notes from '../Notes/Notes'
import ContactApp from '../Contact/ContactApp'
import './Desktop.css'

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
  const restoredState = useMemo(() => readDashboardUiState(), [])
  const [activeApp, setActiveApp] = useState(restoredState.activeApp)
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
    </div>
  )
}

export default Desktop
