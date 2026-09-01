'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import Footer from '@/components/Footer'
import { setJSONLD } from '@/lib/seo'
import '@/components/Landing/Landing.css'
import './pu-exam-grading.css'

const SITE_URL = 'https://www.manishshrestha012.com.np'

const undergraduateGrades = [
  { grade: 'A', points: '4.0', desc: 'Excellent', min: '90 and above' },
  { grade: 'A-', points: '3.7', desc: '', min: '85 – 89' },
  { grade: 'B+', points: '3.3', desc: '', min: '80 – 84' },
  { grade: 'B', points: '3.0', desc: 'Good', min: '75 – 79' },
  { grade: 'B-', points: '2.7', desc: '', min: '70 – 74' },
  { grade: 'C+', points: '2.3', desc: '', min: '65 – 69' },
  { grade: 'C', points: '2.0', desc: 'Fair', min: '60 – 64' },
  { grade: 'C-', points: '1.7', desc: '', min: '55 – 59' },
  { grade: 'D+', points: '1.3', desc: '', min: '50 – 54' },
  { grade: 'D', points: '1.0', desc: 'Minimum credit', min: '45 – 49' },
  { grade: 'F', points: '0.0', desc: 'Fail', min: 'below 45' },
]

const graduateGrades = [
  { grade: 'A', points: '4.0', desc: 'Excellent', min: '90 and above' },
  { grade: 'A-', points: '3.7', desc: '', min: '85 – 89' },
  { grade: 'B+', points: '3.3', desc: 'Good', min: '80 – 84' },
  { grade: 'B', points: '3.0', desc: 'Fair', min: '75 – 79' },
  { grade: 'B-', points: '2.7', desc: '', min: '70 – 74' },
  { grade: 'C+', points: '2.3', desc: '', min: '65 – 69' },
  { grade: 'C', points: '2.0', desc: 'Minimum credit', min: '60 – 64' },
  { grade: 'F', points: '0.0', desc: 'Fail', min: 'below 60' },
]

const semesters = [
  { n: 1, url: '/blog/semester/1', title: 'Calculus I, Digital Logic, Programming in C' },
  { n: 2, url: '/blog/semester/2', title: 'Algebra and Geometry, Applied Physics, Object Oriented Programming in C++' },
  { n: 3, url: '/blog/semester/3', title: 'Calculus II, Database Management System, Operating Systems' },
  { n: 4, url: '/blog/semester/4', title: 'Applied Mathematics, Numerical Methods, Advanced Programming with Java' },
  { n: 5, url: '/blog/semester/5', title: 'Probability and Statistics, Artificial Intelligence, Software Engineering' },
  { n: 6, url: '/blog/semester/6', title: 'Machine Learning, Compiler Design, Computer Networks' },
  { n: 7, url: '/blog/semester/7', title: 'Engineering Economics, Network and Cyber Security, Data Science and Analytics' },
  { n: 8, url: '/blog/semester/8', title: 'Elective III, Internship, Project II' },
]

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'PU Exam Grading & Marking System — Pokhara University Letter Grades, Marks & CGPA',
  description:
    'Pokhara University exam grading and marking system explained: the 4-point letter grade system, honour points, 50-50 internal/external marking scheme, pass marks, SGPA/CGPA, retakes, distinction and Dean\u2019s list.',
  image: `${SITE_URL}/logo-512.png`,
  author: { '@id': `${SITE_URL}/#author` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/pu-exam-grading` },
  datePublished: '2026-09-01',
  dateModified: '2026-09-01',
  inLanguage: 'en-US',
}

export default function PuExamGrading() {
  useEffect(() => {
    setJSONLD(articleSchema, 'json-ld-pu-exam-grading-article')
  }, [])

  return (
    <div className="landing legal-dark pu-exam-grading-page">
      <SiteNav />

      <main className="pu-exam-grading-container">
        <header className="pu-exam-grading-hero">
          <p className="pu-exam-grading-badge">Pokhara University · Grading &amp; Marking</p>
          <h1 className="pu-exam-grading-title">PU Exam Grading &amp; Marking System — Letter Grades, Marks &amp; CGPA</h1>
          <p className="pu-exam-grading-subtitle">
            How Pokhara University grades and marks the end-semester (PU) exam: the marking scheme,
            internal vs external marks, the 4-point letter grade system, pass marks, SGPA/CGPA, retakes,
            distinction and Dean&rsquo;s list — based on the official Pokhara University academic regulations.
          </p>
          <div className="pu-exam-grading-cta">
            <Link className="pu-exam-grading-btn" href="/pu-exam">PU Exam Guide</Link>
            <Link className="pu-exam-grading-btn pu-exam-grading-btn-ghost" href="/dashboard">Open Study Dashboard</Link>
          </div>
        </header>

        <section className="pu-exam-grading-section">
          <h2>How PU Exam Marks Are Evaluated</h2>
          <p>
            A Pokhara University student&rsquo;s performance in each course is evaluated in two phases:
            <strong> internally</strong> by the college faculty (through quizzes, tutorials, lab work,
            home assignments, class tests, class participation and term papers) and <strong>externally</strong> by
            the Office of the Controller of Examinations through the semester-end (end-semester) exam.
            You must pass both the internal and the external examinations <strong>separately</strong>.
          </p>
          <table className="pu-exam-grading-table">
            <thead>
              <tr>
                <th>Program Level</th>
                <th>Internal Evaluation Weightage</th>
                <th>End-Semester Exam Weightage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Undergraduate (Bachelor)</td>
                <td>50%</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>Graduate</td>
                <td>60%</td>
                <td>40%</td>
              </tr>
            </tbody>
          </table>
          <p>
            Cumulative final score (0&ndash;100) = <strong>0.50 × IEM + 0.50 × EEM</strong> at undergraduate level and
            <strong> 0.60 × IEM + 0.40 × EEM</strong> at graduate level, where IEM = Internal Examination Marks and
            EEM = External Examination Marks.
          </p>
        </section>

        <section className="pu-exam-grading-section">
          <h2>Pass Marks in Internal &amp; External Exams</h2>
          <table className="pu-exam-grading-table">
            <thead>
              <tr>
                <th>Program Level</th>
                <th>Internal Pass %</th>
                <th>External Pass %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Undergraduate (Bachelor)</td>
                <td>45%</td>
                <td>45%</td>
              </tr>
              <tr>
                <td>Graduate</td>
                <td>60%</td>
                <td>60%</td>
              </tr>
            </tbody>
          </table>
          <p>
            A student failing the internal examination is <strong>&ldquo;Not Qualified&rdquo;</strong> to appear in the
            end-of-semester examination. Pass-mark cut-offs may be slightly adjusted statistically on the
            basis of break points in student scores, as recommended by the Scrutiny Board and approved by
            the Examination Board.
          </p>
        </section>

        <section className="pu-exam-grading-section">
          <h2>PU Letter Grade System (Undergraduate / Bachelor)</h2>
          <p>
            Pokhara University follows a <strong>four-point letter grade system</strong>. The final letter grade
            in each <strong>Bachelor</strong> (BE Computer Engineering) subject is awarded on the cumulative total score (0&ndash;100) as follows:
          </p>
          <table className="pu-exam-grading-table">
            <thead>
              <tr>
                <th>Letter Grade</th>
                <th>Honour Point</th>
                <th>Description</th>
                <th>Cumulative Score</th>
              </tr>
            </thead>
            <tbody>
              {undergraduateGrades.map((row) => (
                <tr key={row.grade}>
                  <td>{row.grade}</td>
                  <td>{row.points}</td>
                  <td>{row.desc || '—'}</td>
                  <td>{row.min}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="pu-exam-grading-section">
          <h2>PU Letter Grade System (Graduate)</h2>
          <table className="pu-exam-grading-table">
            <thead>
              <tr>
                <th>Letter Grade</th>
                <th>Honour Point</th>
                <th>Description</th>
                <th>Cumulative Score</th>
              </tr>
            </thead>
            <tbody>
              {graduateGrades.map((row) => (
                <tr key={row.grade}>
                  <td>{row.grade}</td>
                  <td>{row.points}</td>
                  <td>{row.desc || '—'}</td>
                  <td>{row.min}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Cut-offs may be slightly adjusted on a particular exam based on the difficulty of the question
            set, as determined statistically using the standard normal distribution and natural break points.
          </p>
        </section>

        <section className="pu-exam-grading-section">
          <h2>SGPA &amp; CGPA in the PU System</h2>
          <p>
            A student&rsquo;s performance is evaluated with two indices:
          </p>
          <ul className="pu-exam-grading-list">
            <li>
              <strong>SGPA</strong> (Semester Grade Point Average) — the grade point average of a particular semester.
            </li>
            <li>
              <strong>CGPA</strong> (Cumulative Grade Point Average) — the grade point average of all semesters taken together.
            </li>
          </ul>
          <p>
            A minimum CGPA of <strong>2.0 at undergraduate level</strong> and <strong>3.0 at graduate level</strong> is
            normally required to continue the program. A student whose past performance does not show the
            possibility of maintaining this CGPA may be dismissed from the program.
          </p>
        </section>

        <section className="pu-exam-grading-section">
          <h2>Retaking a Course in PU</h2>
          <p>
            A course may be taken only once for a grade, except when a student receives a failing grade.
            Because passing each course is essential for the degree, a student must retake any course they
            failed and complete it successfully. Within the maximum duration allowed for the program:
          </p>
          <ul className="pu-exam-grading-list">
            <li>A student may retake a maximum of <strong>two passed courses</strong> to achieve the minimum CGPA (2.0 undergraduate / 3.0 graduate).</li>
            <li>The grade earned on the retake exam <strong>substitutes</strong> the previously earned grade in the course.</li>
            <li>An incomplete grade <strong>&ldquo;I&rdquo;</strong> is automatically converted to <strong>&ldquo;F&rdquo;</strong> if all requirements are not completed within the following semester.</li>
          </ul>
        </section>

        <section className="pu-exam-grading-section">
          <h2>Distinction &amp; Dean&rsquo;s List in PU</h2>
          <table className="pu-exam-grading-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Undergraduate CGPA</th>
                <th>Graduate CGPA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Degree with Distinction</td>
                <td>3.60 or better</td>
                <td>3.75 or better</td>
              </tr>
              <tr>
                <td>Dean&rsquo;s List</td>
                <td>3.70 or better</td>
                <td>3.80 or better</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="pu-exam-grading-section">
          <h2>Internal vs External Mark Congruency Rule</h2>
          <p>
            If internal examination marks <strong>substantially exceed</strong> external marks — specifically when
            internal marks exceed external marks by <strong>more than 25% on average</strong> for a batch of students in
            a subject — the internal marks are considered questionable. As an anti-inflation measure, the
            weightage of the internal examination is then penalized by reducing it by <strong>50%</strong>, with the
            corresponding weightage added to the external examination.
          </p>
        </section>

        <section className="pu-exam-grading-section">
          <h2>Free Exam Revision for Every Semester</h2>
          <p>
            Pair the grading rules above with free, syllabus-aligned notes for every PU Bachelor (BE Computer
            Engineering) semester to score the highest grade band in your end-semester exam.
          </p>
          <div className="pu-exam-grading-sem-grid">
            {semesters.map((s) => (
              <Link key={s.n} className="pu-exam-grading-sem-card" href={s.url}>
                <span className="pu-exam-grading-sem-num">Semester {s.n}</span>
                <span className="pu-exam-grading-sem-title">{s.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}