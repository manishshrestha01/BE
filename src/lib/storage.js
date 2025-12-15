import { supabase, isSupabaseConfigured } from './supabase'
import { createFileRecord, deleteFileRecord } from './database'

const BUCKET_NAME = 'notes'

// Get file type from extension
export const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'pdf'
  if (['pptx', 'ppt'].includes(ext)) return 'pptx'
  if (['docx', 'doc'].includes(ext)) return 'docx'
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video'
  if (['txt', 'md'].includes(ext)) return 'text'
  return 'unknown'
}

// Upload a file to Supabase Storage
export const uploadFile = async (file, folderId = null) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase not configured' }
  }

  try {
    // Create unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = folderId 
      ? `${folderId}/${timestamp}_${sanitizedName}`
      : `root/${timestamp}_${sanitizedName}`

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { data: null, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)

    // Create file record in database
    const fileType = getFileType(file.name)
    const { data: fileRecord, error: dbError } = await createFileRecord({
      name: file.name,
      fileType,
      fileSize: file.size,
      storagePath,
      url: urlData.publicUrl,
      folderId
    })

    if (dbError) {
      // Rollback: delete uploaded file if DB insert fails
      await supabase.storage.from(BUCKET_NAME).remove([storagePath])
      return { data: null, error: dbError }
    }

    return { 
      data: { 
        ...fileRecord, 
        type: 'file',
        fileType 
      }, 
      error: null 
    }
  } catch (err) {
    console.error('Upload exception:', err)
    return { data: null, error: err.message }
  }
}

// Upload multiple files
export const uploadFiles = async (files, folderId = null, onProgress = null) => {
  const results = []
  let completed = 0

  for (const file of files) {
    const result = await uploadFile(file, folderId)
    results.push(result)
    completed++
    
    if (onProgress) {
      onProgress(completed, files.length, file.name)
    }
  }

  const successful = results.filter(r => !r.error)
  const failed = results.filter(r => r.error)

  return {
    successful: successful.map(r => r.data),
    failed,
    total: files.length
  }
}

// Delete a file from storage and database
export const deleteFile = async (fileId, storagePath) => {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured' }
  }

  try {
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .remove([storagePath])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await deleteFileRecord(fileId)

    return { error: dbError || storageError }
  } catch (err) {
    return { error: err.message }
  }
}

// Get download URL for a file
export const getDownloadUrl = async (storagePath) => {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 3600) // 1 hour expiry

  return { url: data?.signedUrl, error }
}

// Check if file type is allowed
export const isAllowedFileType = (filename) => {
  const allowedExtensions = [
    'pdf', 'pptx', 'ppt', 'docx', 'doc',
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
    'mp4', 'mov', 'webm',
    'txt', 'md'
  ]
  const ext = filename.split('.').pop().toLowerCase()
  return allowedExtensions.includes(ext)
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
