import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
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
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
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
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) throw error
    return data
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
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isSupabaseConfigured: isSupabaseConfigured()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
