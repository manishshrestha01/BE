import {
  classifyPapersToTerms,
  getAllQuestionPaperSubjectPaths,
  getQuestionPaperSubject,
  getVariantBySlug,
  getVariantSources,
  termToSlug,
  semesterFallbackTerm,
} from "./oldQuestionConfig";

// Server-side enumeration of the per-year question-paper URLs for the sitemap.
// It mirrors the client loader's folder listing + classification so the sitemap
// only emits year pages that actually render a paper. Every step is
// failure-tolerant: if a listing errors (rate limit, network) it falls back to
// the years derivable purely from the config (combined ranges, terms, fallback),
// so a transient failure can never take down the whole sitemap.

const SUPABASE_FUNCTION_URL = (process.env.VITE_SUPABASE_FUNCTION_URL || process.env.SUPABASE_FUNCTION_URL || "").replace(/\/$/, "");
const GITHUB_OWNER = "manishshrestha01";
const GITHUB_REPO = "BE-Computer";
const GITHUB_BRANCH = "main";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

async function listFolder(folder) {
  if (SUPABASE_FUNCTION_URL) {
    try {
      const r = await fetch(`${SUPABASE_FUNCTION_URL}/list?path=${encodeURIComponent(folder)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (!r.ok) return { files: [], folders: [] };
      const json = await r.json();
      if (!json.success) return { files: [], folders: [] };

      const files = (json.data || [])
        .filter((item) => item.type === "file")
        .map((item) => ({
          name: item.name,
          path: item.path,
          size: item.size || 0,
          url: `${SUPABASE_FUNCTION_URL}/file?path=${encodeURIComponent(item.path)}`,
          type: item.fileType || "file",
        }));
      const folders = (json.data || [])
        .filter((item) => item.type === "folder")
        .map((item) => ({ path: item.path }));
      return { files, folders };
    } catch {
      return { files: [], folders: [] };
    }
  }

  try {
    const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
    const headers = { "User-Agent": "StudyMate/1.0", Accept: "application/vnd.github.v3+json" };
    if (token) headers.Authorization = `token ${token}`;
    const r = await fetch(`${GITHUB_API}/contents/${folder}?ref=${GITHUB_BRANCH}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return { files: [], folders: [] };
    const data = await r.json();
    const items = Array.isArray(data) ? data : [data];
    return {
      files: items
        .filter((item) => item.type === "file")
        .map((item) => ({
          name: item.name,
          path: item.path,
          size: item.size || 0,
          url: item.download_url || `${GITHUB_RAW}/${item.path}`,
          type: "file",
        })),
      folders: items
        .filter((item) => item.type === "dir")
        .map((item) => ({ path: item.path })),
    };
  } catch {
    return { files: [], folders: [] };
  }
}

async function listRecursive(folder) {
  const files = [];
  const queue = [folder];
  const seen = new Set();
  while (queue.length) {
    const current = queue.shift();
    if (seen.has(current)) continue;
    seen.add(current);
    const result = await listFolder(current);
    files.push(...result.files);
    result.folders.forEach((sub) => {
      if (sub?.path && !seen.has(sub.path)) queue.push(sub.path);
    });
  }
  return files;
}

function configFallbackYears(sources, isNewSyllabus, semesterId) {
  const slugs = new Set();
  if (isNewSyllabus) {
    const fallback = semesterFallbackTerm(semesterId);
    if (fallback) slugs.add(termToSlug(fallback));
  }
  Object.values(sources.combined || {}).forEach((range) => {
    if (range?.from) slugs.add(range.from);
    if (range?.to) slugs.add(range.to);
  });
  Object.values(sources.terms || {}).forEach((slug) => {
    if (slug && !slugs.has(slug)) slugs.add(slug);
  });
  return slugs;
}

export async function getQuestionPaperYearPaths() {
  const paths = [];
  for (const { variant, subjectSlug } of getAllQuestionPaperSubjectPaths()) {
    const configKey = getVariantBySlug(variant).configKey;
    const found = getQuestionPaperSubject(subjectSlug);
    if (!found) continue;

    const semesterId = String(found.semester.semester);
    const isNewSyllabus = configKey === "board";
    const sources = getVariantSources(semesterId, subjectSlug, configKey);
    const fallbackYears = configFallbackYears(sources, isNewSyllabus, semesterId);
    let slugs = new Set();

    try {
      const seen = new Set();
      const files = [];
      for (const folder of sources.folders || []) {
        for (const file of await listRecursive(folder)) {
          const key = String(file.name || "").toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          if (!sources.filter || new RegExp(sources.filter, "i").test(file.name)) files.push(file);
        }
      }
      const { entries } = classifyPapersToTerms(files, sources, isNewSyllabus, semesterId);
      entries.forEach((entry) => {
        const slug = termToSlug(entry.term);
        if (slug) slugs.add(slug);
      });
    } catch {
      slugs = new Set();
    }

    if (slugs.size === 0) slugs = fallbackYears;
    slugs.forEach((yearSlug) => {
      paths.push({ variant, subjectSlug, yearSlug });
    });
  }
  return paths;
}