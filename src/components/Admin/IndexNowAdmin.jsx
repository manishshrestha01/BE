import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './IndexNowAdmin.css'

const TOKEN_STORAGE_KEY = 'studymate:indexnow:admin-token'

const readInitialToken = () => {
  if (typeof window === 'undefined') return ''

  const runtimeToken = window.__INDEXNOW_ADMIN_TOKEN__
  if (typeof runtimeToken === 'string' && runtimeToken.trim()) {
    return runtimeToken.trim()
  }

  const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
  return storedToken?.trim() || ''
}

const parseCustomUrls = (rawValue) =>
  Array.from(
    new Set(
      rawValue
        .split(/[\n,\s]+/)
        .map((value) => value.trim())
        .filter(Boolean)
    )
  )

const normalizeRequireLogin = (payload) => {
  if (typeof payload?.requireLogin === 'boolean') return payload.requireLogin
  if (typeof payload?.authEnabled === 'boolean') return payload.authEnabled
  if (typeof payload?.authRequired === 'boolean') return payload.authRequired
  return true
}

const normalizePdfDownloadEnabled = (payload) => {
  if (typeof payload?.pdfDownloadEnabled === 'boolean') return payload.pdfDownloadEnabled
  if (typeof payload?.downloadEnabled === 'boolean') return payload.downloadEnabled
  if (typeof payload?.enabled === 'boolean') return payload.enabled
  return true
}

const normalizeSupportReplyEnabled = (payload) => {
  if (typeof payload?.supportReplyEnabled === 'boolean') return payload.supportReplyEnabled
  if (typeof payload?.replyEnabled === 'boolean') return payload.replyEnabled
  if (typeof payload?.enabled === 'boolean') return payload.enabled
  return true
}

const formatUpdatedAt = (updatedAt) => {
  if (typeof updatedAt !== 'string' || !updatedAt) return ''

  const parsedDate = new Date(updatedAt)
  if (Number.isNaN(parsedDate.getTime())) return ''

  return parsedDate.toLocaleString()
}

const ResultPanel = ({ result, title }) => {
  if (!result) return null

  return (
    <section className="indexnow-result-card" aria-live="polite">
      <h3>{title}</h3>
      <p>
        <strong>Total valid URLs:</strong> {result.totalUrls}
      </p>
      <p>
        <strong>Submitted URLs:</strong> {result.submittedCount}
      </p>
      <p>
        <strong>Submitted batches:</strong> {result.submittedBatches}
      </p>
      <p>
        <strong>Failed batches:</strong> {result.failedBatches?.length || 0}
      </p>
      <p>
        <strong>Invalid URLs ignored:</strong> {result.invalidUrls || 0}
      </p>

      {Array.isArray(result.failedBatches) && result.failedBatches.length > 0 && (
        <div className="indexnow-failures">
          {result.failedBatches.map((batch) => (
            <div key={`${batch.batchIndex}-${batch.status}`} className="indexnow-failure-item">
              <p>
                Batch #{batch.batchIndex} | Status: {batch.status}
              </p>
              <p>{batch.errorSnippet}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const IndexNowAdmin = () => {
  const { refreshAuthGate } = useAuth()
  const [token, setToken] = useState(readInitialToken)
  const [submitAllLoading, setSubmitAllLoading] = useState(false)
  const [submitAllError, setSubmitAllError] = useState('')
  const [submitAllResult, setSubmitAllResult] = useState(null)

  const [customUrlsRaw, setCustomUrlsRaw] = useState('')
  const [customMode, setCustomMode] = useState('updated')
  const [customLoading, setCustomLoading] = useState(false)
  const [customError, setCustomError] = useState('')
  const [customResult, setCustomResult] = useState(null)
  const [authGateLoading, setAuthGateLoading] = useState(true)
  const [authGateUpdating, setAuthGateUpdating] = useState(false)
  const [authGateError, setAuthGateError] = useState('')
  const [authGateState, setAuthGateState] = useState({
    requireLogin: true,
    updatedAt: null,
    configured: false,
  })
  const [pdfGateLoading, setPdfGateLoading] = useState(true)
  const [pdfGateUpdating, setPdfGateUpdating] = useState(false)
  const [pdfGateError, setPdfGateError] = useState('')
  const [pdfGateState, setPdfGateState] = useState({
    enabled: true,
    updatedAt: null,
    configured: false,
  })
  const [supportReplyGateLoading, setSupportReplyGateLoading] = useState(true)
  const [supportReplyGateUpdating, setSupportReplyGateUpdating] = useState(false)
  const [supportReplyGateError, setSupportReplyGateError] = useState('')
  const [supportReplyGateState, setSupportReplyGateState] = useState({
    enabled: true,
    updatedAt: null,
    configured: false,
  })

  const customUrls = useMemo(() => parseCustomUrls(customUrlsRaw), [customUrlsRaw])

  const persistToken = (nextToken) => {
    setToken(nextToken)
    if (typeof window === 'undefined') return

    const normalized = nextToken.trim()
    if (!normalized) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      return
    }
    window.localStorage.setItem(TOKEN_STORAGE_KEY, normalized)
  }

  const callIndexNowApi = async (path, payload) => {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-indexnow-token': token.trim(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`)
    }
    return data
  }

  const loadAuthGateStatus = useCallback(async () => {
    setAuthGateError('')
    setAuthGateLoading(true)

    try {
      const response = await fetch('/api/auth-gate', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`)
      }

      setAuthGateState({
        requireLogin: normalizeRequireLogin(data),
        updatedAt: typeof data?.updatedAt === 'string' ? data.updatedAt : null,
        configured: Boolean(data?.configured),
      })
    } catch (error) {
      setAuthGateError(error instanceof Error ? error.message : 'Failed to load login toggle status')
      setAuthGateState((prev) => ({
        ...prev,
        configured: false,
      }))
    } finally {
      setAuthGateLoading(false)
    }
  }, [])

  const loadPdfGateStatus = useCallback(async () => {
    setPdfGateError('')
    setPdfGateLoading(true)

    try {
      const response = await fetch('/api/pdf-download-gate', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`)
      }

      setPdfGateState({
        enabled: normalizePdfDownloadEnabled(data),
        updatedAt: typeof data?.updatedAt === 'string' ? data.updatedAt : null,
        configured: Boolean(data?.configured),
      })
    } catch (error) {
      setPdfGateError(error instanceof Error ? error.message : 'Failed to load PDF download toggle status')
      setPdfGateState((prev) => ({
        ...prev,
        configured: false,
      }))
    } finally {
      setPdfGateLoading(false)
    }
  }, [])

  const loadSupportReplyGateStatus = useCallback(async () => {
    setSupportReplyGateError('')
    setSupportReplyGateLoading(true)

    try {
      const response = await fetch('/api/support-reply-gate', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`)
      }

      setSupportReplyGateState({
        enabled: normalizeSupportReplyEnabled(data),
        updatedAt: typeof data?.updatedAt === 'string' ? data.updatedAt : null,
        configured: Boolean(data?.configured),
      })
    } catch (error) {
      setSupportReplyGateError(error instanceof Error ? error.message : 'Failed to load support reply toggle status')
      setSupportReplyGateState((prev) => ({
        ...prev,
        configured: false,
      }))
    } finally {
      setSupportReplyGateLoading(false)
    }
  }, [])

  const callAuthGateApi = async (payload) => {
    const response = await fetch('/api/auth-gate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-auth-toggle-token': token.trim(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`)
    }
    return data
  }

  const callPdfGateApi = async (payload) => {
    const response = await fetch('/api/pdf-download-gate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-pdf-toggle-token': token.trim(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`)
    }
    return data
  }

  const callSupportReplyGateApi = async (payload) => {
    const response = await fetch('/api/support-reply-gate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-support-reply-toggle-token': token.trim(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`)
    }
    return data
  }

  useEffect(() => {
    loadAuthGateStatus()
    loadPdfGateStatus()
    loadSupportReplyGateStatus()
  }, [loadAuthGateStatus, loadPdfGateStatus, loadSupportReplyGateStatus])

  const handleToggleAuthGate = async () => {
    setAuthGateError('')

    if (!token.trim()) {
      setAuthGateError('Enter the admin token first.')
      return
    }

    setAuthGateUpdating(true)
    try {
      const result = await callAuthGateApi({ action: 'toggle' })
      setAuthGateState({
        requireLogin: normalizeRequireLogin(result),
        updatedAt: typeof result?.updatedAt === 'string' ? result.updatedAt : null,
        configured: true,
      })
      await refreshAuthGate()
    } catch (error) {
      setAuthGateError(error instanceof Error ? error.message : 'Failed to toggle login requirement')
    } finally {
      setAuthGateUpdating(false)
    }
  }

  const handleTogglePdfGate = async () => {
    setPdfGateError('')

    if (!token.trim()) {
      setPdfGateError('Enter the admin token first.')
      return
    }

    setPdfGateUpdating(true)
    try {
      const result = await callPdfGateApi({ action: 'toggle' })
      setPdfGateState({
        enabled: normalizePdfDownloadEnabled(result),
        updatedAt: typeof result?.updatedAt === 'string' ? result.updatedAt : null,
        configured: true,
      })
    } catch (error) {
      setPdfGateError(error instanceof Error ? error.message : 'Failed to toggle PDF download mode')
    } finally {
      setPdfGateUpdating(false)
    }
  }

  const handleToggleSupportReplyGate = async () => {
    setSupportReplyGateError('')

    if (!token.trim()) {
      setSupportReplyGateError('Enter the admin token first.')
      return
    }

    setSupportReplyGateUpdating(true)
    try {
      const result = await callSupportReplyGateApi({ action: 'toggle' })
      setSupportReplyGateState({
        enabled: normalizeSupportReplyEnabled(result),
        updatedAt: typeof result?.updatedAt === 'string' ? result.updatedAt : null,
        configured: true,
      })
    } catch (error) {
      setSupportReplyGateError(error instanceof Error ? error.message : 'Failed to toggle support reply mode')
    } finally {
      setSupportReplyGateUpdating(false)
    }
  }

  const handleSubmitAll = async () => {
    setSubmitAllError('')
    setSubmitAllResult(null)

    if (!token.trim()) {
      setSubmitAllError('Enter the IndexNow admin token first.')
      return
    }

    setSubmitAllLoading(true)
    try {
      const result = await callIndexNowApi('/api/indexnow/submit-all', {})
      setSubmitAllResult(result)
    } catch (error) {
      setSubmitAllError(error instanceof Error ? error.message : 'Submit-all failed')
    } finally {
      setSubmitAllLoading(false)
    }
  }

  const handleCustomSubmit = async () => {
    setCustomError('')
    setCustomResult(null)

    if (!token.trim()) {
      setCustomError('Enter the IndexNow admin token first.')
      return
    }

    if (customUrls.length === 0) {
      setCustomError('Add at least one URL.')
      return
    }

    setCustomLoading(true)
    try {
      const result = await callIndexNowApi('/api/indexnow/submit', {
        urls: customUrls,
        mode: customMode,
      })
      setCustomResult(result)
    } catch (error) {
      setCustomError(error instanceof Error ? error.message : 'Custom submission failed')
    } finally {
      setCustomLoading(false)
    }
  }

  return (
    <main className="indexnow-admin-page">
      <div className="indexnow-admin-shell">
        <header className="indexnow-admin-header">
          <h1>IndexNow Admin</h1>
          <p>Server-side Bing IndexNow submission tools for sitemap and custom URL batches.</p>
          <Link className="indexnow-back-link" to="/dashboard">
            Back to Dashboard
          </Link>
        </header>

        <section className="indexnow-card">
          <h2>Admin Token</h2>
          <p>
            Token is kept in local browser storage only for this admin page and never hardcoded
            in the repo. It is used for IndexNow, login-auth toggle, PDF download toggle, and
            support-reply toggle
            actions.
          </p>
          <input
            type="password"
            value={token}
            onChange={(event) => persistToken(event.target.value)}
            placeholder="Paste admin token"
            autoComplete="off"
          />
        </section>

        <section className="indexnow-card">
          <h2>Login Authentication Toggle</h2>
          <p>
            Use the same button to disable or re-enable login authentication for all visitors.
            Disable it when you want crawlers and bots to access site content directly.
          </p>
          <div className="indexnow-status-line">
            <span className={`indexnow-status-pill ${authGateState.requireLogin ? 'locked' : 'open'}`}>
              {authGateState.requireLogin ? 'Login Required' : 'Login Disabled'}
            </span>
            <span className="indexnow-status-meta">
              {authGateLoading
                ? 'Loading status...'
                : authGateState.updatedAt
                  ? `Last updated: ${formatUpdatedAt(authGateState.updatedAt)}`
                  : 'No persisted toggle found yet (using default).'}
            </span>
          </div>
          {!authGateState.configured && !authGateLoading && (
            <p className="indexnow-error">
              Auth toggle backend is not fully configured. Check env vars and database setup.
            </p>
          )}
          <div className="indexnow-inline-controls">
            <button type="button" onClick={handleToggleAuthGate} disabled={authGateLoading || authGateUpdating}>
              {authGateUpdating
                ? 'Updating login mode...'
                : authGateState.requireLogin
                  ? 'Disable Login Authentication'
                  : 'Enable Login Authentication'}
            </button>
            <button
              type="button"
              className="indexnow-secondary-btn"
              onClick={loadAuthGateStatus}
              disabled={authGateLoading || authGateUpdating}
            >
              Refresh Status
            </button>
          </div>
          {authGateError && <p className="indexnow-error">{authGateError}</p>}
        </section>

        <section className="indexnow-card">
          <h2>PDF Download Toggle (Mozilla PDF Viewer)</h2>
          <p>
            Control whether the PDF.js toolbar download button is visible inside the QuickLook
            PDF viewer.
          </p>
          <div className="indexnow-status-line">
            <span className={`indexnow-status-pill ${pdfGateState.enabled ? 'open' : 'locked'}`}>
              {pdfGateState.enabled ? 'Download Enabled' : 'Download Hidden'}
            </span>
            <span className="indexnow-status-meta">
              {pdfGateLoading
                ? 'Loading status...'
                : pdfGateState.updatedAt
                  ? `Last updated: ${formatUpdatedAt(pdfGateState.updatedAt)}`
                  : 'No persisted toggle found yet (using default).'}
            </span>
          </div>
          {!pdfGateState.configured && !pdfGateLoading && (
            <p className="indexnow-error">
              PDF toggle backend is not fully configured. Check env vars and database setup.
            </p>
          )}
          <div className="indexnow-inline-controls">
            <button type="button" onClick={handleTogglePdfGate} disabled={pdfGateLoading || pdfGateUpdating}>
              {pdfGateUpdating
                ? 'Updating PDF download mode...'
                : pdfGateState.enabled
                  ? 'Disable PDF Download'
                  : 'Enable PDF Download'}
            </button>
            <button
              type="button"
              className="indexnow-secondary-btn"
              onClick={loadPdfGateStatus}
              disabled={pdfGateLoading || pdfGateUpdating}
            >
              Refresh Status
            </button>
          </div>
          {pdfGateError && <p className="indexnow-error">{pdfGateError}</p>}
        </section>

        <section className="indexnow-card">
          <h2>Support Reply Toggle (Email Replies)</h2>
          <p>
            Control whether backend support replies can send emails from `/api/support/reply`.
          </p>
          <div className="indexnow-status-line">
            <span className={`indexnow-status-pill ${supportReplyGateState.enabled ? 'open' : 'locked'}`}>
              {supportReplyGateState.enabled ? 'Support Reply Enabled' : 'Support Reply Disabled'}
            </span>
            <span className="indexnow-status-meta">
              {supportReplyGateLoading
                ? 'Loading status...'
                : supportReplyGateState.updatedAt
                  ? `Last updated: ${formatUpdatedAt(supportReplyGateState.updatedAt)}`
                  : 'No persisted toggle found yet (using default).'}
            </span>
          </div>
          {!supportReplyGateState.configured && !supportReplyGateLoading && (
            <p className="indexnow-error">
              Support reply toggle backend is not fully configured. Check env vars and database setup.
            </p>
          )}
          <div className="indexnow-inline-controls">
            <button
              type="button"
              onClick={handleToggleSupportReplyGate}
              disabled={supportReplyGateLoading || supportReplyGateUpdating}
            >
              {supportReplyGateUpdating
                ? 'Updating support reply mode...'
                : supportReplyGateState.enabled
                  ? 'Disable Support Reply'
                  : 'Enable Support Reply'}
            </button>
            <button
              type="button"
              className="indexnow-secondary-btn"
              onClick={loadSupportReplyGateStatus}
              disabled={supportReplyGateLoading || supportReplyGateUpdating}
            >
              Refresh Status
            </button>
          </div>
          {supportReplyGateError && <p className="indexnow-error">{supportReplyGateError}</p>}
        </section>

        <section className="indexnow-card">
          <h2>Submit All URLs</h2>
          <p>Reads sitemap(s) from the server and submits all discovered URLs to IndexNow.</p>
          <button type="button" onClick={handleSubmitAll} disabled={submitAllLoading}>
            {submitAllLoading
              ? 'Submitting all URLs...'
              : 'Submit ALL URLs to Bing (IndexNow)'}
          </button>
          {submitAllError && <p className="indexnow-error">{submitAllError}</p>}
          <ResultPanel result={submitAllResult} title="Submit-all Result" />
        </section>

        <section className="indexnow-card">
          <h2>Custom URL Submission</h2>
          <p>Submit specific URLs for created, updated, or deleted pages.</p>
          <textarea
            rows={7}
            value={customUrlsRaw}
            onChange={(event) => setCustomUrlsRaw(event.target.value)}
            placeholder={`https://www.manishshrestha012.com.np/blog\nhttps://www.manishshrestha012.com.np/blog/semester/1/calculus-i`}
          />
          <div className="indexnow-inline-controls">
            <label htmlFor="indexnow-mode">Mode</label>
            <select
              id="indexnow-mode"
              value={customMode}
              onChange={(event) => setCustomMode(event.target.value)}
            >
              <option value="created">created</option>
              <option value="updated">updated</option>
              <option value="deleted">deleted</option>
            </select>
            <span>{customUrls.length} URL(s) ready</span>
          </div>
          <button type="button" onClick={handleCustomSubmit} disabled={customLoading}>
            {customLoading ? 'Submitting custom URLs...' : 'Submit Custom URLs'}
          </button>
          {customError && <p className="indexnow-error">{customError}</p>}
          <ResultPanel result={customResult} title="Custom Submission Result" />
        </section>
      </div>
    </main>
  )
}

export default IndexNowAdmin
