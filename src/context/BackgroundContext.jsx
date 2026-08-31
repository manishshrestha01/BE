import { createContext, useContext, useState, useEffect } from 'react'

const BackgroundContext = createContext()

const backgrounds = [
  {
    id: 'monterey',
    name: 'Monterey',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
  },
  {
    id: 'ventura',
    name: 'Ventura',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'sonoma',
    name: 'Sonoma',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'sequoia',
    name: 'Sequoia',
    type: 'gradient',
    value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'gradient',
    value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #2d1b4e 100%)'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    type: 'gradient',
    value: 'linear-gradient(135deg, #005c97 0%, #363795 100%)'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'nord',
    name: 'Nord',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2e3440 0%, #4c566a 100%)'
  },
  {
    id: 'forest',
    name: 'Forest',
    type: 'gradient',
    value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  {
    id: 'mint',
    name: 'Mint',
    type: 'gradient',
    value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  },
  {
    id: 'peach',
    name: 'Peach',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    id: 'slate',
    name: 'Slate',
    type: 'gradient',
    value: 'linear-gradient(135deg, #485563 0%, #29323c 100%)'
  }
]

export const BackgroundProvider = ({ children }) => {
  const [currentBg, setCurrentBg] = useState(backgrounds[0])
  const [customBg, setCustomBg] = useState(null)

  useEffect(() => {
    // Restore the saved background after mount. Reading localStorage
    // here (rather than via a lazy initializer) avoids SSR/hydration
    // mismatches for users with a saved custom background.
    const restoreSavedBackground = () => {
      try {
        const custom = localStorage.getItem('notesAppCustomBackground')
        if (custom) {
          setCustomBg(custom)
          return
        }

        const saved = localStorage.getItem('notesAppBackground')
        const found = saved ? backgrounds.find(bg => bg.id === saved) : undefined
        if (found) setCurrentBg(found)
      } catch {
        // ignore storage access errors
      }
    }

    const rafId = requestAnimationFrame(restoreSavedBackground)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const changeBackground = (bgId) => {
    const found = backgrounds.find(bg => bg.id === bgId)
    if (found) {
      setCurrentBg(found)
      // clearing any custom background when user selects a built-in
      setCustomBg(prev => {
        try {
          if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev)
          }
        } catch { /* ignore */ }
        return null
      })
      try { localStorage.removeItem('notesAppCustomBackground') } catch { /* ignore */ }
      localStorage.setItem('notesAppBackground', bgId)
    }
  }

  const setCustomBackground = (url) => {
    // Revoke previous blob URL when replacing it to avoid memory leaks
    setCustomBg(prev => {
      try {
        if (prev && typeof prev === 'string' && prev.startsWith('blob:') && prev !== url) {
          URL.revokeObjectURL(prev)
        }
      } catch {
        // ignore
      }
      return url
    })

    // Persist only non-blob URLs (data URLs). Blob URLs cannot be stored and are session-scoped.
    if (typeof url === 'string' && !url.startsWith('blob:')) {
      try {
        localStorage.setItem('notesAppCustomBackground', url)
      } catch (err) {
        // localStorage may fail on some browsers for large images; ignore
        console.warn('Failed to persist custom background', err)
      }
    } else {
      try { localStorage.removeItem('notesAppCustomBackground') } catch { /* ignore */ }
    }

    // clear chosen built-in background when using custom
    localStorage.removeItem('notesAppBackground')
  }

  const removeCustomBackground = () => {
    // If custom background is a blob URL, revoke it before clearing
    setCustomBg(prev => {
      try {
        if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev)
        }
      } catch {
        // ignore
      }
      return null
    })
    try { localStorage.removeItem('notesAppCustomBackground') } catch { /* ignore */ }
    // restore selected built-in if present, otherwise fallback to default
    const saved = localStorage.getItem('notesAppBackground')
    if (saved) {
      const found = backgrounds.find(bg => bg.id === saved)
      if (found) setCurrentBg(found)
      else setCurrentBg(backgrounds[0])
    } else {
      setCurrentBg(backgrounds[0])
    }
  }

  return (
    <BackgroundContext.Provider value={{
      currentBg,
      customBg,
      backgrounds,
      changeBackground,
      setCustomBackground,
      removeCustomBackground
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => useContext(BackgroundContext)
