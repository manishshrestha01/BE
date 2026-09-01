import { parseJsonBody, requireIndexNowAdminToken, sendJson, sendMethodNotAllowed } from '../_lib/http.js'
import { loadIndexNowConfig } from '../_lib/indexnow.js'
import { pingBaiduSitemap } from '../_lib/engines.js'

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

  const includeBaidu = body?.baidu !== false
  const results = []

  if (includeBaidu) {
    try {
      const pingResult = await pingBaiduSitemap()
      results.push(pingResult)
    } catch (error) {
      results.push({
        ok: false,
        engine: 'baidu',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  sendJson(res, 200, {
    sitemapUrl: config.sitemapUrl,
    results,
    note: 'Bing, Naver, Yandex, Seznam.cz, Yep, DuckDuckGo are covered via IndexNow — POST /api/indexnow/submit with { scope: "all" } to notify them.',
  })
}