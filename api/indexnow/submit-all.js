import { fetchSitemapUrls, loadIndexNowConfig, submitIndexNow } from '../_lib/indexnow.js'
import {
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

  try {
    const sitemapUrls = await fetchSitemapUrls()
    const result = await submitIndexNow(sitemapUrls)

    sendJson(res, 200, {
      totalUrls: result.validUrls,
      submittedCount: result.submittedCount,
      submittedBatches: result.submittedBatches,
      failedBatches: result.failedBatches,
      invalidUrls: result.invalidUrls,
    })
  } catch (error) {
    console.error('[IndexNow] submit-all failed', error)
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Failed to submit sitemap URLs',
    })
  }
}
