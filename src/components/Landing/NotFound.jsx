import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        {/* 404 Error Code */}
        <div className="not-found-code">404</div>

        {/* Error Text */}
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          Uh oh, we can't seem to find the page you're looking for. Try going back to the previous page or to our Home page for more information.
        </p>

        {/* Back to Home Button */}
        <Link to="/" className="not-found-button">
          <span>BACK TO HOME</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
