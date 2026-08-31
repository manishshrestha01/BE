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
            <span className="hero-highlight">PU Computer Engineering Guides</span>
          </h1>
          <p className="hero-subtitle blog-subtitle">
            Semester-first learning layout, then subject-wise tutorials with syllabus, key
            topics, concept explanations, and practice questions.
          </p>
          <div className="hero-cta blog-hero-cta">
            <a href="#semester-guides" className="btn-primary">
              Learn More
              <span className="btn-arrow">→</span>
            </a>
            <a href="#semester-guides" className="btn-secondary">
              Learn More
            </a>
          </div>

          <div className="hero-visual blog-hero-visual">
            <div className="visual-card card-1">
              <span className="card-icon" aria-hidden="true">📁</span>
              <span className="card-text">Semester Guides</span>
            </div>
            <div className="visual-card card-2">
              <span className="card-icon" aria-hidden="true">📝</span>
              <span className="card-text">Exam Focused</span>
            </div>
            <div className="visual-card card-3">
              <span className="card-icon" aria-hidden="true">💡</span>
              <span className="card-text">Subject Tutorials</span>
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
            <span className="stat-label">Subject Guides</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">500+</span>
            <span className="stat-label">Study Resources</span>
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
              <p>Every guide is structured around the PU exam pattern with key topics, concept explanations, and practice questions.</p>
            </div>
            <div className="blog-why-card">
              <span className="blog-why-icon" aria-hidden="true">📐</span>
              <h3>Syllabus-Aligned</h3>
              <p>Content follows the official Pokhara University BE Computer Engineering curriculum — topic by topic, unit by unit.</p>
            </div>
            <div className="blog-why-card">
              <span className="blog-why-icon" aria-hidden="true">🔄</span>
              <h3>Always Updated</h3>
              <p>New subject guides and tutorials are added regularly to keep up with curriculum changes and student feedback.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section" id="semester-guides">
        <div className="blog-shell">
          <div className="section-header blog-section-header">
            <span className="section-badge">Guides</span>
            <h2 className="section-title">Semester Guides</h2>
            <p className="section-subtitle">
              Start from your current semester and open subject-wise article pages.
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
