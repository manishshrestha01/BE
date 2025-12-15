import { supabase, isSupabaseConfigured } from './supabase'

// ============ FOLDERS ============

// Get all folders
export const getFolders = async (parentId = null) => {
  if (!isSupabaseConfigured()) return { data: [], error: null }
  
  let query = supabase
    .from('folders')
    .select('*')
    .order('name')
  
  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }
  
  const { data, error } = await query
  return { data: data || [], error }
}

// Create a folder
export const createFolder = async (name, parentId = null) => {
  if (!isSupabaseConfigured()) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from('folders')
    .insert([{ name, parent_id: parentId }])
    .select()
    .single()
  
  return { data, error }
}

// Delete a folder
export const deleteFolder = async (folderId) => {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured' }
  
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId)
  
  return { error }
}

// Rename a folder
export const renameFolder = async (folderId, newName) => {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from('folders')
    .update({ name: newName })
    .eq('id', folderId)
    .select()
    .single()
  
  return { data, error }
}

// ============ FILES ============

// Get files in a folder
export const getFiles = async (folderId = null) => {
  if (!isSupabaseConfigured()) return { data: [], error: null }
  
  let query = supabase
    .from('files')
    .select('*')
    .order('name')
  
  if (folderId) {
    query = query.eq('folder_id', folderId)
  } else {
    query = query.is('folder_id', null)
  }
  
  const { data, error } = await query
  return { data: data || [], error }
}

// Get file by ID
export const getFileById = async (fileId) => {
  if (!isSupabaseConfigured()) return { data: null, error: null }
  
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single()
  
  return { data, error }
}

// Create file record (after upload)
export const createFileRecord = async (fileData) => {
  if (!isSupabaseConfigured()) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from('files')
    .insert([{
      name: fileData.name,
      file_type: fileData.fileType,
      file_size: fileData.fileSize,
      storage_path: fileData.storagePath,
      url: fileData.url,
      folder_id: fileData.folderId || null
    }])
    .select()
    .single()
  
  return { data, error }
}

// Delete file record
export const deleteFileRecord = async (fileId) => {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured' }
  
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId)
  
  return { error }
}

// Move file to folder
export const moveFile = async (fileId, folderId) => {
  if (!isSupabaseConfigured()) return { error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from('files')
    .update({ folder_id: folderId })
    .eq('id', fileId)
    .select()
    .single()
  
  return { data, error }
}

// ============ COMBINED ============

// Get all items (folders + files) in a location
export const getItemsInFolder = async (folderId = null) => {
  const [foldersResult, filesResult] = await Promise.all([
    getFolders(folderId),
    getFiles(folderId)
  ])
  
  const folders = (foldersResult.data || []).map(f => ({
    ...f,
    type: 'folder'
  }))
  
  const files = (filesResult.data || []).map(f => ({
    ...f,
    type: 'file',
    fileType: f.file_type
  }))
  
  return {
    data: [...folders, ...files],
    error: foldersResult.error || filesResult.error
  }
}
