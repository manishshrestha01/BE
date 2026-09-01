'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import { setJSONLD } from '@/lib/seo'
import '@/components/Landing/Landing.css'
import '@/components/Landing/FAQ.css'
import './pu-exam.css'

const SITE_URL = 'https://www.manishshrestha012.com.np'

const semesters = [
  { n: 1, url: '/blog/semester/1', title: 'Calculus I, Digital Logic, C Programming' },
  { n: 2, url: '/blog/semester/2', title: 'Algebra, Applied Physics, Data Structures' },
  { n: 3, url: '/blog/semester/3', title: 'Discrete Maths, Object Oriented Programming' },
  { n: 4, url: '/blog/semester/4', title: 'DBMS, Operating Systems, Numerical Methods' },
  { n: 5, url: '/blog/semester/5', title: 'Computer Networks, Computer Architecture' },
  { n: 6, url: '/blog/semester/6', title: 'AI, Compiler Design, Software Engineering' },
]

const examTips = [
  'Revise the full syllabus PDF for your semester — PU exam questions are drawn directly from the official curriculum.',
  'Practise previous-year questions from your subject guides; PU frequently repeats similar question patterns.',
  'Focus on numerical-heavy subjects (Maths, Physics, DSA) by working through solved topper notes.',
  'Make a revision schedule across all subjects instead of cramming a single one.',
  'Memorise key definitions and data-structure/algorithm traces early — they carry easy marks.',
  'Reserve the last 2 days before an exam for past-question revision and formula sheets.',
]

const faqs = [
  {
    question: 'When are Pokhara University (PU) exams held?',
    answer:
      'Pokhara University conducts semester-end exams twice a year (end-semester and back exams) for BE Computer Engineering. Exact dates and the exam routine are published by the Pokhara University examination section and announced at each college a few weeks before the exam window begins.',
  },
  {
    question: 'Where can I find the PU exam routine and date sheet?',
    answer:
      'The official PU exam routine is published on the Pokhara University website (exam.pu.edu.np) and announced at your college. On StudyMate you can use the dashboard and semester pages to revise each subject before the routine is released.',
  },
  {
    question: 'How are PU BE Computer Engineering exams graded?',
    answer:
      'Each theory subject combines internal (continuous/internal assessment) and end-semester marks. Pokhara University uses a 4-point letter-grade system (A, A-, B+, B, B-, C+, C, C-, D+, D, and F for fail) for results across all 8 semesters. There is no A+ and no NG grade in bachelor\'s results.',
  },
  {
    question: 'What is a back paper in PU exams?',
    answer:
      'A back paper (backlog/back exam) is a re-examination for a subject a student failed or missed. Pokhara University holds back exams in the following term so students can clear failed subjects and continue their degree.',
  },
  {
    question: 'How should I prepare for the PU Computer Engineering exam?',
    answer:
      'Prepare by studying the free semester-wise notes, syllabus breakdowns, and topper PDFs on StudyMate, practising previous-year questions, and revising high-weight topics. Focus on marks-heavy units and numerical derivation subjects.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'PU Exam Guide — Pokhara University BE Computer Engineering',
  description:
    'Complete guide to the Pokhara University (PU) exam for BE Computer Engineering: routine, grading, back papers, and free subject-wise revision notes for all 8 semesters.',
  image: `${SITE_URL}/logo-512.png`,
  author: { '@id': `${SITE_URL}/#author` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/pu-exam` },
  datePublished: '2026-02-19',
  dateModified: '2026-02-19',
  inLanguage: 'en-US',
}

export default function PuExam() {
  useEffect(() => {
    setJSONLD(faqSchema, 'json-ld-pu-exam-faq')
    setJSONLD(articleSchema, 'json-ld-pu-exam-article')
  }, [])

  return (
    <div className="landing legal-dark pu-exam-page">
      <SiteNav />

      <main className="pu-exam-container">
        <header className="pu-exam-hero">
          <p className="pu-exam-badge">Pokhara University · Exam Guide</p>
          <h1 className="pu-exam-title">PU Exam Guide — BE Computer Engineering</h1>
          <p className="pu-exam-subtitle">
            Everything you need to prepare for the Pokhara University (PU) end-semester exam: how the
            exam works, grading, back papers, and free subject-wise revision notes for all 8 semesters.
          </p>
          <div className="pu-exam-cta">
            <Link className="pu-exam-btn" href="/dashboard">Open Study Dashboard</Link>
            <Link className="pu-exam-btn pu-exam-btn-ghost" href="/blog">Browse Subject Guides</Link>
          </div>
        </header>

        <section className="pu-exam-section">
          <h2>What is the PU Exam?</h2>
          <p>
            The <strong>PU exam</strong> is the end-semester examination for Bachelor of Engineering
            (BE) Computer Engineering at <strong>Pokhara University (PU)</strong>, Nepal. Each of the
            8 semesters ends with a university-conducted theory exam for every subject, alongside
            internal assessment, labs, and practicals. The exam tests your grasp of the official PU
            curriculum and syllabus for each semester.
          </p>
        </section>

        <section className="pu-exam-section">
          <h2>PU Exam Format &amp; Grading</h2>
          <ul className="pu-exam-list">
            <li>End-semester theory exams are held for all subjects in each semester.</li>
            <li>Marks combine internal (assignments, attendance, internal tests) and end-semester theory.</li>
            <li>Pokhara University grades on a 4-point A to F letter scale; passing requires the minimum per subject.</li>
            <li>Back (backlog) papers are offered in the following term for any failed subject.</li>
            <li>See the full <Link className="pu-exam-inline-link" href="/pu-exam-grading">letter grade &amp; marking scheme</Link> for SGPA/CGPA details.</li>
          </ul>
        </section>

        <section className="pu-exam-section">
          <h2>Free Subject-Wise Revision for Every Semester</h2>
          <p>
            Our free notes cover the complete PU BE Computer Engineering syllabus. Each guide includes
            the syllabus overview, important topics, practice questions, and study tips to help you
            score well in the PU exam.
          </p>
          <div className="pu-exam-sem-grid">
            {semesters.map((s) => (
              <Link key={s.n} className="pu-exam-sem-card" href={s.url}>
                <span className="pu-exam-sem-num">Semester {s.n}</span>
                <span className="pu-exam-sem-title">{s.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pu-exam-section">
          <h2>PU Exam Preparation Tips</h2>
          <ul className="pu-exam-list">
            {examTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="pu-exam-section">
          <h2>PU Exam — Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details className="faq-item" key={f.question} open={i === 0}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
