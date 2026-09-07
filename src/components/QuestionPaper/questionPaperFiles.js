const MULTI_PAGE_RE = /[-_ ]\d{1,3}$/;
const EXTENSION_RE = /\.[^.]+$/;

export const isPdf = (name) => String(name || "").toLowerCase().endsWith(".pdf");

export function isImage(name) {
  return /\.(jpe?g|png|gif|webp)$/i.test(name || "");
}

// Splits files into renderable cards, merging multi-page image scans (e.g.
// "CT-05 Fall_0001.jpg", "CT-05 Fall_0002.jpg") into a single stack.
export function buildCards(files) {
  const cards = [];
  const imageGroups = new Map();
  const order = [];

  files.forEach((file) => {
    if (isImage(file.name)) {
      const base = file.name.replace(EXTENSION_RE, "").replace(MULTI_PAGE_RE, "");
      const key = base.toLowerCase();
      if (!imageGroups.has(key)) {
        imageGroups.set(key, { name: base, urls: [] });
        order.push(key);
      }
      imageGroups.get(key).urls.push(file.url);
    } else {
      cards.push({
        kind: isPdf(file.name) ? "pdf" : "other",
        name: file.name,
        url: file.url,
        urls: [file.url],
        size: file.size || 0,
      });
    }
  });

  order.forEach((key) => {
    const group = imageGroups.get(key);
    cards.push({
      kind: "image",
      name: group.name,
      urls: group.urls,
      size: 0,
    });
  });

  return cards;
}

async function listFolder(folder) {
  const params = new URLSearchParams({ resource: "subject", format: "json" });
  params.set("path", folder);
  const res = await fetch(`/api/notes?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Unable to load question papers (${res.status})`);
  const json = await res.json();
  return { files: json?.files || [], folders: json?.folders || [] };
}

// Lists every file under a folder, walking subfolders recursively.
export async function listRecursive(folder) {
  const files = [];
  const queue = [folder];
  const seenFolders = new Set();

  while (queue.length) {
    const current = queue.shift();
    if (seenFolders.has(current)) continue;
    seenFolders.add(current);
    const result = await listFolder(current);
    files.push(...result.files);
    result.folders.forEach((sub) => {
      if (sub?.path && !seenFolders.has(sub.path)) queue.push(sub.path);
    });
  }

  return files;
}

// Loads, dedupes and (optionally) filters the files for a folder list.
export async function loadQuestionPaperFiles(folders, filter) {
  const merged = [];
  for (const folder of folders) {
    merged.push(...(await listRecursive(folder)));
  }

  // Dedupe by filename: the same paper often lives in several folders (e.g.
  // "Semester 1/Final Paper/Back" mirrors "Semester 1/Final Paper"), so keep
  // the first copy and drop case-variant duplicates.
  const seen = new Set();
  let list = [];
  merged.forEach((file) => {
    const key = String(file.name || "").toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    list.push({
      name: file.name,
      path: file.path,
      size: file.size || 0,
      url: file.rawUrl || file.downloadUrl || file.url || "",
      fileType: file.type || file.fileType || "",
    });
  });

  if (filter) {
    const re = new RegExp(filter, "i");
    list = list.filter((file) => re.test(file.name));
  }

  return list;
}

// Groups parsed files into exam terms plus undated "others".
export function groupByTerm(files, extractExamTerm) {
  const byTerm = new Map();
  const others = [];

  files.forEach((file) => {
    const term = extractExamTerm(file.name);
    if (term) {
      const label = term.label;
      if (!byTerm.has(label)) byTerm.set(label, { term, files: [] });
      byTerm.get(label).files.push(file);
    } else {
      others.push(file);
    }
  });

  const entries = [...byTerm.values()].sort((a, b) => a.term.sortKey - b.term.sortKey);
  return { entries, others };
}