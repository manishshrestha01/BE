import { useState } from 'react'
import './Dock.css'

const Dock = ({ onFinderClick, onNotesClick, onSettingsClick, onContactClick, onSpotifyClick, activeApp }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const apps = [
    { id: 'finder', name: 'Finder', icon: '/icons/finder.webp', action: onFinderClick },
    { id: 'notes', name: 'Draw', icon: '/icons/notes.webp', action: onNotesClick },
    { id: 'spotify', name: 'Spotify', icon: '/icons/spotify.webp', action: onSpotifyClick },
    { id: 'contact', name: 'Contact', icon: '/icons/contacts.webp', action: onContactClick },
    { id: 'settings', name: 'Settings', icon: '/icons/settings.webp', action: onSettingsClick },
  ]

  const getScale = (index) => {
    if (hoveredIndex === null) return 1
    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) return 1.5
    if (distance === 1) return 1.25
    if (distance === 2) return 1.1
    return 1
  }

  return (
    <div className="dock-container">
      <div className="dock glass">
        {apps.map((app, index) => (
          <div
            key={app.id}
            className={`dock-item ${activeApp === app.id ? 'active' : ''}`}
            style={{ transform: `scale(${getScale(index)})` }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={app.action}
          >
            <img src={app.icon} alt={app.name} className="dock-icon dock-icon-img" />
            <span className="dock-tooltip">{app.name}</span>
            {activeApp === app.id && <span className="dock-indicator" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dock
