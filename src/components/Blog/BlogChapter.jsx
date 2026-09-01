'use client'
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, FolderOpen, ListChecks } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "./Breadcrumbs";
import { setJSONLD } from "../../lib/seo";
import { BLOG_BASE_URL, BLOG_LAST_UPDATED, getSubjectBySlug } from "../../lib/blogCurriculum";
import { getSubjectArticle } from "../../data/subjectArticles";
import "./Blog.css";

const BlogChapterContent = ({ semesterData, subjectData, chapter, previousChapter, nextChapter }) => {
  const article = getSubjectArticle(semesterData.semester, subjectData.slug);
  const subjectLabel = subjectData.courseCode
    ? `${subjectData.name} (${subjectData.courseCode})`
    : subjectData.name;

  const topicCount = chapter.bullets.length;

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: `Semester ${semesterData.semester}`, to: semesterData.urlPath },
    { label: subjectLabel, to: subjectData.urlPath },
    { label: `Chapter ${chapter.number}: ${chapter.title}` },
  ];

  useEffect(() => {
    const chapterPath = chapter.absoluteUrl || `/blog/${semesterData.semesterSlug}/${subjectData.slug}/chapter/${chapter.slug}`;
    const topicItems = (chapter.bullets || []).map((text, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: text,
    }));

    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: `${subjectData.name} Chapter ${chapter.number}: ${chapter.title} Notes`,
          description: chapter.description,
          image: `${BLOG_BASE_URL}/logo-512.png`,
          author: { "@id": `${BLOG_BASE_URL}/#author` },
          publisher: { "@id": `${BLOG_BASE_URL}/#organization` },
          mainEntityOfPage: { "@type": "WebPage", "@id": chapterPath },
          datePublished: article?.updatedAt || BLOG_LAST_UPDATED,
          dateModified: article?.updatedAt || BLOG_LAST_UPDATED,
          inLanguage: "en-US",
        },
        {
          "@type": "ItemList",
          name: `${subjectData.name} Chapter ${chapter.number} topics`,
          itemListElement: topicItems,
        },
      ],
    };
    setJSONLD(graph, "json-ld-blog-chapter");
    return () => {};
  }, [chapter, subjectData, semesterData.semesterSlug, article]);

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
            Chapter {chapter.number}: {chapter.title}
            {subjectData.courseCode ? ` (${subjectData.courseCode})` : ""}
          </h1>
          <p className="blog-subtitle">{chapter.description}</p>

          <div className="subject-meta-row">
            <span>Chapter {chapter.number} of {topicCount} topics</span>
            {chapter.hours ? <span>Syllabus Hours: {chapter.hours}</span> : null}
            <span>Pokhara University BE Computer Engineering • Semester {semesterData.semester}</span>
          </div>

          <div className="subject-cta subject-hero-cta">
            <Link
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-btn subject-cta-btn"
            >
              <FolderOpen className="subject-nav-icon" aria-hidden="true" />
              Open in StudyMate Dashboard
            </Link>
            <Link href={subjectData.urlPath} className="blog-btn blog-btn-muted">
              Full {subjectLabel} Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell subject-layout">
          <article className="blog-card subject-article">
            <section className="chapter-topic-section">
              <h2 className="subject-heading">
                <ListChecks className="blog-inline-icon" aria-hidden="true" />
                {subjectData.name} Chapter {chapter.number} Topics
              </h2>
              <p className="chapter-lead">
                Everything you need to study {chapter.title} for Pokhara University BE Computer
                Engineering Semester {semesterData.semester}. Master these topics, then open the
                full notes and previous past papers in the StudyMate dashboard.
              </p>

              {chapter.bullets.length ? (
                <ol className="subject-topic-list">
                  {chapter.bullets.map((topic, index) => (
                    <li key={`${chapter.id}-topic-${index}`}>{topic}</li>
                  ))}
                </ol>
              ) : (
                <p className="chapter-lead">No topic breakdown is stored for this chapter yet.</p>
              )}
            </section>

            <section className="subject-cta">
              <h2 className="subject-heading">Get Chapter {chapter.number} Notes in StudyMate Dashboard</h2>
              <p>
                Open the StudyMate dashboard to browse semester-wise folders, download the full
                {chapter.title} notes, and view previous PU past papers for {subjectData.name}.
              </p>
              <Link href="/dashboard" className="blog-btn subject-cta-btn">
                Open StudyMate Dashboard
                <BookOpen className="subject-nav-icon" aria-hidden="true" />
              </Link>
            </section>

            <nav className="subject-nav" aria-label="Chapter navigation">
              {previousChapter ? (
                <Link className="blog-btn subject-nav-btn" href={previousChapter.urlPath}>
                  <ArrowLeft className="subject-nav-icon" aria-hidden="true" />
                  Ch {previousChapter.number}: {previousChapter.title}
                </Link>
              ) : (
                <span
                  className="blog-btn subject-nav-btn blog-btn-muted disabled-link"
                  aria-disabled="true"
                >
                  Start of {subjectData.name}
                </span>
              )}

              <Link
                className="blog-btn subject-nav-btn subject-nav-center"
                href={subjectData.urlPath}
              >
                <BookOpen className="subject-nav-icon" aria-hidden="true" />
                Full {subjectLabel} Guide
              </Link>

              {nextChapter ? (
                <Link className="blog-btn subject-nav-btn" href={nextChapter.urlPath}>
                  Ch {nextChapter.number}: {nextChapter.title}
                  <ArrowRight className="subject-nav-icon" aria-hidden="true" />
                </Link>
              ) : (
                <span
                  className="blog-btn subject-nav-btn blog-btn-muted disabled-link"
                  aria-disabled="true"
                >
                  End of {subjectData.name}
                </span>
              )}
            </nav>
          </article>

          <aside className="toc-sidebar">
            <div className="toc-card">
              <h2>In This Chapter</h2>
              <ol className="chapter-mini-toc">
                {chapter.bullets.slice(0, 12).map((topic, index) => (
                  <li key={`mini-${index}`}>{topic}</li>
                ))}
              </ol>
              <Link href={subjectData.urlPath} className="blog-btn subject-cta-btn chapter-back-btn">
                Full {subjectData.name} notes
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const BlogChapter = ({ semesterId, subjectSlug, chapter, previousChapter, nextChapter }) => {
  const semesterNumber = Number(semesterId);
  const result = getSubjectBySlug(semesterNumber, subjectSlug || "");

  if (!result?.semester || !result?.subject) {
    return (
      <div className="landing blog-page">
        <SiteNav />
        <section className="blog-hero">
          <div className="blog-shell">
            <h1 className="blog-title">Chapter not found</h1>
            <p className="blog-subtitle">The requested chapter is not available.</p>
            <Link className="blog-btn" href="/blog">
              Back to Blog
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const topicPreview = (chapter.bullets || []).slice(0, 3).join(", ");
  const description =
    `${result.subject.name} Chapter ${chapter.number} — ${chapter.title}: PU Semester ${result.semester.semester} ` +
    `${result.subject.name} notes, syllabus topics (${topicPreview}) and previous past papers in the StudyMate dashboard.`;

  return (
    <BlogChapterContent
      semesterData={result.semester}
      subjectData={result.subject}
      chapter={{ ...chapter, description }}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
    />
  );
};

export default BlogChapter;