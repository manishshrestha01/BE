import { useState, useEffect, useCallback } from 'react'
import { getItemsInFolder, createFolder, deleteFolder, getFolders } from '../lib/database'
import { uploadFile, uploadFiles, deleteFile } from '../lib/storage'
import { isSupabaseConfigured } from '../lib/supabase'

// Demo data for when Supabase is not configured
const demoData = {
  root: [
    { id: 'sem1', name: 'Semester 1', type: 'folder' },
    { id: 'sem2', name: 'Semester 2', type: 'folder' },
    { id: 'sem3', name: 'Semester 3', type: 'folder' },
    { id: 'sem4', name: 'Semester 4', type: 'folder' },
    { id: 'sem5', name: 'Semester 5', type: 'folder' },
    { id: 'sem6', name: 'Semester 6', type: 'folder' },
    { id: 'sem7', name: 'Semester 7', type: 'folder' },
    { id: 'sem8', name: 'Semester 8', type: 'folder' },
  ],
  sem1: [
    { id: 'math1', name: 'Mathematics I.pdf', type: 'file', fileType: 'pdf', url: '#' },
    { id: 'physics1', name: 'Physics.pptx', type: 'file', fileType: 'pptx', url: '#' },
    { id: 'chemistry1', name: 'Chemistry Notes.docx', type: 'file', fileType: 'docx', url: '#' },
    { id: 'diagram1', name: 'Circuit Diagram.png', type: 'file', fileType: 'image', url: 'https://via.placeholder.com/800x600' },
  ],
  sem2: [
    { id: 'math2', name: 'Mathematics II.pdf', type: 'file', fileType: 'pdf', url: '#' },
    { id: 'programming', name: 'C Programming.pdf', type: 'file', fileType: 'pdf', url: '#' },
    { id: 'digital', name: 'Digital Logic.pptx', type: 'file', fileType: 'pptx', url: '#' },
  ],
  sem3: [
    { id: 'dsa', name: 'Data Structures.pdf', type: 'file', fileType: 'pdf', url: '#' },
    { id: 'oop', name: 'OOP Concepts.docx', type: 'file', fileType: 'docx', url: '#' },
  ],
}

export const useNotes = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [folderPath, setFolderPath] = useState([{ id: null, name: 'Notes' }])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  const isConfigured = isSupabaseConfigured()

  // Fetch items in current folder
  const fetchItems = useCallback(async (folderId = null) => {
    setLoading(true)
    setError(null)

    try {
      if (!isConfigured) {
        // Use demo data
        const key = folderId || 'root'
        const demoItems = demoData[key] || []
        setItems(demoItems)
      } else {
        // Fetch from Supabase
        const { data, error: fetchError } = await getItemsInFolder(folderId)
        if (fetchError) {
          setError(fetchError)
        } else {
          setItems(data)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isConfigured])

  // Navigate to folder
  const navigateToFolder = useCallback(async (folderId, folderName) => {
    setCurrentFolderId(folderId)
    setFolderPath(prev => [...prev, { id: folderId, name: folderName }])
    await fetchItems(folderId)
  }, [fetchItems])

  // Navigate back
  const navigateBack = useCallback(async () => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1)
      const parentFolder = newPath[newPath.length - 1]
      setFolderPath(newPath)
      setCurrentFolderId(parentFolder.id)
      await fetchItems(parentFolder.id)
    }
  }, [folderPath, fetchItems])

  // Navigate to specific path index
  const navigateToPathIndex = useCallback(async (index) => {
    const newPath = folderPath.slice(0, index + 1)
    const targetFolder = newPath[newPath.length - 1]
    setFolderPath(newPath)
    setCurrentFolderId(targetFolder.id)
    await fetchItems(targetFolder.id)
  }, [folderPath, fetchItems])

  // Create new folder
  const addFolder = useCallback(async (name) => {
    if (!isConfigured) {
      setError('Database not configured. Running in demo mode.')
      return { error: 'Demo mode' }
    }

    const { data, error: createError } = await createFolder(name, currentFolderId)
    if (createError) {
      setError(createError)
      return { error: createError }
    }

    // Refresh items
    await fetchItems(currentFolderId)
    return { data }
  }, [isConfigured, currentFolderId, fetchItems])

  // Delete folder
  const removeFolder = useCallback(async (folderId) => {
    if (!isConfigured) {
      setError('Database not configured. Running in demo mode.')
      return { error: 'Demo mode' }
    }

    const { error: deleteError } = await deleteFolder(folderId)
    if (deleteError) {
      setError(deleteError)
      return { error: deleteError }
    }

    // Refresh items
    await fetchItems(currentFolderId)
    return {}
  }, [isConfigured, currentFolderId, fetchItems])

  // Upload single file
  const uploadSingleFile = useCallback(async (file) => {
    if (!isConfigured) {
      setError('Database not configured. Running in demo mode.')
      return { error: 'Demo mode' }
    }

    setUploading(true)
    setUploadProgress({ current: 0, total: 1, fileName: file.name })

    const { data, error: uploadError } = await uploadFile(file, currentFolderId)
    
    setUploading(false)
    setUploadProgress(null)

    if (uploadError) {
      setError(uploadError)
      return { error: uploadError }
    }

    // Refresh items
    await fetchItems(currentFolderId)
    return { data }
  }, [isConfigured, currentFolderId, fetchItems])

  // Upload multiple files
  const uploadMultipleFiles = useCallback(async (files) => {
    if (!isConfigured) {
      setError('Database not configured. Running in demo mode.')
      return { error: 'Demo mode' }
    }

    setUploading(true)
    
    const result = await uploadFiles(
      Array.from(files), 
      currentFolderId,
      (current, total, fileName) => {
        setUploadProgress({ current, total, fileName })
      }
    )
    
    setUploading(false)
    setUploadProgress(null)

    // Refresh items
    await fetchItems(currentFolderId)
    return result
  }, [isConfigured, currentFolderId, fetchItems])

  // Delete file
  const removeFile = useCallback(async (fileId, storagePath) => {
    if (!isConfigured) {
      setError('Database not configured. Running in demo mode.')
      return { error: 'Demo mode' }
    }

    const { error: deleteError } = await deleteFile(fileId, storagePath)
    if (deleteError) {
      setError(deleteError)
      return { error: deleteError }
    }

    // Refresh items
    await fetchItems(currentFolderId)
    return {}
  }, [isConfigured, currentFolderId, fetchItems])

  // Initial fetch
  useEffect(() => {
    fetchItems(null)
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    currentFolderId,
    folderPath,
    uploading,
    uploadProgress,
    isConfigured,
    navigateToFolder,
    navigateBack,
    navigateToPathIndex,
    addFolder,
    removeFolder,
    uploadSingleFile,
    uploadMultipleFiles,
    removeFile,
    refresh: () => fetchItems(currentFolderId)
  }
}
