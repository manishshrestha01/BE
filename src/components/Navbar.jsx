import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
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
          <img src="/black.svg" alt="StudyMate" style={{ height: 20, verticalAlign: 'middle', marginRight: 8 }} />
          <span>StudyMate</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/colleges">Colleges</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login" className="login-btn">Login</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
