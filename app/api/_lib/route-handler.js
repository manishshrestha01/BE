import { NextResponse } from 'next/server'

const JSON_RE = /^application\/json/i

// Converts a Next.js Route Handler request into the req/res shape the shared
// `_handlers/*` modules were written against (Node-style serverless handlers).
export async function asRequestLike(request) {
  const headers = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  const req = {
    method: request.method,
    headers,
    url: request.url,
    query: Object.fromEntries(request.nextUrl.searchParams),
  }

  const contentType = headers['content-type'] || ''
  if (JSON_RE.test(contentType)) {
    try {
      req.body = await request.json()
    } catch {
      req.body = undefined
    }
  }

  // Minimal readable stream so parseJsonBody() still throws on malformed JSON
  req.on = (event, callback) => {
    if (event === 'end') {
      queueMicrotask(() => callback(''))
    } else if (event === 'error') {
      const error =
        req.body === undefined
          ? new SyntaxError('Request body must be valid JSON')
          : null
      if (error) queueMicrotask(() => callback(error))
    }
    return req
  }

  return req
}

export function createResponseLike() {
  const headers = new Headers()
  const res = {
    statusCode: 200,
    headers,
    _body: '',
    setHeader(name, value) {
      headers.set(name, String(value))
    },
    getHeader(name) {
      return headers.get(name)
    },
    status(code) {
      this.statusCode = code
      return this
    },
    end(payload) {
      if (payload !== undefined) {
        this._body = typeof payload === 'string' ? payload : JSON.stringify(payload)
      }
      return this
    },
    send(payload) {
      if (typeof payload === 'object' && payload !== null) {
        headers.set('content-type', 'application/json; charset=utf-8')
      }
      this._body = typeof payload === 'string' ? payload : JSON.stringify(payload)
      return this
    },
    json(payload) {
      headers.set('content-type', 'application/json; charset=utf-8')
      this._body = JSON.stringify(payload)
      return this
    },
  }

  Object.defineProperty(res, 'response', {
    get() {
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json; charset=utf-8')
      }
      return new NextResponse(res._body, { status: res.statusCode, headers })
    },
  })

  return res
}

export async function runHandler(request, handler) {
  try {
    const req = await asRequestLike(request)
    const res = createResponseLike()
    await handler(req, res)
    return res.response
  } catch (error) {
    console.error('[api] handler error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}