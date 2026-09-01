import { notFound } from 'next/navigation'
import {
  BLOG_CURRICULUM,
  buildSubjectDescription,
  getSubjectBySlug,
} from '@/lib/blogCurriculum'
import { buildMetadata } from '@/lib/blogSeo'
import BlogSubject from '@/components/Blog/BlogSubject'

export const dynamicParams = true

export function generateStaticParams() {
  return BLOG_CURRICULUM.flatMap((semester) =>
    semester.subjects.map((subject) => ({
      semesterId: String(semester.semester),
      subjectSlug: subject.slug,
    }))
  )
}

export async function generateMetadata({ params }) {
  const { semesterId, subjectSlug } = await params
  const found = getSubjectBySlug(Number(semesterId), subjectSlug)
  if (!found) return {}

  const { semester, subject } = found
  return buildMetadata({
    title: `${subject.name} Syllabus & Notes - PU Semester ${semester.semester} Computer Engineering`,
    description: buildSubjectDescription(semester, subject),
    canonicalPath: subject.urlPath,
  })
}

export default async function Page({ params }) {
  const { semesterId, subjectSlug } = await params
  const found = getSubjectBySlug(Number(semesterId), subjectSlug)
  if (!found) notFound()

  return <BlogSubject semesterId={semesterId} subjectSlug={subjectSlug} />
}