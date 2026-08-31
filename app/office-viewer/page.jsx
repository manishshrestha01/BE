import { Suspense } from 'react'
import OfficeViewer from '@/components/QuickLook/OfficeViewer'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Office Viewer - StudyMate',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense>
      <OfficeViewer />
    </Suspense>
  )
}