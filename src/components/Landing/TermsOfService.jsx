'use client'
import Link from 'next/link'
import LegalTheme from './LegalTheme'
import './Landing.css'

const TermsOfService = () => {
  return (
    <div className="legal-page landing legal-dark">
      <LegalTheme />
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

          <h2>Contact</h2>
          <p>
            If you have questions about these terms, or wish to report a violation or abuse,
            please reach out via the Contact app in the desktop environment or consult our
            <Link href="/privacy-policy"> Privacy Policy</Link> for details about data handling.
          </p>

          <div className="legal-actions">
            <Link href="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>

    {/* Footer */}
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StudyMate. Made with ❤️ for PU Students</p>
          <div className="footer-bottom-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
 )
}

export default TermsOfService
