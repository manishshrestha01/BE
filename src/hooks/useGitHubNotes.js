import { useState, useEffect, useCallback } from 'react'
import { fetchGitHubContents, isGitHubConfigured, getGitHubRawUrl } from '../lib/github'

/**
 * Custom hook for managing notes from GitHub repository
 * Read-only - fetches and displays notes stored in GitHub
 */
export function useGitHubNotes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPath, setCurrentPath] = useState('') // Current directory path
  const [folderPath, setFolderPath] = useState([{ id: 'root', name: 'Notes', path: '' }]) // Breadcrumb
  
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
