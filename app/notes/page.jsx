import { buildMetadata } from '@/lib/blogSeo'
import BlogHome from '@/components/Blog/BlogHome'

export const metadata = buildMetadata({
  title: 'PU Notes - Pokhara University BE Computer Engineering',
  description:
    'Free Pokhara University BE Computer Engineering notes for every semester and subject. Read chapter notes directly on the page — no downloads, no login needed.',
  canonicalPath: '/notes',
})

export default function Page() {
  return <BlogHome scope="notes" />
}