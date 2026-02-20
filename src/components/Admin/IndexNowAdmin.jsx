import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [token, setToken] = useState(readInitialToken)
  const [submitAllLoading, setSubmitAllLoading] = useState(false)
  const [submitAllError, setSubmitAllError] = useState('')
  const [submitAllResult, setSubmitAllResult] = useState(null)

  const [customUrlsRaw, setCustomUrlsRaw] = useState('')
  const [customMode, setCustomMode] = useState('updated')
  const [customLoading, setCustomLoading] = useState(false)
  const [customError, setCustomError] = useState('')
  const [customResult, setCustomResult] = useState(null)

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
            in the repo.
          </p>
          <input
            type="password"
            value={token}
            onChange={(event) => persistToken(event.target.value)}
            placeholder="Paste x-indexnow-token"
            autoComplete="off"
          />
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
