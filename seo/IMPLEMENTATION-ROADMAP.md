# Implementation Roadmap — StudyMate

Sequenced so each phase is independently shippable and measurable. Ownership: single-dev
(this project) — keep phases tight.

## Phase 0 — Technical + crawl hygiene (1-2 weeks) — DO FIRST
Gate: everything below blocks all other gains.

1. **SSR the chapter + subject content** (highest impact): render chapter bullets/subpoint
   HTML from the config + Supabase at page build/render time; initial HTML must contain the
   answers (kills the client-side loading-state).
2. `robots.txt` allowlist for AI crawlers on /blog, /college, /pu-exam; disallow /dashboard,
   /api/*, /dist/*.
3. `X-Robots-Tag: noindex` for /api/notes-index, /api/notes-subject, /dashboard; drop
   /dashboard from sitemap.xml.
4. Split sitemaps (blog/subjects/colleges/static) with `lastmod`.
5. `public/llms.txt` (see SEO-STRATEGY §GEO).
6. Verify: Google Search Console — submit new sitemaps; check "Page indexing" report.

**Exit criteria:** curl of any chapter page returns full notes in HTML; GSC shows chapter URLs
as "Indexed"; crawler bots fetch 200s.

## Phase 1 — Foundation content + schema (2-3 weeks)
1. Breadcrumbs + h1s renamed to "Syllabus & Notes" language; never "Blog".
2. Course + LearningResource + BreadcrumbList schema on chapter/subject pages; CollegeOrUniversity
   on college pages; Person (author) entity + About page.
3. Title/meta description templates per page type (unique per subject).
4. Internal linking layer: subject hub → chapters + college set; chapter prev/next.
5. Launch on /colleges at full depth (intro copy on each page, not empty).
6. Re-audit the field with fresh DA metrics (validate KPI baselines below).

**Exit criteria:** every chapter page has unique meta + schema; college pages internal-linked
into subject flow; noindex gaps closed.

## Phase 2 — Answer content for organic + AI (ongoing; 4-6 weeks for first pass)
1. "PU asked questions" per subject (semester-aligned) with FAQ schema.
2. Short-answer block per chapter (definition + one difference).
3. /pu-exam + /pu-exam-grading refresh; NEC/license section placeholder.
4. GEO pass: rewrite answer phrasing for quotability; confirm SSR HTML against GPTBot/
   PerplexityBot fetches (no-JS request = full content).
5. Brand signals: consistent name/logo/link on GitHub repos, Play Store listing, social.

**Exit criteria:** crawl-bot fetch of any chapter returns the answer block; ≥20 asked-question
pages live.

## Phase 3 — Authority, app popularity, digital PR (rolling)
1. Backlinks: PR/github → point BECE_Notes-style repos and READMEs at chapter pages; submit
   StudyMate to note directories; request listing on college/university pages.
2. Domain: keep .com.np (edu-tier trust); evaluate `studymate` brand un-collision (name
   conflicts — decide whether a separate brand/dot-com is warranted; measure first).
3. Legacy domain `notes.shresthamanish.info.np`: decide consolidate (301 + canonical) vs.
   redirect to avoid split equity.
4. GEO monitoring: ask Perplexity/GPT "where can I find PU BE computer notes / StudyMate" —
   log citation rate vs. competitors (quarterly).
5. App installs: promo deep-links in exam-season pages; Play-listing keywords synced to the
   answer content.

**Exit criteria (12-mo):** cited by AI assistants for ≥1 brand query; GSC index covers full
chapter set; app installs from organic/geo flows rising QoQ.