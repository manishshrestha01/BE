/* eslint-env node */
/* global process */

import { createClient } from '@supabase/supabase-js'
import { getHeader, sendJson } from './http.js'

const DEFAULT_TABLE_NAME = 'site_settings'
const DEFAULT_ADS_BUCKET = 'support-attachments'
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])
const FALSE_VALUES = new Set(['0', 'false', 'no', 'off'])
const ABSOLUTE_HTTP_PATTERN = /^https?:\/\//i
const REQUIRED_SITE_AD_WIDTH = 1080
const ALLOWED_SITE_AD_HEIGHTS = new Set([1080, 1350])

function normalizeSupabaseError(error, fallbackMessage) {
  if (!error) return fallbackMessage
  if (error instanceof Error && error.message) return error.message
  if (typeof error?.message === 'string' && error.message) return error.message
  return fallbackMessage
}

function parseBoolean(rawValue, fallbackValue = false) {
  if (typeof rawValue === 'boolean') return rawValue
  if (typeof rawValue === 'number') return rawValue !== 0

  if (typeof rawValue === 'string') {
    const normalized = rawValue.trim().toLowerCase()
    if (TRUE_VALUES.has(normalized)) return true
    if (FALSE_VALUES.has(normalized)) return false
  }

  if (
    rawValue &&
    typeof rawValue === 'object' &&
    !Array.isArray(rawValue) &&
    Object.prototype.hasOwnProperty.call(rawValue, 'enabled')
  ) {
    return parseBoolean(rawValue.enabled, fallbackValue)
  }

  return fallbackValue
}

function normalizeText(rawValue, maxLength = 200) {
  if (typeof rawValue !== 'string') return ''
  return rawValue.trim().slice(0, maxLength)
}

function normalizeRelativeOrAbsoluteUrl(rawValue) {
  if (typeof rawValue !== 'string') return ''

  const trimmed = rawValue.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/')) return trimmed
  if (!ABSOLUTE_HTTP_PATTERN.test(trimmed)) return ''

  try {
    const normalizedUrl = new URL(trimmed)
    return normalizedUrl.toString()
  } catch {
    return ''
  }
}

function normalizeAbsoluteUrl(rawValue) {
  const normalized = normalizeRelativeOrAbsoluteUrl(rawValue)
  return normalized.startsWith('/') ? '' : normalized
}

function normalizeHexColor(rawValue) {
  if (typeof rawValue !== 'string') return ''

  const trimmed = rawValue.trim()
  if (!HEX_COLOR_PATTERN.test(trimmed)) return ''

  if (trimmed.length === 4) {
    const [hash, r, g, b] = trimmed
    return `${hash}${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  return trimmed.toLowerCase()
}

export function normalizeFolderColors(rawValue) {
  if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
    return {}
  }

  const entries = Object.entries(rawValue)
    .map(([path, color]) => [normalizeText(path, 300), normalizeHexColor(color)])
    .filter(([path, color]) => path && color)
    .slice(0, 300)

  return Object.fromEntries(entries)
}

export function normalizeSiteAd(rawValue) {
  const value = rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
    ? rawValue
    : {}

  const imageUrl = normalizeAbsoluteUrl(value.imageUrl)
  const targetUrl = normalizeRelativeOrAbsoluteUrl(value.targetUrl)
  const rawImageWidth = Number.isFinite(value.imageWidth) ? Number(value.imageWidth) : null
  const rawImageHeight = Number.isFinite(value.imageHeight) ? Number(value.imageHeight) : null
  const hasAllowedDimensions = (
    rawImageWidth === REQUIRED_SITE_AD_WIDTH &&
    ALLOWED_SITE_AD_HEIGHTS.has(rawImageHeight)
  )
  const imageWidth = hasAllowedDimensions ? rawImageWidth : null
  const imageHeight = hasAllowedDimensions ? rawImageHeight : null
  const enabled = parseBoolean(value.enabled, false) && Boolean(imageUrl && targetUrl && imageWidth && imageHeight)

  return {
    enabled,
    imageUrl,
    imagePath: normalizeText(value.imagePath, 500),
    targetUrl,
    altText: normalizeText(value.altText, 160),
    imageWidth,
    imageHeight,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
  }
}

export function loadSiteSettingsConfig() {
  const supabaseUrl = (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ''
  ).trim()
  const supabaseServiceRoleKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim()
  const adminToken = (
    process.env.SITE_SETTINGS_ADMIN_TOKEN ||
    process.env.AUTH_TOGGLE_ADMIN_TOKEN ||
    process.env.INDEXNOW_ADMIN_TOKEN ||
    ''
  ).trim()
  const tableName = (process.env.SITE_SETTINGS_TABLE || DEFAULT_TABLE_NAME).trim()
  const adsBucket = (
    process.env.SITE_ADS_BUCKET ||
    process.env.VITE_SUPPORT_BUCKET ||
    DEFAULT_ADS_BUCKET
  ).trim()

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    adminToken,
    tableName,
    adsBucket,
  }
}

export function isSiteSettingsConfigured(config) {
  return Boolean(
    config?.supabaseUrl &&
    config?.supabaseServiceRoleKey &&
    config?.tableName
  )
}

function createSupabaseAdminClient(config) {
  if (!isSiteSettingsConfigured(config)) {
    throw new Error(
      'Site settings backend is not configured. Missing SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SITE_SETTINGS_TABLE.'
    )
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function readSiteSetting(config, settingKey, fallbackValue) {
  const client = createSupabaseAdminClient(config)
  const { data, error } = await client
    .from(config.tableName)
    .select('value,updated_at')
    .eq('key', settingKey)
    .maybeSingle()

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, `Failed to read site setting "${settingKey}"`)
    )
  }

  return {
    value: data?.value ?? fallbackValue,
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : null,
    persisted: Boolean(data),
  }
}

export async function writeSiteSetting(config, settingKey, value) {
  const client = createSupabaseAdminClient(config)
  const now = new Date().toISOString()

  const { data, error } = await client
    .from(config.tableName)
    .upsert(
      {
        key: settingKey,
        value,
        updated_at: now,
      },
      {
        onConflict: 'key',
      }
    )
    .select('value,updated_at')
    .single()

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, `Failed to write site setting "${settingKey}"`)
    )
  }

  return {
    value: data?.value ?? value,
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : now,
  }
}

function readProvidedAdminToken(req) {
  const directHeaders = ['x-site-settings-token', 'x-admin-token', 'x-indexnow-token']

  for (const headerName of directHeaders) {
    const value = getHeader(req, headerName)
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  const authorization = getHeader(req, 'authorization')
  if (typeof authorization !== 'string') return ''

  const bearerPrefix = 'bearer '
  if (authorization.toLowerCase().startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim()
  }

  return authorization.trim()
}

export function requireSiteSettingsAdminToken(req, res, config) {
  if (!config?.adminToken) {
    sendJson(res, 500, {
      error:
        'SITE_SETTINGS_ADMIN_TOKEN (or AUTH_TOGGLE_ADMIN_TOKEN / INDEXNOW_ADMIN_TOKEN fallback) is not configured on the server',
    })
    return false
  }

  const providedToken = readProvidedAdminToken(req)
  if (!providedToken || providedToken !== config.adminToken) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return false
  }

  return true
}

function sanitizeFileName(rawValue) {
  const normalized = normalizeText(rawValue, 180)
  if (!normalized) return 'ad-image.png'
  return normalized.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function createSignedAdUpload(config, { fileName = '', contentType = '' } = {}) {
  const client = createSupabaseAdminClient(config)
  const normalizedContentType = normalizeText(contentType, 120)

  if (!normalizedContentType.startsWith('image/')) {
    throw new Error('Ad uploads must be image files.')
  }

  const safeFileName = sanitizeFileName(fileName)
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).slice(2, 10)
  const storagePath = `site-ads/${timestamp}-${randomSuffix}-${safeFileName}`

  const { data, error } = await client
    .storage
    .from(config.adsBucket)
    .createSignedUploadUrl(storagePath)

  if (error) {
    throw new Error(normalizeSupabaseError(error, 'Failed to create ad upload URL'))
  }

  const { data: publicUrlData } = client
    .storage
    .from(config.adsBucket)
    .getPublicUrl(storagePath)

  return {
    bucket: config.adsBucket,
    path: data?.path || storagePath,
    token: data?.token || '',
    publicUrl: publicUrlData?.publicUrl || '',
  }
}
