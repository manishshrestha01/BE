'use client'
import Link from 'next/link'
import LegalTheme from './LegalTheme'
import './Landing.css'

const AboutPage = () => {
  return (
    <div className="legal-page landing legal-dark">
      <LegalTheme />
      <div className="legal-container">
        <div className="legal-content">
          <h1 className="terms-title">About StudyMate</h1>
          <p className="terms-subtitle">
            StudyMate is a student-focused learning platform for Pokhara University BE Computer Engineering.
            Current version: 2.0.0.
          </p>
          <p className="legal-meta">Last updated: August 2026</p>

          <p>
            StudyMate organizes semester-wise study materials, subject guides, and quick references so
            students can find resources without searching across multiple sources. Version 2.0 adds a
            personalized Dashboard with 14 built-in wallpapers, custom wallpaper uploads, and a polished
            window experience.
          </p>

          <h2>What we provide</h2>
          <ul>
            <li>Semester and subject-based navigation for BE Computer Engineering content.</li>
            <li>Public blog guides for syllabus understanding, concepts, and exam preparation.</li>
            <li>A dashboard experience for signed-in users with personalization — wallpapers, themes,
              and additional tools.</li>
            <li>Free access for all students, with no hidden costs.</li>
          </ul>

          <h2>Who this is for</h2>
          <p>
            The platform is built primarily for Pokhara University BE Computer Engineering students,
            but public educational pages can be accessed by anyone.
          </p>

          <h2>Important links</h2>
          <ul>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
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

export default AboutPage
