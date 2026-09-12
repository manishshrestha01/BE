import { notFound } from 'next/navigation'
import {
  BLOG_BASE_URL,
  BLOG_LAST_UPDATED,
  getSubjectBySlug,
} from '@/lib/blogCurriculum'
import { getChapterBySlug, getSubjectChapters, getAllChapterPaths, buildSubjectKeywords } from '@/lib/subjectChapters'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import { getSubjectArticle } from '@/data/subjectArticles'
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
  const courseLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name
  const description = `${courseLabel} Chapter ${chapter.number} — ${chapter.title}: PU ${semester.semester} ${subject.name} notes. Syllabus topics: ${topicPreview}. ` +
    `Study ${chapter.title} inside the StudyMate dashboard with notes and past papers.`

  return buildMetadata({
    title: `${subject.name}${subject.courseCode ? ` (${subject.courseCode})` : ''} ${/^(chapter|unit)\s+(\d+|[ivxlcdm]+)\s*[:.-]/i.test(chapter.title) ? chapter.title : `Ch ${chapter.number}: ${chapter.title}`} — PU Sem ${semester.semester}`,
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

  const chapter = getChapterBySlug(semesterId, subjectSlug, chapterSlug)
  if (!chapter) notFound()

  const allChapters = getSubjectChapters(semesterId, subjectSlug)
  const chapterIndex = allChapters.findIndex((item) => item.slug === chapterSlug)
  const previousChapter = chapterIndex > 0 ? allChapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex >= 0 && chapterIndex < allChapters.length - 1
    ? allChapters[chapterIndex + 1]
    : null

  const subjectLabel = subject.courseCode
    ? `${subject.name} (${subject.courseCode})`
    : subject.name

  const article = getSubjectArticle(semester.semester, subject.slug)
  const chapterPath = `${BLOG_BASE_URL}${chapter.urlPath}`
  const topicItems = (chapter.bullets || []).map((text, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: text,
  }))

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${subject.name} Chapter ${chapter.number}: ${chapter.title} Notes`,
        description: chapter.description,
        image: `${BLOG_BASE_URL}/logo-512.png`,
        author: { '@id': `${BLOG_BASE_URL}/#author` },
        publisher: { '@id': `${BLOG_BASE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': chapterPath },
        datePublished: article?.updatedAt || BLOG_LAST_UPDATED,
        dateModified: article?.updatedAt || BLOG_LAST_UPDATED,
        inLanguage: 'en-US',
      },
      {
        '@type': 'ItemList',
        name: `${subject.name} Chapter ${chapter.number} topics`,
        itemListElement: topicItems,
      },
      buildCourseSchema({
        name: subject.name,
        courseCode: subject.courseCode,
        semesterNumber: semester.semester,
        url: chapterPath,
        teaches: chapter.bullets,
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Study Materials', url: `${BLOG_BASE_URL}/blog` },
        { name: `Semester ${semester.semester}`, url: `${BLOG_BASE_URL}${semester.urlPath}` },
        { name: subjectLabel, url: `${BLOG_BASE_URL}${subject.urlPath}` },
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
      />
    </>
  )
}