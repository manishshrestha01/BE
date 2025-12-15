import { useState } from 'react'
import { useBackground } from '../../context/BackgroundContext'
import Finder from '../Finder/Finder'
import Dock from '../Dock/Dock'
import QuickLook from '../QuickLook/QuickLook'
import Settings from '../Settings/Settings'
import Notes from '../Notes/Notes'
import './Desktop.css'

const Desktop = () => {
  const { currentBg, customBg } = useBackground()
  const [showFinder, setShowFinder] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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

  // Determine which app is active for the dock indicator
  const getActiveApp = () => {
    if (showFinder) return 'finder'
    if (showNotes) return 'notes'
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
      </div>

      {/* Dock */}
      <Dock 
        activeApp={getActiveApp()}
        onFinderClick={toggleFinder}
        onNotesClick={toggleNotes}
        onSettingsClick={() => setShowSettings(true)}
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
