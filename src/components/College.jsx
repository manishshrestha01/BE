'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { COLLEGES } from '../lib/colleges'
import './College.css'
import SiteNav from './SiteNav'
import Footer from './Footer'
import { setJSONLD } from '../lib/seo'

const SITE_URL = 'https://www.manishshrestha012.com.np'

const makeSlugFromLabel = (label) => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const CollegeJSONLD = ({ college }) => {
  const slug = makeSlugFromLabel(college.label)
  const abbr = (college.label.match(/\(([^)]+)\)/) || [])[1] || college.label

  useEffect(() => {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${SITE_URL}/college/${slug}#educationalorg`,
          name: college.label,
          alternateName: abbr,
          url: `${SITE_URL}/college/${slug}`,
          logo: `${SITE_URL}${college.logo || '/logo-512.png'}`,
          location: college.location ? { '@type': 'Place', name: college.location } : undefined,
          disambiguatingDescription: college.description,
          sameAs: [],
          hasCourse: [
            {
              '@type': 'Course',
              name: 'BE Computer Engineering',
              provider: { '@id': `${SITE_URL}/college/${slug}#educationalorg` },
              url: `${SITE_URL}/college/${slug}`,
            },
          ],
        },
        {
          '@type': 'EducationalOccupationalCredential',
          '@id': `${SITE_URL}/college/${slug}#degree`,
          credentialCategory: 'bachelorDegree',
          name: 'BE Computer Engineering',
          educationalLevel: "Bachelor's Degree",
          recognizedBy: { '@id': `${SITE_URL}/college/${slug}#educationalorg` },
        },
      ],
    }
    setJSONLD(graph, 'json-ld-college')
  }, [college, slug, abbr])

  return null
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
      <CollegeJSONLD college={college} />
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
            <p>{college.description || `StudyMate provides organized BE Computer Engineering notes for ${college.label} students, aligned with the Pokhara University curriculum. You can find lecture notes, PDF resources, and create personal notes while studying.`}</p>
            <div className="college-facts">
              {college.established ? <span><strong>Established:</strong> {college.established}</span> : null}
              {college.location ? <span><strong>Location:</strong> {college.location}</span> : null}
              {college.program ? <span><strong>Program:</strong> {college.program}</span> : null}
            </div>
            <p>
              We update these notes against the official Pokhara University 2022 curriculum so the
              syllabus topics, unit weights, and past-paper patterns match what your department
              actually teaches at {college.label}. Open the{' '}
              <Link href="/dashboard">StudyMate dashboard</Link> to access the notes and previous
              past papers for each subject, semester by semester.
            </p>
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
