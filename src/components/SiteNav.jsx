import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Landing/Landing.css'

const SiteNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const handleLogoClick = () => {
    setMobileMenuOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav className="landing-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLogoClick}>
          <img src="/black.svg" alt="StudyMate Logo" style={{ height: 32 }} />
          <span className="logo-text">StudyMate</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/colleges">Colleges</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/dashboard" className="nav-cta">Open Dashboard</Link>
        </div>

        <button className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} aria-label="Menu" onClick={() => setMobileMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav" onClick={e => e.stopPropagation()}>
            <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>&times;</button>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/login" className="nav-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link to="/dashboard" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>Open Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default SiteNav
