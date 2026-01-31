get-notes Edge Function

Purpose
- Serve as a secure server-side proxy to GitHub for listing and streaming files from a private repository. The GitHub token is kept as a Supabase secret and never exposed to the browser.

Endpoints
- GET /list?path=...  — returns JSON { success: true, data: [ ... ] }
- GET /file?path=...  — proxies raw file bytes with correct Content-Type
- GET /repo           — returns GitHub repository info (optional)

Dashboard Deployment (no Docker required)
1. Open Supabase Dashboard → Project → Functions
2. Create a new function named `get-notes` or open the existing one
3. Replace `index.ts` contents with the code in this repo and Save
4. Add Secrets (Project → Functions → Secrets):
   - GITHUB_TOKEN (your PAT, fine‑grained + read-only recommended)
   - GITHUB_OWNER (e.g., "manishshrestha01")
   - GITHUB_REPO (e.g., "BE-Computer")
   - GITHUB_BRANCH (e.g., "main")
   - GITHUB_BASE_PATH (optional)
5. Click "Deploy function"
6. Copy the function invoke URL (example: `https://<project>.functions.supabase.co/get-notes`)

Local testing via CLI (requires Docker):
- supabase functions serve
- curl "http://localhost:54321/functions/v1/get-notes/list?path="

Front-end setup
- Set a public env var in your Vite app (not secret):
  VITE_SUPABASE_FUNCTION_URL="https://<project>.functions.supabase.co/get-notes"
- Restart dev server (npm run dev)
- The app will automatically use the function for listings and file downloads when `VITE_SUPABASE_FUNCTION_URL` is present.

Security notes
- Keep GITHUB_TOKEN as a server-side secret only. Do NOT set it as a `VITE_` env var.
- Use a fine‑grained PAT with minimum scope (Contents: read, only selected repo) and set an expiry.
- Rotate tokens regularly and revoke immediately if leaked.
