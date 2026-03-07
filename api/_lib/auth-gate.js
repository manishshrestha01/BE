/* eslint-env node */
/* global process */

import { createClient } from '@supabase/supabase-js'

const DEFAULT_TABLE_NAME = 'site_settings'
const DEFAULT_SETTING_KEY = 'require_login'

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

function normalizeRequireLogin(rawValue, fallbackValue = true) {
  return parseBoolean(rawValue, fallbackValue)
}

export function loadAuthGateConfig() {
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
    process.env.AUTH_TOGGLE_ADMIN_TOKEN ||
    process.env.INDEXNOW_ADMIN_TOKEN ||
    ''
  ).trim()
  const tableName = (process.env.AUTH_TOGGLE_TABLE || DEFAULT_TABLE_NAME).trim()
  const settingKey = (process.env.AUTH_TOGGLE_KEY || DEFAULT_SETTING_KEY).trim()
  const defaultRequireLogin = normalizeRequireLogin(
    process.env.AUTH_TOGGLE_DEFAULT_REQUIRE_LOGIN,
    true
  )

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    adminToken,
    tableName,
    settingKey,
    defaultRequireLogin,
  }
}

export function isAuthGateConfigured(config) {
  return Boolean(
    config?.supabaseUrl &&
    config?.supabaseServiceRoleKey &&
    config?.tableName &&
    config?.settingKey
  )
}

function createSupabaseAdminClient(config) {
  if (!isAuthGateConfigured(config)) {
    throw new Error(
      'Auth gate is not configured. Missing SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AUTH_TOGGLE_TABLE, or AUTH_TOGGLE_KEY.'
    )
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function readAuthGateState(config) {
  const client = createSupabaseAdminClient(config)

  const { data, error } = await client
    .from(config.tableName)
    .select('value,updated_at')
    .eq('key', config.settingKey)
    .maybeSingle()

  if (error) {
    throw new Error(
      normalizeSupabaseError(error, 'Failed to read auth gate configuration')
    )
  }

  return {
    requireLogin: normalizeRequireLogin(data?.value, config.defaultRequireLogin),
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : null,
    persisted: Boolean(data),
  }
}

export async function writeAuthGateState(config, requireLogin) {
  const client = createSupabaseAdminClient(config)
  const normalizedRequireLogin = normalizeRequireLogin(requireLogin, true)
  const now = new Date().toISOString()

  const { data, error } = await client
    .from(config.tableName)
    .upsert(
      {
        key: config.settingKey,
        value: normalizedRequireLogin,
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
      normalizeSupabaseError(error, 'Failed to update auth gate configuration')
    )
  }

  return {
    requireLogin: normalizeRequireLogin(data?.value, normalizedRequireLogin),
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : now,
  }
}

