/**
 * Chapter notes data source config.
 *
 * Three modes per subject:
 *   1. `featuredFile`  — a single master-note file that covers the whole
 *      subject. Chapter pages auto-render it inline for reading.
 *   2. `folder`        — a subfolder whose files are listed and read inline on
 *      every chapter page (no login, no download).
 *   3. `chapterFiles`  — a folder plus a per-chapter allowlist of exact file
 *      names, so each chapter page shows only the notes linked to that chapter.
 *
 * File/folder names must match the BE-Computer repo exactly (e.g.
 * `Semester 1/E.D.C/ch 2 BJT.pdf`).
 */
export const FEATURED_SUBJECT_NOTES = {
  "calculus-i": "Math (Calculus) Complete Note [Most Compressed one].pdf",
};

export const SUBJECT_NOTE_FOLDERS = {
  "basic-electrical-engineering": "Semester 1/BEE - Class Materials/Lectures",
  "programming-in-c": "Semester 1/C Programming/PEC 2023 (Sanjish KC)",
};

export const SUBJECT_NOTE_CHAPTER_FILES = {
  "electronics-devices-and-circuits": {
    folder: "Semester 1/E.D.C",
    chapters: {
      1: ["ch 1 Semiconducting material.pdf", "Diode resistance.pdf"],
      2: ["ch 2 BJT.pdf", "ch2_BJT_biasing_continue.pdf"],
      3: ["ch 3 DC power supply.pdf"],
      4: ["ch 4 FET.pdf"],
      5: ["ch 5 Small signal BJT.pdf", "DC_AC_load_line.pdf"],
      6: ["ch 6 Multistage amplifier.pdf"],
      7: ["ch 7 Large signal amplifiers.pdf"],
      8: ["ch 8 Feedback amplifier.pdf"],
      9: ["ch 9 OP amp.pdf"],
    },
  },
};

export function getFeaturedNoteForSubject(subjectSlug) {
  return FEATURED_SUBJECT_NOTES[subjectSlug] || null;
}

export function getNoteFolderForSubject(subjectSlug) {
  return SUBJECT_NOTE_FOLDERS[subjectSlug] || null;
}

export function getNoteChapterConfig(subjectSlug) {
  return SUBJECT_NOTE_CHAPTER_FILES[subjectSlug] || null;
}