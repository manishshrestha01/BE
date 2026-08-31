import {
  isAuthGateConfigured,
  loadAuthGateConfig,
  readAuthGateState,
  writeAuthGateState,
} from './_lib/auth-gate.js'
import {
  getHeader,
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from './_lib/http.js'

function readProvidedAdminToken(req) {
  const directHeaders = ['x-auth-toggle-token', 'x-admin-token', 'x-indexnow-token']
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

function parseRequireLoginFromBody(body, currentState) {
  if (typeof body?.requireLogin === 'boolean') return body.requireLogin
  if (typeof body?.authRequired === 'boolean') return body.authRequired
  if (typeof body?.enabled === 'boolean') return body.enabled

  if (body?.action === 'toggle') {
    return !currentState.requireLogin
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    sendMethodNotAllowed(res, ['GET', 'POST'])
    return
  }

  const config = loadAuthGateConfig()

  res.setHeader('cache-control', 'no-store')

  if (!isAuthGateConfigured(config)) {
    sendJson(res, 200, {
      requireLogin: config.defaultRequireLogin,
      authEnabled: config.defaultRequireLogin,
      persisted: false,
      configured: false,
      message:
        'Auth gate storage is not configured. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    })
    return
  }

  if (req.method === 'GET') {
    try {
      const state = await readAuthGateState(config)
      sendJson(res, 200, {
        requireLogin: state.requireLogin,
        authEnabled: state.requireLogin,
        authBypassEnabled: !state.requireLogin,
        updatedAt: state.updatedAt,
        persisted: state.persisted,
        configured: true,
      })
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Failed to read auth gate state',
      })
    }
    return
  }

  if (!config.adminToken) {
    sendJson(res, 500, {
      error:
        'AUTH_TOGGLE_ADMIN_TOKEN (or INDEXNOW_ADMIN_TOKEN fallback) is not configured on the server',
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
    currentState = await readAuthGateState(config)
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to read current auth gate state before update',
    })
    return
  }

  const nextRequireLogin = parseRequireLoginFromBody(body, currentState)
  if (nextRequireLogin === null) {
    sendJson(res, 400, {
      error:
        'Provide requireLogin/authRequired/enabled as a boolean, or action: "toggle".',
    })
    return
  }

  try {
    const updatedState = await writeAuthGateState(config, nextRequireLogin)
    sendJson(res, 200, {
      previousRequireLogin: currentState.requireLogin,
      requireLogin: updatedState.requireLogin,
      authEnabled: updatedState.requireLogin,
      authBypassEnabled: !updatedState.requireLogin,
      updatedAt: updatedState.updatedAt,
      configured: true,
    })
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Failed to update auth gate state',
    })
  }
}

