'use client'

import Script from 'next/script'

export default function Scripts() {
  return (
    <>
      <Script
        id="adsense"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3679310343847893"
        crossOrigin="anonymous"
      />
      <Script
        id="aclib"
        strategy="afterInteractive"
        src="/aclib-anti-adblock.js"
        onReady={() => {
          // Guard against third-party ad libs calling
          // navigator.userAgentData.getHighEntropyValues() on browsers
          // (and some in-app webviews) where userAgentData is undefined.
          if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.userAgentData) {
            try {
              Object.defineProperty(navigator, 'userAgentData', {
                value: {
                  brands: [],
                  mobile: false,
                  platform: navigator.platform || '',
                  getHighEntropyValues: async () => ({ brands: [], mobile: false, platform: navigator.platform || '', version: '' }),
                },
                configurable: true,
              })
            } catch {
              /* ignore shim failure */
            }
          }
          if (typeof window !== 'undefined' && window.aclib?.runAutoTag) {
            window.aclib.runAutoTag({ zoneId: 'sp6bdgcx0c' })
          }
        }}
      />
      <Script
        id="gtag"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-87XJ0JZSRN"
      />
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-87XJ0JZSRN');
        `}
      </Script>
    </>
  )
}