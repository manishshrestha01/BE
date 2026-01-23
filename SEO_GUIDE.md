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

8) Bing Webmaster Tools
- Verify the site in Bing Webmaster Tools (add the meta tag or upload verification file shown in the Bing UI).
- Submit your sitemap: https://www.manishshrestha012.com.np/sitemap.xml and use the URL submission tool to request indexing for key pages.
- Use the Site Scan and Index Explorer to confirm important pages are discoverable.

How to influence Google/Bing sitelinks (short checklist)
- Make preferred links very prominent in the main navigation and footer (Dashboard, Colleges, Login, Privacy, Terms). — done (added Dashboard to top nav + SiteNavigationElement).
- Expose important lists to crawlers (server-side JSON-LD ItemList + visible/`noscript` links). — done (colleges ItemList + noscript list).
- Add BreadcrumbList on all content pages so hierarchy is obvious. — done for all college pages.
- If you don't want specific pages shown as sitelinks, remove or de-emphasize their anchor text from the homepage (or add `noindex` only as a last resort).
- Request indexing in Search Console and Bing Webmaster after you deploy these changes; sitelink updates can take days–weeks.

Quick next steps (what I recommend you do now)
1. Deploy these changes to production.
2. In Google Search Console: inspect and Request Indexing for `/`, `/colleges`, `/college/<slug>` (start with the ones missing in search).
3. In Bing Webmaster Tools: verify site and submit the sitemap.
4. Wait 48–72 hours and re-check the Performance/Index Coverage reports; open a ticket if a page still isn't indexed after 2 weeks.

Notes
- Google may take hours to days to update how the site is displayed in search. Showing the brand name (StudyMate) in the Organization JSON-LD, site title, and using canonical, og:site_name together will help Google replace the globe/domain with your brand over time.
- If you want, I can:
  - run the Rich Results test for one page and report back the findings (I can't perform Search Console verified actions without access), or
  - create unique thumbnail images for each college and wire them into the og:image for better click-throughs. Let me know which you prefer.

Meta description length (practical rule)
- Keep meta descriptions between ~120–155 characters for best display across Google/Bing. Avoid stuffing keywords — write concise, user-focused copy that includes the primary target phrase (e.g. "PEC notes").

Automated checks
- The repository includes an enhanced SEO inspector that prints meta description length and warns when a description is >160 characters. Example:
  - npm run inspect-seo -- https://www.manishshrestha012.com.np
  - To make CI fail on long descriptions: npm run inspect-seo -- <url> --fail-on-long-desc

Quick example of a good homepage description (we applied this):
"Pokhara University BE Computer Engineering notes — semester-wise PDFs for PEC, NCIT, NEC and other colleges."
