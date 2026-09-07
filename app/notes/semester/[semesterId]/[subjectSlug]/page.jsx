import { notFound } from 'next/navigation'
import {
  BLOG_CURRICULUM,
  BLOG_BASE_URL,
  buildSubjectDescription,
  getSubjectBySlug,
  scopeHref,
} from '@/lib/blogCurriculum'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import { buildSubjectKeywords, getSubjectChapters } from '@/lib/subjectChapters'
import NotesSubject from '@/components/Blog/NotesSubject'

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
    title: `${subject.name}${subject.courseCode ? ` (${subject.courseCode})` : ''} Notes - PU Semester ${semester.semester} Computer Engineering`,
    description: buildSubjectDescription(semester, subject),
    keywords: buildSubjectKeywords(String(semester.semester), subject.slug, subject),
    canonicalPath: scopeHref('notes', semester.semester, subject.slug),
    type: 'article',
    image: dynamicOgImage({
      title: `${subject.name} Notes`,
      subtitle: `PU Semester ${semester.semester} Computer Engineering`,
      badge: subject.courseCode || 'StudyNotes',
    }),
  })
}

export default async function Page({ params }) {
  const { semesterId, subjectSlug } = await params
  const found = getSubjectBySlug(Number(semesterId), subjectSlug)
  if (!found) notFound()

  const { semester, subject } = found
  const subjectLabel = subject.courseCode
    ? `${subject.name} (${subject.courseCode})`
    : subject.name
  const notesPath = scopeHref('notes', semester.semester, subject.slug)
  const chapters = getSubjectChapters(semesterId, subjectSlug, 'notes')

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      buildCourseSchema({
        name: subject.name,
        courseCode: subject.courseCode,
        semesterNumber: semester.semester,
        url: `${BLOG_BASE_URL}${notesPath}`,
        teaches: chapters.flatMap((chapter) => chapter.bullets),
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Notes', url: `${BLOG_BASE_URL}/notes` },
        {
          name: `Semester ${semester.semester}`,
          url: `${BLOG_BASE_URL}${scopeHref('notes', semester.semester)}`,
        },
        { name: subjectLabel },
      ]),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <NotesSubject semesterData={semester} subjectData={subject} chapters={chapters} />
    </>
  )
}