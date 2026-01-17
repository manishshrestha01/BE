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
