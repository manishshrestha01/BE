#!/usr/bin/env node
/* eslint-env node */
/* global process */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import vm from "node:vm";

import {
  BLOG_BASE_URL,
  BLOG_CURRICULUM,
  buildSemesterDescription,
  buildSubjectDescription,
  getAllBlogPaths,
} from "../src/lib/blogCurriculum.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const START_MARKER = "  <!-- Blog pages (auto-generated) -->";
const END_MARKER = "  <!-- /Blog pages (auto-generated) -->";
const INDEXNOW_BLOG_EVENT_ENDPOINT =
  process.env.INDEXNOW_BLOG_EVENT_ENDPOINT || `${BLOG_BASE_URL}/api/indexnow/blog-event`;

const ORG_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BLOG_BASE_URL}/#organization`,
      name: "StudyMate",
      url: `${BLOG_BASE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${BLOG_BASE_URL}/logo-512.png`,
      },
      description: "PU notes for BE Computer Engineering students.",
    },
    {
      "@type": "WebSite",
      "@id": `${BLOG_BASE_URL}/#website`,
      url: `${BLOG_BASE_URL}/`,
      name: "StudyMate",
      publisher: {
        "@id": `${BLOG_BASE_URL}/#organization`,
      },
      inLanguage: "en-US",
    },
  ],
};

const SUBJECT_ARTICLES_PATH = path.join(ROOT_DIR, "src/data/subjectArticles.ts");

function buildBreadcrumbList(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function toAbsolute(pathname) {
  return `${BLOG_BASE_URL}${pathname}`;
}

function toHtmlPath(urlPath) {
  const cleaned = urlPath.replace(/^\//, "");
  return path.join(PUBLIC_DIR, cleaned, "index.html");
}

function makeMetaImage() {
  return toAbsolute("/logo-512.png");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderArticleToHtml(article) {
  if (!article) return "";

  const parts = [];

  for (const section of article.sections) {
    const tag = `h${Math.min(Math.max(section.level, 2), 6)}`;
    parts.push(
      `<${tag} id="${escapeHtml(section.id || "")}">${escapeHtml(section.title)}</${tag}>`,
    );

    if (section.content) {
      for (const para of section.content) {
        if (para.trim()) parts.push(`<p>${escapeHtml(para)}</p>`);
      }
    }

    if (section.bullets) {
      parts.push("<ul>");
      for (const bullet of section.bullets) {
        if (bullet.trim()) parts.push(`<li>${escapeHtml(bullet)}</li>`);
      }
      parts.push("</ul>");
    }

    if (section.numbered) {
      parts.push("<ol>");
      for (const item of section.numbered) {
        if (item.trim()) parts.push(`<li>${escapeHtml(item)}</li>`);
      }
      parts.push("</ol>");
    }

    if (section.units) {
      for (const unit of section.units) {
        const unitTag = `h${Math.min(Math.max(section.level + 1, 3), 6)}`;
        parts.push(
          `<${unitTag} id="${escapeHtml(unit.id || "")}">${escapeHtml(unit.title)}</${unitTag}>`,
        );

        if (unit.content) {
          for (const para of unit.content) {
            if (para.trim()) parts.push(`<p>${escapeHtml(para)}</p>`);
          }
        }

        if (unit.bullets) {
          parts.push("<ul>");
          for (const bullet of unit.bullets) {
            if (bullet.trim()) parts.push(`<li>${escapeHtml(bullet)}</li>`);
          }
          parts.push("</ul>");
        }

        if (unit.numbered) {
          parts.push("<ol>");
          for (const item of unit.numbered) {
            if (item.trim()) parts.push(`<li>${escapeHtml(item)}</li>`);
          }
          parts.push("</ol>");
        }
      }
    }
  }

  return parts.join("\n");
}

function normalizeCourseCode(courseCode = "") {
  return String(courseCode || "").trim().toUpperCase();
}

function makeUnitKeywords() {
  return [];
}

function makeSubjectKeywords(semester, subject, courseCode) {
  const key = subject.name.toLowerCase();
  const keywords = [
    subject.name,
    `${subject.name} notes`,
    `${subject.name} syllabus`,
    `${subject.name} study guide`,
    `${subject.name} important topics`,
    `${subject.name} practice questions`,
    `${subject.name} pdf notes`,
    `${subject.name} question bank`,
    `${subject.name} past questions`,
    `${subject.name} notes Pokhara University`,
    `${subject.name} PU syllabus`,
    `${subject.name} Pokhara University syllabus`,
    `${subject.name} PoU`,
    `PU ${subject.name}`,
    `Pokhara University ${subject.name}`,
    `${subject.name} BE Computer semester ${semester.semester}`,
    `semester ${semester.semester} ${key} notes`,
    `BE Computer Engineering semester ${semester.semester}`,
    `Pokhara University semester ${semester.semester} study material`,
  ];

  if (courseCode) {
    keywords.push(`${courseCode} notes`);
    keywords.push(`${subject.name} ${courseCode}`);
  }

  return [...new Set(keywords.filter(Boolean))];
}

function makeSubjectFaqs(semester, subject, courseCode) {
  const track = detectSubjectTrack(subject.name);
  const faqs = [
    {
      question: `What is ${subject.name} in Pokhara University BE Computer Engineering?`,
      answer: `${subject.name}${courseCode ? ` (course code ${courseCode})` : ""} is a core subject in Pokhara University BE Computer Engineering Semester ${semester.semester}. It covers ${getTrackFocusLabel(track)} and is designed to build foundational knowledge required for advanced engineering courses.`,
    },
    {
      question: `How many credits is ${subject.name} in PU BE Computer Engineering?`,
      answer: `${subject.name} carries ${subject.credit || 3} credits in the Pokhara University BE Computer Engineering Semester ${semester.semester} curriculum${courseCode ? ` (course code ${courseCode})` : ""}.`,
    },
    {
      question: `Where can I find ${subject.name} notes for PU BE Computer Engineering?`,
      answer: `Download free ${subject.name} notes and study materials for Pokhara University BE Computer Engineering Semester ${semester.semester} at <a href="/api/notes-subject?semester=${semester.semester}&subject=${subject.slug}">StudyMate notes page</a>. The platform provides PDF notes, syllabus breakdown, important topics, and practice questions — all free for PU BE Computer Engineering students.`,
    },
    {
      question: `What topics are covered in ${subject.name} Semester ${semester.semester}?`,
      answer: `${subject.name} in PU BE Computer Engineering Semester ${semester.semester} covers core concepts including fundamental principles, analytical methods, practical applications, and exam-oriented problem solving techniques. The complete syllabus is available on StudyMate.`,
    },
  ];
  return faqs;
}

function makeSubjectCourseSchema(semester, subject, courseCode) {
  const credits = subject.credit || 3;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${subject.name}${courseCode ? ` (${courseCode})` : ""}`,
    description: `Pokhara University BE Computer Engineering Semester ${semester.semester} — ${subject.name}${courseCode ? `, course code ${courseCode}` : ""}, ${credits} credits.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: "Pokhara University",
      sameAs: "https://pokharauniversity.edu.np",
      address: { "@type": "PostalAddress", addressCountry: "NP" },
    },
    educationalCredentialAwarded: "BE Computer Engineering",
    courseCode: courseCode || undefined,
    numberOfCredits: credits,
    inLanguage: "en-US",
    timeRequired: "P4M",
  };
}

function makeSubjectFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/<[^>]*>/g, "") },
    })),
  };
}

function makeSpeakableSchema(url) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Study Guide",
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".prerendered-content h1", ".prerendered-content h2"] },
  };
}

function buildSubjectFaqHtml(faqs) {
  if (!faqs || !faqs.length) return "";
  return `<section id="faq">
<h2>Frequently Asked Questions about ${escapeHtml(faqs[0].question.replace(/^What is /, "").replace(/\?.*$/, ""))}</h2>
${faqs.map((f, i) => `<div itemscope="" itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">${escapeHtml(f.question)}</h3>
<div itemscope="" itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">${f.answer}</p>
</div>
</div>`).join("\n")}
</section>`;
}

function buildSubjectNotesHtml(semesterNum, subjectSlug, subjectName) {
  const apiUrl = `/api/notes-subject?semester=${semesterNum}&subject=${subjectSlug}`;
  return `<section id="subject-notes">
<h2>${escapeHtml(subjectName)} Notes &amp; Study Materials</h2>
<p>Access free <strong>${escapeHtml(subjectName)} notes</strong> for Pokhara University BE Computer Engineering Semester ${semesterNum}. These study materials include PDF notes, important questions, and syllabus breakdown curated for PU students.</p>
<p><a href="${escapeHtml(apiUrl)}" target="_blank" rel="noopener noreferrer">Download ${escapeHtml(subjectName)} Notes</a></p>
<p>For all subjects in this semester, visit the <a href="/blog/semester/${semesterNum}">Semester ${semesterNum} study guide</a>.</p>
</section>`;
}

function buildSubjectTocHtml() {
  return `<nav aria-label="Table of Contents" id="table-of-contents">
<h2>Table of Contents</h2>
<ul>
<li><a href="#introduction">Introduction</a></li>
<li><a href="#what-you-will-learn">What You Will Learn</a></li>
<li><a href="#syllabus-overview">Syllabus Overview</a></li>
<li><a href="#important-topics">Important Topics</a></li>
<li><a href="#practice-questions">Practice Questions</a></li>
<li><a href="#subject-notes">Notes &amp; Study Materials</a></li>
<li><a href="#faq">FAQ</a></li>
</ul>
</nav>`;
}

function detectSubjectTrack(name) {
  const s = name.toLowerCase();
  if (/calculus|algebra|mathematics|numerical|probability|statistics/.test(s)) return "math";
  if (/digital logic|electrical|electronics|microprocessor|embedded|architecture|instrumentation/.test(s)) return "hardware";
  if (/data communication|network|cyber security|cloud|virtualization/.test(s)) return "network";
  if (/machine learning|artificial intelligence|image processing|pattern recognition|data science|analytics/.test(s)) return "intelligence";
  if (/project|internship|research|management|economics|entrepreneurship|professional practice|communication technique/.test(s)) return "professional";
  if (/compiler|database|operating systems|graphics|programming|java|c\+\+|data structure|theory of computation|software engineering/.test(s)) return "software";
  return "general";
}

function getTrackFocusLabel(track) {
  const labels = {
    math: "mathematical modeling and problem solving",
    hardware: "system-level hardware understanding",
    network: "communication stack and infrastructure reasoning",
    intelligence: "data-driven and intelligent decision systems",
    professional: "project execution and professional engineering practice",
    software: "algorithmic and software implementation thinking",
    general: "core engineering reasoning",
  };
  return labels[track] || labels.general;
}

async function loadSubjectArticlesStore() {
  const source = await fs.readFile(SUBJECT_ARTICLES_PATH, "utf8");
  const startMarker = "export const subjectArticles";
  const endMarker = "\n};\n\nexport function getSubjectArticle";

  const startIndex = source.indexOf(startMarker);
  if (startIndex < 0) {
    return {};
  }

  const braceStart = source.indexOf("{", startIndex);
  if (braceStart < 0) {
    return {};
  }

  const endIndex = source.indexOf(endMarker, braceStart);
  if (endIndex < 0) {
    return {};
  }

  const objectLiteral = source.slice(braceStart, endIndex + 2);
  return vm.runInNewContext(`(${objectLiteral})`, {});
}

function pageTemplate({
  title,
  description,
  canonicalPath,
  keywords,
  type = "website",
  jsonLd = [],
  noscriptLinks = [],
  articleHtml = "",
}) {
  const canonical = toAbsolute(canonicalPath);
  const image = makeMetaImage();
  const hasPrerenderedContent = !!articleHtml;

  const jsonLdScripts = [...jsonLd, ORG_GRAPH]
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`,
    )
    .join("\n");

  const noscriptNav = noscriptLinks.length
    ? `<noscript>
    <nav aria-label="Blog links (no-JS)">
      <ul>
        ${noscriptLinks
          .map(
            (item) =>
              `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
          )
          .join("\n        ")}
      </ul>
    </nav>
  </noscript>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#000000">
  <meta name="application-name" content="StudyMate">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="StudyMate">
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png">
  <link rel="apple-touch-icon" sizes="192x192" href="/logo-512.png">
  ${hasPrerenderedContent ? "" : '<style id="spa-hide">body{visibility:hidden!important}</style>'}
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">

  <meta property="og:type" content="${escapeHtml(type)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:site_name" content="StudyMate">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">

  ${jsonLdScripts}
  ${hasPrerenderedContent ? '<style>.prerendered-content h1,.prerendered-content h2,.prerendered-content h3{line-height:1.3}.prerendered-content p,.prerendered-content li{line-height:1.6}.prerendered-content{max-width:800px;margin:0 auto;padding:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#222}.prerendered-content .prerendered-description{font-size:1.1em;color:#555}</style>' : ""}
  <script type="text/javascript" src="/aclib-anti-adblock.js"></script>
  <script type="text/javascript">aclib.runAutoTag({zoneId: 'sp6bdgcx0c'});</script>
</head>
<body>
  ${noscriptNav}
  <div id="root">${hasPrerenderedContent ? `<article class="prerendered-content">${articleHtml}</article>` : ""}</div>
  <script src="/spa-loader.js" defer></script>
</body>
</html>`;
}

function buildSitemapEntry(pathname, changefreq, priority) {
  return `  <url>
    <loc>${toAbsolute(pathname)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function writePage(urlPath, pageConfig) {
  const fullPath = toHtmlPath(urlPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, pageTemplate({ canonicalPath: urlPath, ...pageConfig }), "utf8");
}

async function generateBlogPages() {
  await fs.rm(path.join(PUBLIC_DIR, "blog"), { recursive: true, force: true });
  const subjectArticlesStore = await loadSubjectArticlesStore();

  const blogCollectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: toAbsolute("/blog"),
    name: "StudyMate Blog - PU Computer Engineering Guides",
    description:
      "Semester-wise static tutorial guides for Pokhara University BE Computer Engineering.",
    isPartOf: { "@id": `${BLOG_BASE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: BLOG_CURRICULUM.map((semester, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `Semester ${semester.semester}`,
        url: toAbsolute(semester.urlPath),
      })),
    },
  };

  const blogBreadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: `${BLOG_BASE_URL}/` },
    { name: "Blog", url: `${BLOG_BASE_URL}/blog` },
  ]);

  const blogIndexHtml = `<h1>StudyMate Blog &mdash; PU Computer Engineering Guides</h1>
<p class="prerendered-description">Semester-wise tutorial guides for Pokhara University BE Computer Engineering students. Browse by semester below.</p>
<h2>Semesters</h2>
<ul>
${BLOG_CURRICULUM.map(
  (sem) =>
    `  <li><a href="${escapeHtml(sem.urlPath)}">Semester ${sem.semester} (${sem.subjectCount} subjects)</a></li>`,
).join("\n")}
</ul>`;

  await writePage("/blog", {
    title: "StudyMate Blog - PU Computer Engineering Guides",
    description:
      "Semester-wise static tutorial guides for Pokhara University BE Computer Engineering students.",
    keywords:
      "Pokhara University blog, BE Computer Engineering notes, semester guides, StudyMate blog",
    jsonLd: [blogBreadcrumbLd, blogCollectionLd],
    noscriptLinks: BLOG_CURRICULUM.map((semester) => ({
      href: semester.urlPath,
      label: `Semester ${semester.semester}`,
    })),
    articleHtml: blogIndexHtml,
  });

  for (const semester of BLOG_CURRICULUM) {
    const semesterTitle = `Semester ${semester.semester} Guides - Pokhara University BE Computer Engineering | StudyMate`;
    const semesterDescription = buildSemesterDescription(semester);
    const semesterBreadcrumbLd = buildBreadcrumbList([
      { name: "Home", url: `${BLOG_BASE_URL}/` },
      { name: "Blog", url: `${BLOG_BASE_URL}/blog` },
      {
        name: `Semester ${semester.semester}`,
        url: `${BLOG_BASE_URL}${semester.urlPath}`,
      },
    ]);

    const semesterCollectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: toAbsolute(semester.urlPath),
      name: semesterTitle,
      description: semesterDescription,
      isPartOf: { "@id": `${BLOG_BASE_URL}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: semester.subjects.map((subject, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name,
          url: toAbsolute(subject.urlPath),
        })),
      },
    };

    const semesterOverviewHtml = (semester.overviewParagraphs || [])
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("\n");

    const semesterSubjectListHtml = `<h2>Subjects</h2>
<ul>
${semester.subjects
  .map(
    (subj) =>
      `  <li><a href="${escapeHtml(subj.urlPath)}">${escapeHtml(subj.courseCode ? `${subj.name} (${subj.courseCode})` : subj.name)}</a></li>`,
  )
  .join("\n")}
</ul>`;

    const semesterPageHtml = `<h1>${escapeHtml(semesterTitle)}</h1>
${semesterOverviewHtml}
${semesterSubjectListHtml}`;

    await writePage(semester.urlPath, {
      title: semesterTitle,
      description: semesterDescription,
      keywords: `Pokhara University semester ${semester.semester}, BE Computer Engineering semester ${semester.semester}, StudyMate semester guide`,
      jsonLd: [semesterBreadcrumbLd, semesterCollectionLd],
      noscriptLinks: semester.subjects.map((subject) => ({
        href: subject.urlPath,
        label: subject.name,
      })),
      articleHtml: semesterPageHtml,
    });

    for (const subject of semester.subjects) {
      const subjectCourseCode = normalizeCourseCode(subject.courseCode);
      const subjectLabel = subjectCourseCode
        ? `${subject.name} (${subjectCourseCode})`
        : subject.name;
      const subjectUrl = toAbsolute(subject.urlPath);
      const subjectArticle = subjectArticlesStore?.[String(semester.semester)]?.[subject.slug] || null;
      const subjectDescriptionBare = buildSubjectDescription(semester, subject);
      const subjectTitle = `${subjectLabel} — Notes, Syllabus & Study Guide — PU BE Computer Engineering Semester ${semester.semester} | StudyMate`;
      const subjectDescription = `Master ${subjectLabel} in Pokhara University BE Computer Engineering Semester ${semester.semester}. Download notes, get syllabus breakdown, important topics, practice questions, and exam tips — a complete free study guide.`;
      const subjectKeywords = [
        ...makeSubjectKeywords(semester, subject, subjectCourseCode),
        ...makeUnitKeywords(semester, subjectArticle),
      ];
      const subjectFaqs = makeSubjectFaqs(semester, subject, subjectCourseCode);
      const subjectCourseSchema = makeSubjectCourseSchema(semester, subject, subjectCourseCode);
      const subjectFaqSchema = makeSubjectFaqSchema(subjectFaqs);
      const subjectSpeakableSchema = makeSpeakableSchema(`${BLOG_BASE_URL}${subject.urlPath}`);

      const subjectBreadcrumbLd = buildBreadcrumbList([
        { name: "Home", url: `${BLOG_BASE_URL}/` },
        { name: "Blog", url: `${BLOG_BASE_URL}/blog` },
        {
          name: `Semester ${semester.semester}`,
          url: `${BLOG_BASE_URL}${semester.urlPath}`,
        },
        {
          name: subjectLabel,
          url: `${BLOG_BASE_URL}${subject.urlPath}`,
        },
      ]);

      const subjectArticleLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        mainEntityOfPage: subjectUrl,
        headline: `${subjectLabel} — Semester ${semester.semester} Study Guide`,
        description: subjectDescription,
        inLanguage: "en-US",
        about: [
          { "@type": "CollegeOrUniversity", name: "Pokhara University" },
          {
            "@type": "Course",
            name: `${subjectLabel} (BE Computer Engineering Semester ${semester.semester})`,
          },
        ],
        author: { "@type": "Organization", name: "StudyMate" },
        publisher: { "@id": `${BLOG_BASE_URL}/#organization` },
        keywords: subjectKeywords,
      };

      const articleHtml = subjectArticle
        ? renderArticleToHtml(subjectArticle)
        : "";
      const tocHtml = articleHtml ? buildSubjectTocHtml() : "";
      const notesHtml = buildSubjectNotesHtml(semester.semester, subject.slug, subject.name);
      const faqHtml = articleHtml ? buildSubjectFaqHtml(subjectFaqs) : "";

      const subjectPageHtml = articleHtml
        ? `<h1>${escapeHtml(subjectTitle)}</h1>\n<p class="prerendered-description">${escapeHtml(subjectDescriptionBare)}</p>\n${tocHtml}\n${articleHtml}\n${notesHtml}\n${faqHtml}`
        : notesHtml;

      await writePage(subject.urlPath, {
        title: subjectTitle,
        description: subjectDescription,
        keywords: subjectKeywords.join(", "),
        type: "article",
        jsonLd: [subjectBreadcrumbLd, subjectArticleLd, subjectCourseSchema, subjectFaqSchema, subjectSpeakableSchema],
        noscriptLinks: [
          { href: semester.urlPath, label: `Back to Semester ${semester.semester}` },
          { href: "/blog", label: "Back to Blog" },
        ],
        articleHtml: subjectPageHtml,
      });
    }
  }
}

async function updateSitemap() {
  const oldSitemap = await fs.readFile(SITEMAP_PATH, "utf8");

  const blogEntryLines = [
    START_MARKER,
    buildSitemapEntry("/blog", "weekly", "0.94"),
    ...BLOG_CURRICULUM.map((semester) => buildSitemapEntry(semester.urlPath, "weekly", "0.90")),
    ...BLOG_CURRICULUM.flatMap((semester) =>
      semester.subjects.map((subject) => buildSitemapEntry(subject.urlPath, "monthly", "0.86")),
    ),
    END_MARKER,
  ].join("\n\n");

  const blockRegex = new RegExp(
    `${START_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    "m",
  );

  let nextSitemap;
  if (blockRegex.test(oldSitemap)) {
    nextSitemap = oldSitemap.replace(blockRegex, blogEntryLines);
  } else {
    nextSitemap = oldSitemap.replace("</urlset>", `\n\n${blogEntryLines}\n\n</urlset>`);
  }

  await fs.writeFile(SITEMAP_PATH, nextSitemap, "utf8");
}

function extractBlogUrlsFromSitemap(xml) {
  const locRegex = /<loc>([\s\S]*?)<\/loc>/gi;
  const urls = new Set();

  let match = locRegex.exec(xml);
  while (match) {
    const loc = String(match[1] || "").trim();
    if (loc.startsWith(`${BLOG_BASE_URL}/blog`)) {
      urls.add(loc);
    }
    match = locRegex.exec(xml);
  }

  return urls;
}

async function readExistingBlogUrlsFromSitemap() {
  try {
    const sitemapXml = await fs.readFile(SITEMAP_PATH, "utf8");
    return extractBlogUrlsFromSitemap(sitemapXml);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return new Set();
    }
    throw error;
  }
}

function diffSets(previousSet, currentSet) {
  const created = [];
  const updated = [];
  const deleted = [];

  for (const url of currentSet) {
    if (previousSet.has(url)) {
      updated.push(url);
    } else {
      created.push(url);
    }
  }

  for (const url of previousSet) {
    if (!currentSet.has(url)) {
      deleted.push(url);
    }
  }

  return { created, updated, deleted };
}

async function notifyIndexNowForBlogChanges({ created, updated, deleted }) {
  const adminToken = String(process.env.INDEXNOW_ADMIN_TOKEN || "").trim();
  if (!adminToken) {
    console.log(
      "Skipped IndexNow blog create/update/delete webhook: INDEXNOW_ADMIN_TOKEN is not set.",
    );
    return;
  }

  const endpoint = String(INDEXNOW_BLOG_EVENT_ENDPOINT || "").trim();
  if (!endpoint) {
    console.log("Skipped IndexNow blog webhook: endpoint is empty.");
    return;
  }

  const sendEvent = async (action, urls) => {
    if (!urls.length) return;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-indexnow-token": adminToken,
      },
      body: JSON.stringify({ action, urls }),
    });

    const body = await response.text();
    if (!response.ok) {
      throw new Error(
        `Blog ${action} webhook failed (${response.status}): ${body.slice(0, 220)}`,
      );
    }

    console.log(`IndexNow blog ${action}: ${urls.length} URL(s)`);
  };

  try {
    await sendEvent("created", created);
    await sendEvent("updated", updated);
    await sendEvent("deleted", deleted);
  } catch (error) {
    console.error("IndexNow blog webhook failed:", error);
  }
}

async function main() {
  const previousBlogUrls = await readExistingBlogUrlsFromSitemap();
  await generateBlogPages();
  await updateSitemap();

  const currentBlogUrls = new Set(getAllBlogPaths().map((pathName) => toAbsolute(pathName)));
  const changes = diffSets(previousBlogUrls, currentBlogUrls);

  await notifyIndexNowForBlogChanges(changes);

  console.log(`Generated static blog pages for ${currentBlogUrls.size} URLs.`);
  console.log(`Updated sitemap at ${SITEMAP_PATH}`);
}

main().catch((error) => {
  console.error("Failed to generate static blog pages:", error);
  process.exit(1);
});
