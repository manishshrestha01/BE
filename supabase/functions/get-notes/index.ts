// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// @ts-ignore
declare const Deno: any

console.info('get-notes function started');

// Configuration from Environment Variables
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') || ''
const OWNER = Deno.env.get('GITHUB_OWNER') || 'manishshrestha01'
const REPO = Deno.env.get('GITHUB_REPO') || 'BE-Computer'
const BRANCH = Deno.env.get('GITHUB_BRANCH') || 'main'
const BASE_PATH = Deno.env.get('GITHUB_BASE_PATH') || ''

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-client-info,apikey',
}

// Map extensions to correct Content-Types for browser viewing
const MIME_TYPES: Record<string, string> = {
  'pdf': 'application/pdf',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'doc': 'application/msword',
  'odt': 'application/vnd.oasis.opendocument.text',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'ppt': 'application/vnd.ms-powerpoint',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'txt': 'text/plain; charset=utf-8',
  'md': 'text/markdown; charset=utf-8',
  'mp4': 'video/mp4',
  'webm': 'video/webm'
}

function getFileType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (['heif', 'heic'].includes(ext)) return 'heif'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'pdf'
  if (['pptx', 'ppt'].includes(ext)) return 'pptx'
  if (['docx', 'doc', 'odt'].includes(ext)) return 'docx'
  if (['rtf'].includes(ext)) return 'rtf'
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video'
  if (['txt', 'md'].includes(ext)) return 'text'
  return 'unknown'
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  const pathname = url.pathname
  const action = pathname.split('/').filter(Boolean).pop() || ''
  const pathParam = url.searchParams.get('path') || ''
  
  // Clean the path to avoid double slashes
  const ghPath = [BASE_PATH, pathParam].filter(Boolean).join('/')

  const headers: Record<string, string> = { 
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Supabase-Edge-Function'
  }
  if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`

  // --- ACTION: LIST ---
  if (action === 'list') {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURI(ghPath)}?ref=${BRANCH}`

    try {
      const r = await fetch(ghUrl, { headers })
      if (!r.ok) {
        if (r.status === 404) {
          return new Response(JSON.stringify({ success: true, data: [] }), { 
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
          })
        }
        const text = await r.text()
        return new Response(JSON.stringify({ success: false, error: text }), { 
          status: r.status, 
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
        })
      }

      const data = await r.json()
      
      // Construct the base URL for files dynamically
      const fileBase = `${url.origin}${url.pathname.replace(/\/list$/, '/file')}`

      const items = (Array.isArray(data) ? data : [data])
        .filter((item: any) => {
          if (item.name.startsWith('.')) return false
          if (item.type === 'file') {
            const ext = item.name.split('.').pop()?.toLowerCase() || ''
            const supportedExts = Object.keys(MIME_TYPES).concat(['heif', 'heic', 'mov', 'rtf'])
            return supportedExts.includes(ext)
          }
          return true
        })
        .map((item: any) => ({
          id: item.sha,
          name: item.name,
          type: item.type === 'dir' ? 'folder' : 'file',
          fileType: item.type === 'file' ? getFileType(item.name) : undefined,
          path: item.path,
          size: item.size || 0,
          url: `${fileBase}?path=${encodeURIComponent(item.path)}`,
          html_url: item.html_url,
          sha: item.sha,
        }))
        .sort((a: any, b: any) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1
          if (a.type !== 'folder' && b.type === 'folder') return 1
          return a.name.localeCompare(b.name)
        })

      return new Response(JSON.stringify({ success: true, data: items }), { 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
      })
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { 
        status: 500, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
      })
    }
  }

  // --- ACTION: FILE PROXY ---
  if (action === 'file') {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURI(ghPath)}?ref=${BRANCH}`
    try {
      const r = await fetch(ghUrl, { 
        headers: { ...headers, 'Accept': 'application/vnd.github.v3.raw' } 
      })
      
      if (!r.ok) {
        return new Response(null, { status: r.status, headers: CORS_HEADERS })
      }

      const ext = pathParam.split('.').pop()?.toLowerCase() || ''
      const contentType = MIME_TYPES[ext] || 'application/octet-stream'
      const buf = await r.arrayBuffer()

      return new Response(buf, { 
        headers: { 
          ...CORS_HEADERS, 
          'Content-Type': contentType, 
          'Cache-Control': 'public, max-age=3600',
          'Content-Disposition': `inline; filename="${encodeURIComponent(pathParam.split('/').pop() || 'file')}"`
        } 
      })
    } catch (err: any) {
      return new Response(null, { status: 500, headers: CORS_HEADERS })
    }
  }

  // --- ACTION: REPO INFO ---
  if (action === 'repo') {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}`
    try {
      const r = await fetch(ghUrl, { headers })
      if (!r.ok) return new Response(JSON.stringify({ success: false }), { 
        status: r.status, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
      })
      const data = await r.json()
      return new Response(JSON.stringify({ success: true, data }), { 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
      })
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { 
        status: 500, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), { 
    status: 404, 
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
  })
})
