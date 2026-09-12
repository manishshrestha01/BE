import { notFound } from 'next/navigation'
import {
  BLOG_CURRICULUM,
  BLOG_BASE_URL,
  BLOG_LAST_UPDATED,
  buildSubjectDescription,
  getSubjectBySlug,
  scopeHref,
} from '@/lib/blogCurriculum'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import { buildSubjectKeywords } from '@/lib/subjectChapters'
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
    title: `${subject.name}${subject.courseCode ? ` (${subject.courseCode})` : ''} Syllabus - PU Semester ${semester.semester} Computer Engineering`,
    description: buildSubjectDescription(semester, subject),
    keywords: buildSubjectKeywords(String(semester.semester), subject.slug, subject),
    canonicalPath: scopeHref('syllabus', semester.semester, subject.slug),
    type: 'article',
    image: dynamicOgImage({
      title: `${subject.name} Syllabus`,
      subtitle: `PU Semester ${semester.semester} Computer Engineering`,
      badge: subject.courseCode || 'Syllabus',
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
  const syllabusPath = scopeHref('syllabus', semester.semester, subject.slug)

  const article = getSubjectArticle(semester.semester, subject.slug)
  const articlePath = `${BLOG_BASE_URL}${syllabusPath}`

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${subject.name} Syllabus`,
        description: article?.description || buildSubjectDescription(semester, subject),
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
        teaches: [],
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Syllabus', url: `${BLOG_BASE_URL}/syllabus` },
        {
          name: `Semester ${semester.semester}`,
          url: `${BLOG_BASE_URL}${scopeHref('syllabus', semester.semester)}`,
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
      <BlogSubject semesterId={semesterId} subjectSlug={subjectSlug} scope="syllabus" />
    </>
  )
}