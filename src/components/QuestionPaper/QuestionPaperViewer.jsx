'use client'
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  GraduationCap,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import Breadcrumbs from "../Blog/Breadcrumbs";
import PaperCard from "./PaperCard";
import { buildCards, loadQuestionPaperFiles } from "./questionPaperFiles";
import {
  classifyPapersToTerms,
  QUESTION_PAPER_HOME,
  QUESTION_PAPER_VARIANTS,
  slugToTerm,
  subjectPaperHref,
  termToSlug,
  variantHref,
  yearPaperHref,
} from "../../lib/oldQuestionConfig";
import "../Blog/Blog.css";
import "./QuestionPaper.css";

const EMPTY_SOURCES = { folders: [], filter: null, other: [], combined: {} };

const QuestionPaperViewer = ({ semesterData, subject, variant, sources = {}, yearSlug }) => {
  const currentVariant = QUESTION_PAPER_VARIANTS.find((item) => item.slug === variant) || QUESTION_PAPER_VARIANTS[0];
  const otherVariant = QUESTION_PAPER_VARIANTS.find((item) => item.slug !== currentVariant.slug) || null;

  const currentSources = sources[currentVariant.configKey] || EMPTY_SOURCES;
  const otherSources = otherVariant ? sources[otherVariant.configKey] || EMPTY_SOURCES : EMPTY_SOURCES;

  const [currentFiles, setCurrentFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [loading, setLoading] = useState(() => currentSources.folders.length > 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentSources.folders.length) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const [current, other] = await Promise.all([
          loadQuestionPaperFiles(currentSources.folders, currentSources.filter),
          otherSources.folders.length
            ? loadQuestionPaperFiles(otherSources.folders, otherSources.filter)
            : Promise.resolve([]),
        ]);
        if (!cancelled) {
          setCurrentFiles(current);
          setOtherFiles(other);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load question papers");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources]);

  const isNewSyllabus = currentVariant.configKey === "board";

  const current = useMemo(
    () => classifyPapersToTerms(currentFiles, currentSources, isNewSyllabus, semesterData.semester),
    [currentFiles, currentSources, isNewSyllabus, semesterData.semester]
  );
  const other = useMemo(
    () => classifyPapersToTerms(otherFiles, otherSources, false, semesterData.semester),
    [otherFiles, otherSources, semesterData.semester]
  );

  const otherYears = useMemo(
    () => new Set(other.entries.map((entry) => termToSlug(entry.term))),
    [other.entries]
  );

  const parsedYear = yearSlug ? slugToTerm(yearSlug) : null;
  const activeEntry = parsedYear
    ? current.entries.find((entry) => termToSlug(entry.term) === yearSlug) || null
    : null;

  const subjectLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name;
  const subjectHref = subjectPaperHref(currentVariant.slug, subject.slug);

  const toggleHref = (targetVariant) => {
    if (!targetVariant) return subjectHref;
    if (yearSlug && otherYears.has(yearSlug)) {
      return yearPaperHref(targetVariant.slug, subject.slug, yearSlug);
    }
    return subjectPaperHref(targetVariant.slug, subject.slug);
  };

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Question Papers", to: QUESTION_PAPER_HOME },
    { label: currentVariant.shortLabel, to: variantHref(currentVariant.slug) },
    { label: subjectLabel, to: subjectHref },
    ...(parsedYear ? [{ label: parsedYear.label }] : []),
  ];

  const variantNav = (
    <div className="oldq-variant-nav" role="group" aria-label="Question paper collection">
      {QUESTION_PAPER_VARIANTS.map((item) => (
        <Link
          key={item.slug}
          href={item.slug === currentVariant.slug ? subjectHref : toggleHref(item)}
          aria-current={item.slug === currentVariant.slug ? "page" : undefined}
          className={`oldq-variant-chip ${item.slug === currentVariant.slug ? "oldq-variant-chip--active" : ""}`}
        >
          {item.slug === currentVariant.slug ? item.shortLabel : `See ${item.shortLabel}`}
        </Link>
      ))}
    </div>
  );

  const yearFilter = (
    <div className="oldq-year-filter">
      <h3 className="subject-heading oldq-filter-heading">
        <SlidersHorizontal size={17} aria-hidden="true" />
        Filter papers by exam year
      </h3>
      <div className="oldq-filter-chips">
        {current.entries.map((entry) => {
          const active = parsedYear && termToSlug(entry.term) === yearSlug;
          return (
            <Link
              key={entry.term.label}
              href={yearPaperHref(currentVariant.slug, subject.slug, termToSlug(entry.term))}
              aria-current={active ? "page" : undefined}
              className={`oldq-term-chip ${active ? "oldq-term-chip--active" : ""}`}
            >
              {entry.term.label}
              <span className="oldq-filter-count">{entry.files.length}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const renderEmpty = () => (
    <p className="chapter-notes-empty">
      No {currentVariant.shortLabel.toLowerCase()} papers for {subject.name} are archived yet.
      {otherVariant ? (
        <>
          {" "}
          Try the{" "}
          <Link className="oldq-inline-link" href={toggleHref(otherVariant)}>
            {otherVariant.shortLabel.toLowerCase()} collection
          </Link>
          .
        </>
      ) : null}
    </p>
  );

  return (
    <div className="landing blog-page oldq-page">
      <SiteNav />

      <section className="blog-hero subject-hero">
        <div className="blog-shell">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="hero-badge blog-badge">
            <GraduationCap className="blog-inline-icon" aria-hidden="true" />
            Semester {semesterData.semester} • {subjectLabel}
          </div>
          <h1 className="blog-title">
            {parsedYear ? (
              <>
                {subject.name} {parsedYear.label} Question Paper
                {subject.courseCode ? ` (${subject.courseCode})` : ""}
              </>
            ) : (
              <>
                {subject.name} Question Papers
                {subject.courseCode ? ` (${subject.courseCode})` : ""}
              </>
            )}
          </h1>
          <p className="blog-subtitle">
            {parsedYear
              ? `The ${parsedYear.label} ${currentVariant.shortLabel.toLowerCase()} paper for ${subjectLabel} — read it directly in your browser, no login needed, no downloads.`
              : `${currentVariant.tagline} for ${subjectLabel}. Pick an exam year to read that paper directly in your browser — no login needed, no downloads.`}
          </p>

          {variantNav}

          <div className="subject-meta-row">
            <span>Pokhara University BE Computer Engineering • Semester {semesterData.semester}</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell oldq-shell">
          <article className="blog-card oldq-papers">
            {error && (
              <p className="chapter-notes-error">
                <strong>Question papers unavailable:</strong> {error}
              </p>
            )}

            {!error && loading && (
              <div className="chapter-notes-loading">
                <Loader2 className="spin" size={18} aria-hidden="true" />
                Loading question papers…
              </div>
            )}

            {!error && !loading && !parsedYear && current.entries.length === 0 && renderEmpty()}

            {!error && !loading && parsedYear && !activeEntry && (
              <>
                <p className="chapter-notes-empty">
                  {parsedYear
                    ? `No ${parsedYear.label} paper for ${subject.name} is archived yet.`
                    : `No paper found for ${yearSlug}.`}
                </p>
                {variantNav && (
                  <div className="oldq-year-filter">
                    <Link className="blog-btn" href={subjectHref}>
                      Browse all {subject.name} {currentVariant.shortLabel} papers
                    </Link>
                  </div>
                )}
              </>
            )}

            {!error && !loading && !parsedYear && current.entries.length > 0 && (
              <>
                <h2 className="subject-heading">Question Papers by Exam Year</h2>
                <p className="chapter-lead">
                  {current.entries.length} exam {"year"}
                  {current.entries.length === 1 ? "" : "s"} archived for {subjectLabel}. Open a
                  year to read the {currentVariant.shortLabel.toLowerCase()} paper in your browser.
                </p>

                <div className="oldq-year-grid">
                  {current.entries.map((entry) => {
                    const cards = buildCards(entry.files);
                    return (
                      <Link
                        key={entry.term.label}
                        href={yearPaperHref(currentVariant.slug, subject.slug, termToSlug(entry.term))}
                        className="oldq-year-card"
                      >
                        <span className="oldq-year-card-label">{entry.term.label}</span>
                        <span className="oldq-year-card-meta">
                          <FileText size={13} aria-hidden="true" />
                          {entry.files.length} file{entry.files.length === 1 ? "" : "s"}
                          {" · "}
                          {cards.length} paper{cards.length === 1 ? "" : "s"}
                        </span>
                        <span className="blog-btn oldq-year-card-btn">Open paper →</span>
                      </Link>
                    );
                  })}
                </div>

                {!isNewSyllabus && current.others.length > 0 && (
                  <div className="oldq-other">
                    <h3 className="subject-heading oldq-other-title">
                      Other papers ({current.others.length})
                    </h3>
                    <p className="chapter-lead">
                      Undated papers from the old-syllabus collection, kept here for reference.
                      Read them right here — no download.
                    </p>
                    <div className="chapter-notes-embeds">
                      {buildCards(current.others).map((card) => (
                        <PaperCard key={card.name} card={card} />
                      ))}
                    </div>
                  </div>
                )}

                {currentFiles.length > 0 && (
                  <p className="oldq-total-note">
                    {currentFiles.length} question paper file
                    {currentFiles.length === 1 ? "" : "s"} in this subject&apos;s {currentVariant.shortLabel.toLowerCase()} archive.
                  </p>
                )}
              </>
            )}

            {!error && !loading && parsedYear && activeEntry && (
              <>
                <h2 className="subject-heading">
                  {activeEntry.term.label} Question Paper
                </h2>
                <p className="chapter-lead">
                  {activeEntry.files.length} file
                  {activeEntry.files.length === 1 ? "" : "s"} for the{" "}
                  {activeEntry.term.label} paper of {subjectLabel}.
                </p>

                <div className="oldq-term-result" role="region" aria-label={`${activeEntry.term.label} question paper`}>
                  {buildCards(activeEntry.files).length > 0 ? (
                    <div className="chapter-notes-embeds">
                      {buildCards(activeEntry.files).map((card) => (
                        <PaperCard key={card.name} card={card} />
                      ))}
                    </div>
                  ) : (
                    <p className="chapter-notes-empty">
                      No previewable files for the {activeEntry.term.label} paper of {subjectLabel}.
                    </p>
                  )}
                </div>

                {yearFilter}

                {!isNewSyllabus && current.others.length > 0 && (
                  <div className="oldq-other">
                    <h3 className="subject-heading oldq-other-title">
                      Other papers ({current.others.length})
                    </h3>
                    <p className="chapter-lead">
                      Undated papers from the old-syllabus collection, kept here for reference.
                      Read them right here — no download.
                    </p>
                    <div className="chapter-notes-embeds">
                      {buildCards(current.others).map((card) => (
                        <PaperCard key={card.name} card={card} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!error && !loading && (
              <div className="subject-nav" aria-label="More resources">
                <Link className="blog-btn subject-nav-btn" href={subjectHref}>
                  <ArrowLeft className="subject-nav-icon" aria-hidden="true" />
                  All {subject.name} Question Papers
                </Link>

                {otherVariant ? (
                  <Link className="blog-btn subject-nav-btn" href={toggleHref(otherVariant)}>
                    {otherVariant.shortLabel} papers
                    <ArrowRight className="subject-nav-icon" aria-hidden="true" />
                  </Link>
                ) : null}

                <Link
                  className="blog-btn subject-nav-btn"
                  href={`/blog/semester/${semesterData.semester}/${subject.slug}`}
                >
                  {subject.name} Syllabus &amp; Notes
                  <ArrowRight className="subject-nav-icon" aria-hidden="true" />
                </Link>
              </div>
            )}
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuestionPaperViewer;