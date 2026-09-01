import Link from "next/link";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import {
  getSemesterByNumber,
} from "../../lib/blogCurriculum";
import "./Blog.css";

const BlogSemester = ({ semesterId }) => {
  const semesterNumber = Number(semesterId);
  const semesterData = getSemesterByNumber(semesterNumber);

  if (!semesterData) {
    return (
      <div className="landing blog-page">
        <SiteNav />
        <section className="blog-hero">
          <div className="blog-shell">
            <h1 className="blog-title">Semester not found</h1>
            <p className="blog-subtitle">
              The selected semester does not exist in the PU 2022 curriculum dataset.
            </p>
            <Link className="blog-btn" href="/blog">
              Back to Blog
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const previousSemester = semesterData.semester > 1 ? semesterData.semester - 1 : null;
  const nextSemester = semesterData.semester < 8 ? semesterData.semester + 1 : null;

  return (
    <div className="landing blog-page">
      <SiteNav />

      <section className="blog-hero semester-hero">
        <div className="blog-shell">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>Semester {semesterData.semester}</span>
          </nav>

          <div className="hero-badge blog-badge">
            <GraduationCap className="blog-inline-icon" aria-hidden="true" />
            Semester {semesterData.semester} • PU BE Computer Engineering
          </div>
          <h1 className="blog-title">Semester {semesterData.semester} Syllabus</h1>
          <p className="blog-subtitle">{semesterData.overview}</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell semester-content-wrap">
          <section className="blog-card">
            <h2 className="blog-section-title semester-section-title">Table of Subjects</h2>
            <div className="subjects-table-wrap">
              <table className="subjects-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Subject</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterData.subjects.map((subject) => (
                    <tr key={subject.slug}>
                      <td>{subject.courseCode || "N/A"}</td>
                      <td>{subject.name}</td>
                      <td>{subject.credit ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="blog-card">
            <h2 className="blog-section-title semester-section-title">Subjects</h2>
            <div className="subject-grid">
              {semesterData.subjects.map((subject) => (
                <article key={subject.slug} className="topic-item-card">
                  <h3>{subject.name}</h3>
                  <p>
                    Semester {semesterData.semester} tutorial with syllabus, concept breakdown,
                    and practice set.
                  </p>
                  <Link href={subject.urlPath} className="blog-btn">
                    Read Article
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <div className="semester-internal-links">
            <Link href="/blog" className="blog-btn semester-nav-btn">
              <ArrowLeft className="semester-nav-icon" aria-hidden="true" />
              Back to all semesters
            </Link>
            {previousSemester ? (
              <Link
                href={`/blog/semester/${previousSemester}`}
                className="blog-btn semester-nav-btn"
              >
                <ArrowLeft className="semester-nav-icon" aria-hidden="true" />
                Semester {previousSemester} guides
              </Link>
            ) : null}
            {nextSemester ? (
              <Link
                href={`/blog/semester/${nextSemester}`}
                className="blog-btn semester-nav-btn"
              >
                Semester {nextSemester} guides
                <ArrowRight className="semester-nav-icon" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogSemester;
