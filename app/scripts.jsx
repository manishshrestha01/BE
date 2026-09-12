'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const isProd = process.env.NODE_ENV === 'production'

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3679310343847893'

export default function Scripts() {
  useEffect(() => {
    // Load AdSense after hydration. A server-rendered <script> in <head> makes the
    // AdSense loader mutate the head before React hydrates (hydration mismatch), and
    // next/script adds a data-nscript attribute AdSense's loader rejects. Injecting
    // after mount avoids both. The loader only tolerates standard attributes (src,
    // async, crossorigin), so guard against double-injection by src, not a data-* tag.
    const existing = document.querySelector('script[src*="adsbygoogle.js"]')
    if (!existing) {
      const script = document.createElement('script')
      script.async = true
      script.src = ADSENSE_SRC
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }
  }, [])

  return (
    <>
      {isProd && (
        <Script id="prod-console-shield" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var BRAND =
                  '%c Welcome to StudyMate %c\\n' +
                  '\\n' +
                  '%c* Makes sure we do not expose implementation details or internal APIs.*\\n' +
                  '\\n' +
                  'If you are a developer, explore responsibly.\\n';

                function brand() {
                  try {
                    console.warn(
                      BRAND,
                      'background: #111; color: #1db954; font-size: 16px; padding: 6px 10px; border-radius: 6px; font-weight: bold;',
                      '',
                      'color: #888; font-size: 12px;'
                    );
                  } catch (e) {}
                }

                // Clear and neutralise the console so only the branded message shows.
                (function shield() {
                  var noop = function () {};
                  // Reference the real warn/error functions before we flag them,
                  // so a later fatal error can still alert the user.
                  try { console.clear(); } catch (e) {}
                  try {
                    console.log = noop;
                    console.info = noop;
                    console.debug = noop;
                    console.trace = noop;
                    console.warn = noop;
                    console.error = noop;
                  } catch (e) {}
                  brand();
                  setTimeout(brand, 1000);
                })();
              } catch (e) {}
            })();
          `}
        </Script>
      )}
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