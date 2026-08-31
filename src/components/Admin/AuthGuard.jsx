'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isAuthRequired, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (isAuthRequired && !isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname || '')}`)
    }
  }, [loading, isAuthRequired, isAuthenticated, pathname, router])

  if (loading) return null
  if (isAuthRequired && !isAuthenticated) return null

  return children
}

export default AuthGuard