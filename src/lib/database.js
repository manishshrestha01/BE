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

// ============ USER FAVORITES & RECENTS ============

// Fetch user favorites
export const getUserFavorites = async (userId) => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Add or remove favorite (upsert)
export const toggleFavorite = async ({ userId, item }) => {
  // Ensure item_data is included if provided
  const favoriteData = {
    user_id: userId,
    item_id: item.item_id,
    item_name: item.item_name,
    item_path: item.item_path,
    item_type: item.item_type,
    item_data: item.item_data || null
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .upsert([favoriteData], { onConflict: 'user_id,item_path' })
    .select()
  
  if (error) console.error('Error saving favorite:', error, favoriteData)
  return { data, error }
}

export const removeFavorite = async (userId, item_path) => {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('item_path', item_path)
  return { error }
}

// Fetch user recents
export const getUserRecents = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('user_recent_tabs')
    .select('*')
    .eq('user_id', userId)
    .order('last_opened_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

// Add or update recent tab
export const upsertRecentTab = async ({ userId, item }) => {
  const recentData = {
    user_id: userId,
    item_id: item.item_id,
    item_name: item.item_name,
    item_path: item.item_path,
    item_type: item.item_type,
    item_data: item.item_data || null,
    last_opened_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_recent_tabs')
    .upsert([recentData], { onConflict: 'user_id,item_path' })
    .select()
  
  if (error) console.error('Error saving recent tab:', error, recentData)
  return { data, error }
}

// ============ SUPPORT MESSAGES ============

/**
 * Persist a support / contact message to the `support_messages` table.
 * Columns expected: user_id (uuid), email (text), subject (text), message (text), metadata (json), created_at
 */
export const createSupportMessage = async ({ userId = null, name = null, email = null, subject = '', message = '', metadata = {} } = {}) => {
  if (!isSupabaseConfigured()) return { data: null, error: 'Supabase not configured' }

  const payload = {
    user_id: userId ?? null,
    name: name || null,
    email: email || null,
    subject: subject || null,
    message: message || null,
    metadata: Object.keys(metadata || {}).length ? metadata : null
  }

  // Insert without selecting the newly created row to avoid requiring a separate
  // SELECT policy in RLS-protected environments. The REST endpoint will return
  // an HTTP 201 on success and `data` may be null depending on DB settings.
  const { data, error } = await supabase
    .from('support_messages')
    .insert([payload])

  return { data, error }
}
