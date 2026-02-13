import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './QuickLook.css'

const QUICKLOOK_STATE_KEY = 'studymate:quicklook:v1'
const OFFICE_VIEWER_LOAD_TIMEOUT_MS = 4500

const getOfficeFullViewerUrl = (url) => {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
}

const OfficeViewer = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [fallbackTriggered, setFallbackTriggered] = useState(false)
  const fallbackTimerRef = useRef(null)

  const sourceUrl = searchParams.get('src') || ''
  const fileName = searchParams.get('name') || 'Document'
  const backUrl = searchParams.get('back') || ''
  const officeViewerUrl = useMemo(
    () => (sourceUrl ? getOfficeFullViewerUrl(sourceUrl) : ''),
    [sourceUrl]
  )

  const clearQuickLookState = () => {
    try {
      sessionStorage.removeItem(QUICKLOOK_STATE_KEY)
    } catch {
      // Ignore storage failures.
    }
  }

  const closeViewer = () => {
    clearQuickLookState()
    if (backUrl) {
      navigate(backUrl, { replace: true })
      return
    }
    navigate(-1)
  }

  useEffect(() => {
    if (!officeViewerUrl || iframeLoaded) return

    fallbackTimerRef.current = window.setTimeout(() => {
      setFallbackTriggered(true)
      window.location.assign(officeViewerUrl)
    }, OFFICE_VIEWER_LOAD_TIMEOUT_MS)

    return () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
    }
  }, [officeViewerUrl, iframeLoaded])

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  const handleIframeError = () => {
    if (!officeViewerUrl) return
    setFallbackTriggered(true)
    window.location.assign(officeViewerUrl)
  }

  if (!sourceUrl) {
    return (
      <div className="office-viewer-page">
        <header className="office-viewer-topbar">
          <button className="viewer-close" onClick={closeViewer}>✕</button>
          <div className="viewer-filename">Office Viewer</div>
        </header>
        <div className="office-viewer-content">
          <div className="preview-info">
            <span className="info-icon">📄</span>
            <h2>Unable to open file</h2>
            <p>Missing file source URL.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="office-viewer-page">
      <header className="office-viewer-topbar">
        <button className="viewer-close" onClick={closeViewer}>✕</button>
        <div className="viewer-filename">{fileName}</div>
      </header>
      <div className="office-viewer-content">
        <div className={`office-viewer-shell ${!iframeLoaded ? 'is-loading' : ''}`}>
          {!iframeLoaded && (
            <div className="office-viewer-status">
              {fallbackTriggered ? 'Opening Office viewer...' : 'Loading Office preview...'}
            </div>
          )}
          <iframe
            src={officeViewerUrl}
            title={fileName}
            className="fullscreen-viewer"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      </div>
    </div>
  )
}

export default OfficeViewer
