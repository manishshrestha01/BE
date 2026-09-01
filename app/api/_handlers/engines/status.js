import { sendJson, sendMethodNotAllowed } from '../_lib/http.js'
import {
  INDEXNOW_ENGINES,
  SITEMAP_PING_ENDPOINTS,
  getIndexNowKeyLocation,
  getSitemapUrl,
  getVerificationConfig,
} from '../_lib/engines.js'

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendMethodNotAllowed(res, ['GET', 'HEAD'])
    return
  }

  const sitemapUrl = getSitemapUrl()
  const keyLocation = getIndexNowKeyLocation()

  sendJson(res, 200, {
    sitemapUrl,
    indexNow: {
      keyLocation,
      coveredEngines: INDEXNOW_ENGINES,
    },
    pingEndpoints: SITEMAP_PING_ENDPOINTS,
    verificationChannels: getVerificationConfig(),
  })
}