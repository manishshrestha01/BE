// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore
declare const Deno: any

console.info('get-notes function started');

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') || ''
const OWNER = Deno.env.get('GITHUB_OWNER') || 'manishshrestha01'
const REPO = Deno.env.get('GITHUB_REPO') || 'BE-Computer'
const BRANCH = Deno.env.get('GITHUB_BRANCH') || 'main'
const BASE_PATH = Deno.env.get('GITHUB_BASE_PATH') || ''

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

function getFileType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (['heif', 'heic'].includes(ext)) return 'heif'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['pdf'].includes(ext)) return 'pdf'
  if (['pptx', 'ppt'].includes(ext)) return 'pptx'
  if (['docx', 'doc'].includes(ext)) return 'docx'
  if (['rtf'].includes(ext)) return 'rtf'
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video'
  if (['txt', 'md'].includes(ext)) return 'text'
  return 'unknown'
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  const pathname = url.pathname
  const action = pathname.split('/').filter(Boolean).pop() || ''
  const pathParam = url.searchParams.get('path') || ''
  const ghPath = [BASE_PATH, pathParam].filter(Boolean).join('/')

  const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' }
  if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`

  // LIST directory
  if (action === 'list') {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURI(ghPath)}?ref=${BRANCH}`

    try {
      const r = await fetch(ghUrl, { headers })
      if (!r.ok) {
        if (r.status === 404) {
          return new Response(JSON.stringify({ success: true, data: [] }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
        }
        const text = await r.text()
        return new Response(JSON.stringify({ success: false, error: text }), { status: r.status, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
      }

      const data = await r.json()

      const fileBase = `${url.origin}${url.pathname.replace(/\/list$/, '/file')}`

      const items = (Array.isArray(data) ? data : [data])
        .filter((item: any) => {
          if (item.name.startsWith('.')) return false
          if (item.type === 'file') {
            const ext = item.name.split('.').pop()?.toLowerCase() || ''
            const supportedExts = ['pdf', 'pptx', 'ppt', 'docx', 'doc', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heif', 'heic', 'mp4', 'mov', 'webm', 'txt', 'md']
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

      return new Response(JSON.stringify({ success: true, data: items }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
    }
  }

  // FILE proxy
  if (action === 'file') {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURI(ghPath)}?ref=${BRANCH}`
    try {
      const r = await fetch(ghUrl, { headers: { ...headers, 'Accept': 'application/vnd.github.v3.raw' } })
      if (!r.ok) {
        return new Response(null, { status: r.status, headers: CORS_HEADERS })
      }

      const contentType = r.headers.get('content-type') || 'application/octet-stream'

      // If GitHub returned JSON (base64) for some reason, decode it
      if ((contentType || '').includes('application/json')) {
        const json = await r.json()
        if (json && json.content) {
          try {
            const decoded = Uint8Array.from(atob(json.content.replace(/\n/g, '')), c => c.charCodeAt(0))
            const outHeaders = { ...CORS_HEADERS, 'Content-Type': getFileType(json.name) === 'image' ? (json.encoding === 'base64' ? ('image/' + (json.name.split('.').pop() || 'png')) : 'application/octet-stream') : 'application/octet-stream', 'Content-Length': String(decoded.byteLength), 'Cache-Control': 'public, max-age=60, s-maxage=300', 'Content-Disposition': `inline; filename="${json.name}"` }
            console.info('Serving decoded JSON file', { path: ghPath, name: json.name, length: decoded.byteLength })
            return new Response(decoded, { headers: outHeaders })
          } catch (e) {
            console.error('Failed to decode base64 content', e)
            return new Response(null, { status: 500, headers: CORS_HEADERS })
          }
        }
      }

      const buf = await r.arrayBuffer()
      const len = buf.byteLength || 0
      const outHeaders = { ...CORS_HEADERS, 'Content-Type': contentType, 'Cache-Control': 'public, max-age=60, s-maxage=300', 'Content-Length': String(len), 'Content-Disposition': `inline; filename="${pathParam.split('/').pop() || 'file'}"` }
      console.info('Serving file', { path: ghPath, contentType, length: len })
      return new Response(buf, { headers: outHeaders })
    } catch (err: any) {
      console.error('File proxy error:', err)
      return new Response(null, { status: 500, headers: CORS_HEADERS })
    }
  }

  // Repo info
  if (action === 'repo') {
    const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}`
    try {
      const r = await fetch(ghUrl, { headers })
      if (!r.ok) return new Response(JSON.stringify({ success: false }), { status: r.status, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
      const data = await r.json()
      return new Response(JSON.stringify({ success: true, data }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } })
    }
  }

  return new Response(null, { status: 404, headers: CORS_HEADERS })
})
