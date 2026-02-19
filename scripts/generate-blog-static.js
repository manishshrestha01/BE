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

const SUBJECT_EXTRA_KEYWORDS = {
  "calculus-i": [
    "Unit 3: Integral Calculus PU notes",
    "Unit 3 Integral Calculus PU notes",
    "Integral Calculus PU notes",
    "Integral Calculus semester 1 notes",
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

function normalizeCourseCode(courseCode = "") {
  return String(courseCode || "").trim().toUpperCase();
}

function compactCourseCode(courseCode = "") {
  return normalizeCourseCode(courseCode).replace(/\s+/g, "");
}

function stripUnitHours(title = "") {
  return String(title || "").replace(/\s*\([^)]*\)\s*$/g, "").trim();
}

function normalizeUnitTitle(title = "", unitNumber = 1) {
  const cleanedTitle = String(title || "").replace(/^unit\s*[ivxlcdm0-9]+\s*[:.-]?\s*/i, "").trim();
  return `Unit ${unitNumber}: ${cleanedTitle || title}`.trim();
}

function makeUnitKeywords(semester, subjectArticle) {
  const syllabusSection = (subjectArticle?.sections || []).find(
    (section) => section.id === "syllabus-overview",
  );
  const units = syllabusSection?.units || [];
  const keywords = [];

  units.forEach((unit, index) => {
    const unitNumber = index + 1;
    const normalizedUnitTitle = normalizeUnitTitle(unit.title, unitNumber);
    const unitTitleNoHours = stripUnitHours(normalizedUnitTitle);
    const topic = unitTitleNoHours.replace(/^Unit\s*\d+\s*:\s*/i, "").trim();

    keywords.push(
      normalizedUnitTitle,
      unitTitleNoHours,
      `${unitTitleNoHours} PU notes`,
      `${unitTitleNoHours} Pokhara University notes`,
      `${topic} PU notes`,
      `${topic} semester ${semester.semester} notes`,
    );
  });

  return [...new Set(keywords.filter(Boolean))];
}

function makeSubjectKeywords(semester, subject, courseCode) {
  const normalizedCode = normalizeCourseCode(courseCode);
  const compactCode = compactCourseCode(normalizedCode);
  const keywords = [
    "Pokhara University",
    "BE Computer Engineering",
    `semester ${semester.semester}`,
    subject.name,
    `${subject.name} notes`,
    `${subject.name} unit wise notes`,
    `${subject.name} chapter wise notes`,
    `${subject.name} PU notes`,
  ];

  if (normalizedCode) {
    keywords.push(
      normalizedCode,
      compactCode,
      `${subject.name} ${normalizedCode}`,
      `${normalizedCode} notes`,
      `${compactCode} notes`,
      `${normalizedCode} PU notes`,
      `${compactCode} PU notes`,
    );
  }

  const extraKeywords = SUBJECT_EXTRA_KEYWORDS[subject.slug] || [];
  keywords.push(...extraKeywords);

  return [...new Set(keywords.filter(Boolean))];
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
}) {
  const canonical = toAbsolute(canonicalPath);
  const image = makeMetaImage();

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
  <style id="spa-hide">body{visibility:hidden!important}</style>
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
</head>
<body>
  ${noscriptNav}
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

  await writePage("/blog", {
    title: "StudyMate Blog - PU Computer Engineering Guides",
    description:
      "Static semester-wise tutorials for Pokhara University BE Computer Engineering students.",
    keywords:
      "Pokhara University blog, BE Computer Engineering notes, semester guides, StudyMate blog",
    jsonLd: [blogBreadcrumbLd, blogCollectionLd],
    noscriptLinks: BLOG_CURRICULUM.map((semester) => ({
      href: semester.urlPath,
      label: `Semester ${semester.semester}`,
    })),
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

    await writePage(semester.urlPath, {
      title: semesterTitle,
      description: semesterDescription,
      keywords: `Pokhara University semester ${semester.semester}, BE Computer Engineering semester ${semester.semester}, StudyMate semester guide`,
      jsonLd: [semesterBreadcrumbLd, semesterCollectionLd],
      noscriptLinks: semester.subjects.map((subject) => ({
        href: subject.urlPath,
        label: subject.name,
      })),
    });

    for (const subject of semester.subjects) {
      const subjectCourseCode = normalizeCourseCode(subject.courseCode);
      const subjectLabel = subjectCourseCode
        ? `${subject.name} (${subjectCourseCode})`
        : subject.name;
      const subjectArticle = subjectArticlesStore?.[String(semester.semester)]?.[subject.slug] || null;
      const subjectTitle = `${subjectLabel} Tutorial - Semester ${semester.semester} | StudyMate`;
      const subjectDescription = buildSubjectDescription(semester, subject);
      const subjectKeywords = [
        ...makeSubjectKeywords(semester, subject, subjectCourseCode),
        ...makeUnitKeywords(semester, subjectArticle),
      ];
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
        mainEntityOfPage: toAbsolute(subject.urlPath),
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

      await writePage(subject.urlPath, {
        title: subjectTitle,
        description: subjectDescription,
        keywords: subjectKeywords.join(", "),
        type: "article",
        jsonLd: [subjectBreadcrumbLd, subjectArticleLd],
        noscriptLinks: [
          { href: semester.urlPath, label: `Back to Semester ${semester.semester}` },
          { href: "/blog", label: "Back to Blog" },
        ],
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

async function main() {
  await generateBlogPages();
  await updateSitemap();
  console.log(`Generated static blog pages for ${getAllBlogPaths().length} URLs.`);
  console.log(`Updated sitemap at ${SITEMAP_PATH}`);
}

main().catch((error) => {
  console.error("Failed to generate static blog pages:", error);
  process.exit(1);
});
