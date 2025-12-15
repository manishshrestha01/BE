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
  }
]

export const BackgroundProvider = ({ children }) => {
  const [currentBg, setCurrentBg] = useState(backgrounds[0])
  const [customBg, setCustomBg] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('notesAppBackground')
    if (saved) {
      const found = backgrounds.find(bg => bg.id === saved)
      if (found) setCurrentBg(found)
    }
  }, [])

  const changeBackground = (bgId) => {
    const found = backgrounds.find(bg => bg.id === bgId)
    if (found) {
      setCurrentBg(found)
      setCustomBg(null)
      localStorage.setItem('notesAppBackground', bgId)
    }
  }

  const setCustomBackground = (url) => {
    setCustomBg(url)
    localStorage.removeItem('notesAppBackground')
  }

  return (
    <BackgroundContext.Provider value={{
      currentBg,
      customBg,
      backgrounds,
      changeBackground,
      setCustomBackground
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => useContext(BackgroundContext)
