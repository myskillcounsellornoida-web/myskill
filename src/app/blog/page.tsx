import { fetchBlogs } from "@/app/admin/actions";
import BlogClient from "@/components/BlogClient";

export const revalidate = 60;

export default async function BlogPage() {
  const blogsRes = await fetchBlogs();
  const blogsList = blogsRes.success && blogsRes.data ? blogsRes.data : [];

  return <BlogClient blogsList={blogsList} />;
}
