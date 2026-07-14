/* eslint-env node */
/**
 * /api/notes-index
 *
 * Public serverless endpoint that exposes the notes structure to AI crawlers,
 * LLMs, and search engines. The dashboard is a React SPA that JS-crawlers
 * can't read — this endpoint is the AI-readable equivalent.
 *
 * Supports two response formats:
 *   • HTML  (default / browser / AI crawler)  — rich, crawlable page with links
 *   • JSON  (?format=json or Accept: application/json) — structured data for LLMs/MCP
 *
 * Query params:
 *   college  — filter by college slug (e.g. pec, ncit, nec)
 *   semester — filter by semester number 1–8
 *   subject  — filter by subject slug (e.g. data-structure-and-algorithm)
 *   format   — "json" for JSON output
 */

const BASE_URL = "https://www.manishshrestha012.com.np";
const GITHUB_OWNER = "manishshrestha01";
const GITHUB_REPO = "BE-Computer";
const GITHUB_BRANCH = "main";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

// Full 8-semester PU BE Computer Engineering curriculum (2022)
const CURRICULUM = [
  { semester: 1, subjects: ["Calculus I", "Digital Logic", "Programming in C", "Basic Electrical Engineering", "Computer Workshop", "Communication Technique", "Electronics Devices and Circuits"] },
  { semester: 2, subjects: ["Algebra and Geometry", "Applied Physics", "Applied Chemistry", "Basic Engineering Drawing", "Object Oriented Programming in C++", "Data Structure and Algorithm", "Instrumentation"] },
  { semester: 3, subjects: ["Calculus II", "Database Management System", "Operating Systems", "Microprocessor and Assembly Language Programming", "Computer Graphics", "Data Communication"] },
  { semester: 4, subjects: ["Applied Mathematics", "Numerical Methods", "Advanced Programming with Java", "Theory of Computation", "Computer Architecture", "Research Fundamentals"] },
  { semester: 5, subjects: ["Probability and Statistics", "Embedded System", "Engineering Management", "Artificial Intelligence", "Digital Signal Analysis and Processing", "Software Engineering"] },
  { semester: 6, subjects: ["Image Processing and Pattern Recognition", "Machine Learning", "Compiler Design", "Computer Networks", "Simulation and Modeling", "Elective I", "Project I"] },
  { semester: 7, subjects: ["Entrepreneurship and Professional Practice", "Engineering Economics", "Network and Cyber Security", "Cloud Computing and Virtualization", "Data Science and Analytics", "Elective II"] },
  { semester: 8, subjects: ["Elective III", "Internship", "Project II"] },
];

const COLLEGES = [
  { slug: "pec",    name: "Pokhara Engineering College (PEC)" },
  { slug: "ncit",   name: "Nepal College of Information Technology (NCIT)" },
  { slug: "nec",    name: "National Engineering College (NEC)" },
  { slug: "gces",   name: "Gandaki College of Engineering & Science (GCES)" },
  { slug: "cosmos", name: "Cosmos College of Management and Technology" },
  { slug: "oxford", name: "Oxford College of Engineering & Management" },
  { slug: "eec",    name: "Everest Engineering College (EEC)" },
  { slug: "lec",    name: "Lumbini Engineering College (LEC)" },
  { slug: "mbce",   name: "Madan Bhandari College of Engineering (MBCE)" },
  { slug: "nast",   name: "National Academy of Science and Technology (NAST)" },
  { slug: "rec",    name: "Rapti Engineering College (REC)" },
  { slug: "uesc",   name: "Universal Engineering & Science College (UESC)" },
  { slug: "utc",    name: "United Technical College (UTC)" },
];

function subjectToSlug(name) {
  return name.toLowerCase().replace(/c\+\+/gi, "cpp").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Try to fetch the git tree for a college to discover actual note files.
 * Falls back gracefully if GitHub API rate-limits or the path doesn't exist.
 */
async function fetchCollegeNotes(collegeSlug) {
  const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
  const headers = { "User-Agent": "StudyMate-NotesIndex/1.0", Accept: "application/vnd.github.v3+json" };
  if (token) headers["Authorization"] = `token ${token}`;

  try {
    // Get recursive tree for this college folder
    const treeUrl = `${GITHUB_API}/git/trees/${GITHUB_BRANCH}?recursive=1`;
    const res = await fetch(treeUrl, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.tree) return null;

    // Filter to files under this college's folder
    const prefix = `${collegeSlug}/`;
    const files = json.tree
      .filter(item => item.type === "blob" && item.path.toLowerCase().startsWith(prefix))
      .map(item => ({
        path: item.path,
        name: item.path.split("/").pop(),
        rawUrl: `${GITHUB_RAW}/${item.path}`,
        downloadUrl: `${BASE_URL}/api/notes-subject?college=${collegeSlug}&path=${encodeURIComponent(item.path)}`,
      }));

    return files.length > 0 ? files : null;
  } catch {
    return null;
  }
}

function buildJsonResponse(params) {
  const { college, semester, subject } = params;

  const filteredCurriculum = semester
    ? CURRICULUM.filter(s => s.semester === parseInt(semester))
    : CURRICULUM;

  return {
    meta: {
      site: "StudyMate",
      url: BASE_URL,
      description: "Free Pokhara University BE Computer Engineering notes and study materials",
      university: "Pokhara University (PU)",
      program: "BE Computer Engineering",
      syllabus: "2022 Curriculum",
      totalSemesters: 8,
      lastUpdated: "2026-07-14",
    },
    colleges: college
      ? COLLEGES.filter(c => c.slug === college)
      : COLLEGES,
    curriculum: filteredCurriculum.map(sem => ({
      semester: sem.semester,
      semesterLabel: `Semester ${sem.semester}`,
      notesUrl: `${BASE_URL}/dashboard?semester=${sem.semester}`,
      subjects: sem.subjects
        .filter(s => !subject || subjectToSlug(s) === subject)
        .map(name => ({
          name,
          slug: subjectToSlug(name),
          notesUrl: `${BASE_URL}/dashboard?semester=${sem.semester}&subject=${subjectToSlug(name)}`,
          blogUrl: `${BASE_URL}/blog/semester/${sem.semester}/${subjectToSlug(name)}`,
          githubFolder: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${GITHUB_BRANCH}/${college ? college.toUpperCase() : ""}`,
        })),
    })),
    howToAccess: {
      dashboard: `${BASE_URL}/dashboard`,
      selectCollege: "Choose your college from the dropdown in the dashboard",
      selectSemester: "Select semester 1-8",
      downloadNotes: "Click any file to view or download the PDF/PPT notes",
      directUrl: `${BASE_URL}/dashboard?college={college_slug}&semester={1-8}`,
    },
  };
}

function buildHtmlResponse(params) {
  const { college, semester } = params;
  const collegeInfo = college ? COLLEGES.find(c => c.slug === college) : null;
  const filteredSems = semester ? CURRICULUM.filter(s => s.semester === parseInt(semester)) : CURRICULUM;

  const semesterLinks = CURRICULUM.map(s =>
    `<li><a href="${BASE_URL}/api/notes-index?semester=${s.semester}">Semester ${s.semester} (${s.subjects.length} subjects)</a></li>`
  ).join("\n      ");

  const collegeLinks = COLLEGES.map(c =>
    `<li><a href="${BASE_URL}/api/notes-index?college=${c.slug}">${c.name}</a> — <a href="${BASE_URL}/college/${c.slug}">notes page</a></li>`
  ).join("\n      ");

  const subjectSections = filteredSems.map(sem => {
    const subjects = sem.subjects.map(name => {
      const slug = subjectToSlug(name);
      return `
        <li class="subject">
          <strong>${name}</strong>
          <span class="links">
            [<a href="${BASE_URL}/dashboard?semester=${sem.semester}&subject=${slug}">📂 Open in Dashboard</a>]
            [<a href="${BASE_URL}/blog/semester/${sem.semester}/${slug}">📖 Study Guide</a>]
            [<a href="${BASE_URL}/api/notes-index?semester=${sem.semester}&subject=${slug}&format=json">🔗 JSON</a>]
          </span>
        </li>`;
    }).join("");

    return `
    <section id="semester-${sem.semester}">
      <h2>Semester ${sem.semester}</h2>
      <p><a href="${BASE_URL}/dashboard?semester=${sem.semester}">→ Open Semester ${sem.semester} in Dashboard</a></p>
      <ul>${subjects}
      </ul>
    </section>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notes Index — Pokhara University BE Computer Engineering — StudyMate</title>
  <meta name="description" content="Complete index of Pokhara University BE Computer Engineering notes and study materials available on StudyMate. All 8 semesters, all subjects, all colleges.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/api/notes-index">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "StudyMate Notes Index — PU BE Computer Engineering",
    "description": "Complete catalog of Pokhara University BE Computer Engineering notes for all 8 semesters across 13 affiliated colleges",
    "url": "${BASE_URL}/api/notes-index",
    "publisher": {
      "@type": "Organization",
      "name": "StudyMate",
      "url": "${BASE_URL}"
    },
    "dataset": ${JSON.stringify(CURRICULUM.map(sem => ({
      "@type": "Dataset",
      "name": `PU BE Computer Engineering Semester ${sem.semester} Notes`,
      "description": `Study materials for Semester ${sem.semester}: ${sem.subjects.join(", ")}`,
      "url": `${BASE_URL}/dashboard?semester=${sem.semester}`,
      "keywords": sem.subjects,
    })))}
  }
  </script>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 1.5rem; color: #111; line-height: 1.6; }
    h1 { font-size: 1.8rem; } h2 { font-size: 1.2rem; margin-top: 2rem; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; }
    ul { padding-left: 1.2rem; } li.subject { margin: 0.5rem 0; }
    .links { font-size: 0.85rem; margin-left: 0.5rem; color: #555; }
    a { color: #0066cc; } nav ul { list-style: none; padding: 0; display: flex; gap: 1rem; flex-wrap: wrap; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
    .info-box { background: #f8f9fa; border-left: 4px solid #0066cc; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
  </style>
</head>
<body>
  <nav>
    <ul>
      <li><a href="${BASE_URL}">StudyMate Home</a></li>
      <li><a href="${BASE_URL}/dashboard">Dashboard</a></li>
      <li><a href="${BASE_URL}/colleges">Colleges</a></li>
      <li><a href="${BASE_URL}/blog">Blog</a></li>
      <li><a href="${BASE_URL}/api/notes-index?format=json">📦 JSON API</a></li>
    </ul>
  </nav>

  <h1>📚 StudyMate — Notes Index</h1>
  <p>
    <strong>Pokhara University BE Computer Engineering</strong> — Free notes and study materials
    for all 8 semesters, covering the 2022 PU curriculum across 13 affiliated colleges in Nepal.
  </p>

  <div class="info-box">
    <strong>How to access notes:</strong> Open the <a href="${BASE_URL}/dashboard">StudyMate Dashboard</a>,
    select your college and semester, then click any file to view or download PDF/PPT notes.
    All notes are free — no login required to browse.
  </div>

  ${collegeInfo ? `<p>Showing notes for: <strong>${collegeInfo.name}</strong> — <a href="${BASE_URL}/college/${college}">College page</a></p>` : ""}

  <div class="grid">
    <div>
      <h2>Filter by Semester</h2>
      <ul>${semesterLinks}</ul>
    </div>
    <div>
      <h2>Filter by College</h2>
      <ul>${collegeLinks}</ul>
    </div>
  </div>

  <h2>📖 Full Subject Index</h2>
  ${subjectSections}

  <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #eee;font-size:0.85rem;color:#666;">
    <p>StudyMate | Free PU BE Computer Engineering Notes | <a href="${BASE_URL}">manishshrestha012.com.np</a></p>
    <p>
      <a href="${BASE_URL}/api/notes-index?format=json">JSON API</a> ·
      <a href="${BASE_URL}/llms.txt">llms.txt</a> ·
      <a href="${BASE_URL}/llms-full.txt">llms-full.txt</a> ·
      <a href="${BASE_URL}/sitemap.xml">Sitemap</a>
    </p>
  </footer>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS — allow AI tools and MCP clients to call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { college, semester, subject, format } = req.query;
  const params = { college, semester, subject };

  const wantsJson =
    format === "json" ||
    (req.headers.accept || "").includes("application/json");

  if (wantsJson) {
    const data = buildJsonResponse(params);
    return res.status(200).json(data);
  }

  const html = buildHtmlResponse(params);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
}
