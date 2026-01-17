import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { COLLEGES } from '../lib/colleges'
import './Landing/Landing.css'
import './Colleges.css'
import { setTitle, setMeta, setLinkRel, setJSONLD, removeElementById } from '../lib/seo'
import SiteNav from './SiteNav'
import Footer from './Footer'

const makeSlug = (label) => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const Colleges = () => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    setTitle('Colleges — BE Computer Engineering Notes — StudyMate')
    setMeta({ name: 'description', content: 'Find Pokhara University BE Computer Engineering notes for specific colleges like PEC, NCIT, NEC, and others. Choose your college to see semester-wise BE Computer notes and study materials.' })
    setLinkRel('canonical', 'https://www.manishshrestha012.com.np/colleges')
    setMeta({ property: 'og:title', content: 'Colleges — BE Computer Engineering Notes — StudyMate' })
    setMeta({ property: 'og:description', content: 'Find Pokhara University BE Computer Engineering notes for colleges like PEC, NCIT and NEC. Choose your college to see semester-wise BE Computer notes.' })
    setMeta({ property: 'og:site_name', content: 'StudyMate' })

    const collectionLD = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'url': 'https://www.manishshrestha012.com.np/colleges',
      'name': 'Colleges — BE Computer Engineering Notes — StudyMate',
      'description': 'Find Pokhara University BE Computer Engineering notes for specific colleges like PEC, NCIT, NEC, and others.',
      'isPartOf': { '@id': 'https://www.manishshrestha012.com.np/#website' },
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': COLLEGES.map((c, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': c.label,
          'url': `https://www.manishshrestha012.com.np/college/${makeSlug(c.label)}`
        }))
      }
    }

    setJSONLD(collectionLD, 'json-ld-colleges')

    // Make organization information available on client-rendered pages as well
    const orgGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': 'https://www.manishshrestha012.com.np/#organization', 'name': 'StudyMate', 'url': 'https://www.manishshrestha012.com.np/', 'logo': { '@type': 'ImageObject', 'url': 'https://www.manishshrestha012.com.np/logo-512.png' }, 'description': 'PU notes for BE Computer Engineering students.' },
        { '@type': 'WebSite', '@id': 'https://www.manishshrestha012.com.np/#website', 'url': 'https://www.manishshrestha012.com.np/', 'name': 'StudyMate', 'publisher': { '@id': 'https://www.manishshrestha012.com.np/#organization' }, 'inLanguage': 'en-US' }
      ]
    }

    setJSONLD(orgGraph, 'json-ld-org')

    return () => {
      setTitle('StudyMate')
      removeElementById('json-ld-colleges')
      removeElementById('json-ld-org')
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COLLEGES
    return COLLEGES.filter(c => c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q) || makeSlug(c.label).includes(q))
  }, [query])

  return (
    <div className="landing colleges-page">
      <SiteNav />
      <section className="colleges-hero">
        <div className="colleges-hero-inner">
          <div className="hero-content">
            <h1><span className="hero-gradient">Colleges</span> <span className="hero-highlight">— BE Computer Engineering Notes</span></h1>
            <div className="hero-accent-line" aria-hidden="true" />
            <p className="hero-sub">Choose your college to find semester-wise BE Computer Engineering notes, PDFs and study materials for Pokhara University.</p>
            <div className="search-row">
              <input className="college-search" placeholder="Search college (e.g. PEC, NCIT)" value={query} onChange={e => setQuery(e.target.value)} />
              {query && <button className="clear-btn" onClick={() => setQuery('')} aria-label="Clear">✕</button>}
            </div>
          </div>
          <div className="hero-visual">
            <img src="/logo-512.png" alt="StudyMate" className="hero-logo" />
          </div>
        </div>
      </section>

      <section className="colleges-list">
        <div className="colleges-grid">
          {filtered.map(c => {
           const slug = makeSlug(c.label)
             return (
               <article key={c.value} className="college-card">
                 <img src={c.logo || '/logo-512.png'} alt={`${c.label} logo`} className="college-card-img" />
                 <div className="college-card-body">
                   <h3 className="college-title">{c.label}</h3>
                   <p className="college-desc">{c.label} — BE Computer Engineering notes for Pokhara University. Search: "{slug} BE computer notes"</p>
                   <div className="college-actions">
                     <Link to={`/college/${slug}`} className="college-btn-primary">Open Notes</Link>
                   </div>
                 </div>
               </article>
             )
           })}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Colleges
