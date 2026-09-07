import { buildMetadata, dynamicOgImage } from '@/lib/blogSeo'
import { variantHref } from '@/lib/oldQuestionConfig'
import VariantHub from '@/components/QuestionPaper/VariantHub'

export const metadata = buildMetadata({
  title: 'PU New Syllabus Question Papers - Board & Final Papers (BE Computer Engineering)',
  description:
    "Free Pokhara University BE Computer Engineering new-syllabus question papers. Board and final papers from the current program for every subject — pick an exam year and read the paper in your browser, no login and no download.",
  canonicalPath: variantHref('new-syllabus'),
  type: 'article',
  image: dynamicOgImage({
    title: 'PU New Syllabus Question Papers',
    subtitle: 'Board & Final Papers • Computer Engineering',
    badge: 'StudyMate',
  }),
})

export default function Page() {
  return <VariantHub variant="new-syllabus" />
}