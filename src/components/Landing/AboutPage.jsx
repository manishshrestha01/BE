import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'About StudyMate - PU Notes Platform'

    const metaDescription = document.querySelector('meta[name="description"]')
    const description =
      'About StudyMate, a Pokhara University BE Computer Engineering notes platform with semester-wise guides and study resources.'
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const keywords =
      'about StudyMate, Pokhara University notes platform, BE Computer Engineering resources, PU semester notes'
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
    canonical.setAttribute('href', 'https://www.manishshrestha012.com.np/about')

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
          <h1 className="terms-title">About StudyMate</h1>
          <p className="terms-subtitle">
            StudyMate is a student-focused learning platform for Pokhara University BE Computer Engineering.
          </p>
          <p className="legal-meta">Last updated: March 2026</p>

          <p>
            StudyMate organizes semester-wise study materials, subject guides, and quick references so
            students can find resources without searching across multiple sources.
          </p>

          <h2>What we provide</h2>
          <ul>
            <li>Semester and subject-based navigation for BE Computer Engineering content.</li>
            <li>Public blog guides for syllabus understanding, concepts, and exam preparation.</li>
            <li>A dashboard experience for signed-in users with additional tools and personalization.</li>
          </ul>

          <h2>Who this is for</h2>
          <p>
            The platform is built primarily for Pokhara University BE Computer Engineering students,
            but public educational pages can be accessed by anyone.
          </p>

          <h2>Important links</h2>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
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

export default AboutPage
