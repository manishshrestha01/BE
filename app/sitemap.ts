import type { MetadataRoute } from 'next'
import { COLLEGES } from '@/lib/colleges'
import { BLOG_CURRICULUM, BLOG_LAST_UPDATED } from '@/lib/blogCurriculum'

const SITE_URL = 'https://www.manishshrestha012.com.np'

const makeSlugFromLabel = (label: string): string => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(BLOG_LAST_UPDATED)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/dashboard`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/colleges`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blogs`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/disclaimer`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-of-service`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const collegeRoutes: MetadataRoute.Sitemap = COLLEGES.map((college) => ({
    url: `${SITE_URL}/college/${makeSlugFromLabel(college.label)}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = [
    ...BLOG_CURRICULUM.map((semester) => ({
      url: `${SITE_URL}${semester.urlPath}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    ...BLOG_CURRICULUM.flatMap((semester) =>
      semester.subjects.map((subject) => ({
        url: `${SITE_URL}${subject.urlPath}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      }))
    ),
  ]

  return [...staticRoutes, ...collegeRoutes, ...blogRoutes]
}