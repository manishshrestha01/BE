(function () {
  if (typeof window === 'undefined' || !('fetch' in window)) return;
  if (document.getElementById('root')) return; // SPA already present

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
            // Preserve empty/non-visible body; replace any placeholder comment
            document.body.innerHTML = '';
            document.body.appendChild(root);
          }

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
