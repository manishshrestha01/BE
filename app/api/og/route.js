import { NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WIDTH = 1200
const HEIGHT = 630

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function splitLines(text = '', maxChars = 26) {
  const words = text.split(/\s+/)
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current.trim())
      current = word
    } else {
      current = `${current} ${word}`.trim()
    }
  }
  if (current) lines.push(current.trim())
  return lines.slice(0, 4)
}

function buildSvg({ title, subtitle, badge }) {
  const titleLines = splitLines(title, 28)
  const fontSize = titleLines.length > 2 ? 46 : 56
  const lineHeight = fontSize + 12
  const startY = 300 - ((titleLines.length - 1) * lineHeight) / 2
  const titleMarkup = titleLines
    .map(
      (line, index) =>
        `<text x="80" y="${startY + index * lineHeight}" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join('')

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="#111c3a"/>
      <stop offset="100%" stop-color="#1db954"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${WIDTH}" height="10" fill="#1db954"/>
  <text x="80" y="120" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#1db954">${escapeXml(badge)}</text>
  <text x="80" y="170" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="500" fill="#94a3b8">${escapeXml(subtitle)}</text>
  <line x1="80" y1="200" x2="340" y2="200" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  ${titleMarkup}
  <text x="80" y="${HEIGHT - 60}" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">StudyMate</text>
  <text x="80" y="${HEIGHT - 30}" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#94a3b8">Pokhara University Computer Engineering Notes</text>
</svg>`
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Study Notes'
  const subtitle = searchParams.get('sub') || 'StudyMate Notes'
  const badge = searchParams.get('badge') || 'StudyMate'

  const svg = buildSvg({ title, subtitle, badge })
  try {
    const png = await sharp(Buffer.from(svg)).png().toBuffer()
    return new NextResponse(png, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(png.byteLength),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('OG image error', { status: 500 })
  }
}