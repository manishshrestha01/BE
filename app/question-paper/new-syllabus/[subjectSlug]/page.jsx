import { permanentRedirect } from 'next/navigation'
import { subjectPaperHref } from '@/lib/oldQuestionConfig'

export const dynamicParams = true

export default async function Page({ params }) {
  const { subjectSlug } = await params
  permanentRedirect(subjectPaperHref('new-syllabus', subjectSlug))
}