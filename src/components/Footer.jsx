import { Link, useLocation } from 'react-router-dom'
import './Landing/Landing.css'

const Footer = () => {
  const location = useLocation()

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" onClick={handleLogoClick}>
              <img src="/white.svg" alt="StudyMate Logo" style={{ height: 32 }} />
              <span className="logo-text">StudyMate</span>
            </Link>
            <p className="footer-tagline">Your complete study resource for Pokhara University Computer Engineering.</p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h2>Quick Links</h2>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/">Home</Link>
              <a href="/colleges">Colleges</a>
            </div>
            <div className="footer-column">
              <h2>Semesters</h2>
              <Link to="/">Semester 1-2</Link>
              <Link to="/">Semester 3-4</Link>
              <Link to="/">Semester 5-6</Link>
              <Link to="/">Semester 7-8</Link>
            </div>
            <div className="footer-column">
              <h2>Account</h2>
              <Link to="/login">Login</Link>
              <Link to="/login">Continue with Google</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StudyMate. Made with ❤️ for PU Students</p>
          <div className="footer-bottom-links">
            <a href="/faq" target="_blank" rel="noopener noreferrer">FAQ</a>
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
