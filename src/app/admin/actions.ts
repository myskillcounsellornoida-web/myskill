"use server";

import { db } from "@/db";
import { inquiries, testimonials, services, blogs, siteContent } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper check to see if database connection is available
async function runSafe<T>(cb: () => Promise<T>, fallbackValue: T): Promise<{ success: boolean; data: T; error?: string }> {
  if (!process.env.DATABASE_URL) {
    return { success: false, data: fallbackValue, error: "DATABASE_URL is not configured in environment variables." };
  }
  try {
    const res = await cb();
    return { success: true, data: res };
  } catch (e: any) {
    console.error("Database operation error:", e);
    return { success: false, data: fallbackValue, error: e.message || "Failed to execute database operation." };
  }
}

/* ==========================================
   INQUIRIES ACTIONS
   ========================================== */

export async function fetchInquiries() {
  return runSafe(async () => {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }, []);
}

export async function toggleInquiryContacted(id: number, isContacted: boolean) {
  const res = await runSafe(async () => {
    return await db.update(inquiries)
      .set({ isContacted })
      .where(eq(inquiries.id, id))
      .returning();
  }, null);
  
  revalidatePath("/admin");
  return res;
}

export async function deleteInquiry(id: number) {
  const res = await runSafe(async () => {
    return await db.delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  return res;
}

/* ==========================================
   TESTIMONIALS ACTIONS
   ========================================== */

export async function fetchTestimonials() {
  return runSafe(async () => {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }, []);
}

export async function createTestimonial(name: string, role: string, text: string) {
  const res = await runSafe(async () => {
    return await db.insert(testimonials)
      .values({ name, role, text })
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/testimonials");
  return res;
}

export async function updateTestimonial(id: number, name: string, role: string, text: string) {
  const res = await runSafe(async () => {
    return await db.update(testimonials)
      .set({ name, role, text })
      .where(eq(testimonials.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/testimonials");
  return res;
}

export async function deleteTestimonial(id: number) {
  const res = await runSafe(async () => {
    return await db.delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/testimonials");
  return res;
}

/* ==========================================
   SERVICES ACTIONS
   ========================================== */

export async function fetchServices() {
  return runSafe(async () => {
    return await db.select().from(services).orderBy(desc(services.createdAt));
  }, []);
}

export async function createService(title: string, description: string, icon: string) {
  const res = await runSafe(async () => {
    return await db.insert(services)
      .values({ title, description, icon })
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/services");
  return res;
}

export async function updateService(id: number, title: string, description: string, icon: string) {
  const res = await runSafe(async () => {
    return await db.update(services)
      .set({ title, description, icon })
      .where(eq(services.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/services");
  return res;
}

export async function deleteService(id: number) {
  const res = await runSafe(async () => {
    return await db.delete(services)
      .where(eq(services.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/services");
  return res;
}

/* ==========================================
   BLOGS ACTIONS
   ========================================== */

export async function fetchBlogs() {
  return runSafe(async () => {
    return await db.select().from(blogs).orderBy(desc(blogs.createdAt));
  }, []);
}

export async function createBlog(title: string, slug: string, content: string, image: string, tag: string, readTime: string) {
  const res = await runSafe(async () => {
    return await db.insert(blogs)
      .values({ title, slug, content, image, tag, readTime })
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/blog");
  return res;
}

export async function updateBlog(id: number, title: string, slug: string, content: string, image: string, tag: string, readTime: string) {
  const res = await runSafe(async () => {
    return await db.update(blogs)
      .set({ title, slug, content, image, tag, readTime })
      .where(eq(blogs.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/blog");
  return res;
}

export async function deleteBlog(id: number) {
  const res = await runSafe(async () => {
    return await db.delete(blogs)
      .where(eq(blogs.id, id))
      .returning();
  }, null);

  revalidatePath("/admin");
  revalidatePath("/blog");
  return res;
}

/* ==========================================
   SITE CONTENT / CMS ACTIONS
   ========================================== */

export async function fetchSiteContent() {
  return runSafe(async () => {
    return await db.select().from(siteContent);
  }, []);
}

export async function updateSiteContent(key: string, value: string) {
  const res = await runSafe(async () => {
    // Check if the key exists, if so update it, else insert it
    const existing = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
    if (existing.length > 0) {
      return await db.update(siteContent)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();
    } else {
      return await db.insert(siteContent)
        .values({ key, value })
        .returning();
    }
  }, null);

  revalidatePath("/admin");
  revalidatePath("/");
  return res;
}
