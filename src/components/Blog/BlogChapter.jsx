import Link from "next/link";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "./Breadcrumbs";
import ChapterNotesViewer from "./ChapterNotesViewer";
import {
  SCOPE_META,
  getSubjectBySlug,
  scopeHref,
} from "../../lib/blogCurriculum";
import "./Blog.css";

const BlogChapterContent = ({ semesterData, subjectData, chapter, previousChapter, nextChapter, scope = "blog" }) => {
  const subjectLabel = subjectData.courseCode
    ? `${subjectData.name} (${subjectData.courseCode})`
    : subjectData.name;
  const topicCount = chapter.bullets.length;

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: SCOPE_META[scope].label, to: scopeHref(scope) },
    { label: `Semester ${semesterData.semester}`, to: scopeHref(scope, semesterData.semester) },
    { label: subjectLabel, to: scopeHref(scope, semesterData.semester, subjectData.slug) },
    { label: `Chapter ${chapter.number}: ${chapter.title}` },
  ];

  return (
    <div className="landing blog-page chapter-page">
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
          {chapter.bullets?.length ? (
            <ul className="chapter-hero-topics">
              {chapter.bullets.map((topic, index) => (
                <li key={`${chapter.id}-hero-topic-${index}`}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="blog-subtitle">{chapter.description}</p>
          )}

          <div className="subject-meta-row">
            {chapter.hours ? <span>Syllabus Hours: {chapter.hours}</span> : null}
            <span>Pokhara University BE Computer Engineering • Semester {semesterData.semester}</span>
          </div>

          <div className="subject-cta subject-hero-cta">
            <a href="#chapter-notes" className="blog-btn subject-cta-btn">
              Open Chapter {chapter.number} Notes
            </a>
            <Link
              href={scopeHref(scope === "notes" ? "syllabus" : scope, semesterData.semester, subjectData.slug)}
              className="blog-btn subject-cta-btn subject-cta-btn--secondary"
            >
              Full {subjectLabel} Syllabus
            </Link>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell chapter-shell">
          <article className="blog-card subject-article chapter-article">
            <section className="chapter-topic-section">
              <h2 className="subject-heading">
                <GraduationCap className="blog-inline-icon" aria-hidden="true" />
                {subjectData.name} Chapter {chapter.number} Topics
              </h2>
              <p className="chapter-lead">
                Everything you need to study {chapter.title} for Pokhara University BE Computer
                Engineering Semester {semesterData.semester}. Master these topics, then read the
                full notes below.
              </p>

              {topicCount ? (
                <ol className="subject-topic-list">
                  {chapter.bullets.map((topic, index) => (
                    <li key={`${chapter.id}-topic-${index}`}>{topic}</li>
                  ))}
                </ol>
              ) : (
                <p className="chapter-lead">No topic breakdown is stored for this chapter yet.</p>
              )}
            </section>

            <section className="chapter-notes-section">
              <ChapterNotesViewer
                semesterId={semesterData.semester}
                subjectSlug={subjectData.slug}
                subjectName={subjectLabel}
                chapterNumber={chapter.number}
              />
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

const BlogChapter = ({ semesterId, subjectSlug, chapter, previousChapter, nextChapter, scope = "blog" }) => {
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
            <Link className="blog-btn" href={scopeHref(scope)}>
              Back to {SCOPE_META[scope].label}
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
      scope={scope}
    />
  );
};

export default BlogChapter;