import { useLayoutEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "./Breadcrumbs";
import TableOfContents from "./TableOfContents";
import { getSubjectArticle } from "../../data/subjectArticles";
import {
  BLOG_BASE_URL,
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

const forceScrollTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

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

const buildSubjectSeoKeywords = (semesterData, subjectData, courseCode) => {
  const normalizedCode = normalizeCourseCode(courseCode);
  const compactCode = compactCourseCode(normalizedCode);

  const keywords = [
    "Pokhara University",
    "BE Computer Engineering",
    `semester ${semesterData.semester}`,
    subjectData.name,
    `${subjectData.name} notes`,
    `${subjectData.name} semester ${semesterData.semester}`,
  ];

  if (normalizedCode) {
    keywords.push(
      normalizedCode,
      compactCode,
      `${subjectData.name} ${normalizedCode}`,
      `${normalizedCode} notes`,
      `${compactCode} notes`,
      `${normalizedCode} Pokhara University`,
    );
  }

  return [...new Set(keywords.filter(Boolean))];
};

const stripUnitHours = (title = "") => String(title || "").replace(/\s*\([^)]*\)\s*$/g, "").trim();

const buildSyllabusUnitSeoKeywords = (article, semesterData) => {
  const syllabusSection = (article.sections || []).find((section) => section.id === "syllabus-overview");
  const units = syllabusSection?.units || [];
  const keywords = [];

  units.forEach((unit, index) => {
    const unitNumber = index + 1;
    const unitLabelWithHours = formatUnitTitle(unit.title, unitNumber);
    const unitLabel = stripUnitHours(unitLabelWithHours);
    const unitTopic = unitLabel.replace(/^Unit\s*\d+\s*:\s*/i, "").trim();

    keywords.push(
      unitLabelWithHours,
      unitLabel,
      `${unitLabel} PU notes`,
      `${unitLabel} Pokhara University notes`,
      `${unitLabel} semester ${semesterData.semester}`,
      `${unitTopic} PU notes`,
      `${unitTopic} semester ${semesterData.semester} notes`,
      `${unitTopic} chapter notes`,
    );
  });

  return [...new Set(keywords.filter(Boolean))];
};

const BlogSubject = () => {
  const { semesterId, subjectSlug } = useParams();
  const semesterNumber = Number(semesterId);
  const result = getSubjectBySlug(semesterNumber, subjectSlug || "");
  const semesterData = result?.semester || null;
  const subjectData = result?.subject || null;

  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  useLayoutEffect(() => {
    forceScrollTop();
    const frame = window.requestAnimationFrame(forceScrollTop);
    return () => window.cancelAnimationFrame(frame);
  }, [semesterNumber, subjectSlug]);

  if (!semesterData || !subjectData) {
    return (
      <div className="landing blog-page">
        <SiteNav />
        <section className="blog-hero">
          <div className="blog-shell">
            <h1 className="blog-title">Subject not found</h1>
            <p className="blog-subtitle">The requested subject is not available in this semester.</p>
            <Link className="blog-btn" to="/blog" onClick={forceScrollTop}>
              Back to Blog
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const storedArticle = getSubjectArticle(semesterData.semester, subjectData.slug);
  const article = storedArticle || buildFallbackSubjectArticle(semesterData, subjectData);

  const subjectCourseCode = normalizeCourseCode(subjectData.courseCode);
  const subjectLabel = subjectCourseCode
    ? `${subjectData.name} (${subjectCourseCode})`
    : subjectData.name;
  const rawDescription = article.description || buildSubjectDescription(semesterData, subjectData);
  const description = enrichDescriptionWithCourseCode(rawDescription, subjectCourseCode);
  const title = `${subjectLabel} — Semester ${semesterData.semester} | StudyMate`;
  const canonicalPath = `/blog/semester/${semesterData.semester}/${subjectData.slug}`;
  const canonical = `${BLOG_BASE_URL}${canonicalPath}`;
  const updatedDate = formatUpdatedDate(article.updatedAt || BLOG_LAST_UPDATED);
  const neighborInfo = getSubjectNeighbors(semesterData.semester, subjectData.slug);
  const seoKeywords = [
    ...buildSubjectSeoKeywords(semesterData, subjectData, subjectCourseCode),
    ...buildSyllabusUnitSeoKeywords(article, semesterData),
  ];

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
        item: `${BLOG_BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Semester ${semesterData.semester}`,
        item: `${BLOG_BASE_URL}${semesterData.urlPath}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: subjectLabel,
        item: canonical,
      },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonical,
    dateModified: article.updatedAt || BLOG_LAST_UPDATED,
    datePublished: article.updatedAt || BLOG_LAST_UPDATED,
    inLanguage: "en-US",
    about: [
      {
        "@type": "CollegeOrUniversity",
        name: "Pokhara University",
      },
      {
        "@type": "Course",
        name: subjectLabel,
        ...(subjectCourseCode ? { courseCode: subjectCourseCode } : {}),
      },
    ],
    author: {
      "@type": "Organization",
      name: "StudyMate",
    },
    publisher: {
      "@id": `${BLOG_BASE_URL}/#organization`,
    },
    articleSection: tocItems.map((item) => item.text),
    keywords: seoKeywords,
  };

  return (
    <div className="landing blog-page">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={seoKeywords.join(", ")} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="StudyMate" />
        <meta property="og:image" content={`${BLOG_BASE_URL}/logo-512.png`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${BLOG_BASE_URL}/logo-512.png`} />

        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
      </Helmet>

      <SiteNav />

      <section className="blog-hero subject-hero">
        <div className="blog-shell">
          <Breadcrumbs items={breadcrumbItems} onNavigate={forceScrollTop} />

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
              <Link to="/dashboard" className="blog-btn subject-cta-btn" onClick={forceScrollTop}>
                Open Dashboard
                <ArrowRight className="subject-nav-icon" aria-hidden="true" />
              </Link>
            </section>

            <nav className="subject-nav" aria-label="Subject navigation">
              <Link
                className={`blog-btn subject-nav-btn ${
                  !neighborInfo.previous ? "blog-btn-muted disabled-link" : ""
                }`}
                to={neighborInfo.previous ? neighborInfo.previous.urlPath : "#"}
                onClick={
                  neighborInfo.previous ? forceScrollTop : (event) => event.preventDefault()
                }
              >
                <ArrowLeft className="subject-nav-icon" aria-hidden="true" />
                Previous Subject
              </Link>

              <Link
                className="blog-btn subject-nav-btn subject-nav-center"
                to={semesterData.urlPath}
                onClick={forceScrollTop}
              >
                <BookOpen className="subject-nav-icon" aria-hidden="true" />
                Back to Semester
              </Link>

              <Link
                className={`blog-btn subject-nav-btn ${
                  !neighborInfo.next ? "blog-btn-muted disabled-link" : ""
                }`}
                to={neighborInfo.next ? neighborInfo.next.urlPath : "#"}
                onClick={neighborInfo.next ? forceScrollTop : (event) => event.preventDefault()}
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
