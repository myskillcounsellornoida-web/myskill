import { fetchBlogs } from "@/app/admin/actions";
import BlogClient from "@/components/BlogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights | My Skill Counsellor Noida",
  description: "Read the latest insights, tips, and guides on study abroad opportunities, career counseling, university admissions, and IELTS preparation from My Skill Counsellor.",
  keywords: ["study abroad blog", "career counselling insights", "university admission tips", "IELTS preparation guide", "My Skill Counsellor blog"],
  alternates: {
    canonical: "https://myskillcounsellor.com/blog",
  }
};

export const revalidate = 60;

export default async function BlogPage() {
  const blogsRes = await fetchBlogs();
  const blogsList = blogsRes.success && blogsRes.data ? blogsRes.data : [];

  return <BlogClient blogsList={blogsList} />;
}
