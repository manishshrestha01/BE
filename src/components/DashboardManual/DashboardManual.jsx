import { useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { BackgroundProvider } from '../../context/BackgroundContext'
import Desktop from '../Desktop/Desktop'
import './DashboardManual.css'

// SEO configurations for different sections
const seoConfig = {
  default: {
    title: 'PU Notes Dashboard - Pokhara University Computer Engineering Notes',
    description: 'Access PU notes for BE Computer Engineering. Download Pokhara University notes for Compiler Design, C Programming, DBMS, DSA, OS. NCIT, CCRC notes available.',
    keywords: 'PU notes, Pokhara University notes, BE Computer notes, computer engineering notes, PU computer engineering, compiler notes, C notes, DBMS notes, DSA notes, NCIT notes, CCRC notes, engineering notes Nepal'
  },
  'how-it-works': {
    title: 'How to Access PU Notes - Pokhara University Study Materials Guide',
    description: 'Step-by-step guide to accessing Pokhara University notes. Download BE Computer Engineering notes, compiler design, C programming, DBMS and more.',
    keywords: 'PU notes download, how to get PU notes, Pokhara University notes, BE computer notes download, engineering notes PDF'
  },
  'features': {
    title: 'PU Notes Features - All Semester Computer Engineering Notes',
    description: 'Access all 8 semesters of Pokhara University BE Computer Engineering notes. Compiler, C programming, DBMS, DSA, Operating System notes with PDF download.',
    keywords: 'PU notes all semester, computer engineering notes PDF, semester 1-8 notes, PU syllabus notes, engineering exam notes'
  },
  'faq': {
    title: 'PU Notes FAQ - Pokhara University Study Materials Questions',
    description: 'FAQs about PU notes. Access notes for BE Computer, IT, Software Engineering. NCIT, CCRC and all PU affiliated college notes available.',
    keywords: 'PU notes FAQ, BE IT notes, software engineering notes, civil engineering notes, NCIT notes, CCRC notes, PU affiliated college notes'
  }
}

const DashboardManual = () => {
  const { isAuthenticated, loading } = useAuth()
  const { isSetupComplete, loading: profileLoading, profileInitialized } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const justCompletedProfile = useRef(false)

  // Check if profile was just completed
  useEffect(() => {
    if (location.state?.profileJustCompleted) {
      justCompletedProfile.current = true
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Redirect to user-info if profile not complete (for logged-in users)
  useEffect(() => {
    if (isAuthenticated && profileInitialized && !isSetupComplete && !justCompletedProfile.current) {
      setTimeout(() => navigate('/user-info'), 200)
    }
  }, [isAuthenticated, isSetupComplete, profileInitialized, navigate])

  // SEO - Update document title and meta tags based on hash (only for non-authenticated)
  useEffect(() => {
    if (isAuthenticated) return // Skip SEO for authenticated users
    
    // Get current section from hash (remove the #)
    const currentSection = location.hash.replace('#', '') || 'default'
    const seo = seoConfig[currentSection] || seoConfig.default

    // Set page title
    document.title = seo.title
    
    // Helper function to set or create meta tag
    const setMetaTag = (selector, attribute, value) => {
      let meta = document.querySelector(selector)
      if (meta) {
        meta.setAttribute('content', value)
      } else {
        meta = document.createElement('meta')
        if (selector.includes('property=')) {
          meta.setAttribute('property', attribute)
        } else {
          meta.name = attribute
        }
        meta.content = value
        document.head.appendChild(meta)
      }
    }

    // Set meta description
    setMetaTag('meta[name="description"]', 'description', seo.description)

    // Set meta keywords
    setMetaTag('meta[name="keywords"]', 'keywords', seo.keywords)

    // Set Open Graph tags for social sharing
    const ogTags = {
      'og:title': seo.title.replace(' | StudyMate', ''),
      'og:description': seo.description,
      'og:type': 'website',
      'og:url': window.location.href,
      'og:site_name': 'StudyMate'
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      setMetaTag(`meta[property="${property}"]`, property, content)
    })

    // Set Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': seo.title.replace(' | StudyMate', ''),
      'twitter:description': seo.description
    }

    Object.entries(twitterTags).forEach(([name, content]) => {
      setMetaTag(`meta[name="${name}"]`, name, content)
    })

    // Set canonical URL (without hash for SEO best practice)
    let canonical = document.querySelector('link[rel="canonical"]')
    const canonicalUrl = window.location.origin + '/dashboard'
    if (canonical) {
      canonical.href = canonicalUrl
    } else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = canonicalUrl
      document.head.appendChild(canonical)
    }

    // Handle hash navigation - scroll to section if hash exists
    // Skip if hash contains OAuth tokens (access_token, refresh_token, etc.)
    if (location.hash && !location.hash.includes('access_token') && !location.hash.includes('token_type')) {
      try {
        const element = document.querySelector(location.hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
      } catch (e) {
        // Invalid selector, ignore
        window.scrollTo(0, 0)
      }
    } else {
      window.scrollTo(0, 0)
    }

    // Cleanup function to reset title when leaving page
    return () => {
      document.title = 'StudyMate'
    }
  }, [isAuthenticated, location.hash])

  // Show loading only while checking initial auth state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // NOT LOGGED IN: Show the manual/guide page immediately
  if (!isAuthenticated) {
    return <ManualPage location={location} />
  }

  // LOGGED IN but profile still loading - show spinner
  if (profileLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // LOGGED IN: Show the actual macOS-like Desktop with notes
  return (
    <BackgroundProvider>
      <Desktop />
    </BackgroundProvider>
  )
}

// Separate component for the manual page content
const ManualPage = ({ location }) => {
  const manualSections = [
    {
      icon: '🖥️',
      title: 'Desktop Interface',
      description: 'Experience a familiar macOS-like desktop environment. Your study materials are organized in an intuitive interface that feels just like home.',
      tips: [
        'Click on the Dock icons to open different apps',
        'Windows open centered for easy viewing',
        'Use the close button (×) to close any window'
      ]
    },
    {
      icon: '📁',
      title: 'Finder - File Browser',
      description: 'Browse through all your study materials organized by semester and subject. Find PDFs, notes, and documents easily.',
      tips: [
        'Navigate through folders by clicking on them',
        'Use Spacebar to add files in favourites',
        'Hold files to add in favourites for mobile and tablet devices',
        'Double-click to open files in full view'
      ]
    },
    {
      icon: '📝',
      title: 'Notes App',
      description: 'Create, edit, and save your personal notes while studying. Perfect for jotting down important concepts and formulas.',
      tips: [
        'Your notes are auto-saved as you type',
        'Use the drawing canvas for diagrams and sketches'
      ]
    },
    {
      icon: '⚙️',
      title: 'Settings',
      description: 'Customize your dashboard experience. Change backgrounds, manage your profile, and configure preferences.',
      tips: [
        'Choose from preset wallpapers or upload your own',
        'Update your profile information',
        'Upload and manage your own study materials'
      ]
    },
    {
      icon: '🚀',
      title: 'The Dock',
      description: 'Your quick access toolbar at the bottom of the screen. Launch apps with a single click.',
      tips: [
        'Hover over icons to see app names',
        'Active apps show a dot indicator below',
        'Access Finder, Notes, and Settings quickly'
      ]
    }
  ]

  const features = [
    {
      emoji: '☁️',
      title: 'Cloud Sync',
      desc: 'Your notes and preferences sync across devices'
    },
    {
      emoji: '🎨',
      title: 'Custom Themes',
      desc: 'Personalize your workspace with beautiful wallpapers'
    },
    {
      emoji: '📚',
      title: '8 Semesters',
      desc: 'Complete study materials for all semesters'
    },
    {
      emoji: '🔒',
      title: 'Secure',
      desc: 'Your data is safe with Google authentication'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Sign In',
      description: 'Click the Login button and sign in with your Google account. It\'s quick, secure, and free.'
    },
    {
      number: '2',
      title: 'Complete Profile',
      description: 'Enter your name and select your current semester to personalize your experience.'
    },
    {
      number: '3',
      title: 'Explore Dashboard',
      description: 'Access your desktop environment. Open Finder to browse notes or create your own in the Notes app.'
    },
    {
      number: '4',
      title: 'Start Learning',
      description: 'Browse study materials by semester, take notes, and customize your workspace to suit your style.'
    }
  ]

  const faqs = [
    {
      question: 'Is StudyMate free to use?',
      answer: 'Yes! StudyMate is completely free for all Pokhara University Computer Engineering students.'
    },
    {
      question: 'Can I access the syllabus for each subject?',
      answer: 'Yes! You can find the syllabus for each subject available on StudyMate. Navigate to any subject folder to view its complete syllabus along with study materials.'
    },
    {
      question: 'Can students from other faculties use StudyMate?',
      answer: 'Absolutely! While StudyMate is primarily designed for BE Computer Engineering, students from other faculties like BE IT, Software Engineering, and Civil Engineering can also benefit. Many subjects share similar syllabi across these programs, so you\'ll find relevant materials here too.'
    },
    {
      question: 'Can I upload my own notes?',
      answer: 'Yes, you can upload your own study materials through the Settings panel and organize them in your personal folders.'
    },
    {
      question: 'Are my notes saved automatically?',
      answer: 'Yes, all your notes are automatically saved to the cloud and synced across your devices.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support PDF, images (PNG, JPG), and text files. More formats coming soon!'
    }
  ]

  return (
    <div className="dashboard-manual">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src="/black.svg" alt="StudyMate Logo" style={{ height: 32 }} />
            <span className="logo-text">StudyMate</span>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQ</a>
            <Link to="/login" className="nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-badge">
            <span>📖</span> Dashboard Guide
          </div>
          <h1 className="hero-title">
            How to Use the
            <br />
            <span className="hero-highlight">Dashboard</span>
          </h1>
          <p className="hero-subtitle">
            Learn how to navigate and make the most of your StudyMate dashboard. 
            This guide will walk you through all the features available.
          </p>
          <div className="hero-cta">
            <Link to="/login" className="btn-primary">
              Login to Get Started
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <span className="card-icon">📁</span>
              <span className="card-text">Finder</span>
            </div>
            <div className="visual-card card-2">
              <span className="card-icon">📝</span>
              <span className="card-text">Notes</span>
            </div>
            <div className="visual-card card-3">
              <span className="card-icon">⚙️</span>
              <span className="card-text">Settings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="stats" id="features">
        <div className="stats-container">
          {features.map((feature, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{feature.emoji}</span>
              <span className="stat-label">{feature.title}</span>
              <span className="stat-desc">{feature.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Manual Sections */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Components</span>
            <h2 className="section-title">Dashboard Features</h2>
            <p className="section-subtitle">
              Everything you need to know about each part of the dashboard
            </p>
          </div>
          <div className="features-grid">
            {manualSections.map((section, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{section.icon}</span>
                <h3 className="feature-title">{section.title}</h3>
                <p className="feature-description">{section.description}</p>
                <div className="feature-tips">
                  <span className="tips-label">Tips:</span>
                  <ul>
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="about" id="how-it-works">
        <div className="about-container steps-layout">
          <div className="about-content">
            <span className="section-badge">Getting Started</span>
            <h2 className="section-title">How It Works</h2>
            <p className="about-text">
              Getting started with StudyMate is easy. Follow these simple steps to begin your learning journey.
            </p>
            <div className="about-features">
              {steps.map((step, index) => (
                <div key={index} className="about-feature step-feature">
                  <span className="step-number">{step.number}</span>
                  <div className="step-content">
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
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
                  <span>📁</span> Semester 1
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> C Programming Notes.pdf
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Calculus I.pdf
                </div>
                <div className="visual-folder">
                  <span>📁</span> Semester 2
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Data Structures and Algorithm.pdf
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Algebra and Geometry.pdf
                </div>
                <div className="visual-folder">
                  <span>📁</span> Semester 3
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Operating Systems.pdf
                </div>
                <div className="visual-folder">
                  <span>📁</span> Semester 4
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Applied Mathematics.pdf
                </div>
                <div className="visual-folder">
                  <span>📁</span> Semester 5
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Artificial Intelligence.pdf
                </div>
                <div className="visual-folder">
                  <span>📁</span> Semester 6
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Machine Learning.pdf
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="testimonials" id="faq">
        <div className="testimonials-container">
          <div className="section-header">
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Common Questions</h2>
            <p className="section-subtitle">
              Find answers to frequently asked questions
            </p>
          </div>
          <div className="testimonials-grid faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="testimonial-card faq-card">
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Studying?</h2>
          <p className="cta-subtitle">
            Join thousands of students who are already using StudyMate to ace their exams.
          </p>
          <Link to="/login" className="btn-primary">
            Login Now
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>© 2026 StudyMate. Made with ❤️ for PU Students</p>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashboardManual
