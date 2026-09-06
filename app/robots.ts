import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers()
  const host = h.get('host') || 'www.manishshrestha012.com.np'
  const sitemapUrl = `https://${host}/sitemap.xml`

  return {
    rules: [
      {
        userAgent: '*',
        // Explicitly allow all public pages
        allow: [
          '/',
          '/about',
          '/blogs',
          '/blog',
          '/pu-exam',
          '/pu-exam-grading',
          '/contact',
          '/dashboard',
          '/faq',
          '/colleges',
          '/college/',
          '/privacy-policy',
          '/terms',
          '/terms-of-service',
          '/disclaimer',
        ],
        // Block non-public / internal pages
        disallow: ['/admin', '/user-info', '/manifest.json'],
      },
      // ── AI Search Bots (ALLOW — required for GEO citations) ──────
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      // ── AI Training Bots (BLOCK) ──────
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'DataForSeoBot', disallow: '/admin' },
    ],
    sitemap: sitemapUrl,
  }
}