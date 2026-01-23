import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { COLLEGES } from '../lib/colleges'
import { setTitle, setMeta, setLinkRel, setJSONLD, removeElementById } from '../lib/seo'
import './College.css'
import SiteNav from './SiteNav'
import Footer from './Footer'

const makeSlugFromLabel = (label) => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const findCollegeBySlug = (slug) => {
  return COLLEGES.find(c => makeSlugFromLabel(c.label) === slug || (c.value && makeSlugFromLabel(c.value) === slug))
}

const College = () => {
  const { slug } = useParams()
  const college = findCollegeBySlug(slug)

  useEffect(() => {
    if (college) {
      const title = `${college.label} — BE Computer Engineering Notes — StudyMate | Pokhara University`
      setTitle(title)
      const shortDesc = `Semester-wise BE Computer Engineering PDFs and notes for ${college.label} — Pokhara University.`
      setMeta({ name: 'description', content: shortDesc })
      setLinkRel('canonical', `https://www.manishshrestha012.com.np/college/${slug}`)
      setMeta({ name: 'robots', content: 'index, follow' })

      // Open Graph / Twitter
      setMeta({ property: 'og:title', content: title })
      setMeta({ property: 'og:description', content: shortDesc })
      setMeta({ property: 'og:image', content: `https://www.manishshrestha012.com.np${college.logo || '/logo-512.png'}` })
      setMeta({ property: 'og:image:alt', content: `${college.label} logo` })
      setMeta({ property: 'og:type', content: 'website' })
      setMeta({ property: 'og:locale', content: 'en_US' })
      // Helpful hints for social cards
      setMeta({ name: 'twitter:card', content: 'summary_large_image' })
      setMeta({ property: 'og:image:width', content: '512' })
      setMeta({ property: 'og:image:height', content: '512' })
      setMeta({ property: 'og:url', content: `https://www.manishshrestha012.com.np/college/${slug}` })
      setMeta({ property: 'og:site_name', content: 'StudyMate' })

      setMeta({ name: 'twitter:title', content: title })
      setMeta({ name: 'twitter:description', content: shortDesc })
      setMeta({ name: 'twitter:image', content: `https://www.manishshrestha012.com.np${college.logo || '/logo-512.png'}` })
      setMeta({ name: 'twitter:image:alt', content: `${college.label} logo` })

      // Helpful keywords for college-specific search queries including BE Computer phrasing
      setMeta({ name: 'keywords', content: `${college.label}, ${slug} notes, ${college.label} BE Computer notes, ${slug} BE computer notes, Pokhara University BE Computer notes, BE Computer Engineering notes` })

      // JSON-LD: WebPage + BreadcrumbList
      const pageLD = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'url': `https://www.manishshrestha012.com.np/college/${slug}`,
        'image': `https://www.manishshrestha012.com.np${college.logo || '/logo-512.png'}`,
        'name': title,
        'description': shortDesc,
        'inLanguage': 'en-US',
        'publisher': { '@id': 'https://www.manishshrestha012.com.np/#organization' },
        'mainEntity': {
          '@type': 'ItemList',
          'itemListElement': [1,2,3,4,5,6,7,8].map((s) => ({
            '@type': 'ListItem',
            'position': s,
            'name': `${s}${s === 1 ? 'st' : s === 2 ? 'nd' : s === 3 ? 'rd' : 'th'} Semester`,
            'url': `https://www.manishshrestha012.com.np/dashboard?college=${slug}&semester=${s}`
          }))
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.manishshrestha012.com.np/' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Colleges', 'item': 'https://www.manishshrestha012.com.np/colleges' },
            { '@type': 'ListItem', 'position': 3, 'name': college.label, 'item': `https://www.manishshrestha012.com.np/college/${slug}` }
          ]
        },
        'isPartOf': { '@id': 'https://www.manishshrestha012.com.np/#website' }
      }

      setJSONLD(pageLD, `json-ld-college-${slug}`)

      const orgGraph = {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Organization', '@id': 'https://www.manishshrestha012.com.np/#organization', 'name': 'StudyMate', 'url': 'https://www.manishshrestha012.com.np/', 'logo': { '@type': 'ImageObject', 'url': 'https://www.manishshrestha012.com.np/logo-512.png' }, 'description': 'PU notes for BE Computer Engineering students.' },
          { '@type': 'WebSite', '@id': 'https://www.manishshrestha012.com.np/#website', 'url': 'https://www.manishshrestha012.com.np/', 'name': 'StudyMate', 'publisher': { '@id': 'https://www.manishshrestha012.com.np/#organization' }, 'inLanguage': 'en-US' }
        ]
      }

      setJSONLD(orgGraph, 'json-ld-org')
    }

    return () => {
      setTitle('StudyMate')
      removeElementById(`json-ld-college-${slug}`)
      removeElementById('json-ld-org')
    }
  }, [college, slug])

  if (!college) {
    return (
      <div style={{ padding: 40 }}>
        <h2>College not found</h2>
        <p>We couldn't find that college. Try the Colleges list.</p>
        <Link to="/colleges">Back to Colleges</Link>
      </div>
    )
  }

  const otherColleges = COLLEGES.filter(c => c.value !== college.value).slice(0, 6)

  return (
    <div className="landing college-page">
      <SiteNav />
      <section className="college-hero">
        <div className="college-hero-inner">
          <div className="college-hero-media">
            <img src={college.logo || '/logo-512.png'} alt={`${college.label} logo`} className="college-logo" />
          </div>
          <div className="college-hero-content">
            <div className="college-breadcrumbs"><Link to="/">Home</Link> • <Link to="/colleges">Colleges</Link> • <span>{college.label}</span></div>
            <h1><span className="hero-gradient">{college.label}</span> <span className="hero-highlight">— BE Computer Engineering</span></h1>
            <div className="hero-accent-line" aria-hidden="true" />
            <p className="college-sub">Semester-wise BE Computer Engineering notes, PDFs and study materials for {college.label} students at Pokhara University. Use the dashboard to filter by semester and subject.</p>
            <div className="hero-meta">
              <span className="meta-badge">BE Computer Engineering</span>
              <span className="meta-item">8 Semesters</span>
            </div>
            <div className="hero-actions">
              <Link to="/dashboard" className="btn-primary btn-large">Open Dashboard <span className="btn-arrow">→</span></Link>
              <a href="#semesters" className="btn-secondary">Explore Semesters</a>
            </div>
          </div>
        </div>
      </section>

      <section className="college-content">
        <div>
          <div id="semesters" className="semesters">
            <h4>Available Semesters</h4>
            <div className="semesters-grid">
              {[1,2,3,4,5,6,7,8].map(s => (
                <Link key={s} to={`/dashboard?college=${slug}&semester=${s}`} className="semester-card">
                  <div className="semester-card-number">{s}</div>
                  <div className="semester-card-title">{s}{s === 1 ? 'st' : s === 2 ? 'nd' : s === 3 ? 'rd' : 'th'} Semester</div>
                </Link>
              ))}
            </div>
            <div className="popular-subjects">
              <h5>Popular Subjects</h5>
              <div className="subject-chips">
                <span className="chip">Artificial Intelligence (AI)</span>
                <span className="chip">Machine Learning (ML)</span>
                <span className="chip">Data Science and Analytics</span>
                <span className="chip">Cloud Computing and Virtualization</span>
                <span className="chip">Computer Networks</span>
                <span className="chip">Cyber Security</span>
                <span className="chip">Data Structures</span>
                <span className="chip">C ,C++ & Java</span>
                <span className="chip">Operating Systems</span>
                <span className="chip">Digital Logic</span>
                <span className="chip">Compiler Design</span>
                <span className="chip">Calculus I</span>
                <span className="chip">Algebra and Geometry</span>
                <span className="chip">Probability and Statistics</span>
              </div>
            </div>
          </div>

          <div className="college-about" style={{ marginTop: 20 }}>
            <h3>About {college.label}</h3>
            <p>StudyMate provides organized BE Computer Engineering notes for {college.label} students at Pokhara University. You can find lecture notes, PDF resources, and create personal notes while studying.</p>
          </div>
        </div>

        <aside>
          <div className="related-colleges">
            <h4>Other Colleges</h4>
            <div className="related-grid">
              {otherColleges.map(c => (
                <Link key={c.value} to={`/college/${makeSlugFromLabel(c.label)}`} className="related-card">
                  <img src={c.logo || '/logo-512.png'} alt={c.label} />
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  )
}

export default College
