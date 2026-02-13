import { useEffect, useRef, useState } from 'react'
import ZoomableImage from './ZoomableImage'
import './QuickLook.css'

const QuickLook = ({ file, onClose }) => {
  const [viewerErrorKey, setViewerErrorKey] = useState(null)
  const [useSecondaryProxy, setUseSecondaryProxy] = useState(false)
  const mobilePptxOpenAttemptRef = useRef('')

  const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false

    const userAgent = navigator.userAgent || ''
    const isIOS =
      /iPad|iPhone|iPod/i.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/i.test(userAgent)

    return isIOS || isAndroid
  }

  const isMobile = isMobileDevice()
  const currentFileKey = file ? `${file.fileType}:${file.url}` : null
  const viewerError = viewerErrorKey === currentFileKey

  const flagViewerError = () => {
    if (!file) return
    setViewerErrorKey(`${file.fileType}:${file.url}`)
  }

  // Debug logging
  console.log('QuickLook file:', { name: file?.name, fileType: file?.fileType, url: file?.url })

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
    if (!file || file.fileType !== 'pptx' || !isMobile) {
      return
    }

    const attemptKey = `${file.fileType}:${file.url}`
    if (mobilePptxOpenAttemptRef.current === attemptKey) {
      return
    }
    mobilePptxOpenAttemptRef.current = attemptKey

    window.open(getOfficeFullViewerUrl(file.url), '_blank', 'noopener,noreferrer')
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
          return renderOfficeFallback({ showMobileMessage: true })
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
    <div className="viewer-fullscreen">
      {/* Close button */}
      <button className="viewer-close" onClick={onClose}>✕</button>
      
      {/* File name */}
      <div className="viewer-filename">{file.name}</div>
      
      {/* Content */}
      <div className="viewer-content">
        {renderPreview()}
      </div>
    </div>
  )
}

export default QuickLook
