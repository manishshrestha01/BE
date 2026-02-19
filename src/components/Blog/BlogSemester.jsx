import { useLayoutEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";

import Footer from "../Footer";
import SiteNav from "../SiteNav";
import {
  BLOG_BASE_URL,
  buildSemesterDescription,
  getSemesterByNumber,
} from "../../lib/blogCurriculum";
import "./Blog.css";

const forceScrollTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const BlogSemester = () => {
  const { semesterId } = useParams();
  const semesterNumber = Number(semesterId);
  const semesterData = getSemesterByNumber(semesterNumber);

  useLayoutEffect(() => {
    forceScrollTop();
    const frame = window.requestAnimationFrame(forceScrollTop);
    return () => window.cancelAnimationFrame(frame);
  }, [semesterNumber]);

  if (!semesterData) {
    return (
      <div className="landing blog-page">
        <SiteNav />
        <section className="blog-hero">
          <div className="blog-shell">
            <h1 className="blog-title">Semester not found</h1>
            <p className="blog-subtitle">
              The selected semester does not exist in the PU 2022 curriculum dataset.
            </p>
            <Link className="blog-btn" to="/blog" onClick={forceScrollTop}>
              Back to Blog
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const title = `Semester ${semesterData.semester} Guides - Pokhara University BE Computer Engineering | StudyMate`;
  const description = buildSemesterDescription(semesterData);
  const canonical = `${BLOG_BASE_URL}${semesterData.urlPath}`;

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
        item: canonical,
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonical,
    isPartOf: { "@id": `${BLOG_BASE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: semesterData.subjects.map((subject, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name,
        url: `${BLOG_BASE_URL}${subject.urlPath}`,
      })),
    },
  };

  const previousSemester = semesterData.semester > 1 ? semesterData.semester - 1 : null;
  const nextSemester = semesterData.semester < 8 ? semesterData.semester + 1 : null;

  return (
    <div className="landing blog-page">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="StudyMate" />
        <meta property="og:image" content={`${BLOG_BASE_URL}/logo-512.png`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${BLOG_BASE_URL}/logo-512.png`} />

        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>

      <SiteNav />

      <section className="blog-hero semester-hero">
        <div className="blog-shell">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" onClick={forceScrollTop}>Home</Link>
            <span>/</span>
            <Link to="/blog" onClick={forceScrollTop}>Blog</Link>
            <span>/</span>
            <span>Semester {semesterData.semester}</span>
          </nav>

          <div className="hero-badge blog-badge">
            <GraduationCap className="blog-inline-icon" aria-hidden="true" />
            Semester {semesterData.semester} • PU BE Computer Engineering
          </div>
          <h1 className="blog-title">Semester {semesterData.semester} Subject Guides</h1>
          <p className="blog-subtitle">{semesterData.overview}</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-shell semester-content-wrap">
          <section className="blog-card">
            <h2 className="blog-section-title semester-section-title">Table of Subjects</h2>
            <div className="subjects-table-wrap">
              <table className="subjects-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Subject</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterData.subjects.map((subject) => (
                    <tr key={subject.slug}>
                      <td>{subject.courseCode || "N/A"}</td>
                      <td>{subject.name}</td>
                      <td>{subject.credit ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="blog-card">
            <h2 className="blog-section-title semester-section-title">Subjects</h2>
            <div className="subject-grid">
              {semesterData.subjects.map((subject) => (
                <article key={subject.slug} className="topic-item-card">
                  <h3>{subject.name}</h3>
                  <p>
                    Semester {semesterData.semester} tutorial with syllabus, concept breakdown,
                    and practice set.
                  </p>
                  <Link to={subject.urlPath} className="blog-btn" onClick={forceScrollTop}>
                    Read Article
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <div className="semester-internal-links">
            <Link to="/blog" className="blog-btn semester-nav-btn" onClick={forceScrollTop}>
              <ArrowLeft className="semester-nav-icon" aria-hidden="true" />
              Back to all semesters
            </Link>
            {previousSemester ? (
              <Link
                to={`/blog/semester/${previousSemester}`}
                className="blog-btn semester-nav-btn"
                onClick={forceScrollTop}
              >
                <ArrowLeft className="semester-nav-icon" aria-hidden="true" />
                Semester {previousSemester} guides
              </Link>
            ) : null}
            {nextSemester ? (
              <Link
                to={`/blog/semester/${nextSemester}`}
                className="blog-btn semester-nav-btn"
                onClick={forceScrollTop}
              >
                Semester {nextSemester} guides
                <ArrowRight className="semester-nav-icon" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogSemester;
