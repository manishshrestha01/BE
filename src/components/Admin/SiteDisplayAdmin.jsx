import { useEffect, useMemo, useState } from 'react'
import FolderIcon from '../FolderIcon'
import { fetchFolderColors, fetchSiteAd, saveFolderColors, saveSiteAd, uploadSiteAdFile } from '../../lib/siteDisplay'

const DEFAULT_FOLDER_COLOR = '#007bff'
const REQUIRED_AD_WIDTH = 1080
const ALLOWED_AD_HEIGHTS = new Set([1080, 1350, 2468])

const serializeFolderColors = (value) => JSON.stringify(
  Object.entries(value || {}).sort(([left], [right]) => left.localeCompare(right))
)

const serializeAd = (value) => JSON.stringify(value || {})

const isValidTargetUrl = (value) => {
  const trimmed = value.trim()
  return Boolean(trimmed && (trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed)))
}

const readImageDimensions = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file)
  const image = new Image()

  image.onload = () => {
    resolve({
      width: image.naturalWidth,
      height: image.naturalHeight,
    })
    URL.revokeObjectURL(objectUrl)
  }

  image.onerror = () => {
    reject(new Error('Failed to read image dimensions'))
    URL.revokeObjectURL(objectUrl)
  }

  image.src = objectUrl
})

const isAllowedAdDimensions = (width, height) => (
  width === REQUIRED_AD_WIDTH &&
  ALLOWED_AD_HEIGHTS.has(height)
)

const SiteDisplayAdmin = ({ token }) => {
  const [folderColors, setFolderColors] = useState({})
  const [savedFolderColors, setSavedFolderColors] = useState({})
  const [folderPathInput, setFolderPathInput] = useState('')
  const [folderColorInput, setFolderColorInput] = useState(DEFAULT_FOLDER_COLOR)
  const [folderColorsLoading, setFolderColorsLoading] = useState(true)
  const [folderColorsSaving, setFolderColorsSaving] = useState(false)
  const [folderColorsError, setFolderColorsError] = useState('')

  const [siteAd, setSiteAd] = useState({
    enabled: false,
    imageUrl: '',
    imagePath: '',
    targetUrl: '',
    altText: '',
    imageWidth: null,
    imageHeight: null,
    updatedAt: null,
  })
  const [savedSiteAd, setSavedSiteAd] = useState({
    enabled: false,
    imageUrl: '',
    imagePath: '',
    targetUrl: '',
    altText: '',
    imageWidth: null,
    imageHeight: null,
    updatedAt: null,
  })
  const [siteAdLoading, setSiteAdLoading] = useState(true)
  const [siteAdSaving, setSiteAdSaving] = useState(false)
  const [siteAdUploading, setSiteAdUploading] = useState(false)
  const [siteAdError, setSiteAdError] = useState('')

  const folderColorRows = useMemo(
    () => Object.entries(folderColors).sort(([left], [right]) => left.localeCompare(right)),
    [folderColors]
  )
  const hasFolderColorChanges = useMemo(
    () => serializeFolderColors(folderColors) !== serializeFolderColors(savedFolderColors),
    [folderColors, savedFolderColors]
  )
  const hasSiteAdChanges = useMemo(
    () => serializeAd(siteAd) !== serializeAd(savedSiteAd),
    [siteAd, savedSiteAd]
  )

  const loadFolderColors = async () => {
    setFolderColorsLoading(true)
    setFolderColorsError('')

    try {
      const nextFolderColors = await fetchFolderColors()
      setFolderColors(nextFolderColors)
      setSavedFolderColors(nextFolderColors)
    } catch (error) {
      setFolderColorsError(error instanceof Error ? error.message : 'Failed to load folder colors')
      setFolderColors({})
      setSavedFolderColors({})
    } finally {
      setFolderColorsLoading(false)
    }
  }

  const loadSiteAd = async () => {
    setSiteAdLoading(true)
    setSiteAdError('')

    try {
      const nextAd = await fetchSiteAd()
      setSiteAd(nextAd)
      setSavedSiteAd(nextAd)
    } catch (error) {
      setSiteAdError(error instanceof Error ? error.message : 'Failed to load site advertisement')
    } finally {
      setSiteAdLoading(false)
    }
  }

  useEffect(() => {
    loadFolderColors()
    loadSiteAd()
  }, [])

  const handleAddFolderColor = () => {
    const normalizedPath = folderPathInput.trim()
    if (!normalizedPath) {
      setFolderColorsError('Enter the folder path or folder name you want to color.')
      return
    }

    setFolderColorsError('')
    setFolderColors((current) => ({
      ...current,
      [normalizedPath]: folderColorInput,
    }))
    setFolderPathInput('')
  }

  const handleRemoveFolderColor = (path) => {
    setFolderColors((current) => {
      const nextColors = { ...current }
      delete nextColors[path]
      return nextColors
    })
  }

  const handleSaveFolderColors = async () => {
    if (!token.trim()) {
      setFolderColorsError('Enter the admin token first.')
      return
    }

    setFolderColorsSaving(true)
    setFolderColorsError('')

    try {
      const nextFolderColors = await saveFolderColors({
        token,
        folderColors,
      })
      setFolderColors(nextFolderColors)
      setSavedFolderColors(nextFolderColors)
    } catch (error) {
      setFolderColorsError(error instanceof Error ? error.message : 'Failed to save folder colors')
    } finally {
      setFolderColorsSaving(false)
    }
  }

  const handleAdFieldChange = (field, value) => {
    setSiteAd((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleAdImageUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!token.trim()) {
      setSiteAdError('Enter the admin token first.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setSiteAdError('Only image files can be uploaded for the site ad.')
      return
    }

    setSiteAdUploading(true)
    setSiteAdError('')

    try {
      const dimensions = await readImageDimensions(file)
      if (!isAllowedAdDimensions(dimensions.width, dimensions.height)) {
        throw new Error(
          'Ad image must be exactly 1080 × 1080 px, 1080 × 1350 px, or 1592 × 2468 px.'
        )
      }

      const upload = await uploadSiteAdFile({ token, file })
      setSiteAd((current) => ({
        ...current,
        imageUrl: upload.imageUrl,
        imagePath: upload.imagePath,
        imageWidth: dimensions.width,
        imageHeight: dimensions.height,
      }))
    } catch (error) {
      setSiteAdError(error instanceof Error ? error.message : 'Failed to upload site ad image')
    } finally {
      setSiteAdUploading(false)
    }
  }

  const handleSaveSiteAd = async () => {
    if (!token.trim()) {
      setSiteAdError('Enter the admin token first.')
      return
    }

    if (siteAd.enabled) {
      if (!siteAd.imageUrl) {
        setSiteAdError('Upload a 1080 × 1080, 1080 × 1350, or 1592 × 2468 ad image before enabling the advertisement.')
        return
      }

      if (!isValidTargetUrl(siteAd.targetUrl || '')) {
        setSiteAdError('Enter a valid ad URL. Use a full https:// URL or a site path like /dashboard.')
        return
      }
    }

    setSiteAdSaving(true)
    setSiteAdError('')

    try {
      const nextAd = await saveSiteAd({
        token,
        ad: siteAd,
      })
      setSiteAd(nextAd)
      setSavedSiteAd(nextAd)
    } catch (error) {
      setSiteAdError(error instanceof Error ? error.message : 'Failed to save site advertisement')
    } finally {
      setSiteAdSaving(false)
    }
  }

  return (
    <>
      <section className="indexnow-card">
        <h2>Folder Color Manager</h2>
        <p>
          Color Finder folders by GitHub folder path or visible folder name. Path matches are the
          most precise, while name matches work as a fallback. Subfolders now inherit the nearest
          parent folder color unless you save a more specific child-folder override.
        </p>

        <div className="site-display-grid">
          <div>
            <label htmlFor="folder-color-path">Folder Path or Name</label>
            <input
              id="folder-color-path"
              type="text"
              value={folderPathInput}
              onChange={(event) => setFolderPathInput(event.target.value)}
              placeholder="Semester 5/Database Management System"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="folder-color-value">Folder Color</label>
            <div className="site-color-input-row">
              <input
                id="folder-color-value"
                type="color"
                value={folderColorInput}
                onChange={(event) => setFolderColorInput(event.target.value)}
              />
              <span className="site-color-code">{folderColorInput}</span>
            </div>
          </div>
        </div>

        <div className="indexnow-inline-controls">
          <button type="button" onClick={handleAddFolderColor} disabled={folderColorsLoading}>
            Add or Update Color
          </button>
          <button
            type="button"
            className="indexnow-secondary-btn"
            onClick={handleSaveFolderColors}
            disabled={folderColorsLoading || folderColorsSaving || !hasFolderColorChanges}
          >
            {folderColorsSaving ? 'Saving folder colors...' : 'Save Folder Colors'}
          </button>
          <button
            type="button"
            className="indexnow-secondary-btn"
            onClick={loadFolderColors}
            disabled={folderColorsLoading || folderColorsSaving}
          >
            Reload
          </button>
        </div>

        {folderColorsError && <p className="indexnow-error">{folderColorsError}</p>}

        {folderColorsLoading ? (
          <p>Loading folder colors...</p>
        ) : folderColorRows.length === 0 ? (
          <p>No folder color rules saved yet.</p>
        ) : (
          <div className="folder-color-list" aria-live="polite">
            {folderColorRows.map(([path, color]) => (
              <div key={path} className="folder-color-item">
                <div className="folder-color-preview">
                  <FolderIcon color={color} size={40} title={path} />
                </div>
                <div className="folder-color-meta">
                  <strong>{path}</strong>
                  <span>{color}</span>
                </div>
                <button
                  type="button"
                  className="indexnow-secondary-btn folder-color-remove"
                  onClick={() => handleRemoveFolderColor(path)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="indexnow-card">
        <h2>Homepage / Dashboard Ad</h2>
        <p>
          Upload a `1080 × 1080`, `1080 × 1350`, or `1592 × 2468` social media creative. It will appear as a closable
          popup on both <code>/</code> and <code>/dashboard</code>.
        </p>

        <div className="site-display-grid">
          <div>
            <label htmlFor="site-ad-target">Advertisement URL</label>
            <input
              id="site-ad-target"
              type="text"
              value={siteAd.targetUrl || ''}
              onChange={(event) => handleAdFieldChange('targetUrl', event.target.value)}
              placeholder="https://example.com/promo"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="site-ad-alt">Alt Text</label>
            <input
              id="site-ad-alt"
              type="text"
              value={siteAd.altText || ''}
              onChange={(event) => handleAdFieldChange('altText', event.target.value)}
              placeholder="Database SQL workshop advertisement"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="site-display-grid">
          <div>
            <label htmlFor="site-ad-image">1080 × 1080, 1080 × 1350, or 1592 × 2468 Image</label>
            <input
              id="site-ad-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAdImageUpload}
            />
            <p className="site-admin-helper-text">
              Supported types: PNG, JPG, WEBP. Allowed sizes only: 1080 × 1080 px, 1080 × 1350 px, or 1592 × 2468 px.
            </p>
          </div>

          <div>
            <label htmlFor="site-ad-enabled">Display Mode</label>
            <div className="site-toggle-card">
              <label className="site-toggle-line" htmlFor="site-ad-enabled">
                <input
                  id="site-ad-enabled"
                  type="checkbox"
                  checked={Boolean(siteAd.enabled)}
                  onChange={(event) => handleAdFieldChange('enabled', event.target.checked)}
                />
                <span>Enable popup ad on the home and dashboard routes</span>
              </label>
            </div>
          </div>
        </div>

        <div className="indexnow-inline-controls">
          <button
            type="button"
            className="indexnow-secondary-btn"
            disabled={siteAdUploading}
            onClick={() => {
              setSiteAd((current) => ({
                ...current,
                imageUrl: '',
                imagePath: '',
                imageWidth: null,
                imageHeight: null,
              }))
            }}
          >
            Remove Image
          </button>
          <button
            type="button"
            className="indexnow-secondary-btn"
            disabled={siteAdLoading || siteAdSaving}
            onClick={loadSiteAd}
          >
            Reload
          </button>
          <button
            type="button"
            onClick={handleSaveSiteAd}
            disabled={siteAdLoading || siteAdSaving || siteAdUploading || !hasSiteAdChanges}
          >
            {siteAdSaving ? 'Saving advertisement...' : 'Save Advertisement'}
          </button>
        </div>

        <div className="indexnow-status-line">
          <span className={`indexnow-status-pill ${siteAd.enabled ? 'open' : 'locked'}`}>
            {siteAd.enabled ? 'Ad Enabled' : 'Ad Disabled'}
          </span>
          {siteAdUploading && <span className="indexnow-status-meta">Uploading image...</span>}
          {siteAd.imageWidth && siteAd.imageHeight && (
            <span className="indexnow-status-meta">
              Uploaded size: {siteAd.imageWidth} × {siteAd.imageHeight}
            </span>
          )}
        </div>

        {siteAdError && <p className="indexnow-error">{siteAdError}</p>}

        {siteAd.imageUrl ? (
          <div className="site-ad-preview">
            <img
              src={siteAd.imageUrl}
              alt={siteAd.altText || 'Site ad preview'}
              style={{
                aspectRatio: siteAd.imageWidth && siteAd.imageHeight
                  ? `${siteAd.imageWidth} / ${siteAd.imageHeight}`
                  : '1 / 1',
              }}
            />
          </div>
        ) : (
          <p>No ad image uploaded yet.</p>
        )}
      </section>
    </>
  )
}

export default SiteDisplayAdmin
