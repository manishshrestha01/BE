# Full SEO Audit Report — StudyMate (manishshrestha012.com.np)

**Domain:** https://www.manishshrestha012.com.np
**Business type detected:** Publisher / Education resource (college study-notes platform)
**Audit date:** 2026-09-01
**Sitemap pages:** 82

## SEO Health Score: 68 / 100

| Category | Weight | Score | Status |
|----------|--------|-------|--------|
| Technical SEO | 22% | 82 | Good |
| Content Quality | 23% | 60 | Medium |
| On-Page SEO | 20% | 62 | Medium |
| Schema / Structured Data | 10% | 75 | Good (with gaps) |
| Performance (CWV) | 10% | 85 | Good (TTFB 150ms) |
| AI Search Readiness | 10% | 70 | Good baseline |
| Images | 5% | 45 | Weak |

---

## Executive Summary

**What works well:**
- Fast TTFB (~150ms) and clean SSR HTML for article pages.
- Excellent AI crawler access: `robots.txt` allows GPTBot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, Google-Extended.
- Strong structured data baseline: `WebSite`, `Organization`, `Person`, `WebPage`, `SpeakableSpecification` all server-rendered.
- `llms.txt` + `llms-full.txt` + `/api/notes-index` (HTML + JSON) — advanced GEO-ready assets already live.
- Self-referencing canonicals and `index,follow` on all pages tested.

**Top critical issues:**
1. 14 college detail pages are near-duplicate thin content with identical generic titles (indexation/quality risk).
2. Every page reuses the same global `<h1>` — no unique per-page H1 (a sitewide on-page defect).
3. Viewport `user-scalable=no, maximum-scale=1` disables pinch-zoom (mobile usability / ranking factor).

**Top quick wins:**
1. Unique per-page titles + H1s (highest leverage, low effort).
2. Add Article schema with `datePublished`/`dateModified`/`author` to blog posts (drives E-E-A-T + GEO recency).
3. Add missing security headers.
4. Unique OG images per article (stop using the site logo).
5. Remove `user-scalable=no`.

---

## Technical SEO — 82/100

### Crawlability — PASS
- `robots.txt` valid, allows `/`, blocks `/admin` + `/user-info`. Correct.
- XML sitemap valid, present in robots, 82 URLs. Correct.
- `index,follow` on tested pages. Correct.

### AI Crawler Management — EXCELLENT
Allows search-citation crawlers, blocks training-only crawlers:
- Allowed: `GPTBot`, `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Applebot`, `cohere-ai`, `YouBot`.
- Blocked: `ClaudeBot`, `CCBot`, `Bytespider`, `Amazonbot`.
- **Info:** `PerplexityBot` and `GPTBot` are named as both search + training by vendors; the decision to allow them is correct for AI-citation visibility.

### Indexability — WARN
- **HIGH — Thin/near-duplicate college pages.** 14 `/college/{slug}` pages share the identical generic `<title>` ("StudyMate — Computer Engineering Notes Pokhara University") and only ~2,200 chars of unique server-rendered body copy. Risk of being treated as doorway/thin content by Google.
- All canonicals are self-referencing. Correct.

### Security — WARN
Only `strict-transport-security` present. **Missing:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options` / CSP `frame-ancestors`
- `Referrer-Policy`
- `Permissions-Policy`
- (CSP optional; HSTS present but no `preload`.)

### URL Structure — PASS
Clean hyphenated URLs, correct hierarchy (`/blog/semester/{n}/{subject}`), no parameter bloat, consistent trailing-slash-less canonicals.

### Mobile & Page Experience — WARN
- **HIGH — Pinch-to-zoom disabled.** `<meta name="viewport" ... maximum-scale=1, user-scalable=no>` blocks zoom on mobile.
- Responsive layout present; no obvious horizontal scroll.
- Content parity: article body is server-rendered (good); college body is client-rendered (risk).

### Core Web Vitals — GOOD (lab)
- TTFB ~150ms (excellent).
- Homepage HTML only 36KB; blog article ~65KB.
- No lab CWV available (PSI API quota exceeded); field CrUX not accessible without GSC auth. LCP is served by fast SSR + CDN; INP risk from third-party ad scripts (Adcash/Adsense) — see note.

### Structured Data — see Schema section.

### JS Rendering — WARN
- Article pages: content SSR'd (good).
- College detail pages: body mostly **client-rendered**; only generic H2s + ~2.4KB text in raw HTML. Deterministic content should be SSR'd.
- Homepage: only ~326 chars of visible server-rendered text (a JS shell). Acceptable for a landing shell but the **college pages must be SSR'd**.

### IndexNow — NOT CONFIGURED
No IndexNow key/host found. Recommend adding IndexNow for near-instant Bing/Yandex/Naver push.

---

## Content Quality & E-E-A-T — 60/100

### Strengths
- Blog articles are substantive (~3,400+ chars body, structured H2/H3 with syllabus units).
- Author entity established (`Person` schema, GitHub sameAs).

### Issues
- **HIGH — No `Article` schema on blog posts** → no `datePublished`/`dateModified`. Hurts E-E-A-T and GEO recency (SE Ranking: content <3 months old ~3x more likely cited; stale >6mo loses eligibility).
- **HIGH — No publication/last-updated dates visible** on article pages.
- **MEDIUM — Thin college pages** (see Indexability).
- **LOW — Organization `sameAs` only GitHub.** No LinkedIn, YouTube, Wikipedia presence — weakens brand-authority and AI-citation correlation (Ahrefs: brand mentions on YouTube ~0.737, LinkedIn moderate).

---

## On-Page SEO — 62/100

### Issues
- **CRITICAL/HIGH — Global template H1.** Every page outputs `<h1>StudyMate - Pokhara University Computer Engineering Notes</h1>`. Blog articles need a unique H1 (e.g. "Calculus I (MTH 110) — Semester 1 Notes"), college pages need e.g. "NEC College Notes — Pokhara University BE Computer Engineering". The real title only appears in `<title>`/OG.
- **HIGH — College pages generic title** (see above).
- **MEDIUM — Blog `og:image` is the site logo** for every post; `og:image:alt` claims a "banner" that isn't the actual image. Needs a unique, relevant per-article OG image for social CTR.
- **LOW — `og:type` is `website` on articles**; should be `article`.
- Heading hierarchy: blog has good H2/H3; H1 is the problem.

---

## Schema & Structured Data — 75/100

### Present (server-rendered)
- `Organization` + `WebSite` + `SearchAction` (SiteLinks Search Box eligible)
- `Person` (author) — good E-E-A-T
- `WebPage` + `SpeakableSpecification`
- `FAQPage` (all pages)

### Issues / Recommendations
- **HIGH — Missing `Article` schema** on the 48 blog article pages (should include `headline`, `datePublished`, `dateModified`, `author` → Person @id, `image`, `publisher` → Organization @id, `mainEntityOfPage`).
- **HIGH — `WebPage.url` always points to the homepage** even on featured pages; should be the canonical page URL.
- **INFO — `FAQPage`** rich results were retired by Google for all sites on 2026-05-07 (no SERP feature). Keep it (harmless, may help voice/other surfaces) but do **not** treat it as a rich-result strategy. It does not confirm AI-citation benefit.
- **MEDIUM — Missing `CollegeOrUniversity` / `EducationalOrganization` + `Course` schema** for the college/subject pages — a natural SERP/entity opportunity for an education platform.
- **MEDIUM — `sameAs` sparse** (GitHub only).

---

## Performance — 85/100

- TTFB excellent (~150ms cached).
- Small HTML payloads.
- **Risk — third-party scripts** (Adcash `aclib` CDN + Adsense + `aclib-anti-adblock.js` at 625KB) loaded `afterInteractive`; 625KB bundled anti-adblock JS is heavy and can inflate INP. Monitor field INP after ad-lib load.
- PSI API quota was exceeded during audit; recommend re-testing lab CWV via `/seo google` or PageSpeed web UI.

---

## AI Search Readiness (GEO) — 70/100

### Strengths
- All key AI citation crawlers allowed in `robots.txt`.
- `llms.txt` + `llms-full.txt` + notes-index (HTML + JSON) live.
- SSR content = AI crawlers can read without JS (for articles).
- `SpeakableSpecification`, `Person` author entity.

### Gaps
- **HIGH — No Article schema / dates** (blocks GEO recency + entity wiring).
- **MEDIUM — Citability:** add definition-first "What is X?" blocks in the first 60 words and 134–167-word self-contained answer passages (AI-citation sweet spot; ~44% of citations come from top 30% of page).
- **MEDIUM — Brand mentions** absent outside GitHub (no YouTube/LinkedIn/Wikipedia). Brand mentions correlate 3x stronger than backlinks for AI visibility.
- **LOW — `llms.txt`** present (good for non-Google surfaces; not a Google ranking lever).

---

## Images — 45/100

- No `<img>` on homepage/SSR shell → no alt issues there.
- **HIGH — Same logo OG image for all posts**, wrong alt/banner claim.
- No per-article social/hero images.
- Article pages reference no optimizable hero imagery.

---

## Critical / High / Medium / Low

### Critical (fix immediately — blocks quality/indexing)
1. **College pages** — 14 near-duplicate, thin, identically-titled pages. Action: SSR unique content (300+ words each), unique titles/H1s, consolidate or `noindex` any that can't be differentiated. (If unable to differentiate, `noindex` to protect crawl quality.)

### High (within 1 week)
2. **Unique per-page H1** — stop using the global template H1 on articles and college pages.
3. **Unique descriptive `<title>` per college page.**
4. **Add `Article` schema** (`datePublished`, `dateModified`, `author`) to blog posts + fix `WebPage.url` to be canonical.
5. **Remove `user-scalable=no, maximum-scale=1`** from viewport (restore pinch-zoom).
6. **Show publication/last-updated dates** on articles.

### Medium (within 1 month)
7. **Unique OG images per article** + set `og:type=article` for posts.
8. **Security headers** — add `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP `frame-ancestors`.
9. **Add `EducationalOrganization`/`Course`/`CollegeOrUniversity` schema** for college/subject pages.
10. **IndexNow** integration for Bing/Yandex/Naver.
11. **Zone-level: reduce ad-lib weight** — reconsider 625KB `aclib-anti-adblock.js`; verify it's needed.
12. **SSR college body content** (not just client-side).

### Low (backlog)
13. Expand Organization `sameAs` (LinkedIn, YouTube, Wikipedia).
14. Add brand channel on YouTube + presence on Reddit/LinkedIn for AI-citation correlation.
15. LLM-aware content reformatting (answer-first blocks).
16. Verify field CWV via CrUX when traffic grows.

---

## GEO Readiness Score: 70/100

| Platform | Est. readiness | Notes |
|----------|----------------|-------|
| Google AI Overviews | High | ranks well + SSR; needs Article/date schema for recency |
| Google AI Mode | Medium | needs entity authority + unique citable passages |
| ChatGPT | Medium | needs Wikipedia/Reddit/YouTube brand presence |
| Perplexity | Medium | needs community (Reddit) validation |

---

## Quick Wins (this week)
1. Unique titles + H1s per page (highest leverage).
2. Add Article schema with dates + author.
3. Remove `user-scalable=no`.
4. Unique OG images per article.
5. Add 3 security headers.
6. `noindex` or enrich the thin college pages.
