# SEO Strategy — StudyMate (www.manishshrestha012.com.np)

## Objectives (confirmed with owner)
1. **Organic traffic** — capture "PU notes/syllabus/old questions" demand.
2. **App popularity** — convert search + AI traffic into Play Store installs.
3. **AI / GEO** — StudyMate becomes a *source* the AI assistants answer from, not just a distinct
   page in results.

Framing: `/blog/*` is a **syllabus + notes study hub**, not a blog. Keep URLs (`/blog` prefix),
re-brand the presentation (breadcrumbs/h1s → "Syllabus & Notes"). Never repath live URLs.

## Strategic pillars
### A. Answers first (what beats the field)
Every competitor is a *link list* (Drive links, "click here"). We win by being the **answer
page**: chapter content that states definitions, differences, and syllabus units in plain
HTML that both humans and AI read. One quotable definition + one "why/difference" per chapter.

### B. Technical + structured data (crawl this, trust this)
- **SSR chapter content into initial HTML** (§Site-Structure / Roadmap Phase 0). Test with a
  JS-disabled fetch. This is what makes answers *reachable* by Google and AI bots.
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended on content paths.
- Course / LearningResource / CollegeOrUniversity / BreadcrumbList / FAQPage / Person schema.
- `public/llms.txt` mirroring the sitemap so AI can navigate ("About → semesters → subjects").
- Crawl hygiene: noindex /api/*, /dashboard; remove /dashboard from sitemap.

### C. Depth + freshness (win the SERP)
- 8 semester hubs, ~50 subject hubs, 500+ chapter pages, 13 college pages.
- Add per-subject **"PU asked questions"** pages aligned to exams (HIGH intent; FAQ schema).
- Refresh title/meta templates; unique descriptions per subject.

### D. Brand + GEO (the compounding layer)
- Define the **author entity**: Person schema on /about, consistent name/logo/handle.
- Get StudyMate **named** in the ecosystem: GitHub note repos, college communities, the
  official syllabus ecosystem → drives both authority and AI brand association.
- Legacy domain (`notes.shresthamanish.info.np`): consolidate via 301/canonical to one brand.
- AI answer format: self-contained, quotable sentences; a model should be able to cite StudyMate
  for "what is the C programming syllabus at PU? / where can I download Semester 2 notes?"

## KPI table (baselines are estimates — calibrate in GA4 + GSC in Phase 0/1)
| KPI | Baseline est. | Q3-Q4 2026 target | Measure |
|---|---|---|---|
| Indexed pages (GSC) | ~600 sitemap URLs, dashboard/api leaking | 100% of content pages; 0 non-content (noindex OK) | GSC Pages |
| Organic sessions/mo | TBD from GA4 | +50% QoQ | GA4 organic |
| Keyword top-10 (brand + "pu notes") | low | 20+ keyword top-10 | GSC QUERIES |
| AI citations (brand query) | unmeasured | ≥1 citation by GPT/Perplexity for brand query | manual q-mo |
| AI citations (syllabus/notes queries) | unmeasured | cited among top sources | manual q-mo / third-party |
| App installs from web/geo | TBD (Play console) | QoQ growth | Play console, utm_source |
| Featured snippets | 0 | ≥5 chapter/asked-Q snippets | GSC / audit |
| Bounce on chapter pages | TBD | <55% | GA4 |
| avg. position (sem-1 chapters) | TBD | ≤10 | GSC |

## Quarterly checkpoints
1. SSR + noindex complete, sitemaps submitted, llms.txt live.
2. Schema validated (rich results), asked-questions in place, first AI citations logged.
3. Backlink/PR push + legacy-domain consolidation settled; brand mention tracking running.
4. Full-year review vs. KPI table; calendar realigned to the new PU cohort.

## Risk register
- **Brand collision** ("StudyMate" generic) → measure SERPs for the bare brand; plan a
  distinct brand/lib-com layer if contested (Phase 3).
- **AI crawlers throttling** → keep sitemap + llms.txt canonical; robots stay open on content.
- **.com.np domain perception** → it reads as a national/edu-bounded TLD: use it as trust, keep
  subpages out of auth walls.
- **Don't crack the live SEO** → no repaths, no duplicate-canonical split between /blog and an
  alias.