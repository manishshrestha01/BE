import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin Control Center - StudyMate',
  robots: { index: false, follow: false },
}

export default function Page() {
  redirect('/admin/indexnow')
}