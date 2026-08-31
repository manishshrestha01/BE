import { notFound, permanentRedirect } from "next/navigation";
import { BLOG_CURRICULUM } from "../../lib/blogCurriculum";

const BlogSlugRedirect = ({ subjectSlug }) => {
  const match = BLOG_CURRICULUM.find((semester) =>
    semester.subjects.some((subject) => subject.slug === subjectSlug),
  );

  if (!match) {
    notFound();
  }

  permanentRedirect(`/blog/semester/${match.semester}/${subjectSlug}`);
};

export default BlogSlugRedirect;
