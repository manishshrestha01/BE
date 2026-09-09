import Link from "next/link";
import { Archive, BookOpenCheck } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import { QUESTION_PAPER_VARIANTS } from "../../lib/oldQuestionConfig";
import "../Blog/Blog.css";
import "./QuestionPaper.css";

const QuestionPaperHome = () => {
  return (
    <div className="landing blog-page oldq-page">
      <SiteNav />

      <section className="blog-hero subject-hero">
        <div className="blog-shell">
          <div className="hero-badge blog-badge">
            Pokhara University BE Computer Engineering
          </div>
          <h1 className="blog-title">PU Question Papers</h1>
          <p className="blog-subtitle">
            Pokhara University board, final and old question papers for every computer
            engineering subject — split by syllabus. Papers are organised by exam year so you
            can jump straight to the exact term you are preparing for. Every paper opens
            directly in your browser: no login, no download.
          </p>

          <div className="subject-meta-row">
            <span>New &amp; old syllabus collections</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell">
          <h2 className="subject-heading">Choose a paper collection</h2>
          <p className="chapter-lead">
            The current program&apos;s board &amp; final papers are in the new-syllabus
            collection; the previous course&apos;s archive is in the old-syllabus collection.
          </p>

          <div className="qp-type-grid">
            {QUESTION_PAPER_VARIANTS.map((variant) => (
              <article key={variant.slug} className="topic-item-card">
                <h3>
                  {variant.slug === "new-syllabus" ? (
                    <BookOpenCheck className="blog-inline-icon" aria-hidden="true" />
                  ) : (
                    <Archive className="blog-inline-icon" aria-hidden="true" />
                  )}{" "}
                  {variant.label}
                </h3>
                <p>{variant.tagline}.</p>
                <Link href={`/question-paper/${variant.slug}`} className="blog-btn">
                  Browse {variant.shortLabel} Papers
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

export default QuestionPaperHome;