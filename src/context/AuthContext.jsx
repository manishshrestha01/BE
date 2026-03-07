import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})
const AUTH_GATE_ENDPOINT = '/api/auth-gate'

const parseBoolean = (rawValue, fallbackValue = true) => {
  if (typeof rawValue === 'boolean') return rawValue
  if (typeof rawValue === 'number') return rawValue !== 0

  if (typeof rawValue === 'string') {
    const normalized = rawValue.trim().toLowerCase()
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false
  }

  return fallbackValue
}

const readRequireLoginFromResponse = (payload) => {
  if (typeof payload?.requireLogin !== 'undefined') {
    return parseBoolean(payload.requireLogin, true)
  }
  if (typeof payload?.authEnabled !== 'undefined') {
    return parseBoolean(payload.authEnabled, true)
  }
  if (typeof payload?.authRequired !== 'undefined') {
    return parseBoolean(payload.authRequired, true)
  }

  return true
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthRequired, setIsAuthRequired] = useState(true)
  const [authGateLoading, setAuthGateLoading] = useState(true)
  const [authGateError, setAuthGateError] = useState(null)

  const refreshAuthGate = useCallback(async () => {
    setAuthGateLoading(true)
    setAuthGateError(null)

    try {
      const response = await fetch(AUTH_GATE_ENDPOINT, {
        method: 'GET',
        headers: { accept: 'application/json' },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Auth gate request failed (${response.status})`)
      }

      const payload = await response.json()
      setIsAuthRequired(readRequireLoginFromResponse(payload))
      return payload
    } catch (err) {
      setIsAuthRequired(true)
      setAuthGateError(err instanceof Error ? err.message : 'Failed to load auth gate state')
      return null
    } finally {
      setAuthGateLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAuthGate()
  }, [refreshAuthGate])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSessionLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user ?? null)
      } catch (err) {
        setError(err.message)
      } finally {
        setSessionLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setSessionLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Sign in with email (magic link)
  const signInWithEmail = async (email) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured')
    }

    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard` // Redirect to dashboard after magic link
        }
      })

      if (error) throw error
      return data
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message)
      throw err
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured')
    }
    
    setError(null)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) throw error
    return data
  }

  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      return
    }
    
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const value = {
    user,
    loading: sessionLoading || authGateLoading,
    error,
    authGateError,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    refreshAuthGate,
    isAuthenticated: !isAuthRequired || !!user,
    isAuthRequired,
    isAuthBypassed: !isAuthRequired,
    isSupabaseConfigured: isSupabaseConfigured(),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
