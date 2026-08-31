'use client'

import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { GooeyToaster } from 'goey-toast'
import { AuthProvider } from '../src/context/AuthContext'
import { ThemeProvider } from '../src/context/ThemeContext'
import AdSenseRouteRefresh from '../src/AdSenseRouteRefresh'
import RouteAdvertisement from '../src/components/RouteAdvertisement'

function BlockPrintShortcut() {
  useEffect(() => {
    const blockPrintShortcut = (event) => {
      const key = event.key?.toLowerCase?.()
      if ((event.ctrlKey || event.metaKey) && key === 'p') {
        event.preventDefault()
        event.stopPropagation()
        if (typeof event.stopImmediatePropagation === 'function') {
          event.stopImmediatePropagation()
        }
      }
    }

    window.addEventListener('keydown', blockPrintShortcut, true)
    document.addEventListener('keydown', blockPrintShortcut, true)

    return () => {
      window.removeEventListener('keydown', blockPrintShortcut, true)
      document.removeEventListener('keydown', blockPrintShortcut, true)
    }
  }, [])

  return null
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BlockPrintShortcut />
        <AdSenseRouteRefresh />
        {children}
        <RouteAdvertisement />
        <GooeyToaster position="top-right" theme="dark" showTimestamp={false} />
        <Analytics />
      </ThemeProvider>
    </AuthProvider>
  )
}