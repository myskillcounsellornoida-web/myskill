import { db } from "@/db";
import { blogs as blogsTable } from "@/db/schema";
import BlogClient from "@/components/BlogClient";

export const revalidate = 60;



export default async function BlogPage() {
  let dbBlogs: any[] = [];
  try {
    if (process.env.DATABASE_URL) {
      dbBlogs = await db.select().from(blogsTable);
    }
  } catch (error) {
    console.error("Failed to fetch blogs from database:", error);
  }

  const blogsList = dbBlogs;

  return <BlogClient blogsList={blogsList} />;
}
