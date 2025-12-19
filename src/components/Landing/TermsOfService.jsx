import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="legal-page landing">
      <div className="legal-container">
        <div className="legal-content">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-subtitle">These terms explain the rules and responsibilities when using PU Notes.</p>
          <p className="legal-meta">Last updated: December 2025</p>

          <p>
            These terms govern your use of PU Notes. By using the service you agree to these terms.
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
            PU Notes is provided as-is. We make no warranties about the accuracy or availability
            of third-party content. We are not liable for damages from use of the service.
          </p>

          <h2>Changes</h2>
          <p>We may update these terms from time to time. It is your responsibility to review them.</p>

          <div className="legal-actions">
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
