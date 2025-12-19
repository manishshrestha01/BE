import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page landing">
      <div className="legal-container">
        <div className="legal-content">
          <h1 className="terms-title">Privacy Policy</h1>
          <p className="terms-subtitle">We respect your privacy. This page explains what data we collect and how we use it.</p>
          <p className="legal-meta">Last updated: December 2025</p>

          <p>
            PU Notes is committed to protecting your privacy. This Privacy Policy explains how we
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
    </div>
  )
}

export default PrivacyPolicy
