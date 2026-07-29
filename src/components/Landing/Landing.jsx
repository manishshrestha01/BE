import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import './Landing.css'
import { setTitle, setMeta, setLinkRel, setJSONLD, removeElementById } from '../../lib/seo'
import { COLLEGES } from '../../lib/colleges'


const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.manish.studymate'

const getSemesterGroupTarget = (semester) => {
  if (semester <= 2) return 1
  if (semester <= 4) return 3
  if (semester <= 6) return 5
  return 7
}

const landingSemesterLinks = Array.from({ length: 8 }, (_, index) => {
  const semester = index + 1
  const targetSemester = getSemesterGroupTarget(semester)

  return {
    label: `Semester ${semester}`,
    to: `/blog/semester/${targetSemester}`,
  }
})

const Landing = () => {
  const { loading } = useAuth()
  const { mode, setTheme, resolvedTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const testimonials = [
    { quote: "This platform has been a lifesaver during my exam preparations. Everything is so well organized!", author: "Aarav Sharma", role: "4th Semester, Computer Engineering" },
    { quote: "Finally, a place where I can find all PU Computer Engineering notes. The interface is beautiful and easy to use.", author: "Priya Thapa", role: "6th Semester, Computer Engineering" },
    { quote: "The personal notes feature helps me jot down important points while studying. Highly recommended!", author: "Rohan KC", role: "2nd Semester, Computer Engineering" },
    { quote: "I used StudyMate throughout my 7th semester. The organized folder structure saved me hours of searching for the right materials.", author: "Suman Gurung", role: "7th Semester, Computer Engineering" },
    { quote: "Being from a remote area with poor internet, the offline download feature on the mobile app has been a game changer for me.", author: "Anita Magar", role: "3rd Semester, Computer Engineering" },
    { quote: "The blog guides are incredibly detailed. They follow the exact PU syllabus and the practice questions are spot on for exams.", author: "Bikash Rai", role: "5th Semester, Computer Engineering" },
    { quote: "I recommend StudyMate to every junior in our college. It has notes for all semesters and the quality is consistently great.", author: "Srijana Karki", role: "8th Semester, Computer Engineering" },
    { quote: "The macOS-style desktop interface makes studying feel modern and fun. It's like having a personal study environment.", author: "Deepak Thapa", role: "1st Semester, Computer Engineering" },
    { quote: "Before StudyMate, I used to borrow notes from seniors. Now everything is available in one place, updated and organized.", author: "Nischal Basnet", role: "4th Semester, Computer Engineering" },
    { quote: "The ability to view PPTX and DOCX files directly in the app is incredibly convenient. No need to download separate apps.", author: "Sapana Shrestha", role: "6th Semester, Computer Engineering" },
    { quote: "StudyMate helped me score above average in my midterms. The subject-wise organization made revision so much easier.", author: "Rajesh Adhikari", role: "3rd Semester, Computer Engineering" },
    { quote: "I love how everything is categorized by semester. Finding my Compiler Design notes used to take forever, now it takes seconds.", author: "Prativa Poudel", role: "5th Semester, Computer Engineering" },
    { quote: "The drawing canvas feature is brilliant. I sketch flowcharts and diagrams while studying embedded systems concepts.", author: "Ashish Limbu", role: "6th Semester, Computer Engineering" },
    { quote: "As a student at NCIT, I was struggling to find quality notes. StudyMate has everything organized perfectly for our syllabus.", author: "Suman Lama", role: "2nd Semester, Computer Engineering" },
    { quote: "I cleared my OS exam thanks to the comprehensive notes here. The chapter-wise breakdown is exactly what I needed.", author: "Kabita Bhandari", role: "4th Semester, Computer Engineering" },
    { quote: "The search feature is lightning fast. I can find any topic across all my subjects in milliseconds.", author: "Bipin Thapa", role: "7th Semester, Computer Engineering" },
    { quote: "I use StudyMate on my phone during my commute. Having all notes in one app saves so much time.", author: "Sangita Rawal", role: "1st Semester, Computer Engineering" },
    { quote: "The bookmarking feature lets me save important chapters for quick revision before exams. Simple but powerful.", author: "Niraj Tamang", role: "3rd Semester, Computer Engineering" },
    { quote: "I switched from carrying heavy textbooks to using StudyMate. My bag is lighter and my grades are better.", author: "Aayush Ghimire", role: "5th Semester, Computer Engineering" },
    { quote: "The dark mode is perfect for late-night study sessions. My eyes don't strain anymore.", author: "Sunita Karki", role: "8th Semester, Computer Engineering" },
    { quote: "My entire study group uses StudyMate. We share notes and materials through the upload feature all the time.", author: "Ramesh Khadka", role: "4th Semester, Computer Engineering" },
    { quote: "I'm from GCES and the notes here align perfectly with our professors' teaching. It's like having a second classroom.", author: "Prakash Siwakoti", role: "2nd Semester, Computer Engineering" },
    { quote: "The PDF viewer is smooth and fast. I can annotate and read even large documents without any lag.", author: "Mina Shrestha", role: "6th Semester, Computer Engineering" },
    { quote: "I discovered StudyMate during my first semester and I've been using it ever since. It's become essential.", author: "Bishal Gurung", role: "7th Semester, Computer Engineering" },
    { quote: "The upload feature is great. I contributed some notes from my college and now hundreds of students use them.", author: "Laxmi Pudasaini", role: "3rd Semester, Computer Engineering" },
    { quote: "Before exams, I just open StudyMate and everything I need is right there. No more panic searching for notes.", author: "Saugat Bhattarai", role: "5th Semester, Computer Engineering" },
    { quote: "The interface is so clean compared to other apps. It feels like a premium product but it's completely free.", author: "Nisha Adhikari", role: "1st Semester, Computer Engineering" },
    { quote: "I study at LEC and StudyMate has materials for our exact curriculum. The semester-wise organization is perfect.", author: "Roshan Shrestha", role: "4th Semester, Computer Engineering" },
    { quote: "The recent files section saves me so much time. I can quickly jump back to what I was studying last.", author: "Anjali Rai", role: "6th Semester, Computer Engineering" },
    { quote: "I used to spend hours looking for notes online. StudyMate has everything in one place and it's well curated.", author: "Dipesh Koirala", role: "8th Semester, Computer Engineering" },
    { quote: "The mobile app experience is incredible. It feels native and smooth on my Android phone.", author: "Sarita Thapa", role: "2nd Semester, Computer Engineering" },
    { quote: "My favorite feature is the subject-wise breakdown. Each topic has exactly the materials I need.", author: "Kiran Basnet", role: "3rd Semester, Computer Engineering" },
    { quote: "I scored 15 marks higher in my Data Structures exam after using StudyMate's structured notes.", author: "Puja Sharma", role: "4th Semester, Computer Engineering" },
    { quote: "The fact that it covers all 8 semesters means I'll be using this throughout my entire degree.", author: "Ashmita Kandel", role: "1st Semester, Computer Engineering" },
    { quote: "I recommended StudyMate to my entire batch. Now almost everyone at Cosmos uses it regularly.", author: "Sanjay Mishra", role: "5th Semester, Computer Engineering" },
    { quote: "The quick access to previous year question papers has been invaluable for my exam preparation.", author: "Rekha Bajracharya", role: "7th Semester, Computer Engineering" },
    { quote: "It's like having a digital library in my pocket. I access it during lunch breaks, on the bus, everywhere.", author: "Prashant Bhandari", role: "6th Semester, Computer Engineering" },
    { quote: "The notes are well-formatted and easy to read on both my phone and laptop. Great responsive design.", author: "Sabina Tamang", role: "3rd Semester, Computer Engineering" },
    { quote: "I was skeptical at first but after trying it, I can't imagine studying without StudyMate anymore.", author: "Aakash GC", role: "8th Semester, Computer Engineering" },
    { quote: "The folder colors and themes make the app feel personalized. Small details that make a big difference.", author: "Rita Gharti", role: "2nd Semester, Computer Engineering" },
    { quote: "StudyMate helped me transition from traditional notes to digital studying. The best decision I've made.", author: "Manoj Rana", role: "4th Semester, Computer Engineering" },
    { quote: "I love that I can access my notes offline. Living in Pokhara, internet isn't always reliable.", author: "Gita Poudel", role: "5th Semester, Computer Engineering" },
    { quote: "The support team is responsive and helpful. I reported an issue and it was fixed within a day.", author: "Bijay Rai", role: "7th Semester, Computer Engineering" },
    { quote: "Every student at PU affiliated colleges should know about StudyMate. It's a hidden gem.", author: "Deepa Gurung", role: "1st Semester, Computer Engineering" },
    { quote: "The image viewer with zoom feature is great for studying diagrams and charts in detail.", author: "Rabin Kathayat", role: "3rd Semester, Computer Engineering" },
    { quote: "I've tried many study apps but StudyMate is the only one that truly understands PU's curriculum.", author: "Neha Shrestha", role: "6th Semester, Computer Engineering" },
    { quote: "The desktop environment feels premium. It's not just a notes app, it's a complete study workspace.", author: "Karan Bista", role: "8th Semester, Computer Engineering" },
    { quote: "From calculus to machine learning, every subject is covered thoroughly. StudyMate never disappoints.", author: "Sita Kafle", role: "5th Semester, Computer Engineering" },
    { quote: "I use the contact feature to send feedback and suggestions. The team actually listens to students.", author: "Amrit Karki", role: "2nd Semester, Computer Engineering" },
  ]

  const handleLogoClick = () => {
    setMobileMenuOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  // Set page title and meta for SEO
  useEffect(() => {
    setTitle('StudyMate — Computer Engineering Notes Pokhara University')
    // Update meta description
    setMeta({ name: 'description', content: 'Pokhara University BE Computer Engineering notes — semester-wise PDFs for PEC, NCIT, NEC and other colleges.' })
    setMeta({ name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' })
    setLinkRel('canonical', 'https://www.manishshrestha012.com.np/')

    // Open Graph / Twitter
    setMeta({ property: 'og:title', content: 'StudyMate — PU Notes for Computer Engineering' })
    setMeta({ property: 'og:description', content: 'Access PU notes for BE Computer Engineering students. Download semester-wise notes, PDFs, and study materials.' })
    setMeta({ property: 'og:image', content: 'https://www.manishshrestha012.com.np/logo-512.png' })
    setMeta({ property: 'og:url', content: 'https://www.manishshrestha012.com.np/' })
    setMeta({ property: 'og:site_name', content: 'StudyMate' })

    setMeta({ name: 'twitter:title', content: 'StudyMate — PU Notes for Computer Engineering' })
    setMeta({ name: 'twitter:description', content: 'Access PU notes for BE Computer Engineering students. Download semester-wise notes, PDFs, and study materials.' })
    setMeta({ name: 'twitter:image', content: 'https://www.manishshrestha012.com.np/logo-512.png' })

    // JSON-LD for homepage
    const homeLD = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://www.manishshrestha012.com.np/#homepage',
      'url': 'https://www.manishshrestha012.com.np/',
      'name': 'StudyMate',
      'description': 'Your Complete Study Resource Hub for Pokhara University Computer Engineering — notes, PDFs, and semester material.',
      'isPartOf': { '@id': 'https://www.manishshrestha012.com.np/#website' }
    }

    setJSONLD(homeLD, 'json-ld-home')

    return () => {
      setTitle('StudyMate')
      removeElementById('json-ld-home')
    }
  }, [])

  // No global body theme manipulation here; full-bleed CSS handles edge cases

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

  const steps = [
    {
      number: '1',
      icon: '🔍',
      title: 'Browse Your Semester',
      description: 'Navigate through 8 semesters organized by the PU BE Computer Engineering curriculum. Find your subjects instantly.'
    },
    {
      number: '2',
      icon: '📖',
      title: 'Access Study Materials',
      description: 'Open notes, PDFs, presentations, and documents directly in the app. Everything is categorized by subject and chapter.'
    },
    {
      number: '3',
      icon: '📥',
      title: 'Download for Offline',
      description: 'Save study materials on the mobile app for offline access. Study anywhere, even without internet connectivity.'
    },
    {
      number: '4',
      icon: '✏️',
      title: 'Take Notes & Draw',
      description: 'Available on the web dashboard only. Create personal notes and sketches using the built-in drawing canvas. Your work auto-saves to the cloud.'
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
          <Link to="/" className="nav-logo" onClick={handleLogoClick}>
            <img src={resolvedTheme === 'dark' ? '/white.svg' : '/black.svg'} alt="StudyMate Logo" style={{ height: 32, width: 32 }} />
            <span className="logo-text">StudyMate</span>
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#testimonials">Reviews</a>
            <Link to="/colleges">Colleges</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/login" className="nav-login">Login</Link>
            <Link to="/dashboard" className="nav-cta">Open Dashboard</Link>
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark')}
              title={`Theme: ${mode}`}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Moon size={18} /> : mode === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
            </button>
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
              <Link to="/colleges" onClick={() => setMobileMenuOpen(false)}>Colleges</Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/login" className="nav-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/dashboard" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>Open Dashboard</Link>
              <button
                className="theme-toggle-btn mobile-theme-toggle"
                onClick={() => setTheme(mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark')}
                title={`Theme: ${mode}`}
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <Moon size={18} /> : mode === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
              </button>
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

      {/* How It Works Section */}
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
                  <span>📄</span> Computer Architecture.pdf
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Artificial Intelligence.pdf
                </div>
                <div className="visual-subfolder">
                  <span>📄</span> Embedded Systems.pdf</div>
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
          <div className="wall-of-love testimonials-marquee">
            {[
              testimonials.slice(0, 17),
              [...testimonials.slice(12), ...testimonials.slice(0, 12)],
              [...testimonials.slice(6), ...testimonials.slice(0, 6)],
            ].map((row, rowIdx) => (
              <div className={`wol-row ${rowIdx % 2 === 1 ? 'wol-row--reverse' : ''}`} key={rowIdx}>
                <div className="wol-track">
                  {[...row, ...row].map((t, i) => (
                    <div className="wol-card" key={i}>
                      <p className="wol-quote">"{t.quote}"</p>
                      <div className="wol-author">
                        <div className="wol-avatar">{t.author.charAt(0)}</div>
                        <div className="wol-info">
                          <span className="wol-name">{t.author}</span>
                          <span className="wol-role">{t.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Colleges Section */}
      <section id="colleges" className="colleges-showcase">
        <div className="colleges-container">
          <div className="section-header">
            <span className="section-badge">Colleges</span>
            <h2 className="section-title">Supported across 14+ colleges</h2>
            <p className="section-subtitle">
              StudyMate covers all Pokhara University affiliated colleges notes offering BE Computer Engineering.
            </p>
          </div>
          <div className="colleges-grid">
            {COLLEGES.map((college, index) => {
              const slug = (college.value.match(/\(([^)]+)\)/)?.[1] || '').toLowerCase()
              return (
                <Link to={`/college/${slug}`} key={index} className="college-card">
                  <img src={college.logo} alt={college.value} className="college-card-logo" onError={(e) => { e.target.style.display = 'none' }} />
                  <div className="college-card-info">
                    <span className="college-card-name">{college.value.split('(')[0].trim()}</span>
                    <span className="college-card-abbr">({college.value.match(/\(([^)]+)\)/)?.[1]})</span>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="colleges-cta">
            <Link to="/colleges" className="btn-secondary">
              View All Colleges
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Play Store Download Banner */}
      <section className="app-download-banner">
        <div className="app-download-container">
          <div className="app-download-content">
            <div className="app-download-icon">
              <img src="/white.svg" alt="StudyMate" style={{ width: 56, height: 56 }} />
            </div>
            <div className="app-download-text">
              <h3 className="app-download-title">Get StudyMate on your phone</h3>
              <p className="app-download-subtitle">
                Download notes offline, view PDFs, and access your study materials anytime — even without internet.
              </p>
            </div>
          </div>
          <div className="app-download-actions">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="play-store-badge">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302c.812.812.812 2.143 0 2.954l-2.302 2.302L15.396 12l2.302-2.492zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="play-store-text">
                <span className="play-store-small">GET IT ON</span>
                <span className="play-store-big">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to ace your exams?</h2>
          <p className="cta-subtitle">
            Join thousands of PU Computer Engineering students who are already using StudyMate. 
            Access 500+ study materials across 50+ subjects — completely free.
          </p>
          <div className="cta-buttons">
            <Link to="/dashboard" className="btn-primary btn-large">
              Open Dashboard
              <span className="btn-arrow">→</span>
            </Link>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-large">
              Download App
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
          </div>
          <div className="cta-trust">
            <span>🎓 14+ colleges</span>
            <span>📚 500+ materials</span>
            <span>📱 Available on Android</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="nav-logo" onClick={handleLogoClick}>
                <img src="/white.svg" alt="StudyMate Logo" style={{ height: 32, width: 32 }} />
                <span className="logo-text">StudyMate</span>
              </Link>
              <p className="footer-tagline">
                Your complete study resource for Pokhara University Computer Engineering.
              </p>
              <div className="footer-social">
                <a href="https://github.com/manishshrestha01" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.shresthamanish.info.np/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Website">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@shresthamanish.info.np" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Email">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links-grid">
              <div className="footer-column">
                <h2>Quick Links</h2>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/colleges">Colleges</Link>
                <Link to="/blog">Blog</Link>
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="#testimonials">Reviews</a>
              </div>
              <div className="footer-column">
                <h2>Semesters</h2>
                {landingSemesterLinks.map((semesterLink) => (
                  <Link key={semesterLink.label} to={semesterLink.to}>
                    {semesterLink.label}
                  </Link>
                ))}
              </div>
              <div className="footer-column">
                <h2>Account</h2>
                <Link to="/login">Login</Link>
                <Link to="/login">Continue with Google</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} StudyMate. Made with ❤️ for PU Students</p>
            <div className="footer-bottom-links">
              <a href="/faq" target="_blank" rel="noopener noreferrer">FAQ</a>
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
