/* eslint-env node */
/* global process */

import { sendMethodNotAllowed } from '../_lib/http.js'

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendMethodNotAllowed(res, ['GET', 'HEAD'])
    return
  }

  const key = (process.env.INDEXNOW_KEY || '').trim()
  if (!key) {
    res.statusCode = 500
    res.setHeader('content-type', 'text/plain; charset=utf-8')
    res.end('INDEXNOW_KEY is not configured on the server')
    return
  }

  const requestedKey = String(req?.query?.requestedKey || '').trim()
  if (requestedKey && requestedKey !== key) {
    res.statusCode = 404
    res.setHeader('content-type', 'text/plain; charset=utf-8')
    res.end('Not Found')
    return
  }

  res.statusCode = 200
  res.setHeader('content-type', 'text/plain; charset=utf-8')
  res.setHeader('cache-control', 'public, max-age=300')
  res.end(req.method === 'HEAD' ? '' : key)
}
