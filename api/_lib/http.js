export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function sendMethodNotAllowed(res, allowedMethods = []) {
  if (allowedMethods.length > 0) {
    res.setHeader('allow', allowedMethods.join(', '))
  }

  sendJson(res, 405, {
    error: 'Method Not Allowed',
  })
}

export function getHeader(req, headerName) {
  if (!req?.headers || !headerName) return undefined

  const directValue = req.headers[headerName]
  if (typeof directValue === 'string') return directValue
  if (Array.isArray(directValue)) return directValue[0]

  const normalizedHeaderName = headerName.toLowerCase()
  const matchedKey = Object.keys(req.headers).find(
    (key) => key.toLowerCase() === normalizedHeaderName
  )

  if (!matchedKey) return undefined
  const matchedValue = req.headers[matchedKey]
  if (typeof matchedValue === 'string') return matchedValue
  if (Array.isArray(matchedValue)) return matchedValue[0]

  return undefined
}

export async function parseJsonBody(req) {
  if (req?.body && typeof req.body === 'object') return req.body

  if (typeof req?.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body)
  }

  if (!req || typeof req.on !== 'function') return {}

  const rawBody = await new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })

  if (!rawBody) return {}
  return JSON.parse(rawBody)
}

export function requireIndexNowAdminToken(req, res, expectedToken) {
  if (!expectedToken) {
    sendJson(res, 500, {
      error: 'INDEXNOW_ADMIN_TOKEN is not configured on the server',
    })
    return false
  }

  const providedToken = getHeader(req, 'x-indexnow-token')
  if (!providedToken || providedToken !== expectedToken) {
    sendJson(res, 401, {
      error: 'Unauthorized',
    })
    return false
  }

  return true
}
