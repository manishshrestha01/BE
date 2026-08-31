import Login from '@/components/Login'

export const metadata = {
  title: 'Login - StudyMate | Pokhara University Notes',
  description:
    'Sign in to StudyMate with Google or email to access the Pokhara University BE Computer Engineering notes dashboard.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <Login />
}