import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    
    // SEO meta tags
    document.title = 'Privacy Policy - StudyMate | PU Notes Platform'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    const descContent = 'Privacy Policy for StudyMate - Pokhara University notes platform. Learn how we protect your data and privacy while providing BE Computer Engineering study materials.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const keywordsContent = 'StudyMate privacy policy, PU notes privacy, Pokhara University notes data protection, student data privacy Nepal'
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent)
    }

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', 'https://www.manishshrestha012.com.np/privacy-policy')
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
          <h1 className="terms-title">Privacy Policy</h1>
          <p className="terms-subtitle">We respect your privacy. This page explains what data we collect and how we use it.</p>
          <p className="legal-meta">Last updated: December 2025</p>

          <p>
            StudyMate is committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, and share information when you use our website and services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect limited information such as analytics (to improve the site), and any
            information you provide directly (for example when you choose to log in or submit
            feedback). We do not sell personal information to third parties.
          </p>

          <h2>How We Use Information</h2>
          <p>
            We use the information to operate, maintain, and improve the service. For example,
            we may use analytics to understand how the site is used and to diagnose issues.
          </p>

          <h2>Local Storage</h2>
          <p>
            Some features (like the drawing canvas) store data locally in your browser (localStorage)
            so it stays available to you. This data remains on your device unless you clear it by using clear cache on your device.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            The app may use third-party tools and libraries (e.g. Excalidraw) to provide features.
            These tools are governed by their own privacy policies.
          </p>

          <h2>Contact</h2>
          <p>If you have questions about this policy, please contact the site maintainer.</p>

          <div className="legal-actions">
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
      
    {/* Footer */}
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StudyMate. Made with ❤️ for PU Students</p>
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

export default PrivacyPolicy
