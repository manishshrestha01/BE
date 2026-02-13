import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchGitHubContents, isGitHubConfigured, getGitHubRawUrl } from '../lib/github'

/**
 * Custom hook for managing notes from GitHub repository
 * Read-only - fetches and displays notes stored in GitHub
 */
const NOTES_PATH_STORAGE_KEY = 'studymate:notespath:v1'
const ROOT_FOLDER = { id: 'root', name: 'Notes', path: '' }

const isValidFolder = (folder) => {
  return Boolean(
    folder &&
    typeof folder === 'object' &&
    typeof folder.name === 'string' &&
    typeof folder.path === 'string'
  )
}

const normalizeStoredPathState = (value) => {
  const normalizedCurrentPath = typeof value?.currentPath === 'string' ? value.currentPath : ''
  const rawFolderPath = Array.isArray(value?.folderPath) ? value.folderPath : [ROOT_FOLDER]
  const validFolders = rawFolderPath.filter(isValidFolder)

  const normalizedFolderPath = validFolders.length > 0
    ? validFolders
    : [ROOT_FOLDER]

  if (normalizedFolderPath[0]?.path !== '') {
    normalizedFolderPath.unshift(ROOT_FOLDER)
  }

  return {
    currentPath: normalizedCurrentPath,
    folderPath: normalizedFolderPath
  }
}

const readStoredNotesPathState = () => {
  try {
    const raw = sessionStorage.getItem(NOTES_PATH_STORAGE_KEY)
    if (!raw) return normalizeStoredPathState(null)

    const parsed = JSON.parse(raw)
    return normalizeStoredPathState(parsed)
  } catch {
    return normalizeStoredPathState(null)
  }
}

const persistNotesPathState = (state) => {
  try {
    const normalized = normalizeStoredPathState(state)
    sessionStorage.setItem(NOTES_PATH_STORAGE_KEY, JSON.stringify(normalized))
  } catch {
    // Ignore storage failures.
  }
}

export function useGitHubNotes() {
  const initialPathStateRef = useRef(readStoredNotesPathState())
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPath, setCurrentPath] = useState(initialPathStateRef.current.currentPath) // Current directory path
  const [folderPath, setFolderPath] = useState(initialPathStateRef.current.folderPath) // Breadcrumb
  const pathStateRef = useRef({ currentPath, folderPath })
  
  const isConfigured = isGitHubConfigured()

  // Fetch items from current path
  const fetchItems = useCallback(async (path = '') => {
    setLoading(true)
    setError(null)
    
    if (!isConfigured) {
      // Demo data when GitHub is not configured
      setItems([
        { id: 'demo1', name: 'Semester 1', type: 'folder', path: 'semester-1' },
        { id: 'demo2', name: 'Semester 2', type: 'folder', path: 'semester-2' },
        { id: 'demo3', name: 'Semester 3', type: 'folder', path: 'semester-3' },
        { id: 'demo4', name: 'Semester 4', type: 'folder', path: 'semester-4' },
        { id: 'demo5', name: 'Semester 5', type: 'folder', path: 'semester-5' },
        { id: 'demo6', name: 'Semester 6', type: 'folder', path: 'semester-6' },
        { id: 'demo7', name: 'Semester 7', type: 'folder', path: 'semester-7' },
        { id: 'demo8', name: 'Semester 8', type: 'folder', path: 'semester-8' },
      ])
      setLoading(false)
      return
    }
    
    try {
      const result = await fetchGitHubContents(path)
      
      if (result.success) {
        setItems(result.data)
      } else {
        setError(result.error)
        setItems([])
      }
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isConfigured])

  // Initial fetch
  useEffect(() => {
    fetchItems(currentPath)
  }, [currentPath, fetchItems])

  useEffect(() => {
    pathStateRef.current = { currentPath, folderPath }
    persistNotesPathState({ currentPath, folderPath })
  }, [currentPath, folderPath])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistNotesPathState(pathStateRef.current)
        return
      }

      if (document.visibilityState === 'visible') {
        const restored = readStoredNotesPathState()
        const previous = pathStateRef.current
        const prevSerializedPath = JSON.stringify(previous.folderPath)
        const restoredSerializedPath = JSON.stringify(restored.folderPath)

        if (restored.currentPath !== previous.currentPath) {
          setCurrentPath(restored.currentPath)
        }
        if (restoredSerializedPath !== prevSerializedPath) {
          setFolderPath(restored.folderPath)
        }
      }
    }

    const handleBeforeUnload = () => {
      persistNotesPathState(pathStateRef.current)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Navigate into a folder
  const navigateToFolder = useCallback((folderId, folderName, folderPath) => {
    setCurrentPath(folderPath)
    setFolderPath(prev => [...prev, { id: folderId, name: folderName, path: folderPath }])
  }, [])

  // Navigate back one level
  const navigateBack = useCallback(() => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1)
      setFolderPath(newPath)
      setCurrentPath(newPath[newPath.length - 1].path)
    }
  }, [folderPath])

  // Navigate to specific path index (breadcrumb click)
  const navigateToPathIndex = useCallback((index) => {
    const newPath = folderPath.slice(0, index + 1)
    setFolderPath(newPath)
    setCurrentPath(newPath[newPath.length - 1].path)
  }, [folderPath])

  // Refresh current folder
  const refresh = useCallback(() => {
    fetchItems(currentPath)
  }, [currentPath, fetchItems])

  // Get raw URL for a file (for viewing)
  const getFileUrl = useCallback((item) => {
    if (item.url) return item.url // Direct download URL from GitHub API
    if (item.path) return getGitHubRawUrl(item.path)
    return null
  }, [])

  return {
    items,
    loading,
    error,
    folderPath,
    currentPath,
    isConfigured,
    navigateToFolder,
    navigateBack,
    navigateToPathIndex,
    refresh,
    getFileUrl,
  }
}
