'use client'
import Link from 'next/link'
import LegalTheme from './LegalTheme'
import './Landing.css'

const DisclaimerPage = () => {
  return (
    <div className="legal-page landing legal-dark">
      <LegalTheme />
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
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>

          <div className="legal-actions">
            <Link href="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} StudyMate</p>
            <div className="footer-bottom-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DisclaimerPage
