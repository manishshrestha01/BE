# Site Structure — StudyMate (www.manishshrestha012.com.np)

## Positioning note
The `/blog/*` section is **not a blog** — it is a semester-wise syllabus + notes hub with
per-chapter pages. We keep the `/blog` URL prefix (it is live, indexed, and linked to; the
slug has negligible ranking weight and repathing risks every 301 for zero gain). The
**presentation layer** — breadcrumbs, h1s, and page titles — should say "Syllabus & Notes",
Study Materials, or the subject name. Never "Blog post".

## Current IA (as built)
```
/  (Hub: product + app + feature links)
├── /blog  → study hub (syllabus + notes)
│   └── /blog/semester/1..8
│       └── /blog/semester/:sem/:subject
│           ├── /blog/semester/:sem/:subject                  hub page (units/subpoints)
│           └── /blog/semester/:sem/:subject/chapter/:slug    chapter page = note file + inline notes
├── /colleges → college directory
│   └── /college/:slug → college page (life, exams, link to its subjects)
├── /pu-exam, /pu-exam-grading  (exam info)
├── /dashboard  (app — auth-gated)
├── /about, /contact, /faq, /disclaimer
└── (api routes: /api/notes-index, /api/notes-subject — MUST be noindexed)
```

## Target IA (what we optimize toward)
- **Pillars (depth):**
  1. Semester hubs (`/blog/semester/1..8`) — the DMOZ-style index; link each subject.
  2. Subject hubs (`/blog/semester/:sem/:subject`) — original syllabus content (units,
     subpoints) + links to every chapter.
  3. Chapter pages — **the answer pages**: note file + rendered chapter bullets + short
     "old questions" block (Phase 2).
  4. College pages (`/college/:slug`) — cross-point to the subjects each college runs.
  5. Exam pages (`/pu-exam`, `/pu-exam-grading`) — high-intent "old questions / grading".
- Every page must be reachable within **2 clicks** of the home page via breadcrumbs.

## Internal linking rules
- Chapter page → Subject hub (breadcrumb) → Semester hub (breadcrumb) + chapters **prev/next**.
- Subject hub → every chapter + top 3-5 college pages + 1-2 cross-subject chapters that
  answer similar questions (e.g. "Data Structures" ↔ "Theory of Computation").
- Semester hub → all 8 subject hubs + semester intro copy (not an empty index).
- Chapter pages also link **up** to /pu-exam once per subject page, not per chapter.
- Home → top resources by semester + /colleges + /pu-exam.

## Crawl / budget hygiene (do now)
1. `robots.txt`: allow GPTBot, ClaudeBot, PerplexityBot, Googlebot, Bingbot, Google-Extended
   **on /blog, /college, /pu-exam**; block `/dashboard`, `/api/*`, `/dist/*`.
2. `X-Robots-Tag: noindex` on `/api/notes-index` and `/api/notes-subject` (thin duplicates of
   the dashboard; they are already surfacing in Google).
3. Remove `/dashboard` from the sitemap and noindex it (auth-gated = crawl waste).
4. Split the sitemap: `sitemap-blog.xml` (chapters), `sitemap-subjects.xml`, `sitemap-colleges.xml`, `sitemap-static.xml`. Keep valid `<lastmod>`.

## Structured data (per page type)
- Chapter page → `Course` (+ `hasCourseInstance`) + `LearningResource`; add block-level
  `FAQPage` once Q&A blocks exist.
- Subject hub → `Course` (syllabus) + `BreadcrumbList`.
- College page → `CollegeOrUniversity` + `Course`.
- Author → `Person` (see SEO-STRATEGY: author entity = GEO requirement).

## SEO-critical rendering fix
Chapter bullet content must be in the **initial server HTML**. Today it renders client-side
(SSR shows only metadata + a loading state). Google may render it; AI crawlers generally
**do not run JS**, so GPTBot/Perplexity see empty pages and can neither cite StudyMate nor
quote an answer. SSR the chapter notes (fetch via the edge `get-notes`/config at build/serve
time). Same for subject-hub subpoints. This is the single biggest GEO + crawl win.