import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSiteAd from '../hooks/useSiteAd'
import './RouteAdvertisement.css'

const DISMISS_PREFIX = 'studymate:site-ad-banner:dismissed:'

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

const RouteAdvertisementBanner = () => {
  const navigate = useNavigate()
  const { ad, loading } = useSiteAd()
  const [dismissed, setDismissed] = useState(false)
  const dismissKey = useMemo(() => buildDismissKey(ad), [ad])

  useEffect(() => {
    setDismissed(readDismissedState(dismissKey))
  }, [dismissKey])

  const closeBanner = () => {
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

  if (
    loading ||
    dismissed ||
    !ad?.enabled ||
    !ad?.imageUrl ||
    !ad?.targetUrl
  ) {
    return null
  }

  return (
    <div className="route-ad-banner-shell">
      <div className="route-ad-banner" role="complementary" aria-label="Advertisement">
        <button className="route-ad-banner-main" onClick={handleNavigate} type="button">
          <img
            alt={ad.altText || 'Advertisement'}
            className="route-ad-banner-thumb"
            src={ad.imageUrl}
          />
          <div className="route-ad-banner-copy">
            <span className="route-ad-banner-badge">Sponsored</span>
            <strong>{ad.altText || 'Featured advertisement'}</strong>
            <span>Tap to open the advertisement</span>
          </div>
        </button>

        <button
          aria-label="Close advertisement banner"
          className="route-ad-banner-close"
          onClick={closeBanner}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default RouteAdvertisementBanner
