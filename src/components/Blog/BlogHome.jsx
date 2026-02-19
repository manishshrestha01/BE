import { useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import { applyMetadata, applyOrganizationGraph, buildMetadata, clearSeoScripts } from "../../lib/blogSeo";
import {
  BLOG_BASE_URL,
  BLOG_CURRICULUM,
  buildSemesterDescription,
} from "../../lib/blogCurriculum";
import { setJSONLD, setMeta } from "../../lib/seo";
import "./Blog.css";

const forceScrollTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const pageTitle = "StudyMate Blog - PU Computer Engineering Guides";
const pageDescription =
  "StudyMate Blog offers semester-wise Pokhara University BE Computer Engineering tutorials, subject guides, and exam-focused learning paths.";
const canonical = `${BLOG_BASE_URL}/blog`;

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BLOG_BASE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: canonical,
    },
  ],
};

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  description: pageDescription,
  url: canonical,
  isPartOf: { "@id": `${BLOG_BASE_URL}/#website` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: BLOG_CURRICULUM.map((semester, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Semester ${semester.semester}`,
      url: `${BLOG_BASE_URL}${semester.urlPath}`,
      description: buildSemesterDescription(semester),
    })),
  },
};

const BlogHome = () => {
  useLayoutEffect(() => {
    forceScrollTop();
    const frame = window.requestAnimationFrame(forceScrollTop);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const metadata = buildMetadata({
      title: pageTitle,
      description: pageDescription,
      canonicalPath: "/blog",
      type: "website",
    });

    applyMetadata(metadata);
    applyOrganizationGraph();
    setMeta({
      name: "keywords",
      content:
        "StudyMate blog, Pokhara University BE Computer Engineering, semester guides, subject tutorials, PU notes",
    });
    setJSONLD(breadcrumbLd, "json-ld-blog-home-breadcrumb");
    setJSONLD(collectionLd, "json-ld-blog-home-collection");

    return () => {
      clearSeoScripts(["json-ld-blog-home-breadcrumb", "json-ld-blog-home-collection"]);
    };
  }, []);

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
            <Link to="/dashboard" className="btn-primary" onClick={forceScrollTop}>
              Start Learning
              <span className="btn-arrow">→</span>
            </Link>
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
                  to={semester.urlPath}
                  className="blog-btn semester-card-btn"
                  onClick={forceScrollTop}
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
