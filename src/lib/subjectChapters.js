import { getSubjectBySlug, subjectToSlug, BLOG_BASE_URL } from "./blogCurriculum";
import { getSubjectArticle, subjectArticles } from "../data/subjectArticles";

const ROMAN_MAP = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
};

const romanToNumber = (roman = "") => {
  const upper = roman.trim().toUpperCase();
  if (!upper) return null;
  let total = 0;
  let prev = 0;
  for (let i = upper.length - 1; i >= 0; i -= 1) {
    const value = ROMAN_MAP[upper[i].toLowerCase()];
    if (!value) return null;
    total += value < prev ? -value : value;
    prev = value;
  }
  return total;
};

export const cleanUnitTitle = (title = "") => {
  const cleaned = title
    .replace(/^unit\s+[ivxlcdmIVXLCDM]+\s*[:.-]?\s*/i, "")
    .replace(/\s*\(.*?hrs?.*?\)\s*$/i, "")
    .trim();
  return cleaned || title;
};

export const parseUnitNumber = (title = "", fallbackIndex = 1) => {
  const match = title.match(/^unit\s+([ivxlcdm]+)\s*[:.-]?\s*/i);
  if (match) {
    const number = romanToNumber(match[1]);
    if (number) return number;
  }
  return fallbackIndex + 1;
};

export const unitTitleToSlug = (unitId = "", title = "") => {
  const idMatch = unitId.match(/^unit-[ivxlcdm]+-(.+)$/i);
  if (idMatch) return idMatch[1].replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const cleaned = cleanUnitTitle(title);
  return subjectToSlug(cleaned);
};

export function getSubjectChapters(semesterId, subjectSlug) {
  const semesterNumber = Number(semesterId);
  const found = getSubjectBySlug(semesterNumber, subjectSlug || "");
  if (!found?.semester?.subjects?.length) return [];

  const article = getSubjectArticle(semesterNumber, subjectSlug);
  if (!article) return [];

  const syllabusSection = article.sections.find((section) => section.id === "syllabus-overview");
  const units = syllabusSection?.units || [];
  if (!units.length) return [];

  const semester = found.semester;
  const subject = found.subject;
  const semesterSlug = semester.semesterSlug || `semester/${semester.semester}`;
  const baseUrl = `/blog/${semesterSlug}/${subject.slug}/chapter`;

  return units.map((unit, index) => {
    const number = parseUnitNumber(unit.title, index);
    const slug = unitTitleToSlug(unit.id, unit.title);
    const urlPath = `${baseUrl}/${slug}`;
    return {
      number,
      slug,
      id: unit.id,
      title: cleanUnitTitle(unit.title),
      rawTitle: unit.title,
      bullets: unit.bullets || [],
      hours: extractHours(unit.title),
      semester: semester.semester,
      semesterSlug,
      semesterUrlPath: semester.urlPath,
      subject: {
        name: subject.name,
        slug: subject.slug,
        courseCode: subject.courseCode || null,
        urlPath: subject.urlPath,
      },
      urlPath,
      absoluteUrl: `${BLOG_BASE_URL}${urlPath}`,
    };
  });
}

function extractHours(title = "") {
  const match = title.match(/\((\d+(?:\.\d+)?)\s*hrs?\)/i);
  return match ? match[1] : null;
}

export function getChapterBySlug(semesterId, subjectSlug, chapterSlug) {
  const chapters = getSubjectChapters(semesterId, subjectSlug);
  return chapters.find((chapter) => chapter.slug === chapterSlug) || null;
}

export function getAllChapterPaths() {
  const paths = [];

  for (let semester = 1; semester <= 8; semester += 1) {
    const articleStore = getStoreForSemester(semester);
    if (!articleStore) continue;

    Object.keys(articleStore).forEach((subjectSlug) => {
      const chapters = getSubjectChapters(semester, subjectSlug);
      chapters.forEach((chapter) => {
        paths.push({
          semesterId: String(semester),
          subjectSlug,
          chapterSlug: chapter.slug,
        });
      });
    });
  }

  return paths;
}

function getStoreForSemester(semester) {
  return subjectArticles[String(semester)] || null;
}