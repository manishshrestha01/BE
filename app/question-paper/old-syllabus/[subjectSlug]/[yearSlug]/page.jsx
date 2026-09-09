import { permanentRedirect } from 'next/navigation'
import { yearPaperHref } from '@/lib/oldQuestionConfig'

export const dynamicParams = true

export default async function Page({ params }) {
  const { subjectSlug, yearSlug } = await params
  permanentRedirect(yearPaperHref('old-syllabus', subjectSlug, yearSlug))
}