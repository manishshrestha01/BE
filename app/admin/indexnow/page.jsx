import { Suspense } from 'react'
import AuthGuard from '@/components/Admin/AuthGuard'
import IndexNowAdmin from '@/components/Admin/IndexNowAdmin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Control Center - StudyMate',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense>
      <AuthGuard>
        <IndexNowAdmin />
      </AuthGuard>
    </Suspense>
  )
}