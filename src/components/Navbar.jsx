import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

const Navbar = () => {
  const { mode, setTheme, resolvedTheme } = useTheme()
  const location = useLocation()

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={handleLogoClick}>
          <img src={resolvedTheme === 'dark' ? '/white.svg' : '/black.svg'} alt="StudyMate" style={{ height: 20, verticalAlign: 'middle', marginRight: 8 }} />
          <span>StudyMate</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/colleges">Colleges</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login" className="login-btn">Login</Link></li>
        <li>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark')}
            title={`Theme: ${mode}`}
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Moon size={16} /> : mode === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
