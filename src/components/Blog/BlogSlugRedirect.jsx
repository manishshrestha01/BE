import { Navigate, useParams } from "react-router-dom";
import { BLOG_CURRICULUM } from "../../lib/blogCurriculum";
import NotFound from "../Landing/NotFound";

const BlogSlugRedirect = () => {
  const { subjectSlug } = useParams();

  const match = BLOG_CURRICULUM.find((semester) =>
    semester.subjects.some((subject) => subject.slug === subjectSlug),
  );

  if (!match) {
    return <NotFound />;
  }

  return <Navigate to={`/blogs/semester/${match.semester}/${subjectSlug}`} replace />;
};

export default BlogSlugRedirect;
