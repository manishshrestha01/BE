import { loadIndexNowConfig, submitIndexNow } from '../_lib/indexnow.js'
import {
  parseJsonBody,
  requireIndexNowAdminToken,
  sendJson,
  sendMethodNotAllowed,
} from '../_lib/http.js'

const VALID_ACTIONS = new Set(['created', 'updated', 'deleted'])

function collectBlogUrls(body, siteUrl) {
  const candidateUrls = []

  if (Array.isArray(body?.urls)) candidateUrls.push(...body.urls)

  const directFields = ['url', 'postUrl', 'deletedPostUrl', 'canonicalUrl']
  for (const field of directFields) {
    if (typeof body?.[field] === 'string' && body[field].trim()) {
      candidateUrls.push(body[field].trim())
    }
  }

  if (
    typeof body?.semesterId !== 'undefined' &&
    typeof body?.slug === 'string' &&
    body.slug.trim()
  ) {
    const semesterId = String(body.semesterId).trim()
    const slug = body.slug.trim()
    candidateUrls.push(`${siteUrl}/blog/semester/${semesterId}/${slug}`)
  }

  return Array.from(
    new Set(
      candidateUrls
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    )
  )
}

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

  const action = body?.action || 'updated'
  if (!VALID_ACTIONS.has(action)) {
    sendJson(res, 400, {
      error: 'action must be one of: created, updated, deleted',
    })
    return
  }

  const urls = collectBlogUrls(body, config.siteUrl)
  if (urls.length === 0) {
    sendJson(res, 400, {
      error:
        'Provide at least one blog URL via urls[], postUrl, deletedPostUrl, or { semesterId, slug }',
    })
    return
  }

  try {
    const result = await submitIndexNow(urls, action)
    sendJson(res, 200, {
      action,
      totalUrls: result.validUrls,
      submittedCount: result.submittedCount,
      submittedBatches: result.submittedBatches,
      failedBatches: result.failedBatches,
      invalidUrls: result.invalidUrls,
    })
  } catch (error) {
    sendJson(res, 400, {
      error: error instanceof Error ? error.message : 'Failed to submit blog URLs',
    })
  }
}
