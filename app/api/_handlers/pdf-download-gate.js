import {
  isPdfDownloadGateConfigured,
  loadPdfDownloadGateConfig,
  readPdfDownloadGateState,
  writePdfDownloadGateState,
} from './_lib/pdf-download-gate.js'
import {
  getHeader,
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from './_lib/http.js'

function readProvidedAdminToken(req) {
  const directHeaders = [
    'x-pdf-toggle-token',
    'x-auth-toggle-token',
    'x-admin-token',
    'x-indexnow-token',
  ]
  for (const headerName of directHeaders) {
    const value = getHeader(req, headerName)
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  const authorization = getHeader(req, 'authorization')
  if (typeof authorization !== 'string') return ''

  const bearerPrefix = 'bearer '
  if (authorization.toLowerCase().startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim()
  }

  return authorization.trim()
}

function parsePdfDownloadEnabledFromBody(body, currentState) {
  if (typeof body?.pdfDownloadEnabled === 'boolean') return body.pdfDownloadEnabled
  if (typeof body?.downloadEnabled === 'boolean') return body.downloadEnabled
  if (typeof body?.enabled === 'boolean') return body.enabled

  if (body?.action === 'toggle') {
    return !currentState.pdfDownloadEnabled
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    sendMethodNotAllowed(res, ['GET', 'POST'])
    return
  }

  const config = loadPdfDownloadGateConfig()

  res.setHeader('cache-control', 'no-store')

  if (!isPdfDownloadGateConfigured(config)) {
    sendJson(res, 200, {
      pdfDownloadEnabled: config.defaultEnabled,
      downloadEnabled: config.defaultEnabled,
      configured: false,
      persisted: false,
      message:
        'PDF download gate storage is not configured. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    })
    return
  }

  if (req.method === 'GET') {
    try {
      const state = await readPdfDownloadGateState(config)
      sendJson(res, 200, {
        pdfDownloadEnabled: state.pdfDownloadEnabled,
        downloadEnabled: state.pdfDownloadEnabled,
        updatedAt: state.updatedAt,
        persisted: state.persisted,
        configured: true,
      })
    } catch (error) {
      sendJson(res, 500, {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to read PDF download gate state',
      })
    }
    return
  }

  if (!config.adminToken) {
    sendJson(res, 500, {
      error:
        'PDF_DOWNLOAD_TOGGLE_ADMIN_TOKEN (or AUTH_TOGGLE_ADMIN_TOKEN / INDEXNOW_ADMIN_TOKEN fallback) is not configured on the server',
    })
    return
  }

  const providedToken = readProvidedAdminToken(req)
  if (!providedToken || providedToken !== config.adminToken) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Request body must be valid JSON' })
    return
  }

  let currentState
  try {
    currentState = await readPdfDownloadGateState(config)
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to read current PDF download gate state before update',
    })
    return
  }

  const nextEnabled = parsePdfDownloadEnabledFromBody(body, currentState)
  if (nextEnabled === null) {
    sendJson(res, 400, {
      error:
        'Provide pdfDownloadEnabled/downloadEnabled/enabled as a boolean, or action: "toggle".',
    })
    return
  }

  try {
    const updatedState = await writePdfDownloadGateState(config, nextEnabled)
    sendJson(res, 200, {
      previousPdfDownloadEnabled: currentState.pdfDownloadEnabled,
      pdfDownloadEnabled: updatedState.pdfDownloadEnabled,
      downloadEnabled: updatedState.pdfDownloadEnabled,
      updatedAt: updatedState.updatedAt,
      configured: true,
    })
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update PDF download gate state',
    })
  }
}
