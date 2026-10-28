import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogDetailsOne from "../../Components/BlogDetailsOne/BlogDetailsOne";
import BlogDetailsTwo from "../../Components/BlogDetailsTwo/BlogDetailsTwo";
import BlogDetailsThree from "../../Components/BlogDetailsThree/BlogDetailsThree";
import { BLOGS_API_URL } from "../../config/api";

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${BLOGS_API_URL}/${slug}?incrementViews=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blog) {
          setBlog(data.blog);
        }
      })
      .catch((err) => console.error("Error fetching blog details:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      <BlogDetailsOne blog={blog} loading={loading} />
      <BlogDetailsTwo blog={blog} loading={loading} />
      <BlogDetailsThree blog={blog} />
    </div>
  );
};

export default BlogDetails;
