/**
 * Chapter notes data source config.
 *
 * Two modes per subject:
 *   1. `chapterFiles`  — a folder plus a per-chapter allowlist of exact file
 *      names, so each chapter page shows only the notes linked to that chapter
 *      (and auto-renders the note inline when a chapter has a single file).
 *   2. No config      — falls back to the public subject listing endpoint.
 *
 * File/folder names must match the BE-Computer repo exactly (e.g.
 * `Semester 1/E.D.C/ch 2 BJT.pdf`).
 */
export const FEATURED_SUBJECT_NOTES = {};

export const SUBJECT_NOTE_CHAPTER_FILES = {
  "calculus-i": {
    folder: "Semester 1/Calculus I",
    chapters: {
      1: ["Unit 1.pdf"],
      2: ["Unit 2.pdf"],
      3: ["Unit 3.pdf"],
      4: ["Unit 4.pdf"],
      5: ["Unit 5.pdf"],
      6: ["Unit 6.pdf"],
      7: ["Unit 7.pdf"],
      8: ["Unit 8.pdf"],
    },
  },
  "basic-electrical-engineering": {
    folder: "Semester 1/BEE - Class Materials/Lectures",
    chapters: {
      1: ["1PU-BEE.pdf"],
      2: ["2.1 PU-BEE.pdf", "2.2 PU-BEE_all.pdf", "2.2 PU-BEE-Nodal+Mesh.pdf"],
      3: ["3.1 PU-BEE.pdf"],
      4: ["4 PU-BEE.pdf"],
      5: ["5.1 PU-BEE - 1 & 2.pdf", "5.2 PU-BEE.pdf", "5.3 PU-BEE.pdf"],
    },
  },
  "programming-in-c": {
    folder: "Semester 1/C Programming/PEC 2023 (Sanjish KC)",
    chapters: {
      1: ["1. Introduction.pdf"],
      2: ["2. Programming Logic.pdf", "3. Variables and Data Types.pdf"],
      3: ["4. Control Structures.pdf"],
      4: ["5. Arrays and Strings.pdf"],
      5: ["6. Functions.pdf"],
      6: ["7. Pointers.pdf"],
      7: ["8. Structures and Unions.pdf"],
      8: ["9. File Handling.pdf"],
    },
  },
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

export function getNoteChapterConfig(subjectSlug) {
  return SUBJECT_NOTE_CHAPTER_FILES[subjectSlug] || null;
}