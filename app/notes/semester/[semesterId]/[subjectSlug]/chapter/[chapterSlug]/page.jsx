import { notFound } from 'next/navigation'
import {
  BLOG_BASE_URL,
  getSubjectBySlug,
  scopeHref,
} from '@/lib/blogCurriculum'
import { getChapterBySlug, getSubjectChapters, getAllChapterPaths, buildSubjectKeywords } from '@/lib/subjectChapters'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import BlogChapter from '@/components/Blog/BlogChapter'

export const dynamicParams = true

export function generateStaticParams() {
  return getAllChapterPaths()
}

export async function generateMetadata({ params }) {
  const { semesterId, subjectSlug, chapterSlug } = await params
  const found = getSubjectBySlug(Number(semesterId), subjectSlug)
  if (!found) return {}

  const { semester, subject } = found
  const chapter = getChapterBySlug(semesterId, subjectSlug, chapterSlug, 'notes')
  if (!chapter) return {}

  const topicPreview = chapter.bullets.slice(0, 3).join(', ')
  const courseLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name
  // Software Engineering unit titles already carry "Chapter N:" — avoid duplicating the prefix.
  const hasChapterPrefix = /^(chapter|unit)\s+(\d+|[ivxlcdm]+)\s*[:.-]/i.test(chapter.title)
  const titleLabel = hasChapterPrefix ? chapter.title : `Ch ${chapter.number}: ${chapter.title}`
  const description = `${courseLabel} ${chapter.title}: PU ${semester.semester} ${subject.name} notes. Syllabus topics: ${topicPreview}. Read the full chapter notes right here on StudyMate.`

  return buildMetadata({
    title: `${subject.name}${subject.courseCode ? ` (${subject.courseCode})` : ''} ${titleLabel} — PU Sem ${semester.semester}`,
    description,
    keywords: buildSubjectKeywords(String(semester.semester), subject.slug, subject),
    canonicalPath: chapter.urlPath,
    type: 'article',
    image: dynamicOgImage({
      title: `${subject.name} Ch ${chapter.number}: ${chapter.title}`,
      subtitle: `PU Semester ${semester.semester} Computer Engineering`,
      badge: subject.courseCode || 'StudyNotes',
    }),
  })
}

export default async function Page({ params }) {
  const { semesterId, subjectSlug, chapterSlug } = await params
  const found = getSubjectBySlug(Number(semesterId), subjectSlug)
  if (!found) notFound()
  const { semester, subject } = found

  const chapter = getChapterBySlug(semesterId, subjectSlug, chapterSlug, 'notes')
  if (!chapter) notFound()

  const allChapters = getSubjectChapters(semesterId, subjectSlug, 'notes')
  const chapterIndex = allChapters.findIndex((item) => item.slug === chapterSlug)
  const previousChapter = chapterIndex > 0 ? allChapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex >= 0 && chapterIndex < allChapters.length - 1
    ? allChapters[chapterIndex + 1]
    : null

  const subjectLabel = subject.courseCode
    ? `${subject.name} (${subject.courseCode})`
    : subject.name

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      buildCourseSchema({
        name: subject.name,
        courseCode: subject.courseCode,
        semesterNumber: semester.semester,
        url: `${BLOG_BASE_URL}${chapter.urlPath}`,
        teaches: chapter.bullets,
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Notes', url: `${BLOG_BASE_URL}/notes` },
        {
          name: `Semester ${semester.semester}`,
          url: `${BLOG_BASE_URL}${scopeHref('notes', semester.semester)}`,
        },
        { name: subjectLabel, url: `${BLOG_BASE_URL}${scopeHref('notes', semester.semester, subject.slug)}` },
        { name: `Chapter ${chapter.number}: ${chapter.title}` },
      ]),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <BlogChapter
        semesterId={semesterId}
        subjectSlug={subjectSlug}
        chapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        scope="notes"
      />
    </>
  )
}