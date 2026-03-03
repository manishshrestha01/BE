import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const DisclaimerPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Disclaimer - StudyMate'

    const metaDescription = document.querySelector('meta[name="description"]')
    const description =
      'Disclaimer for StudyMate educational content, external links, and liability boundaries for Pokhara University BE Computer Engineering resources.'
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const keywords =
      'StudyMate disclaimer, educational content disclaimer, Pokhara University notes disclaimer, external link policy'
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
    canonical.setAttribute('href', 'https://www.manishshrestha012.com.np/disclaimer')

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
          <h1 className="terms-title">Disclaimer</h1>
          <p className="terms-subtitle">
            StudyMate content is provided for educational support and reference purposes.
          </p>
          <p className="legal-meta">Last updated: March 2026</p>

          <h2>Educational purpose</h2>
          <p>
            Materials on this site are designed to help students study. They do not replace official
            curriculum notices, university announcements, or instructor guidance.
          </p>

          <h2>Accuracy and updates</h2>
          <p>
            We try to keep information accurate and current, but we cannot guarantee completeness or
            uninterrupted availability. Always verify important academic details with official sources.
          </p>

          <h2>External resources</h2>
          <p>
            Some pages may reference third-party content. StudyMate is not responsible for changes,
            availability, or policies on external websites.
          </p>

          <h2>Liability limits</h2>
          <p>
            StudyMate is provided as-is. Use of the platform is at your own discretion, and we are not
            liable for losses resulting from reliance on posted materials.
          </p>

          <h2>Related legal pages</h2>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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

export default DisclaimerPage
