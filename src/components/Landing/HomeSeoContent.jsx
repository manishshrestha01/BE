import Link from 'next/link'
import { BLOG_CURRICULUM } from '../../lib/blogCurriculum'
import { COLLEGES } from '../../lib/colleges'

const makeCollegeSlug = (label) => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const HomeSeoContent = () => {
  return (
    <div className="home-seo-content">
      <section className="home-seo-section home-seo-intro">
        <h2>Pokhara University BE Computer Engineering Notes — Semester by Semester</h2>
        <p>
          StudyMate is a free study archive for Pokhara University (PU) BE Computer Engineering
          students. It organizes the complete 2022 PU curriculum into eight semesters, with
          subject notes, chapter-wise study material, previous question papers, and a readable
          syllabus breakdown for every course. Everything here is structured around what your
          college actually teaches — semester order, course codes, credit hours, and the topics
          your professors test in the end-semester examination.
        </p>
        <p>
          The site is built for two kinds of reading. In the <Link href="/blog">Study Materials</Link>{' '}
          section each subject opens as a full article with an introduction, unit-wise syllabus
          overview, important topics, and practice questions, all readable directly on the page
          without a download. In the <Link href="/notes">Notes</Link> and{' '}
          <Link href="/question-paper">Question Papers</Link> sections you download the actual
          note files and past exam papers, arranged by semester and subject. A{' '}
          <Link href="/dashboard">personal dashboard</Link> keeps recently studied files in one
          place for signed-in users.
        </p>
        <p>
          Use the semester links below to jump straight to the notes for your current semester,
          or browse the affiliated college pages to find resources aligned to your campus. This
          guide is maintained by a Pokhara University engineering student and updated against the
          current syllabus, so the course codes and unit weights match the 2022 curriculum in use
          at PU-affiliated colleges.
        </p>
      </section>

      <section className="home-seo-section">
        <h2>How the notes are organized</h2>
        <p>
          The BE Computer Engineering degree at Pokhara University runs for four years across
          eight semesters. Early semesters build the mathematics and electronics foundation;
          middle semesters introduce core computer science; final semesters cover advanced and
          application areas. The table below lists every semester with the number of subjects,
          and each subject page has its own course code, credit, and chapter list.
        </p>
        <ul className="home-seo-semester-list">
          {BLOG_CURRICULUM.map((semester) => (
            <li key={semester.semester}>
              <Link href={`/blog/semester/${semester.semester}`}>
                Semester {semester.semester}
              </Link>{' '}
              — {semester.subjectCount} subjects
            </li>
          ))}
        </ul>
      </section>

      <section className="home-seo-section">
        <h2>What you can study here</h2>
        <ul>
          <li>
            <strong>Semester-wise notes and PDFs</strong> for every subject of the 2022 PU
            curriculum, downloadable and readable chapter by chapter.
          </li>
          <li>
            <strong>Readable syllabus guides</strong> with unit titles, marks-relevant topics,
            and practice questions for exam preparation.
          </li>
          <li>
            <strong>Previous years’ question papers</strong> for both the new and old syllabus,
            organized by subject and year.
          </li>
          <li>
            <strong>College-aligned pages</strong> for PU-affiliated engineering colleges, so
            you can find material matched to the batch and campus where you study.
          </li>
          <li>
            A <strong>personal dashboard</strong> with bookmarks, recent files, and custom
            notes for signed-in users — optional and completely free.
          </li>
        </ul>
      </section>

      <section className="home-seo-section">
        <h2>Affiliated colleges</h2>
        <p>
          StudyMate groups material for BE Computer Engineering programmes run under Pokhara
          University. The college pages below link the same curriculum to each campus, its
          location, and its program structure, so students at any affiliated college can find
          the right semester and subject quickly.
        </p>
        <ul className="home-seo-college-list">
          {COLLEGES.map((college) => (
            <li key={college.value}>
              <Link href={`/college/${makeCollegeSlug(college.label)}`}>{college.label}</Link>
              {college.location ? <span> — {college.location}</span> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default HomeSeoContent