/* eslint-env node */
/* global process */

import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPPORT_MESSAGES_TABLE = 'support_messages'
const DEFAULT_SUPPORT_REPLIES_TABLE = 'support_replies'
const DEFAULT_SUBJECT_PREFIX = 'StudyMate Support'
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const EMAIL_TIMEOUT_MS = 15_000
const FAILURE_SNIPPET_LIMIT = 300
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeError(error, fallbackMessage) {
  if (!error) return fallbackMessage
  if (error instanceof Error && error.message) return error.message
  if (typeof error?.message === 'string' && error.message) return error.message
  return fallbackMessage
}

function trimToNull(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function truncateSnippet(value, maxLength = FAILURE_SNIPPET_LIMIT) {
  if (typeof value !== 'string') return ''
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

function withTimeoutSignal(timeoutMs) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toHtmlParagraphs(text) {
  const escaped = escapeHtml(text).replace(/\r\n/g, '\n')
  return escaped
    .split('\n\n')
    .map((block) => `<p>${block.replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

export function isValidEmail(value) {
  if (typeof value !== 'string') return false
  return EMAIL_REGEX.test(value.trim())
}

export function loadSupportReplyConfig() {
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
    process.env.SUPPORT_REPLY_ADMIN_TOKEN ||
    process.env.SUPPORT_REPLY_TOGGLE_ADMIN_TOKEN ||
    process.env.AUTH_TOGGLE_ADMIN_TOKEN ||
    process.env.INDEXNOW_ADMIN_TOKEN ||
    ''
  ).trim()
  const supportMessagesTable = (
    process.env.SUPPORT_MESSAGES_TABLE ||
    DEFAULT_SUPPORT_MESSAGES_TABLE
  ).trim()
  const supportRepliesTable = (
    process.env.SUPPORT_REPLIES_TABLE ||
    DEFAULT_SUPPORT_REPLIES_TABLE
  ).trim()
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim()
  const emailFrom = (process.env.SUPPORT_EMAIL_FROM || '').trim()
  const emailReplyTo = trimToNull(process.env.SUPPORT_EMAIL_REPLY_TO || '')
  const subjectPrefix = (
    process.env.SUPPORT_EMAIL_SUBJECT_PREFIX ||
    DEFAULT_SUBJECT_PREFIX
  ).trim()

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    adminToken,
    supportMessagesTable,
    supportRepliesTable,
    resendApiKey,
    emailFrom,
    emailReplyTo,
    subjectPrefix: subjectPrefix || DEFAULT_SUBJECT_PREFIX,
  }
}

export function isSupportReplyConfigured(config) {
  return Boolean(
    config?.supabaseUrl &&
    config?.supabaseServiceRoleKey &&
    config?.supportMessagesTable &&
    config?.supportRepliesTable &&
    config?.resendApiKey &&
    config?.emailFrom
  )
}

export function createSupportAdminClient(config) {
  if (!isSupportReplyConfigured(config)) {
    throw new Error(
      'Support reply backend is not configured. Missing Supabase service credentials, table names, RESEND_API_KEY, or SUPPORT_EMAIL_FROM.'
    )
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function readSupportMessageById(client, config, messageId) {
  const { data, error } = await client
    .from(config.supportMessagesTable)
    .select('id,name,email,subject,message,created_at')
    .eq('id', messageId)
    .maybeSingle()

  if (error) {
    throw new Error(
      normalizeError(error, 'Failed to read support message before sending reply')
    )
  }

  return data || null
}

function normalizeReplySubject(subjectPrefix, originalSubject, providedSubject) {
  const explicitSubject = trimToNull(providedSubject)
  if (explicitSubject) return explicitSubject.slice(0, 180)

  const baseSubject = trimToNull(originalSubject) || 'your support request'
  const normalized = `${subjectPrefix}: Re: ${baseSubject}`
  return normalized.slice(0, 180)
}

export function buildReplyEmail({
  config,
  recipientName,
  originalSubject,
  providedSubject,
  replyMessage,
}) {
  const safeRecipientName = trimToNull(recipientName) || 'there'
  const normalizedReply = String(replyMessage || '').trim()
  const subject = normalizeReplySubject(
    config.subjectPrefix,
    originalSubject,
    providedSubject
  )
  const text = `Hi ${safeRecipientName},\n\n${normalizedReply}\n\nBest regards,\nSupport Team`
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <p>Hi ${escapeHtml(safeRecipientName)},</p>
      ${toHtmlParagraphs(normalizedReply)}
      <p>Best regards,<br />Support Team</p>
    </div>
  `.trim()

  return { subject, text, html }
}

export async function sendSupportReplyEmail(config, { toEmail, subject, text, html }) {
  const payload = {
    from: config.emailFrom,
    to: [toEmail],
    subject,
    text,
    html,
  }

  if (config.emailReplyTo) {
    payload.reply_to = config.emailReplyTo
  }

  const timeout = withTimeoutSignal(EMAIL_TIMEOUT_MS)

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${config.resendApiKey}`,
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
      signal: timeout.signal,
    })

    const rawBody = await response.text()
    let parsedBody = {}
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      parsedBody = {}
    }

    if (!response.ok) {
      const message = truncateSnippet(
        parsedBody?.message || parsedBody?.error || rawBody || response.statusText
      )
      throw new Error(`Failed to send reply email (${response.status}): ${message}`)
    }

    return {
      provider: 'resend',
      providerMessageId:
        typeof parsedBody?.id === 'string' && parsedBody.id ? parsedBody.id : null,
    }
  } catch (error) {
    throw new Error(
      normalizeError(error, 'Failed to send support reply email via Resend')
    )
  } finally {
    timeout.clear()
  }
}

export async function logSupportReply(
  client,
  config,
  {
    messageId,
    recipientEmail,
    emailSubject,
    replyMessage,
    sentBy = null,
    provider = 'resend',
    providerMessageId = null,
  }
) {
  const { data, error } = await client
    .from(config.supportRepliesTable)
    .insert([
      {
        message_id: messageId,
        recipient_email: recipientEmail,
        email_subject: emailSubject,
        reply_message: replyMessage,
        sent_by: sentBy,
        provider,
        provider_message_id: providerMessageId,
      },
    ])
    .select('id,created_at')
    .single()

  if (error) {
    throw new Error(
      normalizeError(error, 'Email sent, but failed to save support reply log')
    )
  }

  return data
}
