import { Suspense } from 'react'
import DashboardManual from '@/components/DashboardManual/DashboardManual'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'StudyMate Dashboard - Pokhara University Computer Engineering Notes',
  description:
    'Access PU notes for BE Computer Engineering. Download Pokhara University notes for Compiler Design, C Programming, DBMS, DSA, OS.',
}

export default function Page() {
  return (
    <Suspense>
      <DashboardManual />
    </Suspense>
  )
}