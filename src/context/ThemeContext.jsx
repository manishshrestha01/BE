import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'studymate-theme'

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch {}
  return 'system'
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getStoredTheme) // 'dark' | 'light' | 'system'

  const resolvedTheme = useMemo(() => {
    if (mode === 'system') return getSystemTheme()
    return mode
  }, [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {}
  }, [mode, resolvedTheme])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = () => {
      document.documentElement.setAttribute('data-theme', getSystemTheme())
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setTheme = useCallback((newMode) => {
    if (newMode === 'dark' || newMode === 'light' || newMode === 'system') {
      setMode(newMode)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setMode(prev => {
      if (prev === 'dark') return 'light'
      if (prev === 'light') return 'system'
      return 'dark'
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
