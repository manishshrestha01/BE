const BASE_URL = "https://www.manishshrestha012.com.np";

const CURRICULUM = [
  {
    semester: 1,
    subjects: [
      "Calculus I",
      "Digital Logic",
      "Programming in C",
      "Basic Electrical Engineering",
      "Computer Workshop",
      "Communication Technique",
      "Electronics Devices and Circuits",
    ],
  },
  {
    semester: 2,
    subjects: [
      "Algebra and Geometry",
      "Applied Physics",
      "Applied Chemistry",
      "Basic Engineering Drawing",
      "Object Oriented Programming in C++",
      "Data Structure and Algorithm",
      "Instrumentation",
    ],
  },
  {
    semester: 3,
    subjects: [
      "Calculus II",
      "Database Management System",
      "Operating Systems",
      "Microprocessor and Assembly Language Programming",
      "Computer Graphics",
      "Data Communication",
    ],
  },
  {
    semester: 4,
    subjects: [
      "Applied Mathematics",
      "Numerical Methods",
      "Advanced Programming with Java",
      "Theory of Computation",
      "Computer Architecture",
      "Research Fundamentals",
    ],
  },
  {
    semester: 5,
    subjects: [
      "Probability and Statistics",
      "Embedded System",
      "Engineering Management",
      "Artificial Intelligence",
      "Digital Signal Analysis and Processing",
      "Software Engineering",
    ],
  },
  {
    semester: 6,
    subjects: [
      "Image Processing and Pattern Recognition",
      "Machine Learning",
      "Compiler Design",
      "Computer Networks",
      "Simulation and Modeling",
      "Elective I",
      "Project I",
    ],
  },
  {
    semester: 7,
    subjects: [
      "Entrepreneurship and Professional Practice",
      "Engineering Economics",
      "Network and Cyber Security",
      "Cloud Computing and Virtualization",
      "Data Science and Analytics",
      "Elective II",
    ],
  },
  {
    semester: 8,
    subjects: ["Elective III", "Internship", "Project II"],
  },
];

const SUBJECT_COURSE_CODES = {
  "Calculus I": "MTH 110",
  "Digital Logic": "ELX 110",
  "Programming in C": "CMP 124",
  "Basic Electrical Engineering": "ELE 120",
  "Computer Workshop": "CMP 122",
  "Communication Technique": "ENG 110",
  "Electronics Devices and Circuits": "ELX 120",
  "Algebra and Geometry": "MTH 150",
  "Applied Physics": "PHY 110",
  "Applied Chemistry": "CHM 110",
  "Basic Engineering Drawing": "MEC 116",
  "Object Oriented Programming in C++": "CMP 162",
  "Data Structure and Algorithm": "CMP 160",
  "Instrumentation": "ELE 172",
  "Calculus II": "MTH 210",
  "Database Management System": "CMP 222",
  "Operating Systems": "CMP 232",
  "Microprocessor and Assembly Language Programming": "CMP 224",
  "Computer Graphics": "CMP 234",
  "Data Communication": "CMM 220",
  "Applied Mathematics": "MTH 250",
  "Numerical Methods": "MTH 252",
  "Advanced Programming with Java": "CMP 228",
  "Theory of Computation": "CMP 264",
  "Computer Architecture": "CMP 262",
  "Research Fundamentals": "CMP 270",
  "Probability and Statistics": "MTH 216",
  "Embedded System": "ELX 320",
  "Engineering Management": "MGT 320",
  "Artificial Intelligence": "CMP 346",
  "Digital Signal Analysis and Processing": "CMM 344",
  "Software Engineering": "CMP 348",
  "Image Processing and Pattern Recognition": "CMP 441",
  "Machine Learning": "CMP 364",
  "Compiler Design": "CMP 422",
  "Computer Networks": "CMP 344",
  "Simulation and Modeling": "CMP 338",
  "Project I": "PRJ 360",
  "Entrepreneurship and Professional Practice": "MGT 332",
  "Engineering Economics": "MGT 250",
  "Network and Cyber Security": "CMP 426",
  "Cloud Computing and Virtualization": "CMP 424",
  "Data Science and Analytics": "CMP 360",
  Internship: "INT 492",
  "Project II": "PRJ 452",
};

const SUBJECT_CREDITS = {
  "Calculus I": 3,
  "Digital Logic": 3,
  "Programming in C": 3,
  "Basic Electrical Engineering": 3,
  "Computer Workshop": 1,
  "Communication Technique": 2,
  "Electronics Devices and Circuits": 3,
  "Algebra and Geometry": 3,
  "Applied Physics": 3,
  "Applied Chemistry": 2,
  "Basic Engineering Drawing": 1,
  "Object Oriented Programming in C++": 3,
  "Data Structure and Algorithm": 3,
  Instrumentation: 3,
  "Calculus II": 3,
  "Database Management System": 3,
  "Operating Systems": 3,
  "Microprocessor and Assembly Language Programming": 3,
  "Computer Graphics": 3,
  "Data Communication": 3,
  "Applied Mathematics": 3,
  "Numerical Methods": 2,
  "Advanced Programming with Java": 3,
  "Theory of Computation": 3,
  "Computer Architecture": 3,
  "Research Fundamentals": 2,
  "Probability and Statistics": 3,
  "Embedded System": 2,
  "Engineering Management": 2,
  "Artificial Intelligence": 3,
  "Digital Signal Analysis and Processing": 3,
  "Software Engineering": 3,
  "Image Processing and Pattern Recognition": 3,
  "Machine Learning": 3,
  "Compiler Design": 2,
  "Computer Networks": 3,
  "Simulation and Modeling": 3,
  "Elective I": 3,
  "Project I": 2,
  "Entrepreneurship and Professional Practice": 2,
  "Engineering Economics": 3,
  "Network and Cyber Security": 3,
  "Cloud Computing and Virtualization": 2,
  "Data Science and Analytics": 2,
  "Elective II": 3,
  "Elective III": 3,
  Internship: 3,
  "Project II": 3,
};

const SEMESTER_OVERVIEWS = {
  1: "Semester 1 of the Pokhara University BE Computer Engineering program builds the fundamental academic base required for every computer engineering student. In this semester, students are introduced to core mathematical concepts through Calculus I, basic programming logic using Programming in C, and foundational hardware understanding via Digital Logic and Basic Electrical Engineering. Alongside technical subjects, Communication Technique helps students improve their professional writing and presentation skills, which are essential throughout the engineering journey.\n\nThis semester focuses heavily on developing problem-solving ability, analytical thinking, and basic coding confidence. The Computer Workshop and Electronics Devices and Circuits subjects provide early exposure to practical and laboratory-based learning. By the end of Semester 1, BE Computer Engineering students at Pokhara University gain the essential groundwork needed to smoothly transition into more advanced computing and software-oriented subjects in later semesters.",
  2: "Semester 2 of the BE Computer Engineering program at Pokhara University strengthens the scientific and programming foundation established in the first semester. Students study Algebra and Geometry to enhance mathematical reasoning, while Applied Physics and Applied Chemistry deepen their understanding of physical systems relevant to computing hardware. The introduction of Object Oriented Programming in C++ marks an important transition from procedural programming toward modern software development practices.\n\nIn addition, subjects like Basic Engineering Drawing and Instrumentation provide interdisciplinary engineering exposure, while Data Structure and Algorithm begins the journey into efficient problem solving and computational thinking. This semester is particularly important because it bridges basic engineering knowledge with structured programming concepts, preparing students for core computer science subjects in upcoming semesters.",
  3: "Semester 3 represents the true entry point into core computer engineering at Pokhara University. During this semester, BE Computer Engineering students dive deeper into system-level and software-level concepts such as Database Management Systems, Operating Systems, and Microprocessor and Assembly Language Programming. These subjects form the backbone of modern computing infrastructure.\n\nCalculus II continues mathematical development, while Computer Graphics introduces visualization and graphical computation concepts. Data Communication provides the first formal exposure to networking fundamentals. This semester significantly enhances students' understanding of how software interacts with hardware and how data flows within computer systems. Successfully completing Semester 3 equips students with the conceptual clarity required for advanced architecture, networking, and software engineering topics.",
  4: "Semester 4 of the Pokhara University BE Computer Engineering curriculum focuses on strengthening theoretical computer science and advanced programming capabilities. Students study Applied Mathematics and Numerical Methods to support computational problem solving, while Advanced Programming with Java expands object-oriented software development skills. Theory of Computation introduces the mathematical foundations of computing, which is essential for understanding compilers, automata, and algorithm limits.\n\nComputer Architecture provides detailed insight into processor organization and memory systems, while Research Fundamentals begins preparing students for academic and project-based work. This semester is academically rigorous and plays a crucial role in transforming students from basic programmers into well-rounded computer engineering learners ready for specialized domains.",
  5: "Semester 5 marks the transition of BE Computer Engineering students at Pokhara University into specialized and intelligent computing domains. Probability and Statistics builds the mathematical base required for data-driven computing, while Embedded System introduces hardware-software integration concepts used in IoT and real-time systems. Engineering Management develops essential project and team management skills needed in professional environments.\n\nArtificial Intelligence and Digital Signal Analysis and Processing expose students to modern computational intelligence and signal processing techniques. Software Engineering formalizes the principles of large-scale software development, including design methodologies and lifecycle models. This semester significantly enhances both theoretical understanding and practical engineering maturity, preparing students for advanced AI, networking, and data science topics.",
  6: "Semester 6 is one of the most technically intensive phases of the Pokhara University BE Computer Engineering program. Students explore advanced computational intelligence through Machine Learning and Image Processing and Pattern Recognition, both of which are highly relevant in modern AI-driven applications. Compiler Design deepens understanding of programming language processing, while Computer Networks provides comprehensive knowledge of network architectures and protocols.\n\nSimulation and Modeling helps students analyze complex systems mathematically, and Project I introduces structured project development experience. Elective I allows partial specialization based on student interest. By the end of Semester 6, students develop strong analytical, networking, and intelligent system design skills that are highly valued in both industry and research environments.",
  7: "Semester 7 of the BE Computer Engineering program at Pokhara University focuses on professional readiness and emerging technology domains. Engineering Economics helps students understand financial decision-making in engineering projects, while Entrepreneurship and Professional Practice develops innovation and business awareness. Network and Cyber Security strengthens knowledge of secure system design, which is critical in modern computing environments.\n\nCloud Computing and Virtualization introduces scalable infrastructure concepts used in today's distributed systems, and Data Science and Analytics prepares students for data-driven problem solving. Elective II allows further specialization. This semester bridges academic knowledge with real-world industry requirements, positioning students for internships, research, and final-year projects.",
  8: "Semester 8 is the final phase of the Pokhara University BE Computer Engineering journey and focuses on practical industry readiness. The Internship component provides real-world professional exposure, allowing students to apply their accumulated technical knowledge in organizational environments. Project II serves as the capstone engineering project, where students design, implement, and present a complete computing solution.\n\nElective III allows final specialization based on career interests such as AI, networking, cloud computing, or software engineering. This semester emphasizes independent problem solving, professional communication, and full-cycle project development. Upon completion of Semester 8, BE Computer Engineering graduates from Pokhara University are prepared for software development roles, system engineering positions, research opportunities, and higher studies.",
};

const SEMESTER_TIPS = {
  1: [
    "Create a weekly routine that balances Calculus I problem sets with Programming in C lab practice so your math and coding improve together.",
    "Use one notebook for formulas and one for conceptual errors; this will make revision before sessional exams faster.",
    "Practice Communication Technique by explaining Digital Logic concepts out loud in plain language.",
  ],
  2: [
    "Solve at least three Data Structure and Algorithm problems every week and write down complexity analysis after each one.",
    "Keep compact revision sheets for Algebra and Geometry, Applied Physics, and Applied Chemistry to connect formulas with examples.",
    "Rewrite selected C programs into Object Oriented Programming in C++ patterns to strengthen design thinking.",
  ],
  3: [
    "Pair Operating Systems theory with short process and memory diagrams after each chapter.",
    "Practice SQL queries directly while studying Database Management System so retrieval logic becomes automatic.",
    "Use mini practical tasks in Computer Graphics and Data Communication to connect concepts with implementation.",
  ],
  4: [
    "Break Theory of Computation into small daily targets and solve one automata problem in each study session.",
    "For Numerical Methods, record method assumptions, convergence conditions, and common mistakes in one table.",
    "Use Research Fundamentals assignments to improve report structure before major projects.",
  ],
  5: [
    "Map Probability and Statistics ideas directly to Artificial Intelligence examples for better retention.",
    "For Embedded System, check hardware constraints before coding to reduce debugging cycles.",
    "Use a requirement-to-test checklist in Software Engineering to build real project discipline.",
  ],
  6: [
    "Treat Project I as a release process: define milestones, risks, and demo checkpoints from week one.",
    "In Machine Learning, spend equal effort on data preprocessing, evaluation metrics, and error analysis.",
    "Use flow summaries for Compiler Design and layered diagrams for Computer Networks during revision.",
  ],
  7: [
    "Use Engineering Economics to justify technical choices in assignments and projects.",
    "Create a security glossary for Network and Cyber Security and revise it weekly.",
    "Build small cloud labs while studying Cloud Computing and Virtualization for practical clarity.",
  ],
  8: [
    "Plan Project II with a realistic timeline covering design, implementation, testing, and final documentation.",
    "Keep weekly internship notes so viva and interview preparation becomes straightforward.",
    "Choose Elective III based on career direction and align project scope with that specialization.",
  ],
};

const FALLBACK_OVERVIEW =
  "This semester builds on previous fundamentals and prepares students for upcoming advanced courses. Focus on consistent revision, concept mapping, and applied practice to improve both exam performance and practical confidence in Pokhara University BE Computer Engineering.";

const FALLBACK_TIPS = [
  "Study core concepts first, then solve practical problems every week.",
  "Keep concise revision notes after each lecture to reduce pre-exam stress.",
  "Use past questions and lab exercises to check real understanding.",
];

export function subjectToSlug(subjectName) {
  return subjectName
    .replace(/c\+\+/gi, "cpp")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function detectSubjectTrack(subjectName) {
  const s = subjectName.toLowerCase();

  if (/calculus|algebra|mathematics|numerical|probability|statistics/.test(s)) {
    return "math";
  }

  if (/digital logic|electrical|electronics|microprocessor|embedded|architecture|instrumentation/.test(s)) {
    return "hardware";
  }

  if (/data communication|network|cyber security|cloud|virtualization/.test(s)) {
    return "network";
  }

  if (/machine learning|artificial intelligence|image processing|pattern recognition|data science|analytics/.test(s)) {
    return "intelligence";
  }

  if (/project|internship|research|management|economics|entrepreneurship|professional practice|communication technique/.test(s)) {
    return "professional";
  }

  if (/compiler|database|operating systems|graphics|programming|java|c\+\+|data structure|theory of computation|software engineering/.test(s)) {
    return "software";
  }

  return "general";
}

function getTrackFocusLabel(track) {
  const labels = {
    math: "mathematical modeling and problem solving",
    hardware: "system-level hardware understanding",
    network: "communication stack and infrastructure reasoning",
    intelligence: "data-driven and intelligent decision systems",
    professional: "project execution and professional engineering practice",
    software: "algorithmic and software implementation thinking",
    general: "core engineering reasoning",
  };

  return labels[track] || labels.general;
}

function makeSemesterPayload(semesterInfo) {
  const semesterSlug = `semester/${semesterInfo.semester}`;
  const subjects = semesterInfo.subjects.map((name, index) => {
    const slug = subjectToSlug(name);
    const courseCode = SUBJECT_COURSE_CODES[name] || null;
    const credit = SUBJECT_CREDITS[name] ?? null;
    return {
      index,
      name,
      courseCode,
      credit,
      slug,
      urlPath: `/blog/${semesterSlug}/${slug}`,
      absoluteUrl: `${BASE_URL}/blog/${semesterSlug}/${slug}`,
    };
  });

  const semesterOverviewRaw = SEMESTER_OVERVIEWS[semesterInfo.semester] || FALLBACK_OVERVIEW;
  const overviewParagraphs = semesterOverviewRaw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return {
    semester: semesterInfo.semester,
    semesterSlug,
    title: `Semester ${semesterInfo.semester}`,
    subjectCount: semesterInfo.subjects.length,
    subjects,
    urlPath: `/blog/${semesterSlug}`,
    absoluteUrl: `${BASE_URL}/blog/${semesterSlug}`,
    overview: overviewParagraphs.join("\n\n"),
    overviewParagraphs,
    tips: SEMESTER_TIPS[semesterInfo.semester] || FALLBACK_TIPS,
  };
}

export const BLOG_BASE_URL = BASE_URL;
export const BLOG_LAST_UPDATED = "2026-02-19";

export const BLOG_CURRICULUM = CURRICULUM.map(makeSemesterPayload);

export function getSemesterByNumber(semesterNumber) {
  return BLOG_CURRICULUM.find((item) => item.semester === Number(semesterNumber)) || null;
}

export function getSubjectBySlug(semesterNumber, subjectSlug) {
  const semester = getSemesterByNumber(semesterNumber);
  if (!semester) return null;

  const subject = semester.subjects.find((item) => item.slug === subjectSlug);
  if (!subject) return null;

  return { semester, subject };
}

export function getSubjectNeighbors(semesterNumber, subjectSlug) {
  const semester = getSemesterByNumber(semesterNumber);
  if (!semester) return { previous: null, next: null };

  const index = semester.subjects.findIndex((item) => item.slug === subjectSlug);
  if (index < 0) return { previous: null, next: null };

  return {
    previous: index > 0 ? semester.subjects[index - 1] : null,
    next: index < semester.subjects.length - 1 ? semester.subjects[index + 1] : null,
  };
}

export function getRelatedSubjects(semesterNumber, subjectSlug, limit = 3) {
  const semester = getSemesterByNumber(semesterNumber);
  if (!semester) return [];

  return semester.subjects
    .filter((item) => item.slug !== subjectSlug)
    .slice(0, limit);
}

export function getAllBlogPaths() {
  return [
    "/blog",
    ...BLOG_CURRICULUM.map((semester) => semester.urlPath),
    ...BLOG_CURRICULUM.flatMap((semester) => semester.subjects.map((subject) => subject.urlPath)),
  ];
}

export function buildSemesterDescription(semester) {
  const subjectPreview = semester.subjects
    .slice(0, 2)
    .map((subject) => subject.name)
    .join(", ");

  return `Pokhara University BE Computer Engineering Semester ${semester.semester} study guide with subject-wise articles, tips, and revision strategy. Includes ${subjectPreview}.`;
}

export function buildSubjectDescription(semester, subject) {
  const courseCodeLabel = subject.courseCode ? ` (course code ${subject.courseCode})` : "";
  return `Pokhara University BE Computer Engineering semester ${semester.semester} tutorial for ${subject.name}${courseCodeLabel} with syllabus, key topics, concepts, and 5 practice questions.`;
}

export function formatUpdatedDate(dateString = BLOG_LAST_UPDATED) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function buildLearningOutcomes(semester, subject) {
  const track = detectSubjectTrack(subject.name);
  const focus = getTrackFocusLabel(track);

  return [
    `Understand the full role of ${subject.name} in Pokhara University BE Computer Engineering semester ${semester.semester}.`,
    `Identify the core definitions, principles, and recurring exam patterns used in ${subject.name}.`,
    `Connect theory with practical implementation steps and lab-ready workflow for ${subject.name}.`,
    `Build a weekly revision routine that improves ${focus} and long-term retention.`,
    `Prepare structured answers for short, long, and scenario-based university questions.`,
  ];
}

export function buildSubjectIntro(semester, subject) {
  const semesterNumber = semester.semester;
  const track = detectSubjectTrack(subject.name);
  const focus = getTrackFocusLabel(track);

  return [
    `In Pokhara University BE Computer Engineering semester ${semesterNumber}, ${subject.name} is not just another syllabus item; it is one of the core knowledge blocks that influences how students perform in later technical courses. A common mistake is to prepare this subject only by reading theory line by line before exams. A stronger method is to combine conceptual reading, short written summaries, and repeated problem-oriented practice from the first month of the term. That approach helps students understand why each unit exists, where questions usually come from, and how to convert chapter-level understanding into scoring answers. The goal of this guide is to help you study ${subject.name} in a way that is practical, academic, and aligned with university evaluation style.`,
    `For most Pokhara University students, BE Computer Engineering semester ${semesterNumber} becomes difficult when multiple technical courses peak at the same time. To manage this, you should treat ${subject.name} as a weekly system rather than a last-week task. Start with syllabus mapping, then split each unit into concept checkpoints, worked examples, and revision questions. When the subject includes derivations, algorithms, circuits, models, or design flow, write each one in your own format and review it repeatedly. This habit improves memory and writing speed together. It also reduces panic during sessional exams because you are revising familiar structures instead of discovering content at the last moment.`,
    `Another important point is integration. In BE Computer Engineering, subjects do not exist in isolation. ${subject.name} supports ${focus}, and this connection appears again in projects, labs, viva sessions, and advanced electives. If you actively build links between chapters and real engineering tasks, your understanding becomes deeper and more stable. For example, instead of memorizing definitions in isolation, ask how each concept influences performance, reliability, scalability, or implementation constraints. That style of thinking helps you answer both theoretical and application-oriented questions with confidence. It also improves your project communication because you can explain not only what a concept is, but where and why it is used.`,
    `This StudyMate tutorial is structured for that exact workflow. You will find a syllabus overview, important topics, concept explanations, and practice questions that can be used for self-testing. Use the Table of Contents to jump directly to weak areas, then return to the sections on What You Will Learn and Important Topics for fast revision loops. By following this pattern consistently, students in Pokhara University BE Computer Engineering semester ${semesterNumber} can turn ${subject.name} into a high-confidence, high-scoring subject instead of a last-minute burden.`,
  ];
}

export function buildSyllabusOverview(subject) {
  return [
    `Introduction to scope, objectives, and technical vocabulary of ${subject.name}.`,
    `Core principles and models that define the analytical foundation of ${subject.name}.`,
    `Methodology or workflow units focused on implementation, design, or system behavior.`,
    `Numerical, procedural, or architectural problems commonly asked in exams.`,
    `Application-oriented unit connecting ${subject.name} with BE Computer Engineering practice.`,
    `Revision-focused unit with previous-question patterns and evaluation strategy.`,
  ];
}

export function buildImportantTopics(subject) {
  return [
    `${subject.name} key terminology, definitions, and conceptual boundaries.`,
    `Frequently repeated long-question themes and stepwise answer structures.`,
    `Important derivations, algorithms, diagrams, or design flows used in evaluations.`,
    `Common conceptual traps and correction strategy for high-weight chapters.`,
    `Practical use cases and integration with Pokhara University BE Computer Engineering labs.`,
    `Fast revision checklist for final 7 days before semester exams.`,
  ];
}

export function buildConceptSections(semester, subject) {
  const track = detectSubjectTrack(subject.name);

  const sectionMap = {
    math: [
      {
        title: "Conceptual Foundation and Mathematical Structure",
        body: `${subject.name} in semester ${semester.semester} should be approached through assumptions, notation discipline, and model interpretation. Start by identifying each theorem, relation, or transformation with its required conditions. Then practice translating verbal problem statements into formal expressions. This reduces errors in derivation-based questions and gives you control over multi-step answers. In Pokhara University evaluations, students who show clean logical transitions between steps usually score higher than those who only present final results.`,
      },
      {
        title: "Problem Solving Workflow for Exam Conditions",
        body: `During preparation, solve representative problems under a timed sequence: identify type, select method, execute steps, and verify the final expression. Keep an error log that records sign mistakes, assumption misses, and unit mismatches. That log is often more valuable than solving many random problems. In BE Computer Engineering, mathematical subjects support later analytical courses, so accuracy and structured reasoning in ${subject.name} directly improve your performance in advanced subjects as well.`,
      },
      {
        title: "Application Perspective in Engineering Context",
        body: `To make ${subject.name} more memorable, connect each major concept with an engineering use case such as optimization, estimation, signal interpretation, or algorithm behavior. This practical framing helps in descriptive answers and viva discussions. It also prevents concept fragmentation, because each chapter is remembered by purpose rather than only by formula.`,
      },
    ],
    hardware: [
      {
        title: "System View: Components, Signals, and Constraints",
        body: `${subject.name} becomes easier when you study it as a complete system rather than isolated definitions. Track how input conditions, component behavior, and output response are linked in each unit. For Pokhara University BE Computer Engineering semester ${semester.semester}, exam questions frequently reward this system-level explanation because it demonstrates true understanding of hardware behavior.`,
      },
      {
        title: "Design and Troubleshooting Logic",
        body: `In hardware-oriented subjects, marks are often lost when students skip reasoning steps. Practice writing design flow in sequence: requirement, selection, configuration, validation, and limitation. Add one troubleshooting path for each practical topic so you can explain failure cases as well. This makes answers stronger in both written and oral evaluation.`,
      },
      {
        title: "Linking Theory with Lab Execution",
        body: `Use lab sessions as conceptual reinforcement, not only completion tasks. Before each lab, summarize expected behavior and parameters. After each lab, write what changed when conditions changed. This habit builds confidence and helps you convert practical experience into precise exam explanations in ${subject.name}.`,
      },
    ],
    network: [
      {
        title: "Layered Thinking and Protocol Responsibility",
        body: `${subject.name} should be learned with clear boundaries between layers, modules, or service roles. Create one compact sheet that states what each layer does, what data it handles, and what failures it can face. In semester ${semester.semester}, this layered clarity helps you answer architecture questions with less confusion and better structure.`,
      },
      {
        title: "Flow Analysis and Performance Reasoning",
        body: `Instead of memorizing terms, practice flow analysis: where data starts, where it is transformed, and where performance bottlenecks appear. For network and cloud topics, include reliability, latency, and security considerations in your answers. Pokhara University examiners often value this multi-factor reasoning because it reflects real deployment understanding.`,
      },
      {
        title: "Security and Operations Perspective",
        body: `For higher scores, pair each theoretical topic with one operational or security implication. Explain what can fail, how it can be detected, and what control can mitigate it. This habit upgrades your descriptive answers from textbook-level to engineering-level quality in ${subject.name}.`,
      },
    ],
    intelligence: [
      {
        title: "Model Intuition Before Formula Memorization",
        body: `In ${subject.name}, begin with intuition: what problem is solved, what data is required, and what output quality means. Once this frame is clear, formulas and workflows become easier to remember. In BE Computer Engineering semester ${semester.semester}, students who build conceptual intuition usually perform better in both algorithm explanation and practical interpretation questions.`,
      },
      {
        title: "Pipeline Thinking for Reliable Results",
        body: `Treat each chapter as part of a pipeline: data understanding, preprocessing, method selection, evaluation, and refinement. When writing answers, explicitly mention this sequence. It demonstrates maturity and prevents fragmented explanations. This approach is especially effective for long-form questions where clarity and structure are heavily weighted.`,
      },
      {
        title: "Interpretability and Practical Communication",
        body: `A complete answer should include not only method but also interpretation. Explain what outputs mean, when the approach may fail, and how to improve reliability. This communication skill matters in exams, project reports, and viva sessions, and it makes ${subject.name} directly useful for final-year work.`,
      },
    ],
    professional: [
      {
        title: "Framework for Decision and Execution",
        body: `${subject.name} in semester ${semester.semester} is best studied through structured decision-making. Identify goals, constraints, stakeholders, and measurable outputs in every unit. This method helps you convert abstract theory into practical engineering responses and improves answer quality for scenario-based questions.`,
      },
      {
        title: "Documentation and Communication Quality",
        body: `Professional subjects reward clarity. Practice concise technical writing: define context, present method, justify decisions, and summarize outcomes. This skill improves grading outcomes and also strengthens project documentation standards in BE Computer Engineering workflow.`,
      },
      {
        title: "Integration with Internship and Project Work",
        body: `Use each topic as a template for real activity logs, risk sheets, cost decisions, or reflection notes. When theory is immediately reused in real tasks, retention improves and viva responses become far more confident. That practical integration is the fastest way to make ${subject.name} highly valuable.`,
      },
    ],
    software: [
      {
        title: "Core Constructs and Execution Model",
        body: `Start ${subject.name} by understanding execution flow, data handling, and modular structure. In semester ${semester.semester}, exam questions often test whether you can explain not just syntax or terms, but how components interact during execution. Build this mental model early and revisit it for each chapter.`,
      },
      {
        title: "Design Thinking and Implementation Strategy",
        body: `Use a design-first routine before writing any solution: define input-output behavior, choose data representation, draft control flow, then implement. This prevents common logical mistakes and makes your answers cleaner in algorithmic and descriptive questions. In Pokhara University BE Computer Engineering, this stepwise approach strongly improves both lab output and theory performance.`,
      },
      {
        title: "Testing, Optimization, and Exam Presentation",
        body: `For higher marks, include validation and optimization discussion in your answers. Mention edge cases, complexity, error handling, or maintainability where relevant. Examiners usually reward students who demonstrate full engineering reasoning rather than isolated implementation steps in ${subject.name}.`,
      },
    ],
    general: [
      {
        title: "Concept Baseline",
        body: `${subject.name} should be studied through definitions, objectives, and chapter-level structure before moving to depth. This baseline prevents confusion when advanced sections begin.`,
      },
      {
        title: "Applied Reasoning",
        body: `After baseline preparation, practice how each concept is applied in real BE Computer Engineering scenarios. Application-based thinking improves retention and answer quality.`,
      },
      {
        title: "Revision Method",
        body: `Keep one short summary sheet per unit and revise it every week. Frequent compact revision is more reliable than one-time heavy reading.`,
      },
    ],
  };

  return sectionMap[track] || sectionMap.general;
}

export function buildPracticeQuestions(semester, subject) {
  return [
    `Explain the role of ${subject.name} in Pokhara University BE Computer Engineering semester ${semester.semester} and justify its academic importance.`,
    `Write a structured note on two major units of ${subject.name} and compare their practical engineering relevance.`,
    `Present a stepwise solution or workflow for one common exam-style problem from ${subject.name}.`,
    `Analyze how ${subject.name} supports related subjects in nearby semesters of the BE Computer Engineering curriculum.`,
    `Design a two-week revision plan for ${subject.name} that balances concept review, problem solving, and self-testing.`,
  ];
}

export function buildInternalLinks(semester, subject) {
  const links = [
    { label: "Go to Important Topics", href: "#important-topics" },
    { label: "Jump to Practice Questions", href: "#practice-questions" },
    { label: `Back to Semester ${semester.semester}`, href: semester.urlPath },
  ];

  const related = getRelatedSubjects(semester.semester, subject.slug, 2);
  for (const item of related) {
    links.push({ label: `${item.name} guide`, href: item.urlPath });
  }

  return links;
}
