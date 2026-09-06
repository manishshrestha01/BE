# Action Plan — StudyMate SEO

Site: https://www.manishshrestha012.com.np · SEO Health: 68/100 · Detected: Education/Publisher

## Phase 1 — Critical Fixes (Week 1)

1. **Fix thin/duplicate college pages (14 pages)**
   - First-principle: 14 pages share one generic `<title>` and ~2,200 chars of unique SSR copy → Google cannot differentiate them → doorway/thin risk.
   - Action: SSR 300+ words of unique content per college; unique title + H1 (`{College Name} Notes — Pokhara University BE Computer Engineering`); if differentiation not possible, add `noindex, follow`.
   - How we know it failed: `site:/college/` in GSC shows zero indexed pages or unchanged impressions after 2–3 weeks.
   - Leading indicator: GSC "Pages" report shows college URLs moving from "Crawled – currently not indexed" to "Indexed".

## Phase 2 — High-Impact (Week 2–3)

2. **Unique per-page H1**
   - Stop emitting the global `<h1>StudyMate - Pokhara University...` on content pages. Use page-specific H1 (e.g. `Calculus I (MTH 110) — Semester 1 Notes`).
   - Check: grep rendered HTML shows one H1 per page, not the template copy.
3. **Add Article schema to blog posts**
   - `"@type":"Article"` with `headline`, `datePublished`, `dateModified`, `author` (→ Person @id), `image`, `publisher` (→ Organization @id), `mainEntityOfPage` (canonical).
   - Fix `WebPage.url` to point to the canonical page, not the homepage.
   - Check: Rich Results Test returns no Article errors.
   - Indicator: articles appear with dates; recency signal for GEO.
4. **Remove `user-scalable=no, maximum-scale=1`** from viewport.
5. **Surface publication / last-updated dates** on article pages (visible + in Article schema).

## Phase 3 — Medium (Month 1)

6. **Unique OG images per article**; set `og:type=article` for posts. Stop reusing the site logo (and the mismatched `og:image:alt`).
7. **Add security headers** in `next.config` / server config:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy`
   - CSP `frame-ancestors 'self'`
   - HSTS: add `includeSubDomains; preload`
8. **EducationalOrganization / Course schema** for college + subject pages (`CollegeOrUniversity`, `Course`, `hasCourse`).
9. **IndexNow** — generate a key, add `IndexNow` host file + key metadata, push article/college URLs. Speeds Bing/Yandex/Naver.
10. **Re-evaluate ad libs** — 625KB `aclib-anti-adblock.js` is heavy; confirm it's required, else lazy-load or drop. Monitor INP.
11. **SSR college and landing content** (reduce client-only rendering).

## Phase 4 — Authority & AI Visibility (Ongoing)

12. Expand `Organization.sameAs` → add LinkedIn, YouTube, Wikipedia.
13. Establish a YouTube channel + presence on Reddit/LinkedIn (brand mentions correlate 3x stronger than backlinks with AI citations).
14. Rewrite top article intros as definition-first, self-contained 134–167-word answer blocks; add "What is X?" in first 60 words.
15. Refresh/update articles on a schedule (content <3 months old ~3x more likely cited; stale >6 months loses eligibility).
16. Monitor field Core Web Vitals via CrUX once traffic supports it; verify INP after ad-lib changes.

---

## Monitoring
- GSC: "Pages" indexation + Queries for `/college/` and blog terms.
- CrUX / PSI: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 (75th pct).
- AI visibility: probe brand mention across ChatGPT/Perplexity/AI Overviews for "Pokhara University [subject] notes".
