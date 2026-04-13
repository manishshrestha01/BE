import { useCallback, useEffect, useState } from 'react'
import { fetchSiteAd } from '../lib/siteDisplay'

const DEFAULT_AD = {
  enabled: false,
  imageUrl: '',
  imagePath: '',
  targetUrl: '',
  altText: '',
  imageWidth: null,
  imageHeight: null,
  updatedAt: null,
}

export const useSiteAd = () => {
  const [ad, setAd] = useState(DEFAULT_AD)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const nextAd = await fetchSiteAd()
      setAd({ ...DEFAULT_AD, ...nextAd })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load site ad')
      setAd(DEFAULT_AD)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    ad,
    loading,
    error,
    refresh,
  }
}

export default useSiteAd
