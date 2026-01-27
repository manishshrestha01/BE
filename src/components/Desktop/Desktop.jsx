import { useState } from 'react'
import { useBackground } from '../../context/BackgroundContext'
import Finder from '../Finder/Finder'
import Dock from '../Dock/Dock'
import QuickLook from '../QuickLook/QuickLook'
import Settings from '../Settings/Settings'
import Notes from '../Notes/Notes'
import ContactApp from '../Contact/ContactApp'
import './Desktop.css'

const Desktop = () => {
  const { currentBg, customBg } = useBackground()
  const [showFinder, setShowFinder] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [quickLookFile, setQuickLookFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const backgroundStyle = customBg 
    ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover' }
    : { background: currentBg.value }

  const handleQuickLook = (file) => {
    setQuickLookFile(file)
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const toggleFinder = () => {
    setShowFinder(!showFinder)
    if (!showFinder) setShowNotes(false) // Close notes when opening finder
  }

  const closeFinder = () => {
    setShowFinder(false)
  }

  const toggleNotes = () => {
    setShowNotes(!showNotes)
    if (!showNotes) setShowFinder(false) // Close finder when opening notes
  }

  const closeNotes = () => {
    setShowNotes(false)
  }

  // Open exactly one app at a time. If the requested app is already open, close it (toggle).
  // This prevents apps from opening *behind* the currently focused app (e.g. Contact).
  const openApp = (app) => {
    const isOpen = {
      finder: showFinder,
      notes: showNotes,
      settings: showSettings,
      contact: showContact
    }[app]

    // toggle: close if already open
    if (isOpen) {
      setShowFinder(false)
      setShowNotes(false)
      setShowSettings(false)
      setShowContact(false)
      return
    }

    // Open requested app and close others
    setShowFinder(app === 'finder')
    setShowNotes(app === 'notes')
    setShowSettings(app === 'settings')
    setShowContact(app === 'contact')
  }

  // Determine which app is active for the dock indicator
  const getActiveApp = () => {
    if (showFinder) return 'finder'
    if (showNotes) return 'notes'
    if (showContact) return 'contact'
    if (showSettings) return 'settings'
    return null
  }

  return (
    <div className="desktop" style={backgroundStyle}>
      {/* Main Content Area */}
      <div className="desktop-content">
        {showFinder && (
          <Finder 
            onFileSelect={handleFileSelect}
            onQuickLook={handleQuickLook}
            onClose={closeFinder}
          />
        )}
        {showNotes && (
          <Notes onClose={closeNotes} />
        )}
        {showContact && (
          <ContactApp onClose={() => setShowContact(false)} />
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
          title="Notes"
          aria-label="Open Notes"
          onClick={() => openApp('notes')}
        >
          <div className="desktop-shortcut-icon"><span>📝</span></div>
          <div className="desktop-shortcut-label">Notes</div>
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
        activeApp={getActiveApp()}
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
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default Desktop
