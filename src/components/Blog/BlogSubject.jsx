'use client'
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "./Breadcrumbs";
import TableOfContents from "./TableOfContents";
import { getSubjectArticle } from "../../data/subjectArticles";
import {
  BLOG_LAST_UPDATED,
  buildImportantTopics,
  buildLearningOutcomes,
  buildPracticeQuestions,
  buildSubjectDescription,
  buildSubjectIntro,
  buildSyllabusOverview,
  formatUpdatedDate,
  getSubjectBySlug,
  getSubjectNeighbors,
} from "../../lib/blogCurriculum";
import "./Blog.css";

const buildFallbackSubjectArticle = (semesterData, subjectData) => ({
  title: subjectData.name,
  description: buildSubjectDescription(semesterData, subjectData),
  updatedAt: BLOG_LAST_UPDATED,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      level: 2,
      content: buildSubjectIntro(semesterData, subjectData),
    },
    {
      id: "what-you-will-learn",
      title: "What you will learn",
      level: 2,
      bullets: buildLearningOutcomes(semesterData, subjectData),
    },
    {
      id: "syllabus-overview",
      title: "Syllabus Overview",
      level: 2,
      bullets: buildSyllabusOverview(subjectData),
    },
    {
      id: "important-topics",
      title: "Important Topics",
      level: 2,
      bullets: buildImportantTopics(subjectData),
    },
    {
      id: "practice-questions",
      title: "Practice Questions",
      level: 2,
      numbered: buildPracticeQuestions(semesterData, subjectData),
    },
  ],
});

const renderHeading = (id, title, level = 2) => {
  const Tag = level === 3 ? "h3" : "h2";
  const className = level === 3 ? "subject-subheading" : "subject-heading";

  return (
    <Tag id={id} className={className}>
      <a href={`#${id}`} className="subject-heading-link" aria-label={`Link to ${title}`}>
        <span>{title}</span>
        <span className="subject-anchor-mark" aria-hidden="true">#</span>
      </a>
    </Tag>
  );
};

const renderParagraphs = (items = [], keyPrefix) =>
  items.map((paragraph, index) => <p key={`${keyPrefix}-p-${index}`}>{paragraph}</p>);

const renderBullets = (items = [], keyPrefix) =>
  items.length ? (
    <ol className="subject-bullet-list">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-b-${index}`}>{item}</li>
      ))}
    </ol>
  ) : null;

const renderNumbered = (items = [], keyPrefix) =>
  items.length ? (
    <ol>
      {items.map((item, index) => (
        <li key={`${keyPrefix}-n-${index}`}>{item}</li>
      ))}
    </ol>
  ) : null;

const formatUnitTitle = (title = "", unitNumber) => {
  const cleanedTitle = title.replace(/^unit\s*[ivxlcdm0-9]+\s*[:.-]?\s*/i, "").trim();
  return `Unit ${unitNumber}: ${cleanedTitle || title}`;
};

const normalizeCourseCode = (courseCode = "") => String(courseCode || "").trim().toUpperCase();

const compactCourseCode = (courseCode = "") => normalizeCourseCode(courseCode).replace(/\s+/g, "");

const enrichDescriptionWithCourseCode = (baseDescription, courseCode) => {
  const description = String(baseDescription || "").trim();
  const normalizedCode = normalizeCourseCode(courseCode);

  if (!description || !normalizedCode) {
    return description;
  }

  const compactDescription = description.toUpperCase().replace(/\s+/g, "");
  if (compactDescription.includes(compactCourseCode(normalizedCode))) {
    return description;
  }

  return `${description} Course code: ${normalizedCode}.`;
};

const renderSyllabusSubpoints = (items = [], keyPrefix, unitNumber) =>
  items.length ? (
    <ol className="subject-subpoint-list">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-sp-${index}`}>
          <span className="subject-subpoint-index">{`${unitNumber}.${index + 1}`}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  ) : null;

const BlogSubject = ({ semesterId, subjectSlug }) => {
  const semesterNumber = Number(semesterId);
  const result = getSubjectBySlug(semesterNumber, subjectSlug || "");

  if (!result?.semester || !result?.subject) {
    return (
      <div className="landing blog-page">
        <SiteNav />
        <section className="blog-hero">
          <div className="blog-shell">
            <h1 className="blog-title">Subject not found</h1>
            <p className="blog-subtitle">The requested subject is not available in this semester.</p>
            <Link className="blog-btn" href="/blog">
              Back to Blog
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return <BlogSubjectContent semesterData={result.semester} subjectData={result.subject} />;
};

const BlogSubjectContent = ({ semesterData, subjectData }) => {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const storedArticle = getSubjectArticle(semesterData.semester, subjectData.slug);
  const article = storedArticle || buildFallbackSubjectArticle(semesterData, subjectData);

  const subjectCourseCode = normalizeCourseCode(subjectData.courseCode);
  const subjectLabel = subjectCourseCode
    ? `${subjectData.name} (${subjectCourseCode})`
    : subjectData.name;
  const rawDescription = article.description || buildSubjectDescription(semesterData, subjectData);
  const description = enrichDescriptionWithCourseCode(rawDescription, subjectCourseCode);
  const updatedDate = formatUpdatedDate(article.updatedAt || BLOG_LAST_UPDATED);
  const neighborInfo = getSubjectNeighbors(semesterData.semester, subjectData.slug);

  const tocItems = useMemo(() => {
    const items = [];

    article.sections.forEach((section, sectionIndex) => {
      const sectionNumber = sectionIndex + 1;

      if (section.level === 2) {
        items.push({
          id: section.id,
          text: `${sectionNumber}. ${section.title}`,
          level: 2,
        });
      }

      const isSyllabusOverview = section.id === "syllabus-overview";

      (section.units || []).forEach((unit, unitIndex) => {
        const unitNumber = unitIndex + 1;
        const unitLabel = isSyllabusOverview
          ? formatUnitTitle(unit.title, unitNumber)
          : `${sectionNumber}.${unitNumber} ${unit.title}`;

        items.push({
          id: unit.id,
          text: unitLabel,
          level: 3,
        });
      });
    });

    return items;
  }, [article.sections]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: `Semester ${semesterData.semester}`, to: semesterData.urlPath },
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
            {subjectCourseCode ? ` • ${subjectCourseCode}` : ""}
          </div>
          <h1 className="blog-title">
            {article.title}
            {subjectCourseCode ? ` (${subjectCourseCode})` : ""}
          </h1>
          <p className="blog-subtitle">{description}</p>

          <div className="subject-meta-row">
            <span>Semester {semesterData.semester}</span>
            {subjectCourseCode ? <span>Course Code: {subjectCourseCode}</span> : null}
            <span>Updated: {updatedDate}</span>
            <span>Pokhara University BE Computer Engineering</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell subject-layout">
          <article className="blog-card subject-article">
            <div className="toc-mobile">
              <button
                type="button"
                className="toc-mobile-toggle"
                onClick={() => setMobileTocOpen((value) => !value)}
                aria-expanded={mobileTocOpen}
                aria-controls="subject-mobile-toc"
              >
                {mobileTocOpen ? "Hide Table of Contents" : "Show Table of Contents"}
              </button>
              {mobileTocOpen ? (
                <div className="toc-card" id="subject-mobile-toc">
                  <TableOfContents items={tocItems} />
                </div>
              ) : null}
            </div>

            {article.sections.map((section, sectionIndex) => {
              const sectionNumber = sectionIndex + 1;

              return (
                <section key={section.id}>
                  {renderHeading(section.id, `${sectionNumber}. ${section.title}`, 2)}

                  {renderParagraphs(section.content || [], section.id)}
                  {renderBullets(section.bullets || [], section.id)}
                  {renderNumbered(section.numbered || [], section.id)}

                  {(section.units || []).map((unit, unitIndex) => {
                    const isSyllabusOverview = section.id === "syllabus-overview";
                    const unitNumber = unitIndex + 1;
                    const unitHeading = isSyllabusOverview
                      ? formatUnitTitle(unit.title, unitNumber)
                      : `${sectionNumber}.${unitNumber} ${unit.title}`;

                    return (
                      <div key={unit.id} className="subject-unit">
                        {renderHeading(unit.id, unitHeading, 3)}
                        {renderParagraphs(unit.content || [], unit.id)}
                        {isSyllabusOverview
                          ? renderSyllabusSubpoints(unit.bullets || [], unit.id, unitNumber)
                          : renderBullets(unit.bullets || [], unit.id)}
                        {renderNumbered(unit.numbered || [], unit.id)}
                      </div>
                    );
                  })}
                </section>
              );
            })}

            <section className="subject-cta">
              {renderHeading("dashboard-cta", "Get Notes in StudyMate Dashboard", 2)}
              <p>Notes are organized inside the dashboard.</p>
              <Link href="/dashboard" className="blog-btn subject-cta-btn">
                Open Dashboard
                <ArrowRight className="subject-nav-icon" aria-hidden="true" />
              </Link>
            </section>

            <nav className="subject-nav" aria-label="Subject navigation">
              <Link
                className={`blog-btn subject-nav-btn ${
                  !neighborInfo.previous ? "blog-btn-muted disabled-link" : ""
                }`}
                href={neighborInfo.previous ? neighborInfo.previous.urlPath : "#"}
              >
                <ArrowLeft className="subject-nav-icon" aria-hidden="true" />
                Previous Subject
              </Link>

              <Link
                className="blog-btn subject-nav-btn subject-nav-center"
                href={semesterData.urlPath}
              >
                <BookOpen className="subject-nav-icon" aria-hidden="true" />
                Back to Semester
              </Link>

              <Link
                className={`blog-btn subject-nav-btn ${
                  !neighborInfo.next ? "blog-btn-muted disabled-link" : ""
                }`}
                href={neighborInfo.next ? neighborInfo.next.urlPath : "#"}
              >
                Next Subject
                <ArrowRight className="subject-nav-icon" aria-hidden="true" />
              </Link>
            </nav>
          </article>

          <aside className="toc-sidebar">
            <div className="toc-card">
              <h2>Table of Contents</h2>
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogSubject;
