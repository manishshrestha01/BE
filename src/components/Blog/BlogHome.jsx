import Link from "next/link";
import { BookOpen } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import { BLOG_CURRICULUM, scopeHref } from "../../lib/blogCurriculum";
import "./Blog.css";

const SCOPE_COPY = {
  blog: {
    heroTitle: "StudyMate Blog",
    heroHighlight: "PU Computer Engineering Syllabus & Notes",
    heroSubtitle:
      "Full Pokhara University BE Computer Engineering syllabus and subject-by-subject notes, important topics, and practice questions — all readable right on the page.",
    browseLabel: "Browse Syllabus",
    statLabel: "Notes & Past Papers",
    sectionBadge: "Syllabus",
    sectionTitle: "Semester-wise Syllabus",
    sectionSubtitle:
      "Pick your semester and open the subject syllabus and notes to start studying.",
    buttonLabel: "Browse Semester",
  },
  syllabus: {
    heroTitle: "PU Complete Syllabus",
    heroHighlight: "Pokhara University BE Computer Engineering",
    heroSubtitle:
      "The full Pokhara University BE Computer Engineering syllabus, semester by semester. Pick a subject to read its unit-wise syllabus, important topics, and question patterns.",
    browseLabel: "Browse Syllabus",
    statLabel: "Subjects Covered",
    sectionBadge: "Syllabus",
    sectionTitle: "Semester-wise Syllabus",
    sectionSubtitle:
      "Pick your semester and open the subject syllabus to start preparing.",
    buttonLabel: "Open Syllabus",
  },
  notes: {
    heroTitle: "PU Notes",
    heroHighlight: "Pokhara University BE Computer Engineering",
    heroSubtitle:
      "Free Pokhara University BE Computer Engineering notes, readable right on the page. Pick a semester and subject to open its chapter notes without downloading anything.",
    browseLabel: "Browse Notes",
    statLabel: "Notes & Past Papers",
    sectionBadge: "Notes",
    sectionTitle: "Semester-wise Notes",
    sectionSubtitle:
      "Pick your semester and open the subject notes to start studying.",
    buttonLabel: "Open Notes",
  },
};

const BlogHome = ({ scope = "blog" }) => {
  const copy = SCOPE_COPY[scope] || SCOPE_COPY.blog;
  return (
    <div className="landing blog-page blog-home-page">
      <SiteNav />

      <section className="blog-hero">
        <div className="blog-shell">
          <div className="hero-badge blog-badge">
            <span aria-hidden="true">🎓</span>
            Pokhara University • BE Computer Engineering
          </div>
          <h1 className="hero-title blog-title">
            {copy.heroTitle}
            <br />
            <span className="hero-highlight">{copy.heroHighlight}</span>
          </h1>
          <p className="hero-subtitle blog-subtitle">{copy.heroSubtitle}</p>
          <div className="hero-cta blog-hero-cta">
            <a href="#semester-syllabus" className="btn-primary">
              {copy.browseLabel}
              <span className="btn-arrow">→</span>
            </a>
          </div>

          <div className="hero-visual blog-hero-visual">
            <div className="visual-card card-1">
              <span className="card-icon" aria-hidden="true">📁</span>
              <span className="card-text">Semester Notes</span>
            </div>
            <div className="visual-card card-2">
              <span className="card-icon" aria-hidden="true">📝</span>
              <span className="card-text">Exam Focused</span>
            </div>
            <div className="visual-card card-3">
              <span className="card-icon" aria-hidden="true">💡</span>
              <span className="card-text">Past Papers</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats blog-stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">8</span>
            <span className="stat-label">Semesters</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Subject Syllabi</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">500+</span>
            <span className="stat-label">{copy.statLabel}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24 / 7</span>
            <span className="stat-label">Access Available</span>
          </div>
        </div>
      </section>

      <section className="blog-section blog-why-section">
        <div className="blog-shell">
          <div className="blog-why-grid">
            <div className="blog-why-card">
              <span className="blog-why-icon" aria-hidden="true">🎯</span>
              <h3>Exam-Focused Content</h3>
              <p>Every subject page is built around the PU exam pattern with the full syllabus, key topics, concept explanations, and practice questions.</p>
            </div>
            <div className="blog-why-card">
              <span className="blog-why-icon" aria-hidden="true">📐</span>
              <h3>Syllabus-Aligned</h3>
              <p>Content follows the official Pokhara University BE Computer Engineering curriculum — topic by topic, unit by unit, semester by semester.</p>
            </div>
            <div className="blog-why-card">
              <span className="blog-why-icon" aria-hidden="true">🔄</span>
              <h3>Read Syllabus Online</h3>
              <p>Every note opens directly on the page as a clean, scrollable reader — no downloads required.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section" id="semester-syllabus">
        <div className="blog-shell">
          <div className="section-header blog-section-header">
            <span className="section-badge">{copy.sectionBadge}</span>
            <h2 className="section-title">{copy.sectionTitle}</h2>
            <p className="section-subtitle">{copy.sectionSubtitle}</p>
          </div>
          <div className="semester-grid">
            {BLOG_CURRICULUM.map((semester) => (
              <article key={semester.semester} className="blog-card semester-card">
                <h3>
                  Semester <span className="semester-number">{semester.semester}</span>
                </h3>
                <span className="semester-card-meta">
                  <BookOpen className="blog-inline-icon" aria-hidden="true" />
                  {semester.subjectCount} Subjects
                </span>
                <Link
                  href={scopeHref(scope, semester.semester)}
                  className="blog-btn semester-card-btn"
                >
                  {copy.buttonLabel}
                  <span className="semester-btn-arrow">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogHome;
