/**
 * Chapter notes data source config.
 *
 * Default chapter mapping rule (applies to every subject): the leading number
 * in a file name is the chapter number — so `1. Introduction.pdf` → chapter 1,
 * `2.1 PU-BEE.pdf` / `2.2 PU-BEE_all.pdf` / `2.3 …` → chapter 2 and its parts.
 * Unnumbered files (e.g. `Syllabus.pdf`) are never shown on chapter pages.
 *
 * `SUBJECT_NOTE_CHAPTER_FILES` overrides that rule for subjects whose notes
 * don't follow the default (e.g. Programming in C where `9. File Handling.pdf`
 * belongs to chapter 8, not chapter 9). File/folder names must match the
 * BE-Computer repo exactly (e.g. `Semester 1/E.D.C/ch 2 BJT.pdf`).
 */

const DIGITAL_LOGIC_DRIVE_URL =
  "https://drive.google.com/file/d/1n2ROmM8bAw2ViF6wS9zD3-1Qcll0Vym7/view?usp=sharing";

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
  "digital-logic": {
    folder: "Semester 1/Digital Logic",
    chapters: {
      1: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      2: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      3: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      4: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      5: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      6: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      7: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      8: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
      9: [{ name: "Complete Solution — Logic Circuit", url: DIGITAL_LOGIC_DRIVE_URL }],
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
  "data-structure-and-algorithm": {
    folder: "Semester 2/DSA/PEC",
    chapters: {
      1: ["DSA Unit 1.pdf"],
      2: ["DSA Unit 2.pdf"],
      3: ["DSA Unit 3.pdf"],
      4: ["DSA Unit 4.pdf"],
      5: ["DSA Unit 5.pdf"],
      6: ["DSA Unit 6.pdf"],
      7: ["DSA Unit 7.pdf"],
    },
  },
  "object-oriented-programming-in-cpp": {
    folder: "Semester 2/C++/PEC",
    chapters: {
      1: ["chapter 1  - object oriented concepts.pdf"],
      2: ["chapter 2 - class and objects.pdf"],
      3: ["chapter 3 - inheritance.pdf"],
      4: ["chapter 4 - polymorphism.pdf"],
      5: ["chapter 5 - templates.pdf"],
      6: ["chapter 6 - exception handling and file handling.pdf"],
    },
  },
  "applied-physics": {
    folder: "Semester 2/Applied Physics/PU",
    chapters: {
      1: ["SP BoCE Physics Note(PU).pdf"],
      2: ["SP BoCE Physics Note(PU).pdf"],
      3: ["SP BoCE Physics Note(PU).pdf"],
      4: ["SP BoCE Physics Note(PU).pdf"],
      5: ["SP BoCE Physics Note(PU).pdf"],
      6: ["SP BoCE Physics Note(PU).pdf"],
      7: ["SP BoCE Physics Note(PU).pdf"],
      8: ["SP BoCE Physics Note(PU).pdf"],
    },
  },
  "applied-chemistry": {
    folder: "Semester 2/Applied Chemistry/Note",
    chapters: {
      1: ["Chemistry Note.pdf"],
      2: ["Chemistry Note.pdf"],
      3: ["Chemistry Note.pdf"],
      4: ["Chemistry Note.pdf"],
      5: ["Chemistry Note.pdf"],
      6: ["Chemistry Note.pdf"],
    },
  },
  "basic-engineering-drawing": {
    folder: "Semester 2/Engineering Drawing",
    chapters: {
      1: ["Mcl_Engineering_drawing.pdf;filename_= UTF-8''Mcl Engineering drawing.pdf"],
      2: ["Mcl_Engineering_drawing.pdf;filename_= UTF-8''Mcl Engineering drawing.pdf"],
      3: ["Mcl_Engineering_drawing.pdf;filename_= UTF-8''Mcl Engineering drawing.pdf"],
      4: ["Mcl_Engineering_drawing.pdf;filename_= UTF-8''Mcl Engineering drawing.pdf"],
      6: ["Mcl_Engineering_drawing.pdf;filename_= UTF-8''Mcl Engineering drawing.pdf"],
    },
  },
  instrumentation: {
    folder: "Semester 2/Instrumentation",
    chapters: {
      1: ["Instrumentation Manual.pdf"],
      2: ["Instrumentation Manual.pdf"],
      3: ["Instrumentation Manual.pdf"],
      4: ["Instrumentation Manual.pdf"],
      5: ["Instrumentation Manual.pdf"],
      6: ["Instrumentation Manual.pdf"],
    },
  },
  "calculus-ii": {
    folder: "Semester 3/Calculus II/BOOK",
    chapters: {
      1: ["Calculus-II.pdf"],
      3: ["Calculus-II.pdf"],
      4: ["Calculus-II.pdf"],
      5: ["Calculus-II.pdf"],
      7: ["Calculus-II.pdf"],
    },
  },
  "computer-graphics": {
    folder: "Semester 3/Computer Graphics",
    chapters: {
      2: ["02. Scan Conversion Algorithms 3.0 .pdf"],
      4: ["04. Graphics in 3-Dimensions 3.0.pdf"],
      5: ["05. Visible Realism 2.0.pdf"],
      6: ["06. Graphics Standards 1.0.pdf"],
      7: ["07. Introduction to OpenGL..pdf"],
    },
  },
  "data-communication": {
    folder: "Semester 3/Data Communication/PEC",
    chapters: {
      1: ["Unit 1 Introduction.pdf"],
      2: ["Unit 2 Data Transmission.pdf"],
      3: ["Unit III pdf scan.pdf", "Signal and Systems.pdf"],
      5: ["Unit 6 Transmission Media.pdf"],
      7: ["Chapter 8 Data Link Control and Protocols.pdf"],
      8: ["Unit 9 multiplexing.pdf"],
      9: ["Chapter9.pdf"],
    },
  },
  "database-management-system": {
    folder: "Semester 3/DBMS/Notes",
    chapters: {
      1: ["Chapter 1.pdf"],
      2: ["Chapter 2.pdf"],
      3: ["Chapter 3.pdf"],
      4: ["Chapter 4.pdf"],
      5: ["Chapter 5.pdf"],
      6: ["Chapter 6.pdf"],
      7: ["Chapter 7.pdf"],
    },
  },
  "microprocessor-and-assembly-language-programming": {
    folder: "Semester 3/MP and ALP",
    chapters: {
      1: ["MALP_manual.pdf"],
      4: ["MALP_manual.pdf"],
      5: ["MALP_manual.pdf"],
    },
  },
  "operating-systems": {
    folder: "Semester 3/OperatingSystem",
    chapters: {
      1: ["chapter 1.pdf"],
      2: ["chapter 2.pdf"],
      3: ["Chapter 3.pdf"],
      4: ["Chapter 4.pdf"],
      5: ["Chapter 5.pdf"],
      6: ["Chapter 6.pdf"],
    },
  },
  "applied-mathematics": {
    folder: "Semester 4/Applied Mathematics",
    chapters: {
      1: ["Applied Math notes.pdf"],
      2: ["Applied Math notes.pdf"],
      3: ["Applied Math notes.pdf"],
      4: ["Applied Math notes.pdf"],
    },
  },
  "computer-architecture": {
    folder: "Semester 4/CA",
    chapters: {
      1: ["ch1.pdf", "ch1-2.pdf"],
      3: ["ch 3.pdf"],
      4: ["ch 4.pdf"],
      5: ["ch 5.pdf"],
      6: ["ch 6.pdf"],
      7: ["ch 7.pdf"],
      8: ["ch 8.pdf"],
      9: ["ch 9.pdf"],
      10: ["ch 10.pdf"],
    },
  },
  "advanced-programming-with-java": {
    folder: "Semester 4/JAVA",
    chapters: {
      1: ["1. Basics of Programming in Java.pptx"],
      2: ["2. Object oriented Principles in Java.pptx"],
      4: ["4. Distributed Network Programming.pptx"],
      5: ["5. Database connectivity with Java.pptx"],
      6: ["6. Servlets and JSP.pptx", "6. Servlets and JSP contd...pptx"],
      7: ["7. Advanced Topics n Java.pptx"],
    },
  },
  "numerical-methods": {
    folder: "Semester 4/Numerical Method GCES",
    chapters: {
      1: ["nm-up-1.pdf"],
      2: ["nm-up-2.pdf"],
      3: ["nm-up-3.pdf"],
      5: ["nm-up-5.pdf"],
    },
  },
  "research-fundamentals": {
    folder: "Semester 4/Research",
    chapters: {
      1: ["Unit 1 Introduction.pdf", "Unit 1 Second Part.pptx"],
      2: ["Unit 2 Research process Model.docx"],
      3: ["Unit 3 Participants and Research Ethics.docx"],
      4: ["Unit 4,5  Research Proposal and Report Writing.pdf"],
      5: ["Unit 4,5  Research Proposal and Report Writing.pdf"],
    },
  },
  "theory-of-computation": {
    folder: "Semester 4/TOC/Note",
    chapters: {
      1: ["1. Introduction.pdf"],
      2: ["TOC Complete Note 1.0.pdf"],
      3: ["TOC Complete Note 1.0.pdf"],
      4: ["5. Slide_Turing Machine and its extension.pdf", "TOC Complete Note 1.0.pdf"],
      5: ["6. Slide_Undecidibailty.pdf", "TOC Complete Note (Remaining from New Syllabus).pdf"],
      6: ["7. Slide_Computational complexity theory 2.0.pdf", "TOC Complete Note (Remaining from New Syllabus).pdf"],
    },
  },
  "artificial-intelligence": {
    folder: "Semester 5/Artificial Intelligence/AI GCES",
    chapters: {
      1: ["Unit1AI_V.pdf"],
      2: ["Unit2AI_v.pdf"],
      3: ["Unit3AI_v.pdf", "Unit3AI_V_searching.pdf", "Unit3AI_v_problemsolving.pdf"],
      4: ["Unit4AI.pdf", "Unit4AI_V_uncertainity.pdf"],
      5: ["Unit5AI_V_machinelearning.pdf", "MACHINE LEARNING_Vsem.pdf"],
      6: ["Unit 6_AI_V.pdf"],
      7: ["Expert Systems_Unit7.pdf"],
    },
  },
  "digital-signal-analysis-and-processing": {
    folder: "Semester 5/DSAP/DSAP GCES",
    chapters: {
      1: ["1. Discrete-time Signals and System.pdf"],
      2: ["2. Review of Z-Transform.pdf"],
      3: ["3. Analysis of LTI system in frequency domain.pdf"],
      4: ["4. Discrete Filter Structure.pdf"],
      5: ["5. IIR Filter Design.pdf"],
      6: ["6. FIR Filter Design.pdf"],
      7: ["7. Discrete Fourier Transform.pdf"],
    },
  },
  "embedded-system": {
    folder: "Semester 5/Embedded System/Embedded system gces",
    chapters: {
      1: ["CH1.pdf"],
      2: ["CH2.pdf"],
      3: ["CH3.pdf"],
      4: ["CH4-1.pdf", "CH4-2.pdf", "VHDL code.pdf"],
      5: ["CH5.pdf"],
      6: ["CH6.pdf"],
      7: ["CH7.pdf"],
    },
  },
  "engineering-management": {
    folder: "Semester 5/Engineering Management/NEC",
    chapters: {
      1: ["Engineering Management Chapter 1.pdf"],
      2: ["Engineering Management Chapter 2.pptx.pdf"],
      3: ["Engineering Management Chapter 3.pdf"],
      5: ["Engineering Management Chapter 5.pptx.pdf", "Engineering mangement chapter 5 class notes.docx.pdf"],
    },
  },
  "computer-networks": {
    folder: "Semester 6/Computer Network",
    chapters: {
      1: ["Chapter 1 - Introduction.pdf"],
      2: ["Chapter 2 - All.pdf", "Chapter 2 - Networking Devices.pdf"],
      3: [
        "Chapter 3 - Final Part.pdf",
        "Chapter 3 - Second Part.pdf",
        "Chapter 3 - Third Part.pdf",
        "Chapter 3 - Transmission Media.pdf",
      ],
      4: ["Chapter 4 - All.pdf", "Chapter 4 - Continue.pdf"],
      5: ["Unit 5 The Network Layer.pdf"],
      6: ["Unit 6 Transport Layer.pdf"],
      7: ["Unit 7 Congestion Control.pdf"],
      8: ["Unit 8 Application Layer.pdf"],
      9: ["Unit 9 Network Management and Security.pptx"],
    },
  },
  "image-processing-and-pattern-recognition": {
    folder: "Semester 6/Image Processing and Pattern Recognition",
    chapters: {
      1: ["IPPR_Chapter_1_Introduction.pdf"],
      2: ["IPPR_Chapter_2_IE_Spatial_Domain.pdf"],
      3: ["IPPR_Chapter_3_I_E_Frequency_Domain.pdf"],
      4: ["Chapter_4_Image_Restoration.pdf"],
      5: ["Chapter_5_Image_Compression_Coding.pdf"],
      6: ["Chapter_6_Image_Analysis.pdf"],
      7: ["Chapter_7_PR&ANN_PR.pdf"],
    },
  },
  "machine-learning": {
    folder: "Semester 6/Machine Learning",
    chapters: {
      1: ["1. Introduction to Machine Learning.pdf"],
      2: ["2. Supervised Learning.pdf"],
      3: ["3. Unsupervised Learning.pdf"],
      4: ["4. Artificial Neural Network.pdf"],
      5: ["5. Model Evaluation and Validation.pdf"],
    },
  },
  "simulation-and-modeling": {
    folder: "Semester 6/Simulation And Modeling",
    chapters: {
      1: [
        "Chapter 1 - Lecture 1.pptx",
        "Chapter 1 - Lecture 2 - System, Environment, Types, Simulation Steps.pptx",
        "Chapter 1 - Lecture 3 - System Modeling, Principles, Verification, Validation.pptx",
      ],
      2: [
        "Chapter 2 - Lecture 4 - Monte Carlo Simulation, Advantages, Disadvantages.pptx",
        "Chapter 2 - Lecture 5 - Comparison, System Simulation and Types, Real-time Simulation.pptx",
        "Chapter 2 - Lecture 6 - Lag Models.pptx",
        "Chapter 2 - Lecture 7 - Queuing System, Single Server Queuing Model.pptx",
      ],
      3: [
        "Chapter 3 - Lecture 8 - Continuous System, Differential Equations.pptx",
        "Chapter 3 - Lecture 9 - Digital Analog Simulators, CSSL, CSMP III.pptx",
        "Chapter 3 - Lecture 10 - Feedback, Interactive System, Predator-Prey Model.pptx",
      ],
      4: [
        "Chapter 4 - Lecture 11 - Discrete System.pptx",
        "Chapter 4 - Lecture 12 - Simulation of Telephone System.pptx",
        "Chapter 4 - Lecture 13 - Gathering Statistics, DSSL.pptx",
      ],
      5: [
        "Chapter 5 - Lecture 14 - Probability Concept.pptx",
        "Chapter 5 - Lecture 15 - Random Number and Generation.pptx",
        "Chapter 5 - Lecture 16 - Uniformity Test.pptx",
        "Chapter 5 - Lecture 17 - Independence Test.pptx",
      ],
      6: [
        "Chapter 6 - Lecture 18 - Simulation Language, GPSS.pptx",
        "Chapter 6 - Lecture 19 - SIMSCRIPT.pptx",
      ],
      7: ["Chapter 7 - Lecture 20 - Output Analysis Method.pptx"],
    },
  },
  "compiler-design": {
    folder: "Semester 6/Compiler Design",
    chapters: {
      1: ["Compiler Design full note.pptx"],
      2: ["Compiler Design full note.pptx"],
      3: ["Compiler Design full note.pptx"],
      4: ["Compiler Design full note.pptx"],
      5: ["Compiler Design full note.pptx"],
      6: ["Compiler Design full note.pptx"],
    },
  },
  "cloud-computing-and-virtualization": {
    folder: "Semester 7/Cloud Computing and Virtualization/PU",
    chapters: {
      1: ["chapter 1.pdf"],
      2: ["chapter 2.pdf"],
      3: ["chapter 3.pdf"],
      4: ["chapter 4.pdf"],
    },
  },
  "data-science-and-analytics": {
    folder: "Semester 7/Data Science and Analytics",
    chapters: {
      1: ["1. Data Analysis Pipeline.pdf"],
      2: ["2. Statistical Foundation.pdf"],
      3: ["3. Numeric Data.pdf"],
      4: ["4. Categorical and Mixed-type Data.pdf"],
      5: ["5. Time and Causality.pdf"],
    },
  },
  "entrepreneurship-and-professional-practice": {
    folder: "Semester 7/Entrepreneurship and Professional Pratice/GCES",
    chapters: {
      1: ["Entrepreneurship and Professional Practice_GCES_BE Software 7th Sem Chap 1 Introduction.pdf"],
      2: ["EPP_GCES_BE Software 7th Sem Unit II Creativity, Innovation and MVP (3 Hrs.).pdf"],
      3: ["EPP_GCES_BE Software 7th Sem Unit III Startup Foundational Analysis (8 Hrs.).pdf"],
      4: ["EPP_GCES_BE Software 7th Sem Unit IV Business Modeling, Planning and Pitching (6 Hrs)  (1).pdf"],
      5: ["EPP_GCES_BE Software 7th Sem Unit V Ethics and Responsibilities for Professional Practice (4 Hrs.) .pdf"],
      6: ["EPP_GCES_BE Software 7th Sem Unit VI_ Legal Issues for Professional Practice.pdf"],
    },
  },
  "network-and-cyber-security": {
    folder: "Semester 7/Network and Cyber Security/PEC and GCES",
    chapters: {
      1: ["Unit 1 Introduction to Network Security.pdf"],
      2: ["Unit 2 Symmetric Key Cryptography.pdf"],
      3: ["Unit 3 Asymmetric Key Cryptography.pdf"],
      4: ["Unit 4 Authentication System and Key Establishment.pdf"],
      5: ["Unit 5 Cyber(Web)Security.pdf"],
      6: ["Unit 6 Web Application Security -Standards and Practices.pdf"],
    },
  },
  "engineering-economics": {
    folder: "Semester 7/Engineering Economics/MANUAL BOOK",
    chapters: {
      1: ["all economic solutions.pdf"],
      2: ["all economic solutions.pdf"],
      3: ["all economic solutions.pdf"],
      4: ["all economic solutions.pdf"],
      5: ["all economic solutions.pdf"],
      6: ["all economic solutions.pdf"],
      7: ["all economic solutions.pdf"],
      8: ["all economic solutions.pdf"],
      9: ["all economic solutions.pdf"],
      10: ["all economic solutions.pdf"],
    },
  },
  "algebra-and-geometry": {
    folder: "Semester 2/Algebra and Geometry",
    chapters: {
      1: ["UNIT-1-Matrix-System-of-Linear-Eqn..pdf"],
      2: ["UNIT-2-Vector-Space.pdf"],
      3: ["UNIT-3-Linear-Programming-Problem-LPP.pdf"],
      4: ["UNIT-4-Vector-Algebra.pdf"],
      5: ["UNIT-5-Infinite-series.pdf"],
      6: ["UNIT 6  Two Dimensional Geometry.pdf"],
      7: ["UNIT 7  3D Geometry or 1st Order Ordinary Diff. eqn..pdf"],
    },
  },
  "probability-and-statistics": {
    folder: "Semester 5/Probability and Statistics/BOOK",
    chapters: {
      1: ["Prob and Stat_Book_compressed.pdf"],
      2: ["Prob and Stat_Book_compressed.pdf"],
      3: ["Prob and Stat_Book_compressed.pdf"],
      4: ["Prob and Stat_Book_compressed.pdf"],
      6: ["Prob and Stat_Book_compressed.pdf"],
      7: ["Prob and Stat_Book_compressed.pdf"],
      8: ["Prob and Stat_Book_compressed.pdf"],
    },
  },
  "software-engineering": {
    folder: "Semester 5/Software Engineering/Software Engineering PEC",
    chapters: {
      1: ["1. Software Engineering and Project Management 2.0.pdf"],
      2: ["2. Software Process Model and Agility.pdf"],
      3: ["3. Requirement Engineering and Principles.pdf"],
      4: ["4. Software Design, Architecture and Principles 1.0.pdf"],
      5: ["5. Testing Techniques and Maintenance.pdf"],
      6: ["6. Software Quality Assusrance Process.pdf"],
      7: ["7. Software Configuration Management.pdf"],
      8: ["8. Advanced Software Engineering Concepts.pdf"],
    },
  },
  "internship": {
    folder: "Semester 8/Internship",
    chapters: {
      1: [
        {
          name: "Internship Regulation-2082-FST-PU(20260417).pdf",
          path: "Semester 8/Internship/PU/Internship Regulation-2082-FST-PU(20260417).pdf",
        },
      ],
      2: [
        {
          name: "Internship Proposal Guide (Word)",
          url: "https://vrittech-my.sharepoint.com/:w:/g/personal/student227_vrittechnologies_edu_np1/IQDAnjcZxsPnQY__FqukPiniAXIvjllcTq0DhmDMRNhKpYo?e=ZIxAWg",
        },
      ],
      3: [
        {
          name: "Internship Mid-term Report (Word)",
          url: "https://vrittech-my.sharepoint.com/:w:/g/personal/student227_vrittechnologies_edu_np1/IQAO9tauIsnaR7pPmI3uFUdiAU_cz6qbp17oB-mpqYdLiOI?e=4P0x8p",
        },
      ],
      4: [
        {
          name: "Internship Final Report (Word)",
          url: "https://vrittech-my.sharepoint.com/:w:/g/personal/student227_vrittechnologies_edu_np1/IQCgX5B-5gwtRIdrc37JFs8cAYlUJt3VlK7gD6UKErzth4o?e=pMJVyi",
        },
      ],
      5: ["Manish's Blackbook.pdf"],
    },
  },
  "project-i": {
    folder: "Semester 6/Project I",
    chapters: {
      1: ["Project I.pdf"],
      2: [
        {
          name: "Keydash Research Proposal.docx",
          path: "Semester 6/Project I/PROPOSAL/Keydash Research Proposal.docx",
        },
      ],
      3: [
        {
          name: "final report.docx",
          path: "Semester 6/Project I/FINAL/final report.docx",
        },
      ],
      4: [
        {
          name: "final report.pdf",
          path: "Semester 6/Project I/FINAL/final report.pdf",
        },
      ],
    },
  },
  "project-ii": {
    folder: "Semester 8/Project II",
    chapters: {
      1: ["Project-II.pdf"],
      2: [
        {
          name: "Keydash Research Proposal.docx (1).pdf",
          path: "Semester 8/Project II/Proposal/Keydash Research Proposal.docx (1).pdf",
        },
      ],
      3: [
        {
          name: "Final mid-term report.docx",
          path: "Semester 8/Project II/Mid Term/Final mid-term report.docx",
        },
      ],
      4: [
        {
          name: "keydashh.pdf",
          path: "Semester 8/Project II/Final/keydashh.pdf",
        },
      ],
      5: [
        {
          name: "keydash-final-odt.pdf",
          path: "Semester 8/Project II/BlackBook/keydash-final-odt.pdf",
        },
      ],
    },
  },
};

export function getNoteChapterConfig(subjectSlug) {
  return SUBJECT_NOTE_CHAPTER_FILES[subjectSlug] || null;
}

/**
 * The leading number in a file name is its chapter number, supporting parts:
 *   "1. Introduction.pdf"                → 1
 *   "2.1 PU-BEE.pdf", "2.2 …", "2.3 …"   → 2
 *   "9. File Handling.pdf"               → 9
 * Unnumbered names (e.g. "Syllabus.pdf") → null (never shown on a chapter).
 */
export function getChapterNumberFromFileName(name = "") {
  const base = String(name)
    .replace(/\.[a-z0-9]+$/i, "")
    .trim();
  const match = base.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}