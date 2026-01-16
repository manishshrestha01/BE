import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    
    // SEO meta tags
    document.title = 'Terms of Service - StudyMate | PU Notes Platform'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    const descContent = 'Terms of Service for StudyMate - Pokhara University notes platform. Rules and guidelines for using BE Computer Engineering study materials and resources.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const keywordsContent = 'StudyMate terms of service, PU notes terms, Pokhara University notes usage terms, student platform terms Nepal'
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent)
    }

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', 'https://www.manishshrestha012.com.np/terms-of-service')
    }

    // Apply body legal-theme so page background covers full viewport
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
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-subtitle">These terms explain the rules and responsibilities when using StudyMate.</p>
          <p className="legal-meta">Last updated: December 2025</p>

          <p>
            These terms govern your use of StudyMate. By using the service you agree to these terms.
          </p>

          <h2>Use of the Service</h2>
          <p>
            The materials and resources provided are for educational use. Respect copyright and the
            contributors who provide materials. Do not misuse the service or attempt to access
            restricted areas.
          </p>

          <h2>Account and Access</h2>
          <p>
            If you create an account, you are responsible for maintaining the security of your
            credentials. We are not responsible for any loss arising from unauthorized access.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            StudyMate is provided as-is. We make no warranties about the accuracy or availability
            of third-party content. We are not liable for damages from use of the service.
          </p>

          <h2>Changes</h2>
          <p>We may update these terms from time to time. It is your responsibility to review them.</p>

          <div className="legal-actions">
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>

    {/* Footer */}
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>© 2026 StudyMate. Made with ❤️ for PU Students</p>
          <div className="footer-bottom-links">
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
 )
}

export default TermsOfService
