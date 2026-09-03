// Lightweight per-IP in-memory sliding-window rate limiter for API handlers.
// NOTE: On serverless platforms a cold/warm function instance holds its own
// memory, so this is defense-in-depth per instance — it still throttles bot
// floods coming from a single IP on the warm path. For stricter guarantees,
// combine with edge/middleware rules or a shared store (e.g. Upstash/Vercel KV).

const WINDOW_MS = 60 * 1000 // 60s
const HIGH = 30 // burst ceiling per window for admin-only endpoints
const LOW = 180 // general ceiling per window for regular endpoints

const buckets = new Map()

function now() {
  return Date.now()
}

export function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string') {
    const first = xff.split(',')[0].trim()
    if (first) return first
  }
  if (req.headers['x-real-ip']) return req.headers['x-real-ip']
  return 'unknown'
}

function prune(nowMs) {
  if (buckets.size < 5000) return
  for (const [key, entry] of buckets) {
    if (nowMs - entry.resetAt > WINDOW_MS) buckets.delete(key)
  }
}

/**
 * Returns true when the request is within budget and should be allowed.
 * Returns false (with a 429 JSON body written by the caller) when blocked.
 */
export function rateLimit(key, limit) {
  const nowMs = now()
  prune(nowMs)

  const entry = buckets.get(key)
  if (!entry || nowMs >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: nowMs + WINDOW_MS })
    return { ok: true }
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - nowMs) / 1000)),
    }
  }

  entry.count += 1
  return { ok: true }
}

export function rateLimitClientIp(req, { keyPrefix, limit } = {}) {
  const ip = getClientIp(req)
  return rateLimit(`${keyPrefix || 'rl'}:${ip}`, limit ?? HIGH)
}