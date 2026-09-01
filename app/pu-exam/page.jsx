import PuExam from './PuExam'

export const dynamicParams = false

const SITE_URL = 'https://www.manishshrestha012.com.np'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'PU Exam Guide — Pokhara University BE Computer Engineering | StudyMate',
  description:
    'PU exam guide for Pokhara University BE Computer Engineering: exam routine, format, grading, back papers, and free subject-wise notes & tips for all 8 semesters.',
  alternates: { canonical: '/pu-exam' },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}/pu-exam`,
    siteName: 'StudyMate',
    title: 'PU Exam Guide — Pokhara University BE Computer Engineering',
    description:
      'How the Pokhara University (PU) end-semester exam works, grading, back papers, and free revision notes for every semester.',
    images: [{ url: `${SITE_URL}/logo-512.png`, alt: 'PU Exam Guide — StudyMate' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PU Exam Guide — Pokhara University BE Computer Engineering',
    description:
      'PU exam routine, format, grading, back papers, and free revision notes for all 8 semesters.',
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <PuExam />
}
