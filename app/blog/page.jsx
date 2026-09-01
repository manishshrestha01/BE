import { buildMetadata } from '@/lib/blogSeo'
import BlogHome from '@/components/Blog/BlogHome'

export const metadata = buildMetadata({
  title: 'StudyMate Blog - PU Computer Engineering Syllabus & Notes',
  description:
    'Complete Pokhara University BE Computer Engineering syllabus, semester-by-semester subject notes, important topics, and practice questions. Access all notes and previous past papers through the StudyMate dashboard.',
  canonicalPath: '/blog',
})

export default function Page() {
  return <BlogHome />
}