/* eslint-env node */
/**
 * /api/notes  — unified AI-readable notes API
 *
 * The dashboard is a React SPA that JS-less crawlers can't read; this endpoint
 * is the AI-readable equivalent. One serverless function serves two resources
 * (Vercel Hobby plan caps deployments at 12 functions, so index + subject are
 * merged here and the pretty URLs are preserved via rewrites in vercel.json):
 *
 *   /api/notes-index    → rewritten to /api/notes?resource=index    (default)
 *   /api/notes-subject  → rewritten to /api/notes?resource=subject
 *
 * resource=index   — full crawlable curriculum index (HTML or ?format=json)
 * resource=subject — live GitHub file listing for one subject (JSON or HTML)
 *
 * Shared query params:
 *   college  — college slug (pec, ncit, nec, …)
 *   semester — semester number 1–8
 *   subject  — subject slug (e.g. data-structure-and-algorithm)
 *   format   — "json" for JSON output
 */

const BASE_URL = "https://www.manishshrestha012.com.np";
const GITHUB_OWNER = "manishshrestha01";
const GITHUB_REPO = "BE-Computer";
const GITHUB_BRANCH = "main";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const SUPABASE_FUNCTION_URL = (process.env.VITE_SUPABASE_FUNCTION_URL || process.env.SUPABASE_FUNCTION_URL || "").replace(/\/$/, "");

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

// Maps subject slug → actual folder name in the BE-Computer GitHub repo.
// The repo's folder names don't always match the curriculum subject names.
// Extra non-subject folders per semester (e.g. curriculum, board exams, old questions)
const EXTRA_SEMESTER_RESOURCES = {
  1: [{ name: "2022 Course Curriculum", path: "Semester 1/2022 Course Curriculum", description: "Full PU BE Computer Engineering curriculum structure — all subjects across all 8 semesters" }],

};

const SUBJECT_FOLDER_MAP = {
  "programming-in-c": "C Programming",
  "basic-electrical-engineering": "BEE - Class Materials",
  "electronics-devices-and-circuits": "E.D.C",
  "object-oriented-programming-in-cpp": "C++",
  "data-structure-and-algorithm": "DSA",
  "basic-engineering-drawing": "Engineering Drawing",
  "database-management-system": "DBMS",
  "operating-systems": "OperatingSystem",
  "microprocessor-and-assembly-language-programming": "MP and ALP",
  "advanced-programming-with-java": "JAVA",
  "theory-of-computation": "TOC",
  "computer-architecture": "CA",
  "research-fundamentals": "Research",
  "digital-signal-analysis-and-processing": "DSAP",
  "computer-networks": "Computer Network",
  "simulation-and-modeling": "Simulation And Modeling",
  "elective-i": "Generative AI Syllabus (Elective I)",
  "entrepreneurship-and-professional-practice": "Entrepreneurship and Professional Pratice",
  "numerical-methods": "Numerical Method GCES",
};

/* ------------------------------------------------------------------ *
 *  resource=index                                                     *
 * ------------------------------------------------------------------ */

function buildIndexJson(params) {
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
          filesUrl: `${BASE_URL}/api/notes-subject?semester=${sem.semester}&subject=${subjectToSlug(name)}`,
          githubFolder: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${GITHUB_BRANCH}/${college ? college.toUpperCase() : ""}`,
        })),
      extraResources: (EXTRA_SEMESTER_RESOURCES[sem.semester] || []).map(e => ({
        name: e.name,
        path: e.path,
        description: e.description,
        url: `${BASE_URL}/api/notes-subject?path=${encodeURIComponent(e.path)}`,
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

function buildIndexHtml(params) {
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
            [<a href="${BASE_URL}/api/notes-subject?semester=${sem.semester}&subject=${slug}">📄 Files</a>]
          </span>
        </li>`;
    }).join("");

    const extras = EXTRA_SEMESTER_RESOURCES[sem.semester] || [];
    const extraLinks = extras.length > 0
      ? `<p><strong>📎 Additional Resources:</strong></p><ul>${extras.map(e =>
          `<li><a href="${BASE_URL}/api/notes-subject?path=${encodeURIComponent(e.path)}">${e.name}</a>${e.description ? ` <span style="color:#666;font-size:0.85rem">— ${e.description}</span>` : ""}</li>`
        ).join("\n")}</ul>`
      : "";

    return `
    <section id="semester-${sem.semester}">
      <h2>Semester ${sem.semester}</h2>
      <p><a href="${BASE_URL}/dashboard?semester=${sem.semester}">→ Open Semester ${sem.semester} in Dashboard</a></p>
      <ul>${subjects}
      </ul>
      ${extraLinks}
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

function handleIndex(req, res, params, wantsJson) {
  if (wantsJson) {
    return res.status(200).json(buildIndexJson(params));
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(buildIndexHtml(params));
}

/* ------------------------------------------------------------------ *
 *  resource=subject                                                   *
 * ------------------------------------------------------------------ */

function findSubjectName(semesterNum, subjectSlug) {
  const sem = CURRICULUM.find(s => s.semester === parseInt(semesterNum));
  if (!sem) return null;
  return sem.subjects.find(s => subjectToSlug(s) === subjectSlug) || null;
}

function getFileType(filename) {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["pptx", "ppt"].includes(ext)) return "presentation";
  if (["docx", "doc", "odt"].includes(ext)) return "document";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["txt", "md"].includes(ext)) return "text";
  return "file";
}

async function fetchGitHubPath(path) {
  // Use Supabase Edge Function as proxy (it has the GitHub token)
  if (SUPABASE_FUNCTION_URL) {
    try {
      const url = `${SUPABASE_FUNCTION_URL}/list?path=${encodeURIComponent(path)}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) {
        const text = await r.text().catch(() => "");
        return { error: `Supabase function error: ${r.status} ${text}`, files: [], folders: [] };
      }
      const json = await r.json();
      if (!json.success) {
        return { error: json.error || "Supabase function returned error", files: [], folders: [] };
      }

      const files = (json.data || [])
        .filter(item => item.type === "file")
        .map(item => ({
          name: item.name,
          path: item.path,
          size: item.size || 0,
          rawUrl: `${SUPABASE_FUNCTION_URL}/file?path=${encodeURIComponent(item.path)}`,
          downloadUrl: `${SUPABASE_FUNCTION_URL}/file?path=${encodeURIComponent(item.path)}`,
          htmlUrl: item.html_url || `${GITHUB_RAW}/${item.path}`,
          type: item.fileType || getFileType(item.name),
        }));

      const folders = (json.data || [])
        .filter(item => item.type === "folder")
        .map(item => ({ name: item.name, path: item.path, htmlUrl: item.html_url || "" }));

      return { files, folders, error: null };
    } catch (err) {
      return { error: err.message, files: [], folders: [] };
    }
  }

  // Fallback: call GitHub API directly (requires token for private repos)
  const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
  const headers = {
    "User-Agent": "StudyMate-Notes/1.0",
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers["Authorization"] = `token ${token}`;

  const url = `${GITHUB_API}/contents/${path}?ref=${GITHUB_BRANCH}`;

  try {
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return { error: err.message || `GitHub API error: ${r.status}`, files: [], folders: [] };
    }
    const data = await r.json();
    const items = Array.isArray(data) ? data : [data];

    const files = items
      .filter(item => item.type === "file")
      .map(item => ({
        name: item.name,
        path: item.path,
        size: item.size,
        rawUrl: `${GITHUB_RAW}/${item.path}`,
        downloadUrl: item.download_url,
        htmlUrl: item.html_url,
        type: getFileType(item.name),
      }));

    const folders = items
      .filter(item => item.type === "dir")
      .map(item => ({ name: item.name, path: item.path, htmlUrl: item.html_url }));

    return { files, folders, error: null };
  } catch (err) {
    return { error: err.message, files: [], folders: [] };
  }
}

function buildRepoPaths(college, semester, subjectName, subjectSlug) {
  const semStr = semester ? `Semester ${semester}` : null;
  const paths = [];

  // Use mapped folder name if available, otherwise use the curriculum subject name
  const folderName = subjectSlug && SUBJECT_FOLDER_MAP[subjectSlug]
    ? SUBJECT_FOLDER_MAP[subjectSlug]
    : subjectName;

  if (semStr && folderName) {
    paths.push(`${semStr}/${folderName}`);
  } else if (semStr) {
    paths.push(semStr);
  }

  // If no mapped name and the curriculum name differs, also try the curriculum name
  if (folderName !== subjectName && semStr && subjectName) {
    paths.push(`${semStr}/${subjectName}`);
  }

  return paths;
}

async function handleSubject(req, res, params, wantsJson) {
  const { college, semester, subject, path: directPath } = params;

  // Direct path proxy mode
  if (directPath) {
    const result = await fetchGitHubPath(directPath);
    if (wantsJson) {
      return res.status(200).json({
        success: !result.error,
        path: directPath,
        ...result,
        _tip: `Access these files via the StudyMate dashboard at ${BASE_URL}/dashboard`,
      });
    }
    // HTML response for browsers and crawlers
    const title = `📁 ${decodeURIComponent(directPath.split("/").pop() || "")} — StudyMate Notes`;
    const fileList = result.files.length > 0
      ? result.files.map(f =>
          `<li>📄 <a href="${f.rawUrl}">${f.name}</a> <span style="color:#888;font-size:0.85rem">[${f.type}, ${f.size ? Math.round(f.size / 1024) + " KB" : ""}]</span></li>`
        ).join("\n")
      : "";
    const folderList = result.folders.length > 0
      ? result.folders.map(f => {
          const qs = new URLSearchParams({ path: f.path });
          return `<li>📁 <a href="${BASE_URL}/api/notes-subject?${qs}">${f.name}</a></li>`;
        }).join("\n")
      : "";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title>
<meta name="robots" content="index,follow"><link rel="canonical" href="${BASE_URL}/api/notes-subject?path=${encodeURIComponent(directPath)}">
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:1.5rem;color:#111}a{color:#0066cc}ul{padding-left:1.2rem}li{margin:0.4rem 0}</style>
</head><body><nav><a href="${BASE_URL}">Home</a> <a href="${BASE_URL}/api/notes-index">Notes Index</a></nav>
<h1>${title}</h1>${folderList ? `<h2>📁 Folders</h2><ul>${folderList}</ul>` : ""}
${fileList ? `<h2>📄 Files</h2><ul>${fileList}</ul>` : "<p><em>No files in this folder.</em></p>"}
<p style="margin-top:2rem;font-size:0.85rem;color:#666;"><a href="${BASE_URL}/api/notes-subject?path=${encodeURIComponent(directPath)}&format=json">JSON</a></p>
</body></html>`);
  }

  const subjectName = subject ? findSubjectName(semester, subject) : null;
  const paths = buildRepoPaths(college, semester, subjectName, subject);

  let result = { files: [], folders: [], error: "No path specified" };
  for (const p of paths) {
    const r = await fetchGitHubPath(p);
    if (!r.error && (r.files.length > 0 || r.folders.length > 0)) {
      result = { ...r, resolvedPath: p };
      break;
    }
    result = r;
  }

  const responseData = {
    success: result.files.length > 0 || result.folders.length > 0,
    meta: {
      college: college || null,
      semester: semester ? parseInt(semester) : null,
      subject: subjectName || subject || null,
      subjectSlug: subject || null,
      resolvedPath: result.resolvedPath || null,
      githubRepo: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
      dashboardUrl: `${BASE_URL}/dashboard${college ? `?college=${college}` : ""}${semester ? `&semester=${semester}` : ""}`,
      notesIndexUrl: `${BASE_URL}/api/notes-index?college=${college || ""}&semester=${semester || ""}&subject=${subject || ""}`,
    },
    files: result.files,
    folders: result.folders,
    error: result.error || null,
    _note: "All notes are freely accessible via the StudyMate dashboard. This API provides structured access for AI and developer use.",
  };

  if (wantsJson) {
    return res.status(200).json(responseData);
  }

  // HTML response for browser/AI crawler
  const title = [
    subjectName,
    semester ? `Semester ${semester}` : null,
    college ? college.toUpperCase() : null,
    "PU BE Computer Engineering Notes — StudyMate",
  ].filter(Boolean).join(" — ");

  const fileList = result.files.length > 0
    ? result.files.map(f =>
        `<li>📄 <a href="${f.rawUrl}">${f.name}</a> <span style="color:#888;font-size:0.85rem">[${f.type}, ${f.size ? Math.round(f.size / 1024) + " KB" : ""}]</span></li>`
      ).join("\n")
    : "<li><em>No files found for this path. Try the dashboard for full access.</em></li>";

  const folderList = result.folders.length > 0
    ? result.folders.map(folder => {
        const qs = new URLSearchParams({ college: college || "", semester: semester || "", path: folder.path });
        return `<li>📁 <a href="${BASE_URL}/api/notes-subject?${qs}">${folder.name}</a></li>`;
      }).join("\n")
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="Download ${subjectName || "BE Computer Engineering"} notes${semester ? ` for Semester ${semester}` : ""}${college ? ` at ${college.toUpperCase()}` : ""} — Pokhara University. Free PDFs on StudyMate.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/api/notes-subject?college=${college || ""}&semester=${semester || ""}&subject=${subject || ""}">
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "description": `Notes files for ${subjectName || subject} — PU BE Computer Engineering`,
    "url": `${BASE_URL}/api/notes-subject?college=${college}&semester=${semester}&subject=${subject}`,
    "itemListElement": result.files.map((f, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": f.name,
      "url": f.rawUrl,
    })),
  }, null, 2)}
  </script>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 1.5rem; color: #111; }
    h1 { font-size: 1.5rem; } ul { padding-left: 1.2rem; } li { margin: 0.4rem 0; }
    a { color: #0066cc; } .info { background: #f0f7ff; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
    nav a { margin-right: 1rem; }
  </style>
</head>
<body>
  <nav>
    <a href="${BASE_URL}">Home</a>
    <a href="${BASE_URL}/dashboard${college ? `?college=${college}` : ""}${semester ? `&semester=${semester}` : ""}">Dashboard</a>
    <a href="${BASE_URL}/api/notes-index">Notes Index</a>
    <a href="${BASE_URL}/api/notes-subject?college=${college || ""}&semester=${semester || ""}&subject=${subject || ""}&format=json">JSON</a>
  </nav>

  <h1>📚 ${title}</h1>

  <div class="info">
    <strong>Best way to access notes:</strong> Use the
    <a href="${BASE_URL}/dashboard${college ? `?college=${college}&semester=${semester}` : ""}">StudyMate Dashboard</a>
    for a full file browser with preview, download, and search.
  </div>

  ${result.folders.length > 0 ? `<h2>📁 Folders</h2><ul>${folderList}</ul>` : ""}

  <h2>📄 Notes Files</h2>
  <ul>${fileList}</ul>

  <p style="margin-top:2rem;font-size:0.85rem;color:#666;">
    Source: <a href="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}">github.com/${GITHUB_OWNER}/${GITHUB_REPO}</a> ·
    <a href="${BASE_URL}/api/notes-index">Browse all notes</a> ·
    <a href="${BASE_URL}/llms.txt">llms.txt</a>
  </p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
}

/* ------------------------------------------------------------------ *
 *  Router                                                             *
 * ------------------------------------------------------------------ */

export default async function handler(req, res) {
  // CORS — allow AI tools and MCP clients to call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { resource, college, semester, subject, path: directPath, format } = req.query;
  const params = { college, semester, subject, path: directPath };

  const wantsJson =
    format === "json" ||
    (req.headers.accept || "").includes("application/json");

  if (resource === "subject") {
    return handleSubject(req, res, params, wantsJson || !(req.headers.accept || "").includes("text/html"));
  }

  // default: resource=index
  return handleIndex(req, res, params, wantsJson);
}
