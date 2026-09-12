import { notFound } from 'next/navigation'
import {
  BLOG_CURRICULUM,
  BLOG_BASE_URL,
  BLOG_LAST_UPDATED,
  buildSubjectDescription,
  getSubjectBySlug,
} from '@/lib/blogCurriculum'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import { buildSubjectKeywords, getSubjectChapters } from '@/lib/subjectChapters'
import { getSubjectArticle } from '@/data/subjectArticles'
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
    title: `${subject.name}${subject.courseCode ? ` (${subject.courseCode})` : ''} Syllabus & Notes - PU Semester ${semester.semester} Computer Engineering`,
    description: buildSubjectDescription(semester, subject),
    keywords: buildSubjectKeywords(String(semester.semester), subject.slug, subject),
    canonicalPath: subject.urlPath,
    type: 'article',
    image: dynamicOgImage({
      title: `${subject.name} Notes`,
      subtitle: `PU Semester ${semester.semester} Computer Engineering`,
      badge: `Course ${subject.courseCode || 'Syllabus'}`,
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

  const article = getSubjectArticle(semester.semester, subject.slug)
  const articleTitle = article?.title || subject.name
  const articleDescription =
    article?.description || buildSubjectDescription(semester, subject)
  const articlePath = `${BLOG_BASE_URL}${subject.urlPath}`

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: articleTitle,
        description: articleDescription,
        image: `${BLOG_BASE_URL}/logo-512.png`,
        author: { '@id': `${BLOG_BASE_URL}/#author` },
        publisher: { '@id': `${BLOG_BASE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': articlePath },
        datePublished: article?.updatedAt || BLOG_LAST_UPDATED,
        dateModified: article?.updatedAt || BLOG_LAST_UPDATED,
        inLanguage: 'en-US',
      },
      buildCourseSchema({
        name: subject.name,
        courseCode: subject.courseCode,
        semesterNumber: semester.semester,
        url: articlePath,
        teaches: getSubjectChapters(semesterId, subjectSlug).flatMap(
          (chapter) => chapter.bullets
        ),
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Study Materials', url: `${BLOG_BASE_URL}/blog` },
        { name: `Semester ${semester.semester}`, url: `${BLOG_BASE_URL}${semester.urlPath}` },
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
      <BlogSubject semesterId={semesterId} subjectSlug={subjectSlug} />
    </>
  )
}