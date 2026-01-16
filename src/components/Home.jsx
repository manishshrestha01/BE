import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import { BackgroundProvider } from '../context/BackgroundContext'
import Desktop from './Desktop/Desktop'
import '../styles/glass.css'

const Home = () => {
  const { isAuthenticated, loading } = useAuth()
  const { profile, isSetupComplete, loading: profileLoading, profileInitialized } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const justCompletedProfile = useRef(false)

  useEffect(() => {
    // Add desktop theme class to body when Home is mounted so global styles in glass.css apply only for desktop
    document.body.classList.add('desktop-theme')
    return () => {
      document.body.classList.remove('desktop-theme')
    }
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, loading, navigate])

  useEffect(() => {
    // Check if we just completed the profile
    if (location.state?.profileJustCompleted) {
      justCompletedProfile.current = true;
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }

    // Also check localStorage for a short-lived bypass (survives refresh)
    try {
      const expiryStr = localStorage.getItem('profileJustCompletedUntil')
      if (expiryStr) {
        const expiry = Number(expiryStr)
        if (!Number.isNaN(expiry) && expiry > Date.now()) {
          justCompletedProfile.current = true
          console.log('Bypassing profile redirect due to recent profile completion', { expiry })
        } else {
          localStorage.removeItem('profileJustCompletedUntil')
        }
      }
    } catch (e) {
      console.warn('Failed to read profileJustCompletedUntil from localStorage', e)
    }
  }, [location.state])

  useEffect(() => {
    console.log('Home component check:', { 
      isAuthenticated, 
      profileLoading, 
      isSetupComplete, 
      justCompleted: justCompletedProfile.current, 
      profileInitialized,
      profileExistsOnDb: undefined,
      profile: profile ? {
        id: profile.id,
        full_name: profile.full_name,
        semester: profile.semester,
        setupComplete: profile.setupComplete
      } : null
    });
    // Only redirect if the profile is actually missing required fields
    if (!isAuthenticated || !profileInitialized || justCompletedProfile.current) return

    const missingRequired = !profile || !profile.full_name || !profile.semester || !profile.college
    if (missingRequired) {
      console.log('Profile incomplete or missing required fields, redirecting to user-info', { missingRequired, isSetupComplete })
      setTimeout(() => navigate('/user-info'), 200)
    }
  }, [isAuthenticated, isSetupComplete, profileLoading, profileInitialized, navigate, profile])

  if (loading || profileLoading) return null

  return (
    <BackgroundProvider>
      <Desktop />
    </BackgroundProvider>
  )
}

export default Home