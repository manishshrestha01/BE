# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Quick start
1. Install dependencies:

	npm install

2. Run dev server:

	npm run dev

3. Open the URL printed by Vite (usually http://localhost:5173).

## Where to edit
- Edit the app entry at `src/App.jsx`.
- The routing and navigation example is in `src/Routes.jsx`.
- Components live in `src/components/` (for example `Home.jsx`).

No additional packages are required to try the in-app navigation example added to `Routes.jsx`.

## SEO & Deployment

Small SEO-related changes were added to improve how Google displays the StudyMate brand and per-college pages:

- Added raster logo and favicon (512x512 PNG, 48x48 PNG).
- Added Organization + WebSite JSON‑LD to the homepage and to every static college page so Google can show the site name and logo instead of the globe/domain.
- Created static pages under `public/colleges` and `public/college/<slug>/index.html` and updated `sitemap.xml`.
- Adjusted `vercel.json` so `/colleges` and `/college/*` are not rewritten to `/`, allowing the server to serve the static HTML pages directly.

Next steps to make these changes live and visible in Google:

1. Commit and push these changes to your repository (e.g. `git add . && git commit -m "seo: serve static college pages and add site schema" && git push`).
2. If you're using Vercel (the project contains `vercel.json`) the push will trigger a deployment. Monitor the deployment logs in the Vercel dashboard and confirm that the URLs below return the per-page HTML with the correct title/meta/JSON-LD:
   - `https://www.manishshrestha012.com.np/colleges`
   - `https://www.manishshrestha012.com.np/college/pec` (and other `/college/<slug>` pages)
3. In Google Search Console, use the URL Inspection tool for those URLs, click "Test live URL" and then "Request indexing".
4. Run the Rich Results Test (https://search.google.com/test/rich-results) and the Mobile-Friendly Test for sample pages to ensure structured data is recognized.
5. Locally you can run `npm run inspect-seo https://your-site/colleges https://your-site/college/pec` to quickly verify the public HTML includes the title/og/canonical/JSON-LD.

If you want, I can re-run the inspection once you deploy and then help with Search Console steps (rich results validation and request indexing).

## IndexNow (Bing) integration

This repo now includes server-side IndexNow submission using Vercel API routes.

### Server env vars (do not expose to client)

- `SITE_URL` (example: `https://www.manishshrestha012.com.np`)
- `INDEXNOW_KEY`
- `INDEXNOW_ADMIN_TOKEN`
- `INDEXNOW_KEY_LOCATION` (optional, defaults to `${SITE_URL}/${INDEXNOW_KEY}.txt`)
- `SITEMAP_URL` (optional, defaults to `${SITE_URL}/sitemap.xml`)

### Endpoints

- `POST /api/indexnow/submit-all`
  - Auth header: `x-indexnow-token`
  - Fetches all URLs from sitemap (supports sitemapindex), then submits in batches.
- `POST /api/indexnow/submit`
  - Auth header: `x-indexnow-token`
  - Body: `{ "urls": ["https://..."], "mode": "created|updated|deleted" }`
- `POST /api/indexnow/blog-event`
  - Auth header: `x-indexnow-token`
  - Body examples:
    - `{ "action": "updated", "postUrl": "https://.../blog/semester/1/calculus-i" }`
    - `{ "action": "deleted", "urls": ["https://.../blog/semester/1/calculus-i"] }`
- `GET /<INDEXNOW_KEY>.txt`
  - Serves the IndexNow key file content at root via Vercel rewrite.

### Admin UI

- Open `/admin/indexnow`
- Paste `INDEXNOW_ADMIN_TOKEN`
- Use:
  - `Submit ALL URLs to Bing (IndexNow)`
  - custom URL submission with `created|updated|deleted` mode

### Blog create/update/delete hook

`scripts/generate-blog-static.js` now computes created/updated/deleted blog URLs and calls:

- `POST /api/indexnow/blog-event`

when `INDEXNOW_ADMIN_TOKEN` is available in environment.

## Login Authentication Toggle (Bot/Crawler access)

You can now toggle login authentication ON/OFF from the admin page using a single button.

- Admin UI: `/admin/indexnow` -> section **Login Authentication Toggle**
- API endpoint:
  - `GET /api/auth-gate` (read current mode)
  - `POST /api/auth-gate` (toggle/update mode, requires admin token)

### Server env vars

- `SUPABASE_SERVICE_ROLE_KEY` (required, server only)
- `AUTH_TOGGLE_ADMIN_TOKEN` (recommended; falls back to `INDEXNOW_ADMIN_TOKEN`)
- Optional:
  - `AUTH_TOGGLE_TABLE` (default: `site_settings`)
  - `AUTH_TOGGLE_KEY` (default: `require_login`)
  - `AUTH_TOGGLE_DEFAULT_REQUIRE_LOGIN` (default: `true`)

### Required database table

Create the table from:

- `supabase/migrations/20260307163000_create_site_settings.sql`

This creates `public.site_settings` with a default `require_login = true` row.

## PDF Download Toggle (Mozilla PDF.js QuickLook)

PDF download in the embedded Mozilla PDF.js viewer can now be controlled from the backend.

- Admin UI: `/admin/indexnow` -> section **PDF Download Toggle (Mozilla PDF Viewer)**
- API endpoint:
  - `GET /api/pdf-download-gate` (read current mode)
  - `POST /api/pdf-download-gate` (toggle/update mode, requires admin token)

### Server env vars

- `SUPABASE_SERVICE_ROLE_KEY` (required, server only)
- `PDF_DOWNLOAD_TOGGLE_ADMIN_TOKEN` (recommended; falls back to `AUTH_TOGGLE_ADMIN_TOKEN`, then `INDEXNOW_ADMIN_TOKEN`)
- Optional:
  - `PDF_DOWNLOAD_TOGGLE_TABLE` (default: `site_settings`)
  - `PDF_DOWNLOAD_TOGGLE_KEY` (default: `pdf_download_enabled`)
  - `PDF_DOWNLOAD_DEFAULT_ENABLED` (default: `true`)

### Required database rows

Run these migrations:

- `supabase/migrations/20260307163000_create_site_settings.sql`
- `supabase/migrations/20260320120000_add_pdf_download_setting.sql`

This stores a `pdf_download_enabled` boolean-like value in `public.site_settings`.

## Support Reply Backend (Email-only replies)

You can now reply to support messages from backend and deliver replies only to the sender's email.

- API endpoint:
  - `POST /api/support/reply` (requires admin token)
- Auth headers accepted:
  - `x-support-admin-token` (recommended)
  - `authorization: Bearer <token>`

### Server env vars

- `SUPABASE_SERVICE_ROLE_KEY` (required, server only)
- `RESEND_API_KEY` (required)
- `SUPPORT_EMAIL_FROM` (required; verified sender in Resend)
- `SUPPORT_REPLY_ADMIN_TOKEN` (recommended; falls back to `AUTH_TOGGLE_ADMIN_TOKEN`, then `INDEXNOW_ADMIN_TOKEN`)
- Optional:
  - `SUPPORT_EMAIL_REPLY_TO`
  - `SUPPORT_MESSAGES_TABLE` (default: `support_messages`)
  - `SUPPORT_REPLIES_TABLE` (default: `support_replies`)
  - `SUPPORT_EMAIL_SUBJECT_PREFIX` (default: `StudyMate Support`)

### Request body

```json
{
  "messageId": "support-message-uuid",
  "reply": "Thanks for reporting this. We have fixed it.",
  "subject": "Re: Login issue",
  "sentBy": "admin@yourdomain.com"
}
```

### Example cURL

```bash
curl -X POST "https://www.manishshrestha012.com.np/api/support/reply" \
  -H "content-type: application/json" \
  -H "x-support-admin-token: <SUPPORT_REPLY_ADMIN_TOKEN>" \
  -d '{
    "messageId": "00000000-0000-0000-0000-000000000000",
    "reply": "Thanks for your message. We have resolved the issue."
  }'
```

### Required database migration

Run:

- `supabase/migrations/20260322170000_create_support_messaging.sql`

This creates `public.support_replies` (reply logs), and creates `public.support_messages` for fresh setups when missing.
