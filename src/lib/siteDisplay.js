import { supabase } from './supabase'

const SITE_SETTINGS_HEADER = 'x-site-settings-token'

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status})`)
  }

  return payload
}

export const fetchFolderColors = async () => {
  const payload = await requestJson('/api/folder-colors', {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'no-store',
  })

  return payload?.folderColors && typeof payload.folderColors === 'object'
    ? payload.folderColors
    : {}
}

export const saveFolderColors = async ({ token, folderColors }) => {
  const payload = await requestJson('/api/folder-colors', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      [SITE_SETTINGS_HEADER]: token.trim(),
    },
    body: JSON.stringify({ folderColors }),
  })

  return payload?.folderColors && typeof payload.folderColors === 'object'
    ? payload.folderColors
    : {}
}

export const fetchSiteAd = async () => {
  const payload = await requestJson('/api/site-ad', {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'no-store',
  })

  return payload?.ad && typeof payload.ad === 'object'
    ? payload.ad
    : {
        enabled: false,
        imageUrl: '',
        imagePath: '',
        targetUrl: '',
        altText: '',
        imageWidth: null,
        imageHeight: null,
        updatedAt: null,
      }
}

export const saveSiteAd = async ({ token, ad }) => {
  const payload = await requestJson('/api/site-ad', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      [SITE_SETTINGS_HEADER]: token.trim(),
    },
    body: JSON.stringify({ ad }),
  })

  return payload?.ad && typeof payload.ad === 'object'
    ? payload.ad
    : null
}

const prepareSiteAdUpload = async ({ token, file }) => requestJson('/api/site-ad-upload', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    [SITE_SETTINGS_HEADER]: token.trim(),
  },
  body: JSON.stringify({
    fileName: file.name,
    contentType: file.type,
  }),
})

export const uploadSiteAdFile = async ({ token, file }) => {
  if (!supabase) {
    throw new Error('Supabase is not configured for uploads.')
  }

  const upload = await prepareSiteAdUpload({ token, file })
  const bucket = typeof upload?.bucket === 'string' ? upload.bucket : ''
  const path = typeof upload?.path === 'string' ? upload.path : ''
  const tokenValue = typeof upload?.token === 'string' ? upload.token : ''
  const publicUrl = typeof upload?.publicUrl === 'string' ? upload.publicUrl : ''

  if (!bucket || !path || !tokenValue || !publicUrl) {
    throw new Error('Upload details are incomplete.')
  }

  const { error } = await supabase
    .storage
    .from(bucket)
    .uploadToSignedUrl(path, tokenValue, file)

  if (error) {
    throw new Error(error.message || 'Failed to upload ad image')
  }

  return {
    bucket,
    imagePath: path,
    imageUrl: publicUrl,
  }
}
