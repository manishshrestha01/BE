import { buildMetadata } from '@/lib/blogSeo'
import BlogHome from '@/components/Blog/BlogHome'

export const metadata = buildMetadata({
  title: 'StudyMate Blog - PU Computer Engineering Guides',
  description:
    'Semester-first learning layout with subject-wise tutorials, syllabus breakdowns, key topics, concept explanations, and practice questions for Pokhara University BE Computer Engineering.',
  canonicalPath: '/blog',
})

export default function Page() {
  return <BlogHome />
}