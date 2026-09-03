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

const FOLDER_NAME_TO_SLUG = Object.fromEntries(
  Object.entries(SUBJECT_FOLDER_MAP).map(([slug, name]) => [name.toLowerCase(), slug])
);

export function folderNameToSlug(folderName) {
  const canonicalSlug = FOLDER_NAME_TO_SLUG[folderName.toLowerCase()];
  if (canonicalSlug) return canonicalSlug;

  return folderName
    .toLowerCase()
    .replace(/c\+\+/gi, 'cpp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/^-|-$/g, '');
}

export function slugToFolderName(slug) {
  return SUBJECT_FOLDER_MAP[slug]
    || slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .replace(/Cpp/gi, 'C++');
}

export { SUBJECT_FOLDER_MAP };
