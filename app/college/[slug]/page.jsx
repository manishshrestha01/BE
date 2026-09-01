import { COLLEGES } from '@/lib/colleges'
import College from '@/components/College'

export const dynamicParams = true

const SITE_URL = 'https://www.manishshrestha012.com.np'

const makeSlugFromLabel = (label) => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const abbrFrom = (label) => (label.match(/\(([^)]+)\)/) || [])[1] || label

export function generateStaticParams() {
  return COLLEGES.map((college) => ({ slug: makeSlugFromLabel(college.label) }))
}

export function generateMetadata({ params }) {
  const { slug } = params
  const college = COLLEGES.find((c) => makeSlugFromLabel(c.label) === slug)
  if (!college) return {}

  const abbr = abbrFrom(college.label)
  const name = college.label
  const canonical = `${SITE_URL}/college/${slug}`

  return {
    title: `${name} Notes - Pokhara University BE Computer Engineering | StudyMate`,
    description: `Free ${abbr} BE Computer Engineering notes, PDFs and study materials for semester 1-8 of the Pokhara University (PU) curriculum. Topper notes, syllabus breakdown, important topics and more for ${name}.`,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'StudyMate',
      title: `${name} - BE Computer Engineering Notes`,
      description: `Semester-wise BE Computer Engineering notes and PDFs for ${name} (${abbr}), Pokhara University.`,
      images: [{ url: `${SITE_URL}${college.logo}`, alt: `${name} logo` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - BE Computer Engineering Notes`,
      description: `Semester-wise BE Computer Engineering notes and PDFs for ${name}, Pokhara University.`,
    },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  return <College slug={slug} />
}