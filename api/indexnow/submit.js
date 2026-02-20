import { loadIndexNowConfig, submitIndexNow } from '../_lib/indexnow.js'
import {
  parseJsonBody,
  requireIndexNowAdminToken,
  sendJson,
  sendMethodNotAllowed,
} from '../_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendMethodNotAllowed(res, ['POST'])
    return
  }

  let config
  try {
    config = loadIndexNowConfig()
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Server configuration error',
    })
    return
  }

  if (!requireIndexNowAdminToken(req, res, config.adminToken)) {
    return
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Request body must be valid JSON' })
    return
  }

  const urls = Array.isArray(body?.urls) ? body.urls : null
  if (!urls) {
    sendJson(res, 400, {
      error: 'Request body must include urls: string[]',
    })
    return
  }

  const mode = body?.mode || 'updated'

  try {
    const result = await submitIndexNow(urls, mode)
    sendJson(res, 200, {
      totalUrls: result.validUrls,
      submittedCount: result.submittedCount,
      submittedBatches: result.submittedBatches,
      failedBatches: result.failedBatches,
      invalidUrls: result.invalidUrls,
      mode: result.mode,
    })
  } catch (error) {
    sendJson(res, 400, {
      error: error instanceof Error ? error.message : 'Failed to submit URLs',
    })
  }
}
