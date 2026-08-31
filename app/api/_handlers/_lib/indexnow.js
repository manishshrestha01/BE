/* eslint-env node */
/* global process */

const DEFAULT_INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLS_PER_BATCH = 1000
const MAX_TOTAL_SITEMAP_URLS = 200_000
const MAX_TOTAL_SITEMAPS = 10_000
const RETRY_COUNT = 2
const RETRY_BASE_DELAY_MS = 500
const FETCH_TIMEOUT_MS = 15_000
const FAILURE_SNIPPET_LIMIT = 300

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function withTimeoutSignal(timeoutMs) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  }
}

function truncateSnippet(value, maxLength = FAILURE_SNIPPET_LIMIT) {
  if (typeof value !== 'string') return ''
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

function removeTrailingSlash(value) {
  return value.replace(/\/+$/, '')
}

function parseHttpsUrl(value, fieldName) {
  if (!value || typeof value !== 'string') {
    throw new Error(`${fieldName} is required`)
  }

  let parsed
  try {
    parsed = new URL(value.trim())
  } catch {
    throw new Error(`${fieldName} must be a valid URL`)
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`${fieldName} must use https`)
  }

  parsed.hash = ''
  return parsed
}

export function loadIndexNowConfig() {
  const siteUrl = removeTrailingSlash(parseHttpsUrl(process.env.SITE_URL, 'SITE_URL').toString())
  const siteHost = new URL(siteUrl).host
  const key = (process.env.INDEXNOW_KEY || '').trim()
  const adminToken = (process.env.INDEXNOW_ADMIN_TOKEN || '').trim()

  if (!key) {
    throw new Error('INDEXNOW_KEY is required')
  }

  const keyLocationRaw = (process.env.INDEXNOW_KEY_LOCATION || `${siteUrl}/${key}.txt`).trim()
  const keyLocation = parseHttpsUrl(keyLocationRaw, 'INDEXNOW_KEY_LOCATION').toString()

  const endpoint = (
    process.env.INDEXNOW_ENDPOINT || DEFAULT_INDEXNOW_ENDPOINT
  ).trim()
  parseHttpsUrl(endpoint, 'INDEXNOW_ENDPOINT')

  const sitemapUrl = (process.env.SITEMAP_URL || `${siteUrl}/sitemap.xml`).trim()
  parseHttpsUrl(sitemapUrl, 'SITEMAP_URL')

  return {
    siteUrl,
    siteHost,
    key,
    keyLocation,
    adminToken,
    endpoint,
    sitemapUrl,
  }
}

function isValidIndexNowMode(mode) {
  return mode === 'created' || mode === 'updated' || mode === 'deleted'
}

function splitIntoChunks(items, chunkSize) {
  const chunks = []
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }
  return chunks
}

function normalizeCandidateUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return null
  }
}

function startsWithSiteUrl(url, siteUrl) {
  return (
    url === siteUrl ||
    url.startsWith(`${siteUrl}/`) ||
    url.startsWith(`${siteUrl}?`)
  )
}

export function validateAndNormalizeUrls(urls, siteUrl) {
  const unique = new Set()
  const validUrls = []
  const invalidUrls = []

  for (const rawUrl of urls) {
    const normalized = normalizeCandidateUrl(rawUrl)
    if (!normalized) {
      invalidUrls.push(String(rawUrl ?? ''))
      continue
    }

    const parsed = new URL(normalized)
    if (parsed.protocol !== 'https:' || !startsWithSiteUrl(normalized, siteUrl)) {
      invalidUrls.push(normalized)
      continue
    }

    if (!unique.has(normalized)) {
      unique.add(normalized)
      validUrls.push(normalized)
    }
  }

  return { validUrls, invalidUrls }
}

async function postIndexNowBatch({ config, urls, batchIndex, mode }) {
  const payload = {
    host: config.siteHost,
    key: config.key,
    keyLocation: config.keyLocation,
    urlList: urls,
  }

  for (let attempt = 0; attempt <= RETRY_COUNT; attempt += 1) {
    const timeout = withTimeoutSignal(FETCH_TIMEOUT_MS)

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
        signal: timeout.signal,
      })

      if (response.ok) {
        return {
          ok: true,
          status: response.status,
        }
      }

      const responseBody = truncateSnippet(await response.text())
      const shouldRetry = response.status >= 500 && response.status < 600 && attempt < RETRY_COUNT

      if (shouldRetry) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt)
        continue
      }

      console.error('[IndexNow] Batch submission failed', {
        mode,
        batchIndex,
        status: response.status,
        body: responseBody,
      })

      return {
        ok: false,
        status: response.status,
        errorSnippet: responseBody || 'IndexNow request failed',
      }
    } catch (error) {
      const errorSnippet = truncateSnippet(
        error instanceof Error ? error.message : String(error)
      )
      const shouldRetry = attempt < RETRY_COUNT

      if (shouldRetry) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt)
        continue
      }

      console.error('[IndexNow] Batch submission network failure', {
        mode,
        batchIndex,
        error: errorSnippet,
      })

      return {
        ok: false,
        status: 'NETWORK_ERROR',
        errorSnippet: errorSnippet || 'Network error while submitting to IndexNow',
      }
    } finally {
      timeout.clear()
    }
  }

  return {
    ok: false,
    status: 'UNKNOWN_ERROR',
    errorSnippet: 'Unknown IndexNow submission error',
  }
}

export async function submitIndexNow(urls, mode = 'updated') {
  if (!Array.isArray(urls)) {
    throw new Error('submitIndexNow expects urls to be an array')
  }

  if (!isValidIndexNowMode(mode)) {
    throw new Error('mode must be one of: created, updated, deleted')
  }

  const config = loadIndexNowConfig()
  const { validUrls, invalidUrls } = validateAndNormalizeUrls(urls, config.siteUrl)
  const batches = splitIntoChunks(validUrls, MAX_URLS_PER_BATCH)

  let submittedCount = 0
  let submittedBatches = 0
  const failedBatches = []

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batchUrls = batches[batchIndex]
    const result = await postIndexNowBatch({
      config,
      urls: batchUrls,
      batchIndex,
      mode,
    })

    if (result.ok) {
      submittedBatches += 1
      submittedCount += batchUrls.length
      continue
    }

    failedBatches.push({
      batchIndex,
      status: result.status,
      errorSnippet: result.errorSnippet,
    })
  }

  return {
    mode,
    totalUrls: urls.length,
    validUrls: validUrls.length,
    invalidUrls: invalidUrls.length,
    submittedCount,
    submittedBatches,
    failedBatches,
  }
}

function decodeXmlEntities(value) {
  if (!value) return ''

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

function extractLocValues(xmlText) {
  const locRegex = /<loc\b[^>]*>([\s\S]*?)<\/loc>/gi
  const locValues = []

  let match = locRegex.exec(xmlText)
  while (match) {
    const decoded = decodeXmlEntities(match[1]).trim()
    if (decoded) {
      locValues.push(decoded)
    }
    match = locRegex.exec(xmlText)
  }

  return locValues
}

function classifySitemapXml(xmlText, locValues) {
  if (/<sitemapindex[\s>]/i.test(xmlText) || /<sitemap[\s>]/i.test(xmlText)) {
    return 'sitemapindex'
  }

  if (/<urlset[\s>]/i.test(xmlText) || /<url[\s>]/i.test(xmlText)) {
    return 'urlset'
  }

  if (locValues.length > 0 && locValues.every((loc) => /\.xml(?:$|[?#])/i.test(loc))) {
    return 'sitemapindex'
  }

  return 'urlset'
}

function toAbsoluteUrl(rawUrl, baseUrl) {
  try {
    const parsed = new URL(rawUrl.trim(), baseUrl)
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return null
  }
}

async function fetchText(url) {
  const timeout = withTimeoutSignal(FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/xml,text/xml,text/plain,*/*',
      },
      signal: timeout.signal,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap (${response.status}) from ${url}`)
    }

    return response.text()
  } finally {
    timeout.clear()
  }
}

export async function fetchSitemapUrls() {
  const { sitemapUrl } = loadIndexNowConfig()
  const sitemapQueue = [sitemapUrl]
  const visitedSitemaps = new Set()
  const discoveredUrls = new Set()

  while (sitemapQueue.length > 0) {
    const currentSitemapUrl = sitemapQueue.shift()
    if (!currentSitemapUrl || visitedSitemaps.has(currentSitemapUrl)) {
      continue
    }

    visitedSitemaps.add(currentSitemapUrl)
    if (visitedSitemaps.size > MAX_TOTAL_SITEMAPS) {
      throw new Error(`Sitemap recursion limit exceeded (${MAX_TOTAL_SITEMAPS} files)`)
    }

    const xmlText = await fetchText(currentSitemapUrl)
    const locValues = extractLocValues(xmlText)
    const sitemapType = classifySitemapXml(xmlText, locValues)

    if (sitemapType === 'sitemapindex') {
      for (const locValue of locValues) {
        const nestedSitemapUrl = toAbsoluteUrl(locValue, currentSitemapUrl)
        if (!nestedSitemapUrl || visitedSitemaps.has(nestedSitemapUrl)) {
          continue
        }
        sitemapQueue.push(nestedSitemapUrl)
      }
      continue
    }

    for (const locValue of locValues) {
      const absoluteUrl = toAbsoluteUrl(locValue, currentSitemapUrl)
      if (!absoluteUrl) continue

      discoveredUrls.add(absoluteUrl)
      if (discoveredUrls.size > MAX_TOTAL_SITEMAP_URLS) {
        throw new Error(`Sitemap URL hard limit exceeded (${MAX_TOTAL_SITEMAP_URLS})`)
      }
    }
  }

  return Array.from(discoveredUrls)
}
