import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Contact StudyMate - Support and Feedback'

    const metaDescription = document.querySelector('meta[name="description"]')
    const description =
      'Contact StudyMate for support, corrections, or collaboration about Pokhara University BE Computer Engineering study resources.'
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const keywords =
      'contact StudyMate, PU notes support, report issue StudyMate, Pokhara University notes feedback'
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    }

    const metaRobots = document.querySelector('meta[name="robots"]')
    if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    }

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', 'https://www.manishshrestha012.com.np/contact')

    document.body.classList.add('legal-theme')

    return () => {
      document.title = 'StudyMate'
      document.body.classList.remove('legal-theme')
    }
  }, [])

  return (
    <div className="legal-page landing legal-dark">
      <div className="legal-container">
        <div className="legal-content">
          <h1 className="terms-title">Contact</h1>
          <p className="terms-subtitle">
            For corrections, broken links, content requests, or support, contact the StudyMate team.
          </p>
          <p className="legal-meta">Last updated: March 2026</p>

          <h2>Support scope</h2>
          <ul>
            <li>Broken page or routing issues.</li>
            <li>Incorrect syllabus details or note metadata.</li>
            <li>Requests for additional public study guides.</li>
          </ul>

          <h2>How to contact</h2>
          <p>
            Use the in-app Contact tool from the dashboard for the fastest context-aware support.
            You can also submit feedback through the official repository issue tracker.
          </p>

          <h2>Related pages</h2>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>

          <div className="legal-actions">
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} StudyMate</p>
            <div className="footer-bottom-links">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
