import { buildMetadata, dynamicOgImage } from '@/lib/blogSeo'
import QuestionPaperHome from '@/components/QuestionPaper/QuestionPaperHome'

export const metadata = buildMetadata({
  title: 'PU Question Papers - Board & Old Papers by Exam Year (BE Computer Engineering)',
  description:
    'Free Pokhara University BE Computer Engineering question papers organised by exam year. New-syllabus board & final papers and the old-syllabus archive for every subject — read each paper in your browser, no login and no download.',
  canonicalPath: '/question-paper',
  type: 'article',
  image: dynamicOgImage({
    title: 'PU Question Papers',
    subtitle: 'New & Old Syllabus • Computer Engineering',
    badge: 'StudyMate',
  }),
})

export default function Page() {
  return <QuestionPaperHome />
}