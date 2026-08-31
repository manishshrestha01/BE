import TermsOfService from '@/components/Landing/TermsOfService'

export const metadata = {
  title: 'Terms of Service - StudyMate | PU Computer Engineering Notes',
  description:
    'StudyMate terms of service — the terms governing your use of the Pokhara University BE Computer Engineering notes website.',
  alternates: { canonical: '/terms' },
}

export default function Page() {
  return <TermsOfService />
}