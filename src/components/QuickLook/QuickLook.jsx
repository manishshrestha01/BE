import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ZoomableImage from './ZoomableImage'
import './QuickLook.css'

const QUICKLOOK_STATE_KEY = 'studymate:quicklook:v1'

const QuickLook = ({ file, onClose }) => {
  const [viewerErrorKey, setViewerErrorKey] = useState(null)
  const [useSecondaryProxy, setUseSecondaryProxy] = useState(false)
  const mobileOfficeRedirectAttemptRef = useRef('')
  const navigate = useNavigate()
  const location = useLocation()

  const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false

    const userAgent = navigator.userAgent || ''
    const isIOSPhone = /iPhone|iPod/i.test(userAgent)
    const isIPad = /iPad/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/i.test(userAgent)

    return isIOSPhone || isIPad || isAndroid
  }

  const isMobile = isMobileDevice()
  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true)
  const currentFileKey = file ? `${file.fileType}:${file.url}` : null
  const viewerError = viewerErrorKey === currentFileKey

  const flagViewerError = () => {
    if (!file) return
    setViewerErrorKey(`${file.fileType}:${file.url}`)
  }

  // Multiple viewer options for different file types
  // PDF.js viewer (Mozilla) - handles large PDFs well
  const getPDFJsViewerUrl = (url) => {
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`
  }

  // Google Docs viewer - good for Office files, has size limits
  const getGoogleViewerUrl = (url) => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }

  // Microsoft Office Online embed viewer (desktop iframe)
  const getOfficeEmbedViewerUrl = (url) => {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
  }

  // Microsoft Office full viewer (best for mobile/fullscreen)
  const getOfficeFullViewerUrl = (url) => {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
  }

  const clearQuickLookState = () => {
    try {
      sessionStorage.removeItem(QUICKLOOK_STATE_KEY)
    } catch {
      // Ignore storage failures.
    }
  }

  const renderMobileOfficeRedirectState = () => {
    return (
      <div className="preview-info">
        <span className="info-icon">{file.fileType === 'docx' ? '📝' : '📊'}</span>
        <h2>{file.name}</h2>
        <p>Opening fullscreen Office viewer...</p>
      </div>
    )
  }

  const renderOfficeFallback = ({ showMobileMessage = false } = {}) => {
    return (
      <div className="preview-info">
        <span className="info-icon">📊</span>
        <h2>{file.name}</h2>
        {showMobileMessage ? (
          <p>PPT preview may appear blank; open fullscreen for best quality.</p>
        ) : (
          <p>Preview unavailable in embedded mode.</p>
        )}

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <a
            href={getOfficeFullViewerUrl(file.url)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#000',
              background: '#fff',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Open Fullscreen (HD)
          </a>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!file || !isMobile || file.fileType !== 'pptx') {
      return
    }

    if (!file.url) {
      return
    }

    const attemptKey = `${file.fileType}:${file.url}`
    if (mobileOfficeRedirectAttemptRef.current === attemptKey) {
      return
    }
    mobileOfficeRedirectAttemptRef.current = attemptKey

    const backUrl = `${location.pathname}${location.search}${location.hash}`
    const params = new URLSearchParams({
      src: file.url,
      name: file.name || 'Document',
      back: backUrl
    })
    const officeViewerRoute = `/office-viewer?${params.toString()}`
    clearQuickLookState()
    onClose?.()
    navigate(officeViewerRoute)
  }, [file, isMobile, location.hash, location.pathname, location.search, navigate, onClose])

  useEffect(() => {
    if (!file || file.fileType !== 'pdf' || !isMobile) {
      return
    }

    const preventGestureZoom = (event) => {
      event.preventDefault()
    }

    const preventPinchTouch = (event) => {
      if (event.touches?.length > 1) {
        event.preventDefault()
      }
    }

    document.addEventListener('gesturestart', preventGestureZoom, { passive: false })
    document.addEventListener('gesturechange', preventGestureZoom, { passive: false })
    document.addEventListener('gestureend', preventGestureZoom, { passive: false })
    document.addEventListener('touchmove', preventPinchTouch, { passive: false })

    return () => {
      document.removeEventListener('gesturestart', preventGestureZoom)
      document.removeEventListener('gesturechange', preventGestureZoom)
      document.removeEventListener('gestureend', preventGestureZoom)
      document.removeEventListener('touchmove', preventPinchTouch)
    }
  }, [file, isMobile])

  if (!file) return null

  const renderPreview = () => {
    // Handle folders - show info card
    if (file.type === 'folder') {
      return (
        <div className="preview-info">
          <span className="info-icon">📁</span>
          <h2>{file.name}</h2>
          <p>Folder</p>
        </div>
      )
    }

    // Handle files by type - all full screen
    switch (file.fileType) {
      case 'image':
        return (
          <ZoomableImage
            src={file.url}
            alt={file.name}
            className="fullscreen-image"
            isMobile={isMobile}
            allowMobilePinch={isStandalone}
          />
        )
      case 'heif': {
        // Display HEIC/HEIF images using image proxy/converter
        const imageUrl = file.url
        
        // Try multiple proxy services for better compatibility
        const primaryUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=2000&h=2000&fit=contain&output=webp`
        const secondaryUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=2000&h=2000&fit=max&output=png`
        const currentUrl = useSecondaryProxy ? secondaryUrl : primaryUrl
        
        console.log('HEIF/HEIC viewer:', { filename: file.name, originalUrl: imageUrl, usingSecondary: useSecondaryProxy, proxyUrl: currentUrl })

        if (viewerError) {
          return (
            <div className="preview-info">
              <span className="info-icon">🖼️</span>
              <h2>{file.name}</h2>
              <p>
                HEIC/HEIF format. 
                <a href={file.url} target="_blank" rel="noopener noreferrer"> Download original</a>
              </p>
            </div>
          )
        }

        return (
          <ZoomableImage
            src={currentUrl}
            alt={file.name}
            className="fullscreen-image"
            isMobile={isMobile}
            allowMobilePinch={isStandalone}
            onLoad={() => console.log('HEIF image loaded successfully from:', currentUrl)}
            onError={() => {
              console.error('HEIF image failed to load from:', currentUrl)
              if (!useSecondaryProxy) {
                console.log('Trying secondary proxy for HEIF...')
                setUseSecondaryProxy(true)
              } else {
                console.log('All proxies failed for HEIF')
                flagViewerError()
              }
            }}
          />
        )
      }
      case 'pdf':
        // Use PDF.js for PDFs - handles large files better
        return (
          <iframe
            src={getPDFJsViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={flagViewerError}
          />
        )
      case 'pptx':
        if (isMobile) {
          return renderMobileOfficeRedirectState()
        }

        if (viewerError) {
          return renderOfficeFallback()
        }

        return (
          <iframe
            src={getOfficeEmbedViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={flagViewerError}
          />
        )
      case 'docx':
        if (viewerError) {
          return renderOfficeFallback()
        }

        return (
          <iframe
            src={getOfficeEmbedViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={flagViewerError}
          />
        )
      case 'rtf':
        // Use Google Docs viewer for RTF files
        return (
          <iframe
            src={getGoogleViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={flagViewerError}
          />
        )
      case 'text':
        return (
          <iframe
            src={file.url}
            title={file.name}
            className="fullscreen-viewer text-viewer"
          />
        )
      case 'video':
        return (
          <video controls autoPlay className="fullscreen-video">
            <source src={file.url} />
            Your browser does not support video playback.
          </video>
        )
      default:
        return (
          <div className="preview-info">
            <span className="info-icon">📄</span>
            <h2>{file.name}</h2>
            <p>Preview not available</p>
          </div>
        )
    }
  }

  return (
    <div className={`viewer-fullscreen ${isMobile ? 'viewer-mobile' : 'viewer-desktop'}`}>
      {isMobile ? (
        <header className="viewer-topbar">
          <button className="viewer-close" onClick={onClose} aria-label="Close preview">✕</button>
          <div className="viewer-filename">{file.name}</div>
        </header>
      ) : (
        <>
          <button className="viewer-close" onClick={onClose} aria-label="Close preview">✕</button>
          <div className="viewer-filename">{file.name}</div>
        </>
      )}
      <div className={`viewer-content ${isMobile && file.fileType === 'pdf' ? 'viewer-content-no-pinch' : ''}`}>
        {renderPreview()}
      </div>
    </div>
  )
}

export default QuickLook
