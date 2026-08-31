'use client'
import Link from 'next/link'
import LegalTheme from './LegalTheme'
import './Landing.css'

const ContactPage = () => {
  return (
    <div className="legal-page landing legal-dark">
      <LegalTheme />
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
            <li><Link href="/about">About</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
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

export default ContactPage
