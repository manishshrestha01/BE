import { notFound } from 'next/navigation'
import {
  getSubjectBySlug,
} from '@/lib/blogCurriculum'
import { getChapterBySlug, getSubjectChapters, getAllChapterPaths } from '@/lib/subjectChapters'
import { buildMetadata, dynamicOgImage } from '@/lib/blogSeo'
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
  const chapter = getChapterBySlug(semesterId, subjectSlug, chapterSlug)
  if (!chapter) return {}

  const topicPreview = chapter.bullets.slice(0, 3).join(', ')
  const description = `${subject.name} Chapter ${chapter.number} — ${chapter.title}: PU ${semester.semester} ${subject.name} notes. Syllabus topics: ${topicPreview}. ` +
    `Study ${chapter.title} inside the StudyMate dashboard with notes and past papers.`

  return buildMetadata({
    title: `${subject.name} Chapter ${chapter.number}: ${chapter.title} Notes - PU Semester ${semester.semester} Computer Engineering`,
    description,
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

  const chapter = getChapterBySlug(semesterId, subjectSlug, chapterSlug)
  if (!chapter) notFound()

  const allChapters = getSubjectChapters(semesterId, subjectSlug)
  const chapterIndex = allChapters.findIndex((item) => item.slug === chapterSlug)
  const previousChapter = chapterIndex > 0 ? allChapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex >= 0 && chapterIndex < allChapters.length - 1
    ? allChapters[chapterIndex + 1]
    : null

  return (
    <BlogChapter
      semesterId={semesterId}
      subjectSlug={subjectSlug}
      chapter={chapter}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
    />
  )
}