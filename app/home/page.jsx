import { Suspense } from 'react'
import Home from '@/components/Home'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'StudyMate Notes - Pokhara University Computer Engineering',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}