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
  }, [location.state])

  useEffect(() => {
    console.log('Home component check:', { 
      isAuthenticated, 
      profileLoading, 
      isSetupComplete, 
      justCompleted: justCompletedProfile.current, 
      profileInitialized,
      profile: profile ? {
        id: profile.id,
        full_name: profile.full_name,
        semester: profile.semester,
        setupComplete: profile.setupComplete
      } : null
    });
    if (isAuthenticated && profileInitialized && !isSetupComplete && !justCompletedProfile.current) {
      console.log('Profile not complete, redirecting to user-info');
      // Small delay to ensure profile state has updated
      setTimeout(() => {
        navigate('/user-info');
      }, 200);
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