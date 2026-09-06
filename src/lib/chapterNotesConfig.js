/**
 * Chapter notes data source config.
 *
 * Two modes per subject:
 *   1. `featuredFile`  — a single master-note file that covers the whole
 *      subject. Chapter pages auto-render it inline for reading.
 *   2. `folder`        — a subfolder (inside the subject's repo folder) whose
 *      files are listed and read inline on chapter pages (no login, no download).
 *
 * `featuredFile` must match the exact file name in the BE-Computer repo folder
 * for that subject (e.g. `Semester 1/Calculus I/<fileName>`).
 * `folder` must match the exact subfolder path inside the subject's repo folder
 * (e.g. `Semester 1/BEE - Class Materials/Lectures`).
 */
export const FEATURED_SUBJECT_NOTES = {
  "calculus-i": "Math (Calculus) Complete Note [Most Compressed one].pdf",
};

export const SUBJECT_NOTE_FOLDERS = {
  "basic-electrical-engineering": "Semester 1/BEE - Class Materials/Lectures",
  "programming-in-c": "Semester 1/C Programming/PEC 2023 (Sanjish KC)",
};

export function getFeaturedNoteForSubject(subjectSlug) {
  return FEATURED_SUBJECT_NOTES[subjectSlug] || null;
}

export function getNoteFolderForSubject(subjectSlug) {
  return SUBJECT_NOTE_FOLDERS[subjectSlug] || null;
}