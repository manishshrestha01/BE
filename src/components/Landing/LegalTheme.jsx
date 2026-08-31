'use client'

import { useEffect } from 'react'

const LegalTheme = () => {
  useEffect(() => {
    document.body.classList.add('legal-theme')
    return () => {
      document.body.classList.remove('legal-theme')
    }
  }, [])

  return null
}

export default LegalTheme