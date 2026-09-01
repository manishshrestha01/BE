/* eslint-env node */
/* global process */

export const INDEXNOW_ENGINES = [
  { id: 'bing', name: 'Bing', note: 'via IndexNow + Bing Webmaster Tools' },
  { id: 'microsoft-copilot', name: 'Microsoft Copilot', note: 'cites from Bing index' },
  { id: 'naver', name: 'Naver', note: 'via IndexNow + Naver Webmaster Toolkit' },
  { id: 'yandex', name: 'Yandex', note: 'via IndexNow + Yandex Webmaster' },
  { id: 'seznam', name: 'Seznam.cz', note: 'via IndexNow' },
  { id: 'yep', name: 'Yep.com', note: 'via IndexNow' },
  { id: 'duckduckgo', name: 'DuckDuckGo', note: 'Bing-powered — IndexNow pings flow through' },
  { id: 'brave', name: 'Brave Search', note: 'own index; submit sitemap in Brave Webmaster' },
]

export const SITEMAP_PING_ENDPOINTS = {
  baidu: {
    id: 'baidu',
    name: 'Baidu',
    url: (sitemapUrl) => `https://www.baidu.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    note: 'Public sitemap ping endpoint (no auth required)',
  },
}

export function getVerificationConfig() {
  return [
    {
      id: 'google',
      name: 'Google',
      domain: 'search.google.com/search-console',
      code: process.env.GOOGLE_SITE_VERIFICATION,
      configured: Boolean(process.env.GOOGLE_SITE_VERIFICATION),
      how: 'Search Console → Settings → Ownership verification (HTML tag)',
    },
    {
      id: 'yandex',
      name: 'Yandex',
      domain: 'webmaster.yandex.com',
      code: process.env.YANDEX_SITE_VERIFICATION || '464a14ed2069c072',
      configured: true,
      how: 'Meta tag already set in app/layout.jsx',
    },
    {
      id: 'bing',
      name: 'Bing',
      domain: 'www.bing.com/webmasters',
      code: process.env.BING_SITE_VERIFICATION,
      configured: Boolean(process.env.BING_SITE_VERIFICATION),
      how: 'Bing Webmaster → Import from GSC or add site → get msvalidate.01 code',
    },
    {
      id: 'baidu',
      name: 'Baidu',
      domain: 'ziyuan.baidu.com',
      code: process.env.BAIDU_SITE_VERIFICATION,
      configured: Boolean(process.env.BAIDU_SITE_VERIFICATION),
      how: 'Baidu Search Resource Platform → verification → baidu-site-verification code',
    },
    {
      id: 'naver',
      name: 'Naver',
      domain: 'searchadvisor.naver.com',
      code: process.env.NAVER_SITE_VERIFICATION,
      configured: Boolean(process.env.NAVER_SITE_VERIFICATION),
      how: 'Naver Search Advisor → website verification → naver-site-verification code',
    },
    {
      id: 'seznam',
      name: 'Seznam.cz',
      domain: 'search.seznam.cz',
      code: process.env.SEZNAM_SITE_VERIFICATION,
      configured: Boolean(process.env.SEZNAM_SITE_VERIFICATION),
      how: 'Seznam Webmaster → verification → seznam-wmt code',
    },
  ]
}

export function getSitemapUrl() {
  return (process.env.SITEMAP_URL || `${process.env.SITE_URL || 'https://www.manishshrestha012.com.np'}/sitemap.xml`).trim()
}

export function getIndexNowKeyLocation() {
  const key = (process.env.INDEXNOW_KEY || '').trim()
  if (!key) return null
  return (
    process.env.INDEXNOW_KEY_LOCATION ||
    `${process.env.SITE_URL || 'https://www.manishshrestha012.com.np'}/${key}.txt`
  ).trim()
}

export async function pingBaiduSitemap() {
  const sitemapUrl = getSitemapUrl()
  const endpoint = SITEMAP_PING_ENDPOINTS.baidu.url(sitemapUrl)

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { accept: 'text/html,*/*', 'user-agent': 'Mozilla/5.0 (compatible; StudyMate Sitemap Ping)' },
    })

    return {
      ok: response.ok,
      status: response.status,
      engine: 'baidu',
      target: endpoint,
    }
  } catch (error) {
    return {
      ok: false,
      status: 'NETWORK_ERROR',
      engine: 'baidu',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}