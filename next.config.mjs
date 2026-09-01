/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'manishshrestha012.com.np' }],
        destination: 'https://www.manishshrestha012.com.np/:path*',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      {
        // /api/notes-index -> /api/notes?resource=index
        source: '/api/notes-index/:path*',
        destination: '/api/notes?resource=index',
      },
      {
        // /api/notes-subject -> /api/notes?resource=subject
        source: '/api/notes-subject/:path*',
        destination: '/api/notes?resource=subject',
      },
      {
        // /blogs (alias) -> /blog
        source: '/blogs',
        destination: '/blog',
      },
      {
        // /blogs/semester/... (alias) -> /blog/semester/...
        source: '/blogs/semester/:path*',
        destination: '/blog/semester/:path*',
      },
    ]
  },
}

export default nextConfig