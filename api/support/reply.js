import {
  buildReplyEmail,
  createSupportAdminClient,
  isSupportReplyConfigured,
  isValidEmail,
  loadSupportReplyConfig,
  logSupportReply,
  readSupportMessageById,
  sendSupportReplyEmail,
} from '../_lib/support-reply.js'
import {
  getHeader,
  parseJsonBody,
  sendJson,
  sendMethodNotAllowed,
} from '../_lib/http.js'

const MAX_MESSAGE_ID_LENGTH = 128
const MAX_REPLY_LENGTH = 10_000

function readProvidedAdminToken(req) {
  const directHeaders = ['x-support-admin-token', 'x-admin-token', 'x-indexnow-token']
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

function readStringField(value, fallback = '') {
  if (typeof value !== 'string') return fallback
  return value.trim()
}

function parseBody(body) {
  const messageId =
    readStringField(body?.messageId) ||
    readStringField(body?.supportMessageId) ||
    readStringField(body?.id)

  const reply =
    readStringField(body?.reply) ||
    readStringField(body?.message) ||
    readStringField(body?.replyMessage)

  const subject = readStringField(body?.subject)
  const sentBy = readStringField(body?.sentBy) || null

  return { messageId, reply, subject, sentBy }
}

function validateRequestBody(payload) {
  if (!payload.messageId) {
    return 'messageId is required'
  }

  if (payload.messageId.length > MAX_MESSAGE_ID_LENGTH) {
    return `messageId is too long (max ${MAX_MESSAGE_ID_LENGTH} chars)`
  }

  if (!payload.reply) {
    return 'reply is required'
  }

  if (payload.reply.length > MAX_REPLY_LENGTH) {
    return `reply is too long (max ${MAX_REPLY_LENGTH} chars)`
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendMethodNotAllowed(res, ['POST'])
    return
  }

  res.setHeader('cache-control', 'no-store')

  const config = loadSupportReplyConfig()

  if (!isSupportReplyConfigured(config)) {
    sendJson(res, 500, {
      error:
        'Support reply backend is not configured. Set SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, SUPPORT_EMAIL_FROM, and table names.',
    })
    return
  }

  if (!config.adminToken) {
    sendJson(res, 500, {
      error:
        'SUPPORT_REPLY_ADMIN_TOKEN is not configured on the server (fallback: AUTH_TOGGLE_ADMIN_TOKEN or INDEXNOW_ADMIN_TOKEN).',
    })
    return
  }

  const providedToken = readProvidedAdminToken(req)
  if (!providedToken || providedToken !== config.adminToken) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Request body must be valid JSON' })
    return
  }

  const requestPayload = parseBody(body)
  const validationError = validateRequestBody(requestPayload)
  if (validationError) {
    sendJson(res, 400, { error: validationError })
    return
  }

  let client
  try {
    client = createSupportAdminClient(config)
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to initialize support reply backend',
    })
    return
  }

  let supportMessage
  try {
    supportMessage = await readSupportMessageById(
      client,
      config,
      requestPayload.messageId
    )
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to read support message before reply',
    })
    return
  }

  if (!supportMessage) {
    sendJson(res, 404, { error: 'Support message not found' })
    return
  }

  if (!isValidEmail(supportMessage.email)) {
    sendJson(res, 400, {
      error: 'Support message does not have a valid recipient email',
    })
    return
  }

  const emailPayload = buildReplyEmail({
    config,
    recipientName: supportMessage.name,
    originalSubject: supportMessage.subject,
    providedSubject: requestPayload.subject,
    replyMessage: requestPayload.reply,
  })

  let emailResult
  try {
    emailResult = await sendSupportReplyEmail(config, {
      toEmail: supportMessage.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
    })
  } catch (error) {
    sendJson(res, 502, {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send support reply email',
    })
    return
  }

  try {
    const logged = await logSupportReply(client, config, {
      messageId: supportMessage.id,
      recipientEmail: supportMessage.email,
      emailSubject: emailPayload.subject,
      replyMessage: requestPayload.reply,
      sentBy: requestPayload.sentBy,
      provider: emailResult.provider,
      providerMessageId: emailResult.providerMessageId,
    })

    sendJson(res, 200, {
      sent: true,
      logged: true,
      supportMessageId: supportMessage.id,
      replyId: logged?.id || null,
      recipientEmail: supportMessage.email,
      provider: emailResult.provider,
      providerMessageId: emailResult.providerMessageId,
      subject: emailPayload.subject,
      createdAt: logged?.created_at || null,
    })
  } catch (error) {
    sendJson(res, 200, {
      sent: true,
      logged: false,
      warning:
        error instanceof Error
          ? error.message
          : 'Email sent, but reply log could not be saved',
      supportMessageId: supportMessage.id,
      recipientEmail: supportMessage.email,
      provider: emailResult.provider,
      providerMessageId: emailResult.providerMessageId,
      subject: emailPayload.subject,
    })
  }
}
