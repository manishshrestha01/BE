import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const forceScrollTop = () => {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    forceScrollTop()

    const frame = window.requestAnimationFrame(() => {
      forceScrollTop()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, search])

  return null
}

export default ScrollToTop
