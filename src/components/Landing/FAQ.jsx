import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'
import './FAQ.css'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  // SEO - Update document title and meta tags
  useEffect(() => {
    // Set page title
    document.title = 'PU Notes FAQ - Pokhara University Computer Engineering Notes Questions'
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent = 'FAQs about PU notes. Pokhara University notes for BE Computer Engineering, IT, Software Engineering. Compiler notes, C programming, DBMS, DSA. NCIT, CCRC notes available.'
    
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = descriptionContent
      document.head.appendChild(meta)
    }

    // Set meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    const keywordsContent = 'PU notes FAQ, Pokhara University notes, BE computer notes, computer engineering notes FAQ, PU syllabus, NCIT notes, CCRC notes, compiler notes, C programming notes, DBMS notes, BE IT notes, software engineering notes, engineering notes Nepal'
    
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'keywords'
      meta.content = keywordsContent
      document.head.appendChild(meta)
    }

    // Set Open Graph tags
    const ogTags = {
      'og:title': 'PU Notes FAQ - Pokhara University Computer Engineering Notes',
      'og:description': 'FAQs about PU notes for BE Computer Engineering. Compiler, C programming, DBMS, DSA notes for NCIT, CCRC students.',
      'og:type': 'website',
      'og:url': window.location.href,
      'og:site_name': 'StudyMate - PU Notes'
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (meta) {
        meta.setAttribute('content', content)
      } else {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        meta.content = content
        document.head.appendChild(meta)
      }
    })

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.href = window.location.origin + '/faq'
    } else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = window.location.origin + '/faq'
      document.head.appendChild(canonical)
    }

    // Scroll to top
    window.scrollTo(0, 0)

    // Cleanup
    return () => {
      document.title = 'StudyMate'
    }
  }, [])

  const faqs = [
    {
      question: 'What is StudyMate?',
      answer: 'StudyMate is a free online platform designed for Pokhara University engineering students. It provides organized study materials, notes, syllabi, and a personal notes feature to help you study effectively.'
    },
    {
      question: 'Is StudyMate free to use?',
      answer: 'Yes! StudyMate is completely free for all students. We believe education resources should be accessible to everyone.'
    },
    {
      question: 'Can I access the syllabus for each subject?',
      answer: 'Yes! You can find the syllabus for each subject available on StudyMate. Navigate to any subject folder to view its complete syllabus along with study materials, past questions, and notes.'
    },
    {
      question: 'Can students from other faculties use StudyMate?',
      answer: 'Absolutely! While StudyMate is primarily designed for BE Computer Engineering, students from other faculties like BE IT, Software Engineering, and Civil Engineering can also benefit. Many subjects share similar syllabi across these programs — subjects like Mathematics, Physics, Engineering Drawing, and several others are common across faculties.'
    },
    {
      question: 'What semesters are covered?',
      answer: 'StudyMate covers all 8 semesters of Computer Engineering at Pokhara University. Each semester has organized folders for different subjects with relevant study materials.'
    },
    {
      question: 'Can I upload my own notes?',
      answer: 'Yes! Once you sign in, you can upload your own study materials through the Settings panel. You can organize them in personal folders and access them from any device.'
    },
    {
      question: 'Are my notes saved automatically?',
      answer: 'Yes, all your personal notes are automatically saved to the cloud and synced across your devices. You\'ll never lose your study notes!'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We currently support PDF documents, images (PNG, JPG, JPEG), and text files. We\'re working on adding support for more formats like Word documents and PowerPoint presentations.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'You can browse study materials without an account. However, to use features like personal notes, cloud sync, and custom settings, you\'ll need to sign in with your Google account. It\'s quick and secure!'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use Google authentication for secure sign-in, and your data is stored safely in the cloud. We don\'t share your personal information with third parties.'
    },
    {
      question: 'Can I use StudyMate on mobile?',
      answer: 'Yes! StudyMate is fully responsive and works great on mobile phones, tablets, and desktops. Access your study materials anywhere, anytime.'
    },
    {
      question: 'How do I report an issue or suggest a feature?',
      answer: 'We\'d love to hear from you! You can reach out through our contact form or email us directly. Your feedback helps us improve StudyMate for everyone.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="landing faq-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src="/black.svg" alt="StudyMate Logo" style={{ height: 32 }} />
            <span className="logo-text">StudyMate</span>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard Guide</Link>
            <Link to="/login" className="nav-login">Login</Link>
            <Link to="/dashboard" className="nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="faq-hero">
        <div className="faq-hero-container">
          <div className="hero-badge">
            <span>❓</span> Help Center
          </div>
          <h1 className="hero-title">
            Frequently Asked
            <br />
            <span className="hero-highlight">Questions</span>
          </h1>
          <p className="hero-subtitle">
            Find answers to common questions about StudyMate. Can't find what you're looking for? 
            Feel free to reach out to us.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="faq-cta">
        <div className="faq-cta-container">
          <h2>Still have questions?</h2>
          <p>Check out our dashboard guide or get started with StudyMate today.</p>
          <div className="faq-cta-buttons">
            <Link to="/dashboard" className="btn-primary">
              Dashboard Guide
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/login" className="btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

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

export default FAQ
