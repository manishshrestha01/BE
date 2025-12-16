import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Landing.css'

const Landing = () => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: '📚',
      title: 'Comprehensive Notes',
      description: 'Access complete study materials for all semesters of Computer Engineering at Pokhara University.'
    },
    {
      icon: '🎯',
      title: 'Organized by Subject',
      description: 'Find exactly what you need with our intuitive folder structure organized by semester and subject.'
    },
    {
      icon: '📱',
      title: 'Access Anywhere',
      description: 'Study on any device - desktop, tablet, or mobile. Your notes are always within reach.'
    },
    {
      icon: '✏️',
      title: 'Personal Notes',
      description: 'Create and save your own notes while studying. Keep track of important concepts.'
    }
  ]

  const stats = [
    { value: '8', label: 'Semesters Covered' },
    { value: '50+', label: 'Subjects Available' },
    { value: '500+', label: 'Study Materials' },
    { value: '24 / 7', label: 'Access Available' }
  ]

  const testimonials = [
    {
      quote: "This platform has been a lifesaver during my exam preparations. Everything is so well organized!",
      author: "Aarav Sharma",
      role: "4th Semester, Computer Engineering"
    },
    {
      quote: "Finally, a place where I can find all PU Computer Engineering notes. The interface is beautiful and easy to use.",
      author: "Priya Thapa",
      role: "6th Semester, Computer Engineering"
    },
    {
      quote: "The personal notes feature helps me jot down important points while studying. Highly recommended!",
      author: "Rohan KC",
      role: "2nd Semester, Computer Engineering"
    }
  ]

  // Show nothing while checking auth status to prevent flash
  if (loading) {
    return null
  }

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">📖</span>
            <span className="logo-text">PU Notes</span>
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#testimonials">Reviews</a>
            <Link to="/login" className="nav-login">Login</Link>
            <Link to="/dashboard" className="nav-cta">Open Dashboard</Link>
          </div>
          <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setMobileMenuOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-nav" onClick={e => e.stopPropagation()}>
              <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>&times;</button>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
              <Link to="/login" className="nav-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/dashboard" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>Open Dashboard</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-badge">
            <span>🎓</span> Pokhara University • Computer Engineering
          </div>
          <h1 className="hero-title">
            Your Complete Study
            <br />
            <span className="hero-highlight">Resource Hub</span>
          </h1>
          <p className="hero-subtitle">
            Access comprehensive notes, study materials, and resources for all 8 semesters 
            of Computer Engineering. Organized, accessible, and always free.
          </p>
          <div className="hero-cta">
            <Link to="/dashboard" className="btn-primary">
              Start Learning
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <span className="card-icon">📁</span>
              <span className="card-text">Semester 1-8</span>
            </div>
            <div className="visual-card card-2">
              <span className="card-icon">📝</span>
              <span className="card-text">Notes & PDFs</span>
            </div>
            <div className="visual-card card-3">
              <span className="card-icon">💡</span>
              <span className="card-text">Quick Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything you need to excel</h2>
            <p className="section-subtitle">
              We've built the most comprehensive resource platform for PU Computer Engineering students.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="about-content">
            <span className="section-badge">About</span>
            <h2 className="section-title">Built by students, for students</h2>
            <p className="about-text">
              We understand the challenges of finding quality study materials. That's why we created 
              this platform - a centralized hub where PU Computer Engineering students can access 
              all the notes and resources they need.
            </p>
            <p className="about-text">
              Our materials are carefully organized by semester and subject, making it easy to find 
              exactly what you're looking for. Whether you're preparing for exams or catching up on 
              lectures, we've got you covered.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="check-icon">✓</span>
                <span>Verified study materials</span>
              </div>
              <div className="about-feature">
                <span className="check-icon">✓</span>
                <span>Regular updates</span>
              </div>
              <div className="about-feature">
                <span className="check-icon">✓</span>
                <span>Community driven</span>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <div className="visual-box">
              <div className="visual-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="visual-content">
                <div className="visual-folder">
                  <span>📁</span> Semester 5
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Computer Networks.pdf
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Database Systems.pdf
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Operating Systems.pdf</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="testimonials-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">Trusted by students</h2>
            <p className="section-subtitle">
              See what fellow Computer Engineering students have to say.
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{testimonial.author}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to start learning?</h2>
          <p className="cta-subtitle">
            Access all study materials for free. No registration required.
          </p>
          <Link to="/dashboard" className="btn-primary btn-large">
            Open Dashboard
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="nav-logo">
                <span className="logo-icon">📖</span>
                <span className="logo-text">PU Notes</span>
              </Link>
              <p className="footer-tagline">
                Your complete study resource for Pokhara University Computer Engineering.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Email">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links-grid">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <Link to="/dashboard">Dashboard</Link>
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="#testimonials">Reviews</a>
              </div>
              <div className="footer-column">
                <h4>Semesters</h4>
                <Link to="/">Semester 1-2</Link>
                <Link to="/">Semester 3-4</Link>
                <Link to="/">Semester 5-6</Link>
                <Link to="/">Semester 7-8</Link>
              </div>
              <div className="footer-column">
                <h4>Account</h4>
                <Link to="/login">Login</Link>
                <Link to="/login">Continue with Google</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 PU Notes. Built with ❤️ for students.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
