import { notFound } from 'next/navigation'
import {
  BLOG_CURRICULUM,
  buildSemesterDescription,
  getSemesterByNumber,
} from '@/lib/blogCurriculum'
import { buildMetadata, dynamicOgImage } from '@/lib/blogSeo'
import BlogSemester from '@/components/Blog/BlogSemester'

export const dynamicParams = true

export function generateStaticParams() {
  return BLOG_CURRICULUM.map((semester) => ({ semesterId: String(semester.semester) }))
}

export async function generateMetadata({ params }) {
  const { semesterId } = await params
  const semester = getSemesterByNumber(Number(semesterId))
  if (!semester) return {}

  return buildMetadata({
    title: `PU Semester ${semester.semester} Syllabus & Notes - Computer Engineering`,
    description: buildSemesterDescription(semester),
    canonicalPath: semester.urlPath,
    type: 'article',
    image: dynamicOgImage({
      title: `PU Semester ${semester.semester} Syllabus`,
      subtitle: 'Computer Engineering Notes',
      badge: 'StudyMate',
    }),
  })
}

export default async function Page({ params }) {
  const { semesterId } = await params
  const semester = getSemesterByNumber(Number(semesterId))
  if (!semester) notFound()

  return <BlogSemester semesterId={semesterId} />
}