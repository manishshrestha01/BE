import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Login.css'

const Login = () => {
  const { mode, setTheme, resolvedTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    signInWithEmail,
    signInWithGoogle,
    isAuthenticated,
    isSupabaseConfigured,
    isAuthRequired,
  } = useAuth()

  const handleLogoClick = () => {
    setMobileMenuOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  // Ensure login page is not indexed by search engines
  useEffect(() => {
    document.title = 'Login - StudyMate | PU Notes for Computer Engineering'

    const metaRobots = document.querySelector('meta[name="robots"]')
    if (metaRobots) metaRobots.setAttribute('content', 'noindex, nofollow')

    // Keep description in case of client-side sharing; do NOT add JSON-LD or OG tags for login
    const metaDescription = document.querySelector('meta[name="description"]')
    const descContent = 'Sign in to StudyMate to access Pokhara University notes for BE Computer Engineering.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent)
    }

    return () => {
      document.title = 'StudyMate'
      const restoreRobots = document.querySelector('meta[name="robots"]')
      if (restoreRobots) {
        restoreRobots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
      }
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Ensure auth pages set a light background while mounted
  useEffect(() => {
    document.body.classList.add('auth-theme')
    return () => {
      document.body.classList.remove('auth-theme')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    if (!isSupabaseConfigured) {
      // Demo mode - just redirect
      setTimeout(() => {
        setIsLoading(false)
        navigate('/dashboard')
      }, 1000)
      return
    }

    try {
      await signInWithEmail(email)
      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your email inbox to sign in.\nNot seeing it? Check your spam folder and mark as "Not spam".',
      })
      setEmail('')
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to send magic link. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      navigate('/dashboard')
      return
    }

    try {
      setMessage({ type: '', text: '' })
      await signInWithGoogle()
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to sign in with Google. Please try again.' 
      })
    }
  }

  return (
    <div className="auth-page">
      {/* Navigation - Same as Landing */}
      <nav className="auth-nav">
        <div className="auth-nav-container">
          <Link to="/" className="auth-nav-logo" onClick={handleLogoClick}>
            <img src={resolvedTheme === 'dark' ? '/white.svg' : '/black.svg'} alt="StudyMate Logo" style={{ height: 32 }} />
            <span className="auth-logo-text">StudyMate</span>
          </Link>
          <div className={`auth-nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="/#features">Features</a>
            <a href="/#about">About</a>
            <a href="/#testimonials">Reviews</a>
            <Link to="/login" className="auth-nav-login">Login</Link>
            <Link to="/dashboard" className="auth-nav-cta">Open Dashboard</Link>
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark')}
              title={`Theme: ${mode}`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Moon size={18} /> : mode === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
            </button>
          </div>
          <button 
            className={`auth-mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} 
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Login Content */}
      <div className="auth-content">
        <div className="auth-layout">
          {/* Feature Highlights Sidebar */}
          <div className="auth-highlights">
            <div className="auth-highlight-header">
              <img src={resolvedTheme === 'dark' ? '/white.svg' : '/black.svg'} alt="StudyMate" style={{ width: 40, height: 40 }} />
              <h2>StudyMate</h2>
            </div>
            <p className="auth-highlight-subtitle">
              Your complete study companion for Pokhara University Computer Engineering
            </p>
            <div className="auth-highlight-list">
              <div className="auth-highlight-item">
                <span className="auth-highlight-check">✓</span>
                <div>
                  <strong>8 Semesters</strong>
                  <span>Complete curriculum coverage</span>
                </div>
              </div>
              <div className="auth-highlight-item">
                <span className="auth-highlight-check">✓</span>
                <div>
                  <strong>500+ Study Materials</strong>
                  <span>PDFs, notes, and presentations</span>
                </div>
              </div>
              <div className="auth-highlight-item">
                <span className="auth-highlight-check">✓</span>
                <div>
                  <strong>Offline Access</strong>
                  <span>Download and study anywhere</span>
                </div>
              </div>
              <div className="auth-highlight-item">
                <span className="auth-highlight-check">✓</span>
                <div>
                  <strong>14+ Colleges</strong>
                  <span>All PU affiliated colleges</span>
                </div>
              </div>
            </div>
            <div className="auth-social-proof">
              <div className="auth-proof-avatars">
                <span className="auth-proof-avatar">A</span>
                <span className="auth-proof-avatar">P</span>
                <span className="auth-proof-avatar">R</span>
                <span className="auth-proof-avatar">S</span>
                <span className="auth-proof-avatar">+</span>
              </div>
              <span className="auth-proof-text">Trusted by 100+ students</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="auth-card">
          <h1 className="auth-title">Login / Sign Up</h1>

          {!isSupabaseConfigured && (
            <div className="auth-message auth-message-info">
              Demo mode: Supabase not configured. You can still explore the dashboard.
            </div>
          )}

          {!isAuthRequired && (
            <div className="auth-message auth-message-info">
              Login is currently disabled by admin. Open the dashboard directly.
            </div>
          )}

          {message.text && (
            <div className={`auth-message auth-message-${message.type}`}>
              {message.text.split('\n').map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </div>
          )}

          {isAuthRequired ? (
            <>
              <form onSubmit={handleSubmit} className="auth-form">
                <label htmlFor="email" className="auth-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="auth-input"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Please wait...' : 'Continue with Email'}
                </button>
              </form>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <button className="auth-btn-google" onClick={handleGoogleLogin}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          ) : (
            <Link to="/dashboard" className="auth-btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
              Open Dashboard
            </Link>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Login
