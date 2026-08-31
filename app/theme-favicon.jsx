'use client'

import { useEffect } from 'react'

export default function ThemeFavicon() {
  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const favicon =
      document.querySelector('link[rel="icon"][id="dynamic-favicon"]') ||
      document.querySelector('link[rel="icon"]')

    const apply = (matches) => {
      if (!favicon) return
      favicon.href = matches ? '/white.svg' : '/black.svg'
    }

    apply(darkQuery.matches)
    const listener = (event) => apply(event.matches)
    darkQuery.addEventListener('change', listener)

    return () => darkQuery.removeEventListener('change', listener)
  }, [])

  return null
}