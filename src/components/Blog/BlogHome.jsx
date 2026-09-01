import Link from "next/link";
import { BookOpen } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import { BLOG_CURRICULUM } from "../../lib/blogCurriculum";
import "./Blog.css";

const BlogHome = () => {
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
            StudyMate Blog
            <br />
            <span className="hero-highlight">PU Computer Engineering Syllabus &amp; Notes</span>
          </h1>
          <p className="hero-subtitle blog-subtitle">
            Full Pokhara University BE Computer Engineering syllabus, subject-by-subject notes,
            important topics, and practice questions. Open the StudyMate dashboard to access every
            note and previous past paper in one place.
          </p>
          <div className="hero-cta blog-hero-cta">
            <Link href="/dashboard" className="btn-primary">
              Open StudyMate Dashboard
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#semester-syllabus" className="btn-secondary">
              Browse Syllabus
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
            <span className="stat-label">Notes &amp; Past Papers</span>
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
              <h3>Notes &amp; Past Papers in One Dashboard</h3>
              <p>Use the StudyMate dashboard to open every note and previous past paper directly — all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section" id="semester-syllabus">
        <div className="blog-shell">
          <div className="section-header blog-section-header">
            <span className="section-badge">Syllabus</span>
            <h2 className="section-title">Semester-wise Syllabus</h2>
            <p className="section-subtitle">
              Pick your semester, open the subject syllabus, notes, and past papers — or jump
              straight into the StudyMate dashboard.
            </p>
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
                  href={semester.urlPath}
                  className="blog-btn semester-card-btn"
                >
                  Browse Semester
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
