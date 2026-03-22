/* eslint-env node */
/* global process */

import { createClient } from '@supabase/supabase-js'

const DEFAULT_TABLE_NAME = 'site_settings'
const DEFAULT_SETTING_KEY = 'support_reply_enabled'

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])
const FALSE_VALUES = new Set(['0', 'false', 'no', 'off'])

function normalizeSupabaseError(error, fallbackMessage) {
  if (!error) return fallbackMessage
  if (error instanceof Error && error.message) return error.message
  if (typeof error?.message === 'string' && error.message) return error.message
  return fallbackMessage
}

function parseBoolean(rawValue, fallbackValue) {
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

function normalizeSupportReplyEnabled(rawValue, fallbackValue = true) {
  return parseBoolean(rawValue, fallbackValue)
}

export function loadSupportReplyGateConfig() {
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
    process.env.SUPPORT_REPLY_TOGGLE_ADMIN_TOKEN ||
    process.env.SUPPORT_REPLY_ADMIN_TOKEN ||
    process.env.AUTH_TOGGLE_ADMIN_TOKEN ||
    process.env.INDEXNOW_ADMIN_TOKEN ||
    ''
  ).trim()
  const tableName = (
    process.env.SUPPORT_REPLY_TOGGLE_TABLE ||
    DEFAULT_TABLE_NAME
  ).trim()
  const settingKey = (
    process.env.SUPPORT_REPLY_TOGGLE_KEY ||
    DEFAULT_SETTING_KEY
  ).trim()
  const defaultEnabled = normalizeSupportReplyEnabled(
    process.env.SUPPORT_REPLY_DEFAULT_ENABLED,
    true
  )

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    adminToken,
    tableName,
    settingKey,
    defaultEnabled,
  }
}

export function isSupportReplyGateConfigured(config) {
  return Boolean(
    config?.supabaseUrl &&
    config?.supabaseServiceRoleKey &&
    config?.tableName &&
    config?.settingKey
  )
}

function createSupabaseAdminClient(config) {
  if (!isSupportReplyGateConfigured(config)) {
    throw new Error(
      'Support reply gate is not configured. Missing SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPPORT_REPLY_TOGGLE_TABLE, or SUPPORT_REPLY_TOGGLE_KEY.'
    )
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function readSupportReplyGateState(config) {
  const client = createSupabaseAdminClient(config)

  const { data, error } = await client
    .from(config.tableName)
    .select('value,updated_at')
    .eq('key', config.settingKey)
    .maybeSingle()

  if (error) {
    throw new Error(
      normalizeSupabaseError(
        error,
        'Failed to read support reply gate configuration'
      )
    )
  }

  return {
    supportReplyEnabled: normalizeSupportReplyEnabled(
      data?.value,
      config.defaultEnabled
    ),
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : null,
    persisted: Boolean(data),
  }
}

export async function writeSupportReplyGateState(config, enabled) {
  const client = createSupabaseAdminClient(config)
  const normalizedEnabled = normalizeSupportReplyEnabled(enabled, true)
  const now = new Date().toISOString()

  const { data, error } = await client
    .from(config.tableName)
    .upsert(
      {
        key: config.settingKey,
        value: normalizedEnabled,
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
      normalizeSupabaseError(
        error,
        'Failed to update support reply gate configuration'
      )
    )
  }

  return {
    supportReplyEnabled: normalizeSupportReplyEnabled(
      data?.value,
      normalizedEnabled
    ),
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : now,
  }
}
