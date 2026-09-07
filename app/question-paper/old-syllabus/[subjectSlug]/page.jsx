import { notFound } from 'next/navigation'
import { getSemesterByNumber, BLOG_BASE_URL } from '@/lib/blogCurriculum'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import {
  getAllQuestionPaperSubjectPaths,
  getQuestionPaperSubject,
  getVariantBySlug,
  getVariantSources,
  subjectPaperHref,
  variantHref,
} from '@/lib/oldQuestionConfig'
import QuestionPaperViewer from '@/components/QuestionPaper/QuestionPaperViewer'

export const dynamicParams = true

const VARIANT_SLUG = 'old-syllabus'

export function generateStaticParams() {
  return getAllQuestionPaperSubjectPaths().filter((path) => path.variant === VARIANT_SLUG)
}

export async function generateMetadata({ params }) {
  const { subjectSlug } = await params
  const found = getQuestionPaperSubject(subjectSlug)
  if (!found) return {}

  const variantMeta = getVariantBySlug(VARIANT_SLUG)
  const subject = found.subject
  const subjectLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name

  return buildMetadata({
    title: `${subjectLabel} Question Papers - ${variantMeta.shortLabel} (PU BE Computer Engineering)`,
    description: `Free ${subject.name} old-syllabus question papers for Pokhara University BE Computer Engineering. The previous course's archive by exam year — read each paper in your browser, no login and no download.`,
    canonicalPath: subjectPaperHref(VARIANT_SLUG, subjectSlug),
    type: 'article',
    image: dynamicOgImage({
      title: `${subject.name} Question Papers`,
      subtitle: `${variantMeta.shortLabel} • PU Computer Engineering`,
      badge: subject.courseCode || 'StudyMate',
    }),
  })
}

export default async function Page({ params }) {
  const { subjectSlug } = await params
  const found = getQuestionPaperSubject(subjectSlug)
  if (!found) notFound()

  const variantMeta = getVariantBySlug(VARIANT_SLUG)
  const { semester, subject } = found
  const semesterData = getSemesterByNumber(semester.semester)
  const subjectLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name

  const sources = {
    board: getVariantSources(String(semester.semester), subjectSlug, 'board'),
    old: getVariantSources(String(semester.semester), subjectSlug, 'old'),
  }

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      buildCourseSchema({
        name: `${subject.name} ${variantMeta.shortLabel} Question Papers`,
        courseCode: subject.courseCode,
        semesterNumber: semester.semester,
        url: `${BLOG_BASE_URL}${subjectPaperHref(VARIANT_SLUG, subjectSlug)}`,
        teaches: [`${subject.name} question papers for PU Semester ${semester.semester}`],
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Question Papers', url: `${BLOG_BASE_URL}/question-paper` },
        { name: variantMeta.shortLabel, url: `${BLOG_BASE_URL}${variantHref(VARIANT_SLUG)}` },
        { name: subjectLabel },
      ]),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />
      <QuestionPaperViewer
        semesterData={semesterData}
        subject={subject}
        variant={VARIANT_SLUG}
        sources={sources}
      />
    </>
  )
}