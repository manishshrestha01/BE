(function () {
  if (typeof window === 'undefined' || !('fetch' in window)) return;
  if (document.getElementById('root')) return; // SPA already present

  function whenAllSettledOrTimeout(promises, timeoutMs) {
    return Promise.race([
      Promise.all(promises.map(p => p.catch(() => null))),
      new Promise(resolve => setTimeout(resolve, timeoutMs))
    ])
  }

  function bootstrap() {
    // Fetch root index.html to discover the SPA entry script and modulepreloads
    fetch('/', { cache: 'no-store' })
      .then(function (r) { return r.text() })
      .then(function (html) {
        try {
          // Copy any <link rel="modulepreload" href="..."> tags to head
          var preloadRegex = /<link[^>]+rel=["']modulepreload["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
          var match;
          while ((match = preloadRegex.exec(html)) !== null) {
            var href = match[1];
            if (!document.querySelector('link[rel="modulepreload"][href="' + href + '"]')) {
              var l = document.createElement('link');
              l.rel = 'modulepreload';
              l.href = href;
              document.head.appendChild(l);
            }
          }

          // Copy any <link rel="stylesheet" href="..."> tags to head and wait for them to load
          var cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
          var cssMatch;
          var cssPromises = [];
          while ((cssMatch = cssRegex.exec(html)) !== null) {
            var cssHref = cssMatch[1];
            if (!document.querySelector('link[rel="stylesheet"][href="' + cssHref + '"]')) {
              (function(href) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                // resolve on load/error to avoid blocking forever
                var p = new Promise(function(resolve) {
                  link.onload = resolve;
                  link.onerror = resolve;
                });
                cssPromises.push(p);
                document.head.appendChild(link);
              })(cssHref);
            }
          }

          // Find the first <script type="module" src="..."></script>
          var scriptRegex = /<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/i;
          var sMatch = html.match(scriptRegex);
          if (!sMatch || !sMatch[1]) {
            // fallback: redirect to root preserving current path so SPA can handle routing
            var path = location.pathname + location.search + location.hash;
            location.replace('/?r=' + encodeURIComponent(path));
            return;
          }

          var src = sMatch[1];

          // Ensure a root element exists for React to mount
          if (!document.getElementById('root')) {
            var root = document.createElement('div');
            root.id = 'root';
            // Preserve empty/non-visible body; remove any accidental visible HTML
            document.body.innerHTML = '';
            document.body.appendChild(root);
          }

          // Wait briefly for styles to load (or timeout) before loading app script to avoid FOUC
          whenAllSettledOrTimeout(cssPromises, 500).then(function () {
            // Load the SPA entry module
            var s = document.createElement('script');
            s.type = 'module';
            s.src = src;
            s.defer = true;
            s.onerror = function () {
              var path = location.pathname + location.search + location.hash;
              location.replace('/?r=' + encodeURIComponent(path));
            };
            document.body.appendChild(s);
          });
        } catch (err) {
          var path = location.pathname + location.search + location.hash;
          location.replace('/?r=' + encodeURIComponent(path));
        }
      })
      .catch(function () {
        var path = location.pathname + location.search + location.hash;
        location.replace('/?r=' + encodeURIComponent(path));
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
