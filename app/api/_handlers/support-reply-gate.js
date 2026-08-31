import {
  isSupportReplyGateConfigured,
  loadSupportReplyGateConfig,
  readSupportReplyGateState,
  writeSupportReplyGateState,
} from './_lib/support-reply-gate.js'
import {
  getHeader,
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from './_lib/http.js'

function readProvidedAdminToken(req) {
  const directHeaders = [
    'x-support-reply-toggle-token',
    'x-support-admin-token',
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

function parseSupportReplyEnabledFromBody(body, currentState) {
  if (typeof body?.supportReplyEnabled === 'boolean') return body.supportReplyEnabled
  if (typeof body?.replyEnabled === 'boolean') return body.replyEnabled
  if (typeof body?.enabled === 'boolean') return body.enabled

  if (body?.action === 'toggle') {
    return !currentState.supportReplyEnabled
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    sendMethodNotAllowed(res, ['GET', 'POST'])
    return
  }

  const config = loadSupportReplyGateConfig()

  res.setHeader('cache-control', 'no-store')

  if (!isSupportReplyGateConfigured(config)) {
    sendJson(res, 200, {
      supportReplyEnabled: config.defaultEnabled,
      replyEnabled: config.defaultEnabled,
      configured: false,
      persisted: false,
      message:
        'Support reply gate storage is not configured. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    })
    return
  }

  if (req.method === 'GET') {
    try {
      const state = await readSupportReplyGateState(config)
      sendJson(res, 200, {
        supportReplyEnabled: state.supportReplyEnabled,
        replyEnabled: state.supportReplyEnabled,
        updatedAt: state.updatedAt,
        persisted: state.persisted,
        configured: true,
      })
    } catch (error) {
      sendJson(res, 500, {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to read support reply gate state',
      })
    }
    return
  }

  if (!config.adminToken) {
    sendJson(res, 500, {
      error:
        'SUPPORT_REPLY_TOGGLE_ADMIN_TOKEN (or SUPPORT_REPLY_ADMIN_TOKEN / AUTH_TOGGLE_ADMIN_TOKEN / INDEXNOW_ADMIN_TOKEN fallback) is not configured on the server',
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
    currentState = await readSupportReplyGateState(config)
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to read current support reply gate state before update',
    })
    return
  }

  const nextEnabled = parseSupportReplyEnabledFromBody(body, currentState)
  if (nextEnabled === null) {
    sendJson(res, 400, {
      error:
        'Provide supportReplyEnabled/replyEnabled/enabled as a boolean, or action: "toggle".',
    })
    return
  }

  try {
    const updatedState = await writeSupportReplyGateState(config, nextEnabled)
    sendJson(res, 200, {
      previousSupportReplyEnabled: currentState.supportReplyEnabled,
      supportReplyEnabled: updatedState.supportReplyEnabled,
      replyEnabled: updatedState.supportReplyEnabled,
      updatedAt: updatedState.updatedAt,
      configured: true,
    })
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update support reply gate state',
    })
  }
}
