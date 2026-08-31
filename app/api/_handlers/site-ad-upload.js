import {
  createSignedAdUpload,
  isSiteSettingsConfigured,
  loadSiteSettingsConfig,
  requireSiteSettingsAdminToken,
} from './_lib/site-settings.js'
import {
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from './_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendMethodNotAllowed(res, ['POST'])
    return
  }

  const config = loadSiteSettingsConfig()
  res.setHeader('cache-control', 'no-store')

  if (!isSiteSettingsConfigured(config)) {
    sendJson(res, 500, {
      error:
        'Site ad upload backend is not configured. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    })
    return
  }

  if (!requireSiteSettingsAdminToken(req, res, config)) {
    return
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Request body must be valid JSON' })
    return
  }

  try {
    const upload = await createSignedAdUpload(config, {
      fileName: body?.fileName,
      contentType: body?.contentType,
    })

    sendJson(res, 200, {
      bucket: upload.bucket,
      path: upload.path,
      token: upload.token,
      publicUrl: upload.publicUrl,
      configured: true,
    })
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Failed to prepare ad upload',
    })
  }
}
