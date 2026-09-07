import { BLOG_CURRICULUM, subjectToSlug } from "./blogCurriculum";

// New-syllabus papers that can't be dated from their filename get a default
// exam term based on the semester they belong to (natural intake progression):
//   S1 = Fall 2022, S2 = Spring 2023, S3 = Fall 2023, S4 = Spring 2024,
//   S5 = Fall 2024, S6 = Spring 2025, S7 = Fall 2025, S8 = Spring 2026.
export const SEMESTER_FALLBACK_YEAR = {
  1: { season: "fall", year: 2022 },
  2: { season: "spring", year: 2023 },
  3: { season: "fall", year: 2023 },
  4: { season: "spring", year: 2024 },
  5: { season: "fall", year: 2024 },
  6: { season: "spring", year: 2025 },
  7: { season: "fall", year: 2025 },
  8: { season: "spring", year: 2026 },
};

export function semesterFallbackTerm(semesterId) {
  const fb = SEMESTER_FALLBACK_YEAR[Number(semesterId)];
  if (!fb) return null;
  const season = fb.season.toLowerCase();
  return {
    label: `${season[0].toUpperCase()}${season.slice(1)} ${fb.year}`,
    year: fb.year,
    season,
    sortKey: fb.year * 10 + (season === "fall" ? 1 : 0),
  };
}

// Subjects with no question-paper archive (workshop, projects, internships and
// electives don't get old-question pages).
const EXCLUDED_SUBJECT_SLUGS = new Set([
  "computer-workshop",
  "elective-i",
  "elective-ii",
  "elective-iii",
  "project-i",
  "project-ii",
  "internship",
]);

// Repo folders holding a subject's question papers, split by syllabus type:
//   board — new/current-syllabus board & final papers ("Final Paper",
//           "Board Questions", "Board Exam ..." folders)
//   old   — previous-syllabus archive ("OLD QUESTIONS"/"Old Questions"/"Old Question")
// Each variant has optional `filter` (regex on filename) when the folder mixes
// several subjects' files.
// Key: `${semesterId}:${subjectSlug}`
const OLD_QUESTION_SOURCES = {
  // Semester 1
  "1:calculus-i": {
    board: {
      folders: ["Semester 1/Final Paper", "Semester 1/Calculus I/Past Question Collection"],
      // Only season-named papers + the combined "board paper all" are shown;
      // solve/prelude notes/PEC scans stay out of the question-paper route.
      filter: "board paper all|fall 2023|fall 2025",
      combined: {
        // Multi-year merged paper (Fall 2022 → Spring 2025): shown on every
        // year in that range so it's discoverable from any term page.
        "board paper all": { from: "fall-2022", to: "spring-2025" },
      },
    },
    old: { folders: ["Semester 1/OLD QUESTIONS /Math I"] },
  },
  "1:digital-logic": {
    board: { folders: ["Semester 1/Final Paper"], filter: "digital logic" },
    old: { folders: ["Semester 1/OLD QUESTIONS /LC"] },
  },
  "1:programming-in-c": {
    board: { folders: ["Semester 1/Final Paper"], filter: "programming in c" },
    old: { folders: ["Semester 1/OLD QUESTIONS /C"] },
  },
  "1:basic-electrical-engineering": {
    board: { folders: ["Semester 1/Final Paper"], filter: "^bee[.]?" },
    // "BEE - Question Collection.pdf" in the subject folder is old-course (undated,
    // lands under old-syllabus Additional papers).
    old: {
      folders: [
        "Semester 1/OLD QUESTIONS /Basic Electrical Engineering",
        "Semester 1/BEE - Class Materials/Past Questions",
      ],
      filter: "^BEE-[0-9]|BEE - Question Collection",
    },
  },
  "1:communication-technique": {
    board: { folders: ["Semester 1/Final Paper"], filter: "communication" },
    old: { folders: ["Semester 1/OLD QUESTIONS /CT"] },
  },
  "1:electronics-devices-and-circuits": {
    board: { folders: ["Semester 1/Final Paper"], filter: "edc|electronics" },
    old: { folders: ["Semester 1/OLD QUESTIONS /Electronics Devices & Circuits"] },
  },

  // Semester 2
  "2:algebra-and-geometry": {
    board: { folders: ["Semester 2/Final_Paper/Regular"], filter: "algebra and geometry" },
    old: { folders: [] },
  },
  "2:applied-physics": {
    board: { folders: ["Semester 2/Final_Paper/Regular"], filter: "applied_?physics|pplied physics" },
    old: { folders: [] },
  },
  "2:applied-chemistry": {
    // "Engineering Chemistry.pdf" (Regular) = Spring 2023 (fallback);
    // "Applied Chemistry Question Paper.pdf" (subject folder) = Spring 2024.
    // The subject folder's other files are notes/syllabus — filtered out.
    board: {
      folders: ["Semester 2/Final_Paper/Regular", "Semester 2/Applied Chemistry"],
      filter: "Question Paper|engineering chemistry",
      terms: { "applied chemistry question paper": "spring-2024" },
    },
    old: { folders: [] },
  },
  "2:basic-engineering-drawing": {
    board: { folders: ["Semester 2/Final_Paper/Regular"], filter: "drawing" },
    old: { folders: [] },
  },
  "2:object-oriented-programming-in-cpp": {
    board: { folders: ["Semester 2/Final_Paper/Regular"], filter: "oop" },
    // Dated papers live in "Old Questions/C + +"; the subject folder's
    // "C++ (2).pdf" is an undated old-course paper (Additional bucket).
    old: {
      folders: ["Semester 2/Old Questions/C + +", "Semester 2/C++/OLD QN"],
    },
  },
  "2:data-structure-and-algorithm": {
    board: {
      folders: [
        "Semester 2/Final_Paper/Back Exam",
        "Semester 2/DSA/Past Questions Collection",
        "Semester 2/DSA/PEC",
      ],
      // Only actual board papers: assignments, unit notes, RT-portion sheets and
      // exam solutions are excluded from the question-paper route entirely.
      filter: "^(?!.*(assignment|unit|rt[-_ ]?portion|exam soln))(dsa|data structure|bca)",
      terms: {
        dsa: "spring-2023",
        "dsa_6th sem back": "spring-2025",
      },
    },
    old: {
      // "Old Board Question" is entirely old-course; the *Old file in
      // Final_Paper is the old-syllabus Spring 2024 paper. Only old-course
      // names are matched (dash-prefixed board files + the Old-suffixed file);
      // the new-syllabus Back Exam files (DSA_Fall, DSA_2024Fall, ...) are
      // excluded, and IMG_4848.heic is intentionally not shown.
      folders: ["Semester 2/DSA/Old Board Question", "Semester 2/Final_Paper"],
      filter: "DSA-|2024SpringOld",
    },
  },
  "2:instrumentation": {
    board: {
      folders: ["Semester 2/Final_Paper/Back Exam"],
      filter: "instru|^ins_",
    },
    old: {
      folders: ["Semester 2/Final_Paper"],
      filter: "Instrumentation OLD",
      terms: { "instrumentation old": "spring-2024" },
    },
  },

  // Semester 3
  "3:calculus-ii": {
    board: { folders: ["Semester 3/Board Exam Sem 3"], filter: "calculus ?II" },
    // Question-Collection1.pdf is a question collection → old course.
    old: {
      folders: ["Semester 3/Calculus II"],
      filter: "Question-Collection1",
    },
  },
  "3:database-management-system": {
    board: { folders: ["Semester 3/Board Exam Sem 3"], filter: "dbms|database management system" },
    old: { folders: [] },
  },
  "3:operating-systems": {
    board: { folders: ["Semester 3/Board Exam Sem 3"], filter: "operating system" },
    old: { folders: [] },
  },
  "3:microprocessor-and-assembly-language-programming": {
    board: {
      folders: ["Semester 3/Board Exam Sem 3"],
      // "MP and ALP back 1.pdf" is the Fall 2023 back paper (fallback).
      filter: "mp[-_ ]?(and|&)?[-_ ]?alp|mp and alp",
    },
    // "Past Questions" folder is old course (per user: past question = old).
    old: {
      folders: ["Semester 3/MP and ALP/Past Questions"],
      filter: "microprocessor|mpalp",
    },
  },
  "3:computer-graphics": {
    board: { folders: ["Semester 3/Board Exam Sem 3"], filter: "computer graphics" },
    old: { folders: [] },
  },
  "3:data-communication": {
    board: { folders: ["Semester 3/Board Exam Sem 3"], filter: "data communication" },
    old: { folders: [] },
  },

  // Semester 4
  "4:applied-mathematics": {
    // Only season-named papers (AM 2024/2025) + the board paper itself are shown;
    // notes/IMP/scans and "old question" stay out of the new-syllabus route.
    board: {
      folders: ["Semester 4/Board Questions", "Semester 4/Applied Mathematics"],
      filter: "applied maths board|^AM 2024 (Fall|Spring)|^AM 2025 (Fall|Spring)",
    },
    old: {
      folders: ["Semester 4/Applied Mathematics"],
      filter: "old question",
    },
  },
  "4:computer-architecture": {
    // "CA SEMESTER FALL.pdf" is Fall 2024 (explicit term).
    board: {
      folders: ["Semester 4/Board Questions"],
      filter: "ca[-_ ]?semester|computer architecture",
      terms: { "ca semester fall": "fall-2024" },
    },
    // "Past Question Collection" and handwritten "CA Questions" are old course
    // (undated → old-syllabus Additional papers).
    old: {
      folders: ["Semester 4/CA/Past Question Collection", "Semester 4/CA Handwritten"],
      filter: "ca[-_ ]?1|^ca[.]|CA Questions",
    },
  },
  "4:advanced-programming-with-java": {
    board: { folders: ["Semester 4/Board Questions"], filter: "java" },
    old: { folders: ["Semester 4/Old Questions"], filter: "java" },
  },
  "4:numerical-methods": {
    board: { folders: ["Semester 4/Board Questions"], filter: "nm" },
    old: { folders: ["Semester 4/Old Questions"], filter: "^nm|^- ?nm|nm[-_ .]" },
  },
  "4:theory-of-computation": {
    board: { folders: ["Semester 4/Board Questions"], filter: "toc" },
    old: { folders: ["Semester 4/Old Questions"], filter: "toc" },
  },
  "4:research-fundamentals": {
    board: { folders: ["Semester 4/Board Questions"], filter: "research" },
    old: { folders: [] },
  },

  // Semester 5
  "5:probability-and-statistics": {
    board: { folders: ["Semester 5/Final Paper"], filter: "probability|(^|[\\s-])ps[-_ ]" },
    old: { folders: ["Semester 5/Old Question/Probability and Statistics"] },
  },
  "5:embedded-system": {
    board: { folders: ["Semester 5/Final Paper"], filter: "embedded system" },
    old: { folders: ["Semester 5/Old Question/Embedded Systems"] },
  },
  "5:engineering-management": {
    board: { folders: ["Semester 5/Final Paper"], filter: "engineering management" },
    old: { folders: [] },
  },
  "5:artificial-intelligence": {
    board: { folders: ["Semester 5/Final Paper"], filter: "artificial intelligence" },
    old: { folders: ["Semester 5/Old Question"], filter: "artificial intelligence" },
  },
  "5:digital-signal-analysis-and-processing": {
    board: { folders: ["Semester 5/Final Paper"], filter: "dsap|digital signal" },
    old: { folders: ["Semester 5/Old Question"], filter: "dsap|digital signal" },
  },
  "5:software-engineering": {
    board: { folders: ["Semester 5/Final Paper"], filter: "software engineering" },
    old: { folders: ["Semester 5/Old Question/Object Oriented Software Engineering"] },
  },

  // Semester 6
  "6:image-processing-and-pattern-recognition": {
    board: { folders: ["Semester 6/Final Paper"], filter: "ippr|image processing" },
    old: { folders: [] },
  },
  "6:machine-learning": {
    board: { folders: ["Semester 6/Final Paper"], filter: "^ml[.]|machine learning" },
    old: { folders: [] },
  },
  "6:compiler-design": {
    board: { folders: ["Semester 6/Final Paper"], filter: "compiler" },
    old: { folders: [] },
  },
  "6:computer-networks": {
    board: { folders: ["Semester 6/Final Paper"], filter: "network" },
    old: { folders: [] },
  },
  "6:simulation-and-modeling": {
    board: { folders: ["Semester 6/Final Paper"], filter: "snm|simulation" },
    old: { folders: [] },
  },

  // Semester 7
  "7:entrepreneurship-and-professional-practice": {
    // "BOARD QN" holds dated scans: 2025 fall.pdf (Fall 2025), the two
    // 2025-SPRING-0X jpegs (merge into Spring 2025) and FALL-2024.jpeg (Fall 2024).
    board: {
      folders: [
        "Semester 7/Final Paper",
        "Semester 7/Entrepreneurship and Professional Pratice/BOARD QN",
      ],
      filter: "entrepreneurship|2025|FALL-2024",
    },
    old: { folders: [] },
  },
  "7:engineering-economics": {
    // BOARD QN is the authoritative set: EE Fall 2025 (Fall 2025), ...2024 Spring
    // (Spring 2024). (New) = Fall 2024, (New) (2) = Spring 2025. The Final Paper
    // copy (Engineering Economics.pdf) is byte-identical to EE Fall 2025.pdf, so
    // it's deliberately not referenced to avoid showing the paper twice.
    board: {
      folders: ["Semester 7/Engineering Economics/BOARD QN"],
      filter: "engineering economics|\\(New\\)|EE ",
      terms: {
        "engineering economics (new)": "fall-2024",
        "engineering economics (new) (2)": "spring-2025",
      },
    },
    old: { folders: [] },
  },
  "7:network-and-cyber-security": {
    board: { folders: ["Semester 7/Final Paper"], filter: "network and cyber" },
    old: { folders: [] },
  },
  "7:cloud-computing-and-virtualization": {
    board: { folders: ["Semester 7/Final Paper"], filter: "cloud computing" },
    old: { folders: [] },
  },
  "7:data-science-and-analytics": {
    board: { folders: ["Semester 7/Final Paper"], filter: "data science" },
    old: { folders: [] },
  },
};

export const QUESTION_PAPER_VARIANTS = [
  {
    slug: "new-syllabus",
    label: "New Syllabus Question Papers",
    shortLabel: "New Syllabus",
    configKey: "board",
    tagline: "New-syllabus board & final question papers from the current program",
  },
  {
    slug: "old-syllabus",
    label: "Old Syllabus Question Papers",
    shortLabel: "Old Syllabus",
    configKey: "old",
    tagline: "Previous-syllabus question archive",
  },
];

export function getVariantBySlug(variantSlug) {
  return QUESTION_PAPER_VARIANTS.find((item) => item.slug === variantSlug) || QUESTION_PAPER_VARIANTS[0];
}

const SEASON_ORDER = { spring: 0, fall: 1 };
const EXTENSION_RE = /\.[^.]+$/;

// ── Route helpers ────────────────────────────────────────────────────────────
export const QUESTION_PAPER_HOME = "/question-paper";

export function variantHref(variantSlug) {
  return `${QUESTION_PAPER_HOME}/${variantSlug}`;
}

export function subjectPaperHref(variantSlug, subjectSlug) {
  return `${variantHref(variantSlug)}/${subjectSlug}`;
}

export function yearPaperHref(variantSlug, subjectSlug, yearSlug) {
  return `${subjectPaperHref(variantSlug, subjectSlug)}/${yearSlug}`;
}

// Exam-year slug: "Fall 2013" -> "fall-2013", "2013" -> "fall-2013" (fall default)
export function termToSlug(term) {
  if (!term || !term.year) return "";
  const season = (term.season || "fall").toLowerCase();
  return `${season}-${term.year}`;
}

const YEAR_SLUG_RE = /^(fall|spring)-(\d{4})$/i;

export function slugToTerm(yearSlug) {
  const match = String(yearSlug || "")
    .trim()
    .match(YEAR_SLUG_RE);
  if (!match) return null;
  const season = match[1].toLowerCase();
  const year = Number(match[2]);
  return {
    label: `${season[0].toUpperCase()}${season.slice(1)} ${year}`,
    year,
    season,
    sortKey: year * 10 + (SEASON_ORDER[season] || 0),
  };
}

// Parse exam term out of a question-paper filename, e.g.:
//   "BEE-13 Fall.pdf"        -> { label: "Fall 2013", ... }
//   "CT-05 Fall_0001.jpg"    -> { label: "Fall 2005", ... }
//   "DSAP 2025 fall.pdf"     -> { label: "Fall 2025", ... }
//   "DSA_2024SpringOld.pdf"  -> { label: "Spring 2024", ... }
// Returns a term object ({ label, year, season, sortKey }) or null when undetectable.
export function extractExamTerm(fileName) {
  const name = String(fileName || "").replace(EXTENSION_RE, "");
  if (!name) return null;

  let year = null;
  let season = null;

  const four = name.match(/(?:^|[^\d])((?:19|20)\d\d)/);
  if (four) {
    year = Number(four[1]);
  } else {
    const two = name.match(/(?:^|[^\d])(\d{2})(?=[\s_-]*(?:fall|spring))/i);
    if (two) {
      const value = Number(two[1]);
      // Two-digit years in this archive always map to 2000+ (2004..2026)
      year = 2000 + value;
    }
  }

  const seasonMatch = name.match(/fall|spring/i);
  if (seasonMatch) season = seasonMatch[0].toLowerCase();

  if (year === null) return null;

  return {
    label: season ? `${season[0].toUpperCase()}${season.slice(1)} ${year}` : String(year),
    year,
    season: season || "fall",
    sortKey: year * 10 + (SEASON_ORDER[season || "fall"] || 0),
  };
}

function getRawSources(semesterId, subjectSlug) {
  return OLD_QUESTION_SOURCES[`${semesterId}:${subjectSlug}`] || null;
}

export function getOldQuestionSubjects(semesterId) {
  const sem = BLOG_CURRICULUM.find((s) => Number(s.semester) === Number(semesterId));
  if (!sem) return [];
  return sem.subjects
    .map((subject) => ({ slug: subjectToSlug(subject.name), name: subject.name, courseCode: subject.courseCode }))
    .filter((subject) => !EXCLUDED_SUBJECT_SLUGS.has(subject.slug));
}

export function getOldQuestionConfig(semesterId, subjectSlug) {
  const semester = BLOG_CURRICULUM.find((s) => Number(s.semester) === Number(semesterId));
  if (!semester) return null;
  const subject = semester.subjects.find((s) => subjectToSlug(s.name) === subjectSlug);
  if (!subject || EXCLUDED_SUBJECT_SLUGS.has(subjectSlug)) return null;
  return {
    semester,
    subject: { slug: subjectSlug, name: subject.name, courseCode: subject.courseCode },
    sources: getRawSources(semesterId, subjectSlug) || {},
  };
}

// Returns { folders, filter, other, combined, terms } for a single paper collection
// (configKey "board" | "old").
export function getVariantSources(semesterId, subjectSlug, configKey) {
  const config = getOldQuestionConfig(semesterId, subjectSlug);
  if (!config) return { folders: [], filter: null, other: [], combined: {}, terms: {} };
  const sources = config.sources[configKey] || {};
  return {
    folders: sources.folders || [],
    filter: sources.filter || null,
    other: sources.other || [],
    combined: sources.combined || {},
    terms: sources.terms || {},
  };
}

// Looks up a subject anywhere in the curriculum (subject slugs are unique across
// semesters, so semester is not needed in the URL). Returns { semester, subject }
// or null for excluded/missing subjects.
export function getQuestionPaperSubject(subjectSlug) {
  for (const semester of BLOG_CURRICULUM) {
    const subject = semester.subjects.find((item) => subjectToSlug(item.name) === subjectSlug);
    if (subject && !EXCLUDED_SUBJECT_SLUGS.has(subjectSlug)) {
      return {
        semester,
        subject: { slug: subjectSlug, name: subject.name, courseCode: subject.courseCode },
      };
    }
  }
  return null;
}

// Subjects (with their semester) that have a paper archive for the given variant.
export function getVariantSubjects(variantSlug) {
  const configKey = getVariantBySlug(variantSlug).configKey;
  const result = [];
  BLOG_CURRICULUM.forEach((semester) => {
    semester.subjects.forEach((subject) => {
      const slug = subjectToSlug(subject.name);
      if (EXCLUDED_SUBJECT_SLUGS.has(slug)) return;
      const sources = getRawSources(semester.semester, slug);
      const folderList = sources?.[configKey]?.folders || [];
      if (folderList.length > 0) {
        result.push({
          semester,
          subject: { slug, name: subject.name, courseCode: subject.courseCode },
        });
      }
    });
  });
  return result;
}

// All subject-level (variant + subject) static params for the question-paper tree.
export function getAllQuestionPaperSubjectPaths() {
  const paths = [];
  QUESTION_PAPER_VARIANTS.forEach((variant) => {
    getVariantSubjects(variant.slug).forEach(({ subject }) => {
      paths.push({ variant: variant.slug, subjectSlug: subject.slug });
    });
  });
  return paths;
}