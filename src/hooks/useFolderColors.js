import { useCallback, useEffect, useState } from 'react'
import { fetchFolderColors } from '../lib/siteDisplay'

export const useFolderColors = () => {
  const [folderColors, setFolderColors] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const nextColors = await fetchFolderColors()
      setFolderColors(nextColors)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load folder colors')
      setFolderColors({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    folderColors,
    loading,
    error,
    refresh,
  }
}

export default useFolderColors
