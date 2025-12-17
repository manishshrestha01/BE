import { useState } from 'react'
import './QuickLook.css'

const QuickLook = ({ file, onClose }) => {
  const [viewerError, setViewerError] = useState(false)
  const [useSecondaryProxy, setUseSecondaryProxy] = useState(false)
  
  if (!file) return null

  // Debug logging
  console.log('QuickLook file:', { name: file.name, fileType: file.fileType, url: file.url })

  // Multiple viewer options for different file types
  // PDF.js viewer (Mozilla) - handles large PDFs well
  const getPDFJsViewerUrl = (url) => {
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`
  }

  // Google Docs viewer - good for Office files, has size limits
  const getGoogleViewerUrl = (url) => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }

  // Microsoft Office Online viewer - alternative for Office files
  const getOfficeViewerUrl = (url) => {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
  }

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
          <img src={file.url} alt={file.name} className="fullscreen-image" />
        )
      case 'heif': {
        // Display HEIC/HEIF images using image proxy/converter
        const imageUrl = file.url
        
        // Try multiple proxy services for better compatibility
        const primaryUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=2000&h=2000&fit=contain&output=webp`
        const secondaryUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=2000&h=2000&fit=max&output=png`
        const currentUrl = useSecondaryProxy ? secondaryUrl : primaryUrl
        
        console.log('HEIF/HEIC viewer:', { filename: file.name, originalUrl: imageUrl, usingSecondary: useSecondaryProxy, proxyUrl: currentUrl })
        
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <img 
              src={currentUrl} 
              alt={file.name} 
              className="fullscreen-image"
              onLoad={() => console.log('HEIF image loaded successfully from:', currentUrl)}
              onError={(e) => {
                console.error('HEIF image failed to load from:', currentUrl)
                if (!useSecondaryProxy) {
                  console.log('Trying secondary proxy for HEIF...')
                  setUseSecondaryProxy(true)
                } else {
                  console.log('All proxies failed for HEIF')
                  setViewerError(true)
                }
              }}
            />
            {viewerError && (
              <div className="preview-info">
                <span className="info-icon">🖼️</span>
                <h2>{file.name}</h2>
                <p>
                  HEIC/HEIF format. 
                  <a href={file.url} target="_blank" rel="noopener noreferrer"> Download original</a>
                </p>
              </div>
            )}
          </div>
        )
      }
      case 'pdf':
        // Use PDF.js for PDFs - handles large files better
        return (
          <iframe
            src={getPDFJsViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={() => setViewerError(true)}
          />
        )
      case 'pptx':
        // Try Office Online first, fallback to Google
        return (
          <iframe
            src={viewerError ? getGoogleViewerUrl(file.url) : getOfficeViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={() => setViewerError(true)}
          />
        )
      case 'docx':
        // Try Office Online first, fallback to Google
        return (
          <iframe
            src={viewerError ? getGoogleViewerUrl(file.url) : getOfficeViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={() => setViewerError(true)}
          />
        )
      case 'rtf':
        // Use Google Docs viewer for RTF files
        return (
          <iframe
            src={getGoogleViewerUrl(file.url)}
            title={file.name}
            className="fullscreen-viewer"
            onError={() => setViewerError(true)}
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
