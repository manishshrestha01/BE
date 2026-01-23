#!/usr/bin/env node
/* eslint-env node */
/* global process */

// Simple script to fetch a URL and print presence of key SEO tags and JSON-LD
// Usage: node scripts/inspect-seo.js https://example.com

import fs from 'fs/promises'

const rawArgs = process.argv.slice(2)
const flags = rawArgs.filter(a => a.startsWith('--'))
const args = rawArgs.filter(a => !a.startsWith('--'))
const failOnLongDesc = flags.includes('--fail-on-long-desc')
let hadError = false

if (!args.length) {
  console.error('Usage: node scripts/inspect-seo.js <url|file> [<url|file>...]')
  console.error('Optional flags: --fail-on-long-desc')
  process.exit(1)
}

async function inspect(url) {
  try {
    let text
    let status

    if (/^https?:\/\//i.test(url)) {
      const res = await fetch(url, { redirect: 'follow' })
      status = res.status
      text = await res.text()
    } else {
      // treat as local file path
      text = await fs.readFile(url, 'utf8')
      status = 'file'
    }

    const get = (regex) => {
      const m = text.match(regex)
      return m ? m[1] : null
    }

    console.log('\n== ' + url + ' ==')
    console.log('Status:', status)

    const title = get(/<title>([^<]+)<\/title>/i) || '—'
    const desc = get(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || ''

    console.log('Title:', title)
    console.log('Meta description:', desc || '—')
    console.log('Meta description length:', desc.length)

    if (desc.length > 160) {
      console.log('WARNING: meta description is longer than recommended (<=160 chars). Shorten to ~120–155 chars for best results.')
      if (failOnLongDesc) hadError = true
    }

    console.log('OG title:', get(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i) || '—')
    console.log('OG desc:', get(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || '—')
    console.log('OG image:', get(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) || '—')
    console.log('Canonical:', get(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) || '—')

    const jsonldMatches = [...text.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    console.log('Has JSON-LD:', jsonldMatches.length ? 'yes' : 'no')
    for (const match of jsonldMatches) {
      const content = match[1]
      try {
        const j = JSON.parse(content.trim())
        const keys = Array.isArray(j) ? ['array'] : Object.keys(j)
        console.log('JSON-LD keys:', keys)

        const findLogo = (obj) => {
          if (!obj) return null
          if (obj['@type'] === 'Organization') {
            if (obj.logo) {
              if (typeof obj.logo === 'string') return obj.logo
              if (obj.logo.url) return obj.logo.url
            }
          }
          if (obj['@graph'] && Array.isArray(obj['@graph'])) {
            for (const item of obj['@graph']) {
              const res = findLogo(item)
              if (res) return res
            }
          }
          if (obj.mainEntity) return findLogo(obj.mainEntity)
          if (Array.isArray(obj)) {
            for (const item of obj) {
              const res = findLogo(item)
              if (res) return res
            }
          }
          return null
        }

        const logo = findLogo(j)
        console.log('Organization logo:', logo || '—')
      } catch (err) {
        console.log('JSON-LD parse error', err.message)
      }
    }
  } catch (err) {
    console.error('Failed to fetch', url, err.message)
  }
}

;(async () => {
  for (const url of args) await inspect(url)
  if (hadError) process.exit(2)
})()
