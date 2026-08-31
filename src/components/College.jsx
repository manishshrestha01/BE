'use client'
import Link from 'next/link'
import { COLLEGES } from '../lib/colleges'
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

const getSemesterLabel = (semester) => {
  return `${semester}${semester === 1 ? 'st' : semester === 2 ? 'nd' : semester === 3 ? 'rd' : 'th'} Semester`
}

const getSemesterPath = (semester) => `/blog/semester/${semester}`

const College = ({ slug }) => {
  const college = findCollegeBySlug(slug)

  if (!college) {
    return (
      <div style={{ padding: 40 }}>
        <h2>College not found</h2>
        <p>We couldn't find that college. Try the Colleges list.</p>
        <Link href="/colleges">Back to Colleges</Link>
      </div>
    )
  }

  const otherColleges = COLLEGES.filter(c => c.value !== college.value)

  return (
    <div className="landing college-page">
      <SiteNav />
      <section className="college-hero">
        <div className="college-hero-inner">
          <div className="college-hero-media">
            <img src={college.logo || '/logo-512.png'} alt={`${college.label} logo`} className="college-logo" />
          </div>
          <div className="college-hero-content">
            <div className="college-breadcrumbs"><Link href="/">Home</Link> • <Link href="/colleges">Colleges</Link> • <span>{college.label}</span></div>
            <h1><span className="hero-gradient">{college.label}</span> <span className="hero-highlight">— BE Computer Engineering</span></h1>
            <div className="hero-accent-line" aria-hidden="true" />
            <p className="college-sub">
              Semester-wise BE Computer Engineering notes, PDFs and study materials for {college.label} students on StudyMate, aligned with the Pokhara University curriculum.{' '}
              <Link href="/dashboard">Open Dashboard</Link> to get access to the notes by semester and subject.
            </p>
            <div className="hero-meta">
              <span className="meta-badge">BE Computer Engineering</span>
              <span className="meta-item">8 Semesters</span>
            </div>
            <div className="hero-actions">
              <Link href="/dashboard" className="btn-primary btn-large">Open Dashboard <span className="btn-arrow">→</span></Link>
              <a href="#semesters" className="btn-secondary">Explore Semesters</a>
            </div>
          </div>
        </div>
      </section>

      <section className="college-content">
        <div>
          <div id="semesters" className="semesters">
            <h4>Available Semesters</h4>
            <div className="semesters-list">
              {[1,2,3,4,5,6,7,8].map((s) => {
                const semesterLabel = getSemesterLabel(s)
                return (
                  <Link key={s} href={getSemesterPath(s)} className="semester-item">
                    {semesterLabel}
                  </Link>
                )
              })}
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
            <p>StudyMate provides organized BE Computer Engineering notes for {college.label} students, aligned with the Pokhara University curriculum. You can find lecture notes, PDF resources, and create personal notes while studying.</p>
          </div>
        </div>

        <aside>
          <div className="related-colleges">
            <h4>Other Colleges</h4>
            <div className="related-grid">
              {otherColleges.map(c => (
                <Link key={c.value} href={`/college/${makeSlugFromLabel(c.label)}`} className="related-card">
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
