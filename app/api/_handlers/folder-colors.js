import {
  isSiteSettingsConfigured,
  loadSiteSettingsConfig,
  normalizeFolderColors,
  readSiteSetting,
  requireSiteSettingsAdminToken,
  writeSiteSetting,
} from './_lib/site-settings.js'
import {
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from './_lib/http.js'

const SETTING_KEY = 'folder_colors'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    sendMethodNotAllowed(res, ['GET', 'POST'])
    return
  }

  const config = loadSiteSettingsConfig()
  res.setHeader('cache-control', 'no-store')

  if (!isSiteSettingsConfigured(config)) {
    sendJson(res, 200, {
      folderColors: {},
      updatedAt: null,
      persisted: false,
      configured: false,
      message:
        'Folder color storage is not configured. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    })
    return
  }

  if (req.method === 'GET') {
    try {
      const state = await readSiteSetting(config, SETTING_KEY, {})
      sendJson(res, 200, {
        folderColors: normalizeFolderColors(state.value),
        updatedAt: state.updatedAt,
        persisted: state.persisted,
        configured: true,
      })
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Failed to read folder colors',
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

  const nextFolderColors = normalizeFolderColors(body?.folderColors ?? body?.colors)

  try {
    const updated = await writeSiteSetting(config, SETTING_KEY, nextFolderColors)
    sendJson(res, 200, {
      folderColors: normalizeFolderColors(updated.value),
      updatedAt: updated.updatedAt,
      configured: true,
    })
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Failed to update folder colors',
    })
  }
}
