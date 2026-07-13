#!/usr/bin/env node
/**
 * inject-college-faq-schema.js
 *
 * Injects FAQPage + Speakable JSON-LD schema into every college static HTML page.
 * Run: node scripts/inject-college-faq-schema.js
 *
 * This is the highest-impact schema type for GEO (Generative Engine Optimization)
 * — each Q&A becomes a direct citation candidate for ChatGPT, Perplexity, and Google AI Overviews.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COLLEGE_DIR = path.join(ROOT, "public", "college");
const BASE_URL = "https://www.manishshrestha012.com.np";

// Full college info for rich FAQ content
const COLLEGES = {
  pec: {
    name: "Pokhara Engineering College",
    abbr: "PEC",
    location: "Pokhara, Kaski, Nepal",
    established: "1998",
    website: "https://pec.edu.np",
  },
  ncit: {
    name: "Nepal College of Information Technology",
    abbr: "NCIT",
    location: "Balkumari, Lalitpur, Nepal",
    established: "2001",
    website: "https://ncit.edu.np",
  },
  nec: {
    name: "National Engineering College",
    abbr: "NEC",
    location: "Khanar, Bhairahawa, Nepal",
    established: "2006",
    website: "https://nec.edu.np",
  },
  gces: {
    name: "Global College of Engineering and Technology",
    abbr: "GCES",
    location: "Lalitpur, Nepal",
    established: "2010",
    website: "https://gces.edu.np",
  },
  cosmos: {
    name: "Cosmos College of Management and Technology",
    abbr: "Cosmos",
    location: "Bhaisepati, Lalitpur, Nepal",
    established: "2000",
    website: "https://cosmoscollege.edu.np",
  },
  oxford: {
    name: "Oxford College of Engineering and Management",
    abbr: "Oxford",
    location: "Gaidakot, Nawalpur, Nepal",
    established: "2005",
    website: "https://oxford.edu.np",
  },
  eec: {
    name: "Emerging Engineer's College",
    abbr: "EEC",
    location: "Birtamode, Jhapa, Nepal",
    established: "2009",
    website: "https://eec.edu.np",
  },
  lec: {
    name: "Lumbini Engineering College",
    abbr: "LEC",
    location: "Butwal, Rupandehi, Nepal",
    established: "2005",
    website: "https://lec.edu.np",
  },
  mbce: {
    name: "Manmohan Bhatta College of Engineering",
    abbr: "MBCE",
    location: "Surkhet, Nepal",
    established: "2010",
    website: "https://mbce.edu.np",
  },
  nast: {
    name: "National Academy of Science and Technology",
    abbr: "NAST",
    location: "Khumaltar, Lalitpur, Nepal",
    established: "1982",
    website: "https://nast.gov.np",
  },
  rec: {
    name: "Rapti Engineering College",
    abbr: "REC",
    location: "Dang, Nepal",
    established: "2008",
    website: "https://rec.edu.np",
  },
  uesc: {
    name: "Universal Engineering and Science College",
    abbr: "UESC",
    location: "Pokhara, Nepal",
    established: "2007",
    website: "https://uesc.edu.np",
  },
  utc: {
    name: "United Technical College",
    abbr: "UTC",
    location: "Bharatpur, Chitwan, Nepal",
    established: "2008",
    website: "https://utc.edu.np",
  },
};

/**
 * Build FAQPage schema for a specific college.
 * These Q&As are crafted to match real student search queries
 * and AI chat prompts — maximizing GEO citation probability.
 */
function buildFAQSchema(slug, college) {
  const url = `${BASE_URL}/college/${slug}`;
  const dashboardBase = `${BASE_URL}/dashboard?college=${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I find ${college.abbr} BE Computer Engineering notes?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${college.name} (${college.abbr}) BE Computer Engineering notes are available for free at StudyMate (${url}). The page provides semester-wise PDFs and study materials for all 8 semesters of the Pokhara University 2022 curriculum.`,
        },
      },
      {
        "@type": "Question",
        name: `What subjects are taught at ${college.abbr} in BE Computer Engineering?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${college.name} follows the Pokhara University BE Computer Engineering curriculum (2022). Subjects include: Semester 1 — Calculus I, Digital Logic, Programming in C, Basic Electrical Engineering; Semester 2 — Data Structure and Algorithm, OOP in C++; and advanced subjects in later semesters including DBMS, Operating Systems, Computer Networks, Software Engineering, Compiler Design, AI, and Machine Learning.`,
        },
      },
      {
        "@type": "Question",
        name: `How many semesters are there in ${college.abbr} BE Computer Engineering?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${college.name} BE Computer Engineering is a 4-year program with 8 semesters, following the Pokhara University curriculum. StudyMate provides notes and PDFs for all 8 semesters at ${url}.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${college.abbr} affiliated with Pokhara University?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, ${college.name} (${college.abbr}) is affiliated with Pokhara University (PU) for the BE Computer Engineering program. It is located in ${college.location}.`,
        },
      },
      {
        "@type": "Question",
        name: `How can I download ${college.abbr} notes for free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can download ${college.abbr} BE Computer Engineering notes for free at StudyMate: ${url}. Select your semester to access semester-wise PDFs and study materials.`,
        },
      },
    ],
  };
}

/**
 * Build Speakable schema for voice search (AEO).
 */
function buildSpeakableSchema(slug) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-intro"],
    },
    url: `${BASE_URL}/college/${slug}`,
  };
}

const INJECT_MARKER = "  <!-- JSON-LD: Organization + WebSite -->";
const FAQ_END_MARKER = "  <!-- /FAQ schema injected by inject-college-faq-schema.js -->";

async function processCollegePage(slug) {
  const indexPath = path.join(COLLEGE_DIR, slug, "index.html");

  let html;
  try {
    html = await fs.readFile(indexPath, "utf8");
  } catch {
    console.log(`  ⚠️  Skipping ${slug} — file not found`);
    return;
  }

  // Skip if already injected
  if (html.includes(FAQ_END_MARKER)) {
    console.log(`  ✅ ${slug} — FAQPage schema already present, skipping`);
    return;
  }

  const college = COLLEGES[slug];
  if (!college) {
    console.log(`  ⚠️  ${slug} — no college data defined, skipping`);
    return;
  }

  const faqSchema = buildFAQSchema(slug, college);
  const speakableSchema = buildSpeakableSchema(slug);

  const injection = `
  <!-- FAQPage + Speakable schema (GEO + AEO) — injected by inject-college-faq-schema.js -->
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema, null, 2)}
  </script>

  <script type="application/ld+json">
  ${JSON.stringify(speakableSchema, null, 2)}
  </script>
  ${FAQ_END_MARKER}

  ${INJECT_MARKER}`;

  if (!html.includes(INJECT_MARKER)) {
    console.log(`  ⚠️  ${slug} — injection marker not found, appending before </head>`);
    const updated = html.replace("</head>", `${injection}\n</head>`);
    await fs.writeFile(indexPath, updated, "utf8");
  } else {
    const updated = html.replace(INJECT_MARKER, injection);
    await fs.writeFile(indexPath, updated, "utf8");
  }

  console.log(`  ✅ ${slug} — FAQPage + Speakable schema injected`);
}

async function main() {
  console.log("🔧 Injecting FAQPage + Speakable schema into college pages...\n");

  const slugs = Object.keys(COLLEGES);
  for (const slug of slugs) {
    await processCollegePage(slug);
  }

  console.log("\n✅ Done! All college pages updated.");
  console.log("📌 Next step: commit + deploy, then use Google Rich Results Test to validate:");
  console.log("   https://search.google.com/test/rich-results");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
