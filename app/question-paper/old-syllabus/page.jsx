import { buildMetadata, dynamicOgImage } from '@/lib/blogSeo'
import { variantHref } from '@/lib/oldQuestionConfig'
import VariantHub from '@/components/QuestionPaper/VariantHub'

export const metadata = buildMetadata({
  title: 'PU Old Syllabus Question Papers - Previous Course Archive (BE Computer Engineering)',
  description:
    "Free Pokhara University BE Computer Engineering old-syllabus question papers. The previous course's question archive for every subject — pick an exam year and read the paper in your browser, no login and no download.",
  canonicalPath: variantHref('old-syllabus'),
  type: 'article',
  image: dynamicOgImage({
    title: 'PU Old Syllabus Question Papers',
    subtitle: 'Previous Course Archive • Computer Engineering',
    badge: 'StudyMate',
  }),
})

export default function Page() {
  return <VariantHub variant="old-syllabus" />
}