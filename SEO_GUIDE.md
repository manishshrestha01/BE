SEO Checklist & Steps to get college pages ranking for queries like "PEC notes" or "NCIT notes"

1) Deploy changes
- Make sure your latest main branch is deployed to https://www.manishshrestha012.com.np (Netlify / Vercel / other).
- Confirm https://www.manishshrestha012.com.np/logo-512.png and /colleges and /college/pec are accessible publicly.

2) Verify in Google Search Console
- Add and verify the `https://www.manishshrestha012.com.np` property (Domain or URL prefix). Follow Google's verification flow.

3) Request reindexing
- In Search Console > URL Inspection, enter homepage and each `/colleges` and `/college/<slug>` URL and click "Request Indexing".
- This tells Google to re-crawl sooner.

4) Run Rich Results Test / Structured Data tests
- Use https://search.google.com/test/rich-results and enter one of the college URLs. Ensure it detects:
  - WebPage / CollectionPage JSON-LD
  - BreadcrumbList (optional)
  - OG/Twitter preview (you can check meta tags with the inspector below)

5) Use the local SEO inspection script
- You can run a quick check from the project root (requires Node >= 18 with global fetch):
  - npm run inspect-seo https://www.manishshrestha012.com.np/colleges
  - npm run inspect-seo https://www.manishshrestha012.com.np/college/pec
- This will print title, description, OG & JSON-LD presence.

6) Improve per-college pages
- Add useful content to each college page: headings using the target phrase (e.g. "PEC notes"), short list of semesters, sample notes, FAQ for students.
- Add internal links from the dashboard/landing page to each college page.
- Consider one unique image per college (e.g. a branded thumbnail) and reference it in og:image for better social previews.

7) Monitor & iterate
- After requesting indexing, check Performance reports in Search Console for impressions and clicks.
- Keep pages updated with fresh content and get a few backlinks (college pages or student groups linking to these pages help a lot).

Notes
- Google may take hours to days to update how the site is displayed in search. Showing the brand name (StudyMate) in the Organization JSON-LD, site title, and using canonical, og:site_name together will help Google replace the globe/domain with your brand over time.
- If you want, I can:
  - run the Rich Results test for one page and report back the findings (I can't perform Search Console verified actions without access), or
  - create unique thumbnail images for each college and wire them into the og:image for better click-throughs. Let me know which you prefer.
