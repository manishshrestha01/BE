import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "./Breadcrumbs";
import {
  buildSubjectDescription,
  SCOPE_META,
  scopeHref,
} from "../../lib/blogCurriculum";
import "./Blog.css";

const NotesSubject = ({ semesterData, subjectData, chapters }) => {
  const scopeMeta = SCOPE_META.notes;
  const subjectLabel = subjectData.courseCode
    ? `${subjectData.name} (${subjectData.courseCode})`
    : subjectData.name;
  const description = buildSubjectDescription(semesterData, subjectData);

  const previousSubject = getScopeNeighbor(semesterData, subjectData.slug, -1);
  const nextSubject = getScopeNeighbor(semesterData, subjectData.slug, 1);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: scopeMeta.label, to: scopeHref("notes") },
    { label: `Semester ${semesterData.semester}`, to: scopeHref("notes", semesterData.semester) },
    { label: subjectLabel },
  ];

  return (
    <div className="landing blog-page">
      <SiteNav />

      <section className="blog-hero subject-hero">
        <div className="blog-shell">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="hero-badge blog-badge">
            <GraduationCap className="blog-inline-icon" aria-hidden="true" />
            Semester {semesterData.semester} • {subjectData.name}
            {subjectData.courseCode ? ` • ${subjectData.courseCode}` : ""}
          </div>
          <h1 className="blog-title">
            {subjectData.name} Notes
            {subjectData.courseCode ? ` (${subjectData.courseCode})` : ""}
          </h1>
          <p className="blog-subtitle">{description}</p>

          <div className="subject-meta-row">
            <span>Semester {semesterData.semester}</span>
            {subjectData.courseCode ? <span>Course Code: {subjectData.courseCode}</span> : null}
            <span>Pokhara University BE Computer Engineering</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell">
          <article className="blog-card subject-article">
            <h2 className="subject-heading">
              <BookOpen className="blog-inline-icon" aria-hidden="true" />
              Chapter-wise {subjectData.name} Notes
            </h2>
            <p className="chapter-lead">
              Read every {subjectData.name} chapter note right on this page — no downloads, no
              login. Pick a chapter to open its notes below.
            </p>

            {chapters.length ? (
              <div className="subject-grid">
                {chapters.map((chapter) => (
                  <article key={chapter.id} className="topic-item-card">
                    <h3>
                      Chapter {chapter.number}: {chapter.title}
                    </h3>
                    {chapter.hours ? (
                      <p className="notes-chapter-hours">Syllabus Hours: {chapter.hours}</p>
                    ) : null}
                    <p>
                      {chapter.bullets.slice(0, 4).join(" • ")}
                      {chapter.bullets.length > 4 ? "…" : ""}
                    </p>
                    <Link href={chapter.urlPath} className="blog-btn">
                      Open Chapter {chapter.number} Notes
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="chapter-notes-empty">
                Chapter notes aren&apos;t published for this subject on the web yet — find them in
                the StudyMate app.
              </p>
            )}

            <nav className="subject-nav" aria-label="Subject navigation">
              <Link
                className={`blog-btn subject-nav-btn ${
                  !previousSubject ? "blog-btn-muted disabled-link" : ""
                }`}
                href={
                  previousSubject
                    ? scopeHref("notes", semesterData.semester, previousSubject.slug)
                    : "#"
                }
              >
                <ArrowLeft className="subject-nav-icon" aria-hidden="true" />
                Previous Subject
              </Link>

              <Link
                className="blog-btn subject-nav-btn subject-nav-center"
                href={scopeHref("notes", semesterData.semester)}
              >
                <BookOpen className="subject-nav-icon" aria-hidden="true" />
                Back to Semester
              </Link>

              <Link
                className={`blog-btn subject-nav-btn ${
                  !nextSubject ? "blog-btn-muted disabled-link" : ""
                }`}
                href={nextSubject ? scopeHref("notes", semesterData.semester, nextSubject.slug) : "#"}
              >
                Next Subject
                <ArrowRight className="subject-nav-icon" aria-hidden="true" />
              </Link>
            </nav>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const getScopeNeighbor = (semesterData, subjectSlug, offset) => {
  const index = semesterData.subjects.findIndex((item) => item.slug === subjectSlug);
  const neighbor = semesterData.subjects[index + offset];
  return index < 0 ? null : neighbor || null;
};

export default NotesSubject;