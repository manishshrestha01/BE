# StudyMate — Search Engine Ingesting Run-List

Operational checklist to get StudyMate indexed (and re-crawled on updates) by every major
search engine, plus Microsoft Copilot. Code changes are already wired — this is the
manual, one-time account work.

Site URL: https://www.manishshrestha012.com.np
Sitemap:  https://www.manishshrestha012.com.np/sitemap.xml
IndexNow key file: https://www.manishshrestha012.com.np/c26b3dbaccc24a01a8b49b05d49dd844.txt

---

## 1. Google (highest impact for your market)

1. Add the domain to **Google Search Console** (search.google.com/search-console).
2. Verify with the **HTML tag** method. Grab the `google-site-verification` token.
3. Add it on Vercel: Project → Settings → Environment Variables → `GOOGLE_SITE_VERIFICATION` = <token>. Re-deploy.
   - The meta tag is then emitted automatically from `app/layout.jsx`.
4. Under **Sitemaps → Add new sitemap**: submit `/sitemap.xml`.
5. Use **URL Inspection** on `/`, `/blog`, `/pu-exam`, `/dashboard` → *Request indexing*.
6. (Optional, ~2 weeks later) Watch **Performance / Pages** for CWV. TTFB is ~150ms (excellent).

> Google ignores IndexNow (by design). Sitemap + Search Console is the only fast path.

## 2. Bing + Microsoft Copilot (via IndexNow)

Already covers Bing, Naver, Yandex, Seznam.cz, Yep and DuckDuckGo in one POST.

1. **Bing Webmaster Tools** (www.bing.com/webmasters) → Add site → verify.
   - Fastest: **Import from Google Search Console** (one click, if GSC is linked to same Google account).
2. Submit sitemap: `/sitemap.xml`.
3. Get the `msvalidate.01` code → Vercel env `BING_SITE_VERIFICATION` → re-deploy (meta emitted automatically).
4. Ping Bing for fresh pages: **any** of
   - Admin UI (`/admin/indexnow` → "Submit ALL URLs to Bing (IndexNow)"), or
   - `POST /api/indexnow/submit` with `{ "scope": "all" }` + `x-indexnow-token` header, or
   - `POST /api/indexnow/blog-event` with `{ "action": "created", "slug": "...", "semesterId": ... }` on each publish.

> Microsoft Copilot cites from the Bing index. IndexNow pings make new pages eligible for
> Copilot answers quickly. Your robots.txt already allows GPTBot / OAI-SearchBot /
> Claude-SearchBot / PerplexityBot / Google-Extended and blocks training-only bots.

## 3. Baidu (own ping endpoint; not IndexNow)

1. Baidu Search Resource Platform (ziyuan.baidu.com) → verify site via HTML tag →
   `BAIDU_SITE_VERIFICATION` env → re-deploy (meta emitted automatically).
2. Ping the sitemap from the Admin UI ("Ping Baidu Sitemap") or
   `POST /api/engines/ping` with `x-indexnow-token`.

## 4. Naver (South Korea)

1. Naver Search Advisor (searchadvisor.naver.com) → add site → verify via HTML tag →
   `NAVER_SITE_VERIFICATION` env → re-deploy. Meta `naver-site-verification` is emitted.
2. Submit sitemap in the Advisor UI.
3. Also notifies via IndexNow thanks to the shared ping above.

## 5. Yandex (Russia)

1. Yandex Webmaster (webmaster.yandex.com) → add site → verify.
   - Meta tag is already hardcoded in `app/layout.jsx` (`yandex: '464a14ed2069c072'`).
2. Submit sitemap in Yandex Webmaster UI.
3. IndexNow pings also reach Yandex.

## 6. Seznam.cz (Czech Republic)

1. Seznam Webmaster (search.seznam.cz) → verify → `SEZNAM_SITE_VERIFICATION` env → re-deploy
   (meta `seznam-wmt` emitted).
2. Seznam honors IndexNow — no further action needed.

## 7. Yoast-of-the-rest / opportunistic

- **Brave Search**: searchengine.pub API (submit sitemap) — IndexNow independent.
- **Yep.com**: IndexNow partner (covered).
- **DuckDuckGo**: Bing-powered (covered by IndexNow pings).
- **Baidu/Naver/Yandex/Seznam**: mostly relevant if you later localize or expand markets. Low
  urgency for a Nepal-focused audience right now — the env hooks are in place so it's fast when needed.

---

## One-time envs to set on Vercel (all optional except none)

| Var | Engine | Where to get |
|---|---|---|
| `GOOGLE_SITE_VERIFICATION` | Google | GSC HTML-tag code |
| `BING_SITE_VERIFICATION` | Bing | Bing WMT `msvalidate.01` code |
| `BAIDU_SITE_VERIFICATION` | Baidu | Baidu platform code |
| `NAVER_SITE_VERIFICATION` | Naver | Naver Advisor code |
| `SEZNAM_SITE_VERIFICATION` | Seznam | Seznam code |

Already set: `SITE_URL`, `INDEXNOW_KEY`, `INDEXNOW_KEY_LOCATION`, `INDEXNOW_ADMIN_TOKEN`,
`YANDEX_SITE_VERIFICATION` (in code, `464a14ed2069c072`).

## What was changed (this session)

- `public/c26b3dbaccc24a01a8b49b05d49dd844.txt` — IndexNow key file was MISSING so IndexNow
  verification would fail; recreated (public by design).
- `app/layout.jsx` — env-driven verification metas for Google/Bing/Baidu/Naver/Seznam + OG
  image width/height/alt.
- `src/lib/blogSeo.js` — per-page `og:locale`, `og:image:width/height/alt`.
- `app/api/engines/status/route.js` + handler — engine coverage report.
- `app/api/engines/ping/route.js` + handler — Baidu sitemap ping (auth-protected).
- `app/api/_handlers/_lib/engines.js` — engine registry + verification helper.
- Admin UI — "Engine Sitemap Pings" card (Ping Baidu / Check Engine Status).