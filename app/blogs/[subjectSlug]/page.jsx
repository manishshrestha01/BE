import { BLOG_CURRICULUM } from '@/lib/blogCurriculum'
import { buildMetadata } from '@/lib/blogSeo'
import BlogSlugRedirect from '@/components/Blog/BlogSlugRedirect'

export async function generateMetadata({ params }) {
  const { subjectSlug } = await params
  const match = BLOG_CURRICULUM.find((semester) =>
    semester.subjects.some((subject) => subject.slug === subjectSlug)
  )

  if (!match) return {}

  const subject = match.subjects.find((item) => item.slug === subjectSlug)
  return buildMetadata({
    title: `${subject.name} Notes - PU Computer Engineering`,
    description: `Redirecting to the ${subject.name} notes guide for PU BE Computer Engineering semester ${match.semester}.`,
    canonicalPath: `/blogs/${subjectSlug}`,
  })
}

export default async function Page({ params }) {
  const { subjectSlug } = await params
  return <BlogSlugRedirect subjectSlug={subjectSlug} />
}