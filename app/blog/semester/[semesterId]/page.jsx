import { notFound } from 'next/navigation'
import {
  BLOG_CURRICULUM,
  buildSemesterDescription,
  getSemesterByNumber,
} from '@/lib/blogCurriculum'
import { buildMetadata } from '@/lib/blogSeo'
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
    title: `Semester ${semester.semester} Notes - PU Computer Engineering`,
    description: buildSemesterDescription(semester),
    canonicalPath: semester.urlPath,
  })
}

export default async function Page({ params }) {
  const { semesterId } = await params
  const semester = getSemesterByNumber(Number(semesterId))
  if (!semester) notFound()

  return <BlogSemester semesterId={semesterId} />
}