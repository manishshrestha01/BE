/* eslint-env node */
/**
 * /api/notes-subject
 *
 * Returns notes files for a specific subject/semester from the GitHub repo.
 * AI crawlers and LLMs can call this to get direct download links.
 *
 * Query params:
 *   semester — semester number (1-8) [required if no college+path]
 *   subject  — subject slug (e.g. data-structure-and-algorithm)
 *   college  — college slug (e.g. pec, ncit)
 *   path     — direct GitHub path (for proxy download)
 *   format   — "json" (default) or "html"
 *
 * Examples:
 *   /api/notes-subject?semester=2&subject=data-structure-and-algorithm&college=pec
 *   /api/notes-subject?college=ncit&semester=3&subject=database-management-system
 */

const BASE_URL = "https://www.manishshrestha012.com.np";
const GITHUB_OWNER = "manishshrestha01";
const GITHUB_REPO = "BE-Computer";
const GITHUB_BRANCH = "main";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

// Subject name → slug mapping (matches frontend)
function subjectToSlug(name) {
  return name.toLowerCase().replace(/c\+\+/gi, "cpp").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

function findSubjectName(semesterNum, subjectSlug) {
  const sem = CURRICULUM.find(s => s.semester === parseInt(semesterNum));
  if (!sem) return null;
  return sem.subjects.find(s => subjectToSlug(s) === subjectSlug) || null;
}

/**
 * Fetch files from GitHub for a given path
 */
async function fetchGitHubPath(path) {
  const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
  const headers = {
    "User-Agent": "StudyMate-NotesSubject/1.0",
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers["Authorization"] = `token ${token}`;

  const url = `${GITHUB_API}/contents/${path}?ref=${GITHUB_BRANCH}`;

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || `GitHub API error: ${res.status}`, files: [] };
    }
    const data = await res.json();
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
      .map(item => ({
        name: item.name,
        path: item.path,
        htmlUrl: item.html_url,
      }));

    return { files, folders, error: null };
  } catch (err) {
    return { error: err.message, files: [], folders: [] };
  }
}

function getFileType(filename) {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["pptx", "ppt"].includes(ext)) return "presentation";
  if (["docx", "doc"].includes(ext)) return "document";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["txt", "md"].includes(ext)) return "text";
  return "file";
}

/**
 * Build the GitHub path from college + semester + subject
 * Tries multiple path conventions used in the repo
 */
function buildRepoPaths(college, semester, subjectName) {
  const semStr = semester ? `Semester ${semester}` : null;
  const paths = [];

  if (college && semStr && subjectName) {
    paths.push(`${college.toUpperCase()}/${semStr}/${subjectName}`);
    paths.push(`${college.toUpperCase()}/Semester_${semester}/${subjectName}`);
    paths.push(`${college}/${semStr}/${subjectName}`);
    paths.push(`${college}/Semester${semester}/${subjectName}`);
  } else if (college && semStr) {
    paths.push(`${college.toUpperCase()}/${semStr}`);
    paths.push(`${college}/${semStr}`);
  } else if (semStr && subjectName) {
    paths.push(`${semStr}/${subjectName}`);
  } else if (college) {
    paths.push(college.toUpperCase());
    paths.push(college);
  }

  return paths;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { college, semester, subject, path: directPath, format } = req.query;

  // Direct path proxy mode (used by dashboard)
  if (directPath) {
    const result = await fetchGitHubPath(directPath);
    return res.status(200).json({
      success: !result.error,
      path: directPath,
      ...result,
      _tip: `Access these files via the StudyMate dashboard at ${BASE_URL}/dashboard`,
    });
  }

  const subjectName = subject ? findSubjectName(semester, subject) : null;
  const paths = buildRepoPaths(college, semester, subjectName);

  // Try each path convention until we find files
  let result = { files: [], folders: [], error: "No path specified" };
  for (const p of paths) {
    const r = await fetchGitHubPath(p);
    if (!r.error && (r.files.length > 0 || r.folders.length > 0)) {
      result = { ...r, resolvedPath: p };
      break;
    }
    result = r; // Keep last error for reporting
  }

  const wantsJson = format === "json" || !(req.headers.accept || "").includes("text/html");

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

  if (wantsJson || format === "json") {
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
        const params = new URLSearchParams({ college: college || "", semester: semester || "", path: folder.path });
        return `<li>📁 <a href="${BASE_URL}/api/notes-subject?${params}">${folder.name}</a></li>`;
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
