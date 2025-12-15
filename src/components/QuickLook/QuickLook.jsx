import { useState } from 'react'
import './QuickLook.css'

const QuickLook = ({ file, onClose }) => {
  const [viewerError, setViewerError] = useState(false)
  
  if (!file) return null

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
