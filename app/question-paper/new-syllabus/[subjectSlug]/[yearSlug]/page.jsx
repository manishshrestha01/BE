import { notFound } from 'next/navigation'
import { getSemesterByNumber, BLOG_BASE_URL } from '@/lib/blogCurriculum'
import { buildMetadata, dynamicOgImage, buildBreadcrumbList, buildCourseSchema } from '@/lib/blogSeo'
import {
  getQuestionPaperSubject,
  getVariantBySlug,
  getVariantSources,
  slugToTerm,
  subjectPaperHref,
  variantHref,
  yearPaperHref,
} from '@/lib/oldQuestionConfig'
import QuestionPaperViewer from '@/components/QuestionPaper/QuestionPaperViewer'

export const dynamicParams = true

const VARIANT_SLUG = 'new-syllabus'

export async function generateMetadata({ params }) {
  const { subjectSlug, yearSlug } = await params
  const found = getQuestionPaperSubject(subjectSlug)
  if (!found) return {}

  const term = slugToTerm(yearSlug)
  const variantMeta = getVariantBySlug(VARIANT_SLUG)
  const subject = found.subject
  const subjectLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name

  return buildMetadata({
    title: term
      ? `${subjectLabel} ${term.label} Question Paper - ${variantMeta.shortLabel} (PU BE Computer Engineering)`
      : `${subjectLabel} Question Paper - ${variantMeta.shortLabel} (PU BE Computer Engineering)`,
    description: term
      ? `Read the ${term.label} ${subject.name} question paper for Pokhara University BE Computer Engineering directly in your browser — free, no login and no download.`
      : `Free ${subject.name} ${variantMeta.shortLabel.toLowerCase()} question papers by exam year — read each paper in your browser, no login and no download.`,
    canonicalPath: yearPaperHref(VARIANT_SLUG, subjectSlug, yearSlug),
    type: 'article',
    image: dynamicOgImage({
      title: term ? `${subject.name} ${term.label} Question Paper` : `${subject.name} Question Papers`,
      subtitle: `${variantMeta.shortLabel} • PU Computer Engineering`,
      badge: subject.courseCode || 'StudyMate',
    }),
  })
}

export default async function Page({ params }) {
  const { subjectSlug, yearSlug } = await params
  const found = getQuestionPaperSubject(subjectSlug)
  if (!found) notFound()

  const term = slugToTerm(yearSlug)
  const variantMeta = getVariantBySlug(VARIANT_SLUG)
  const { semester, subject } = found
  const semesterData = getSemesterByNumber(semester.semester)
  const subjectLabel = subject.courseCode ? `${subject.name} (${subject.courseCode})` : subject.name

  const sources = {
    board: getVariantSources(String(semester.semester), subjectSlug, 'board'),
    old: getVariantSources(String(semester.semester), subjectSlug, 'old'),
  }

  const termPath = yearPaperHref(VARIANT_SLUG, subjectSlug, yearSlug)

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      buildCourseSchema({
        name: term
          ? `${subject.name} ${term.label} Question Paper`
          : `${subject.name} ${variantMeta.shortLabel} Question Papers`,
        courseCode: subject.courseCode,
        semesterNumber: semester.semester,
        url: `${BLOG_BASE_URL}${termPath}`,
        teaches: term
          ? [`${subject.name} ${term.label} question paper for PU Semester ${semester.semester}`]
          : [`${subject.name} question papers for PU Semester ${semester.semester}`],
      }),
      buildBreadcrumbList([
        { name: 'Home', url: `${BLOG_BASE_URL}/` },
        { name: 'Question Papers', url: `${BLOG_BASE_URL}/question-paper` },
        { name: variantMeta.shortLabel, url: `${BLOG_BASE_URL}${variantHref(VARIANT_SLUG)}` },
        { name: subjectLabel, url: `${BLOG_BASE_URL}${subjectPaperHref(VARIANT_SLUG, subjectSlug)}` },
        ...(term ? [{ name: term.label }] : []),
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
        yearSlug={yearSlug}
      />
    </>
  )
}