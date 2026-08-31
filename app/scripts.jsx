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
        id="ua-data-shim"
        strategy="beforeInteractive"
      >
        {`
          (function () {
            try {
              if (typeof navigator !== 'undefined' && !('userAgentData' in navigator)) {
                Object.defineProperty(navigator, 'userAgentData', {
                  configurable: true,
                  value: {
                    brands: [],
                    mobile: false,
                    platform: (navigator.platform || ''),
                    getHighEntropyValues: function () {
                      return Promise.resolve({
                        architecture: '',
                        bitness: '',
                        model: '',
                        platformVersion: '',
                        uaFullVersion: '',
                        fullVersionList: [],
                        platform: (navigator.platform || ''),
                      });
                    },
                    getBrands: function () { return []; },
                  },
                });
              }
            } catch (e) {}
          })();
        `}
      </Script>
      <Script
        id="aclib"
        strategy="afterInteractive"
        src="/aclib-anti-adblock.js"
        onReady={() => {
          try {
            if (typeof window !== 'undefined' && window.aclib?.runAutoTag) {
              window.aclib.runAutoTag({ zoneId: 'sp6bdgcx0c' })
            }
          } catch (err) {
            // Third-party ad libs (Adcash/aclib) can throw on some browsers
            // (e.g. navigator.userAgentData.getHighEntropyValues is missing).
            // Never let an ad-network runtime error crash the page.
            if (typeof console !== 'undefined' && typeof console.error === 'function') {
              console.error('[aclib] runAutoTag failed:', err)
            }
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