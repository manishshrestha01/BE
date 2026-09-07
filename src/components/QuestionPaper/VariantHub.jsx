import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  FileText,
  GraduationCap,
  Layers,
} from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "../Blog/Breadcrumbs";
import { getVariantBySlug, getVariantSubjects, subjectPaperHref } from "../../lib/oldQuestionConfig";
import { getSemesterByNumber } from "../../lib/blogCurriculum";
import "../Blog/Blog.css";
import "./QuestionPaper.css";

const VariantHub = ({ variant }) => {
  const variantMeta = getVariantBySlug(variant);
  const subjects = getVariantSubjects(variant);
  const isNew = variant === "new-syllabus";

  const bySemester = subjects.reduce((acc, item) => {
    const key = item.semester.semester;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key).push(item);
    return acc;
  }, new Map());

  const sortedSemesters = [...bySemester.keys()].sort((a, b) => a - b);
  const otherSlug = isNew ? "old-syllabus" : "new-syllabus";
  const otherMeta = getVariantBySlug(otherSlug);

  return (
    <div className="landing blog-page oldq-page">
      <SiteNav />

      <section className="blog-hero subject-hero qp-hero">
        <div className="blog-shell">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Question Papers", to: "/question-paper" },
              { label: variantMeta.shortLabel },
            ]}
          />

          <div className="hero-badge blog-badge">
            <GraduationCap className="blog-inline-icon" aria-hidden="true" />
            Pokhara University BE Computer Engineering
          </div>

          <div className="qp-hero-icon" aria-hidden="true">
            {isNew ? <BookOpenCheck size={34} /> : <Archive size={34} />}
          </div>
          <h1 className="blog-title qp-hero-title">{variantMeta.label}</h1>
          <p className="blog-subtitle qp-hero-sub">{variantMeta.tagline}.</p>

          <div className="oldq-variant-nav qp-hero-nav">
            <span className="oldq-variant-chip oldq-variant-chip--active">
              {isNew ? <BookOpenCheck size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />}
              {variantMeta.shortLabel}
            </span>
            <Link className="oldq-variant-chip" href={`/question-paper/${otherSlug}`}>
              {isNew ? <Archive size={16} aria-hidden="true" /> : <BookOpenCheck size={16} aria-hidden="true" />}
              See {otherMeta.shortLabel}
            </Link>
          </div>

          <div className="qp-hero-stats">
            <div className="qp-hero-stat">
              <span className="qp-hero-stat-value">{sortedSemesters.length || "—"}</span>
              <span className="qp-hero-stat-label">Semesters</span>
            </div>
            <div className="qp-hero-stat">
              <span className="qp-hero-stat-value">{subjects.length}</span>
              <span className="qp-hero-stat-label">Subjects</span>
            </div>
            <div className="qp-hero-stat">
              <span className="qp-hero-stat-label qp-hero-stat-free">Free •</span>
              <span className="qp-hero-stat-label">No download</span>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell">
          {sortedSemesters.length === 0 && (
            <p className="chapter-notes-empty">
              No archived {variantMeta.shortLabel.toLowerCase()} papers yet. Check back soon.
            </p>
          )}

          <nav className="qp-semester-jump" aria-label="Jump to semester">
            {sortedSemesters.map((n) => (
              <a key={n} href={`#qp-sem-${n}`} className="qp-semester-jump-chip">
                Sem {n}
              </a>
            ))}
          </nav>

          {sortedSemesters.map((semesterNumber) => {
            const semester = getSemesterByNumber(semesterNumber);
            const items = bySemester.get(semesterNumber);
            return (
              <section
                key={semesterNumber}
                id={`qp-sem-${semesterNumber}`}
                className="qp-semester-block"
              >
                <div className="qp-semester-head">
                  <span className="qp-semester-badge" aria-hidden="true">
                    {semesterNumber}
                  </span>
                  <div className="qp-semester-head-text">
                    <h2 className="qp-semester-title">Semester {semesterNumber}</h2>
                    <p className="qp-semester-meta">
                      {semester?.subjectCount ?? items.length} subjects
                    </p>
                  </div>
                  <span className="qp-semester-count">{items.length} archived</span>
                </div>

                <div className="subject-grid qp-subject-grid">
                  {items.map(({ subject }) => (
                    <article key={subject.slug} className="topic-item-card qp-subject-card">
                      <span className="qp-subject-course">
                        {subject.courseCode || `Sem ${semesterNumber}`}
                      </span>
                      <h3>{subject.name}</h3>
                      <p>
                        {isNew ? "Board & final" : "Previous"} {semesterNumber}
                        {isNew ? "" : ""} question papers, organised by exam year.
                      </p>
                      <Link
                        href={subjectPaperHref(variant, subject.slug)}
                        className="blog-btn qp-subject-btn"
                      >
                        <FileText className="blog-inline-icon" aria-hidden="true" />
                        Open Papers
                        <ArrowRight className="qp-arrow" aria-hidden="true" />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="subject-nav qp-bottom-nav" aria-label="More resources">
            <Link className="blog-btn subject-nav-btn" href={`/question-paper/${otherSlug}`}>
              <ArrowLeft className="subject-nav-icon" aria-hidden="true" />
              {otherMeta.shortLabel} collection
            </Link>
            <Link className="blog-btn subject-nav-btn" href="/question-paper">
              <Layers className="subject-nav-icon" aria-hidden="true" />
              All question papers
            </Link>
            <Link className="blog-btn subject-nav-btn" href="/blog">
              Syllabus &amp; Notes
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VariantHub;