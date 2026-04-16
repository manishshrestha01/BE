import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useSiteAd from '../hooks/useSiteAd'
import './RouteAdvertisement.css'

const ROUTE_TARGETS = new Set(['/', '/dashboard'])
const DISMISS_PREFIX = 'studymate:site-ad:dismissed:'

const buildDismissKey = (ad) => {
  const version = ad?.updatedAt || `${ad?.imageUrl || ''}|${ad?.targetUrl || ''}`
  return `${DISMISS_PREFIX}${version}`
}

const readDismissedState = (key) => {
  if (typeof window === 'undefined' || !key) return false

  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

const persistDismissedState = (key) => {
  if (typeof window === 'undefined' || !key) return

  try {
    window.sessionStorage.setItem(key, '1')
  } catch {
    // Ignore storage failures.
  }
}

const RouteAdvertisement = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { ad, loading } = useSiteAd()
  const [dismissed, setDismissed] = useState(false)

  const canRenderOnRoute = ROUTE_TARGETS.has(location.pathname)
  const dismissKey = useMemo(() => buildDismissKey(ad), [ad])
  const imageAspectRatio = useMemo(
    () => (
      ad?.imageWidth && ad?.imageHeight
        ? `${ad.imageWidth} / ${ad.imageHeight}`
        : '1 / 1'
    ),
    [ad?.imageHeight, ad?.imageWidth]
  )
  const isVisible = Boolean(
    canRenderOnRoute &&
    !loading &&
    ad?.enabled &&
    ad?.imageUrl &&
    ad?.targetUrl &&
    !dismissed
  )

  useEffect(() => {
    setDismissed(readDismissedState(dismissKey))
  }, [dismissKey])

  useEffect(() => {
    if (!isVisible) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        persistDismissedState(dismissKey)
        setDismissed(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dismissKey, isVisible])

  const closeAd = () => {
    persistDismissedState(dismissKey)
    setDismissed(true)
  }

  const handleNavigate = () => {
    if (!ad?.targetUrl) return

    if (ad.targetUrl.startsWith('/')) {
      navigate(ad.targetUrl)
      return
    }

    window.location.assign(ad.targetUrl)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="route-advertisement-overlay" onClick={closeAd} role="presentation">
      <div
        aria-label="Advertisement"
        aria-modal="true"
        className="route-advertisement-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Close advertisement"
          className="route-advertisement-close"
          onClick={closeAd}
          type="button"
        >
          ×
        </button>

        <button
          className="route-advertisement-card"
          onClick={handleNavigate}
          type="button"
        >
          <img
            alt={ad.altText || 'Advertisement'}
            className="route-advertisement-image"
            height={ad.imageHeight || 1080}
            src={ad.imageUrl}
            style={{ aspectRatio: imageAspectRatio }}
            width={ad.imageWidth || 1080}
          />
        </button>
      </div>
    </div>
  )
}

export default RouteAdvertisement
