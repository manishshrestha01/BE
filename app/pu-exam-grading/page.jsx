import PuExamGrading from './PuExamGrading'

export const dynamicParams = false

const SITE_URL = 'https://www.manishshrestha012.com.np'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'PU Exam Grading & Marking System — Pokhara University Letter Grades | StudyMate',
  description:
    'PU exam grading and marking system explained: 4-point letter grades (A, A-, B+, B, C, D, F), marking scheme (50-50 internal/external), pass marks (45%), CGPA & SGPA, retakes, distinction and Dean\u2019s list rules.',
  alternates: { canonical: '/pu-exam-grading' },
  keywords: [
    'PU exam grading and marking', 'PU grading scheme', 'PU marking system',
    'Pokhara University grading system', 'PU exam grading', 'PU marking scheme',
    'PU letter grade', 'PU CGPA', 'PU SGPA', 'Pokhara University pass marks',
    'PU internal exam marks', 'PU external exam', 'PU distinction',
  ],
  openGraph: {
    type: 'article',
    url: `${SITE_URL}/pu-exam-grading`,
    siteName: 'StudyMate',
    title: 'PU Exam Grading & Marking System — Pokhara University Letter Grades',
    description:
      'How Pokhara University grades and marks PU exams: letter grades and honour points, 50-50 internal/external marking scheme, pass marks, SGPA/CGPA, retakes, distinction and Dean\u2019s list.',
    images: [{ url: `${SITE_URL}/logo-512.png`, alt: 'PU Exam Grading & Marking System — StudyMate' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PU Exam Grading & Marking System — Pokhara University Letter Grades',
    description:
      'PU grading and marking: 4-point letter grades (A to F), 50-50 internal/external marking scheme, 45% pass marks, SGPA/CGPA, retakes, distinction & Dean\u2019s list.',
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <PuExamGrading />
}