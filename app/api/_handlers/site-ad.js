import {
  isSiteSettingsConfigured,
  loadSiteSettingsConfig,
  normalizeSiteAd,
  readSiteSetting,
  requireSiteSettingsAdminToken,
  writeSiteSetting,
} from './_lib/site-settings.js'
import {
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from './_lib/http.js'

const SETTING_KEY = 'site_ad'
const DEFAULT_AD = {
  enabled: false,
  imageUrl: '',
  imagePath: '',
  targetUrl: '',
  altText: '',
  imageWidth: null,
  imageHeight: null,
  updatedAt: null,
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    sendMethodNotAllowed(res, ['GET', 'POST'])
    return
  }

  const config = loadSiteSettingsConfig()
  res.setHeader('cache-control', 'no-store')

  if (!isSiteSettingsConfigured(config)) {
    sendJson(res, 200, {
      ad: DEFAULT_AD,
      updatedAt: null,
      persisted: false,
      configured: false,
      message:
        'Site ad storage is not configured. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    })
    return
  }

  if (req.method === 'GET') {
    try {
      const state = await readSiteSetting(config, SETTING_KEY, DEFAULT_AD)
      const normalizedAd = normalizeSiteAd(state.value)
      sendJson(res, 200, {
        ad: normalizedAd,
        updatedAt: normalizedAd.updatedAt || state.updatedAt,
        persisted: state.persisted,
        configured: true,
      })
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Failed to read site ad settings',
      })
    }
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

  const nextAd = normalizeSiteAd({
    ...(body?.ad || body || {}),
    updatedAt: new Date().toISOString(),
  })

  try {
    const updated = await writeSiteSetting(config, SETTING_KEY, nextAd)
    const normalizedAd = normalizeSiteAd(updated.value)
    sendJson(res, 200, {
      ad: normalizedAd,
      updatedAt: normalizedAd.updatedAt || updated.updatedAt,
      configured: true,
    })
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Failed to update site ad settings',
    })
  }
}
