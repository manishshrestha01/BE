import { buildMetadata } from '@/lib/blogSeo'
import BlogHome from '@/components/Blog/BlogHome'

export const metadata = buildMetadata({
  title: 'PU Computer Engineering Syllabus - Pokhara University BE',
  description:
    'Complete Pokhara University BE Computer Engineering syllabus, semester by semester: unit-wise chapters, marks scheme, and important topics for every subject. Read every syllabus on the page.',
  canonicalPath: '/syllabus',
})

export default function Page() {
  return <BlogHome scope="syllabus" />
}