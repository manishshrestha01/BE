import { useRef, useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import './Spotify.css'

const PRESETS = [
  { id: '37i9dQZEVXbMDoHDwVN2tF', label: 'Top 50 Global', emoji: '🌍' },
  { id: '37i9dQZEVXbLRQDuF5jeBp', label: 'Top 50 USA', emoji: '🇺🇸' },
  { id: '37i9dQZEVXbLZ52XmnySJg', label: 'Top 50 India', emoji: '🇮🇳' },
  { id: '7q2T93GlWovggBYLSXfE4M', label: 'Top 50 Nepal', emoji: '🇳🇵' },
  { id: '37i9dQZEVXbJkgIdfsJyTw', label: 'Top 50 Pakistan', emoji: '🇵🇰' },
  { id: '37i9dQZF1DX8kP0ioXjxIA', label: 'BLACKPINK', emoji: '🩷' },
  { id: '37i9dQZF1DZ06evO0jO79m', label: 'Shakira', emoji: '🦈' },
  { id: '40Coe7YGjZyssCWNZAfFfY', label: 'Dekha Ek Khwab', emoji: '🎵' },
  { id: '37i9dQZF1DXc2aPBXGmXrt', label: 'Justin Bieber', emoji: '🎤' },
  { id: '37i9dQZF1DX08mhnhv6g9b', label: 'BTS', emoji: '💜' },
  { id: '37i9dQZF1DX5KpP2LN299J', label: 'Taylor Swift', emoji: '⭐' },
  { id: '37i9dQZF1DX1PfYnYcpw8w', label: 'Ariana Grande', emoji: '🌩️' },
  { id: '37i9dQZF1DX3fRquEp6m8D', label: 'Dua Lipa', emoji: '⚡' },
  { id: '37i9dQZF1DXaQm3ZVg9Z2X', label: 'Coldplay', emoji: '🪐' },
  { id: '37i9dQZF1DZ06evO0ENkA1', label: 'Sajjan Raj Vaidya', emoji: '🇳🇵' },
  { id: '37i9dQZF1DZ06evO3rZWvO', label: 'Sushant KC', emoji: '🇳🇵' },
  { id: '37i9dQZF1DZ06evO0DCbzq', label: '1974 A.D', emoji: '🇳🇵' },
  { id: '37i9dQZF1DZ06evO3uBUjN', label: 'Nepathya', emoji: '🇳🇵' },
  { id: '37i9dQZF1DZ06evO3BSBtH', label: 'Sushant Ghimire', emoji: '🇳🇵' },
  { id: '37i9dQZF1DZ06evO0Gcv5h', label: 'The Edge Band', emoji: '🇳🇵' },
  { id: '37i9dQZF1DWYztMONFqfvX', label: 'Arijit Singh', emoji: '🎤' },
  { id: '37i9dQZF1DZ06evO1n6IJz', label: 'Atif Aslam', emoji: '🎵' },
  { id: '37i9dQZF1DZ06evO2H6yix', label: 'Sanju Rathod', emoji: '🪷' },
  { id: '37i9dQZF1DX0F7Z7ZkOInS', label: 'Neha Kakkar', emoji: '🎤' },
  { id: '37i9dQZF1DXdctHW27fX32', label: 'Badshah', emoji: '🎧' },
  { id: '37i9dQZF1DX0GO2iStOATx', label: 'Diljit Dosanjh', emoji: '💙' },
  { id: '37i9dQZF1DZ06evO0Oxq8L', label: 'Jubin Nautiyal', emoji: '🎤' },
  { id: '37i9dQZF1DZ06evO4029Pj', label: 'AP Dhillon', emoji: '🧢' },
  { id: '37i9dQZEVXbKXQ4mDTEBXq', label: 'Top 50 Japan', emoji: '🇯🇵' },
  { id: '37i9dQZEVXbNxXF4SkHj9F', label: 'Top 50 S. Korea', emoji: '🇰🇷' },
  { id: '37i9dQZF1DX8Uebhn9wzrS', label: 'Lofi Beats', emoji: '🎧' },
  { id: '37i9dQZF1DX4sWSpwq3LiO', label: 'Peaceful Piano', emoji: '🎹' },
]

const SpotifyApp = ({ open, onClose, onReopen }) => {
  const [windowState, setWindowState] = useState('normal')
  const [playlistId, setPlaylistId] = useState(PRESETS[0].id)
  const windowRef = useRef(null)

  const isMinimized = windowState === 'minimized'
  const isMaximized = windowState === 'maximized'
  const overlayHidden = !open || isMinimized

  const handleMaximize = () => {
    setWindowState((prev) => (prev === 'maximized' ? 'normal' : 'maximized'))
    setTimeout(() => {
      try { windowRef.current?.focus() } catch { /* ignore */ }
    }, 60)
  }

  const handlePillClick = () => {
    if (isMinimized) {
      setWindowState('normal')
      return
    }
    onReopen()
  }

  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`

  return (
    <>
      <div
        className={`spotify-overlay ${overlayHidden ? 'spotify-overlay--hidden' : ''}`}
        onClick={onClose}
      >
        <div
          ref={windowRef}
          className={`spotify-window ${isMaximized ? 'maximized' : ''}`}
          role="dialog"
          aria-label="Spotify"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={() => {
            try { windowRef.current?.focus() } catch { /* ignore */ }
          }}
        >
          <div className="spotify-titlebar">
            <div className="window-controls">
              <button className="window-btn close" onClick={onClose} title="Close" aria-label="Close">
                <span><X strokeWidth={2.4} /></span>
              </button>
              <button
                className="window-btn minimize"
                onClick={() => setWindowState('minimized')}
                title="Minimize"
                aria-label="Minimize"
              >
                <span><Minus strokeWidth={2.4} /></span>
              </button>
              <button
                className="window-btn maximize"
                onClick={handleMaximize}
                title={isMaximized ? 'Restore' : 'Maximize'}
                aria-label={isMaximized ? 'Restore' : 'Maximize'}
              >
                <span><Plus strokeWidth={2.4} /></span>
              </button>
            </div>

            <div className="spotify-title">
              <img src="/icons/spotify.webp" alt="" className="spotify-title-logo" />
              <span>Spotify</span>
            </div>

            <div className="spotify-titlebar-spacer" aria-hidden="true" />
          </div>

          <div className="spotify-presets" role="group" aria-label="Study playlists">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`spotify-preset ${preset.id === playlistId ? 'active' : ''}`}
                onClick={() => setPlaylistId(preset.id)}
                aria-pressed={preset.id === playlistId}
              >
                <span className="spotify-preset-emoji">{preset.emoji}</span>
                {preset.label}
              </button>
            ))}
          </div>

          <div className="spotify-player">
            <iframe
              key={playlistId}
              src={embedUrl}
              className="spotify-frame"
              title="Spotify Player"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {overlayHidden && (
        <button
          className={`spotify-minimized ${!isMinimized ? 'spotify-bg-chip' : ''}`}
          onClick={handlePillClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handlePillClick()}
        >
          <img src="/icons/spotify.webp" alt="" className="spotify-minimized-img" />
          <span>{isMinimized ? 'Spotify' : 'Spotify in background'}</span>
        </button>
      )}
    </>
  )
}

export default SpotifyApp