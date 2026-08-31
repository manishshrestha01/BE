import { COLLEGES } from '@/lib/colleges'
import College from '@/components/College'

export const dynamicParams = true

const makeSlugFromLabel = (label) => {
  const match = label.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].toLowerCase()
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function generateStaticParams() {
  return COLLEGES.map((college) => ({ slug: makeSlugFromLabel(college.label) }))
}

export default async function Page({ params }) {
  const { slug } = await params
  return <College slug={slug} />
}