"use server";

import { db } from "@/db";
import { inquiries, testimonials, services, blogs, siteContent } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getLocalData, saveLocalData } from "@/db/localStore";

export type ActionResult<T = any> = { success: boolean; data: T; error?: string };

/* ==========================================
   INQUIRIES ACTIONS
   ========================================== */

export async function fetchInquiries(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchInquiries:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.inquiries };
}

export async function toggleInquiryContacted(id: number, isContacted: boolean): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(inquiries)
        .set({ isContacted })
        .where(eq(inquiries.id, id))
        .returning();
      revalidatePath("/admin");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error toggleInquiryContacted:", e);
      return { success: false, data: null, error: e.message };
    }
  }
  
  const local = getLocalData();
  local.inquiries = local.inquiries.map(inq => inq.id === id ? { ...inq, isContacted } : inq);
  saveLocalData(local);
  revalidatePath("/admin");
  return { success: true, data: local.inquiries };
}

export async function deleteInquiry(id: number): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(inquiries)
        .where(eq(inquiries.id, id))
        .returning();
      revalidatePath("/admin");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error deleteInquiry:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.inquiries = local.inquiries.filter(inq => inq.id !== id);
  saveLocalData(local);
  revalidatePath("/admin");
  return { success: true, data: local.inquiries };
}

/* ==========================================
   TESTIMONIALS ACTIONS
   ========================================== */

export async function fetchTestimonials(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchTestimonials:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.testimonials };
}

export async function createTestimonial(name: string, role: string, text: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.insert(testimonials)
        .values({ name, role, text })
        .returning();
      revalidatePath("/admin");
      revalidatePath("/testimonials");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error createTestimonial:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  const newT = { id: Date.now(), name, role, text, createdAt: new Date().toISOString() };
  local.testimonials = [newT, ...local.testimonials];
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/testimonials");
  revalidatePath("/", "layout");
  return { success: true, data: newT };
}

export async function updateTestimonial(id: number, name: string, role: string, text: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(testimonials)
        .set({ name, role, text })
        .where(eq(testimonials.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/testimonials");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error updateTestimonial:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.testimonials = local.testimonials.map(t => t.id === id ? { ...t, name, role, text } : t);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/testimonials");
  revalidatePath("/", "layout");
  return { success: true, data: local.testimonials };
}

export async function deleteTestimonial(id: number): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(testimonials)
        .where(eq(testimonials.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/testimonials");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error deleteTestimonial:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.testimonials = local.testimonials.filter(t => t.id !== id);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/testimonials");
  revalidatePath("/", "layout");
  return { success: true, data: local.testimonials };
}

/* ==========================================
   SERVICES ACTIONS
   ========================================== */

export async function fetchServices(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(services).orderBy(desc(services.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchServices:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.services };
}

export async function createService(title: string, description: string, icon: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.insert(services)
        .values({ title, description, icon })
        .returning();
      revalidatePath("/admin");
      revalidatePath("/services");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error createService:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  const newS = { id: Date.now(), title, description, icon, createdAt: new Date().toISOString() };
  local.services = [newS, ...local.services];
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return { success: true, data: newS };
}

export async function updateService(id: number, title: string, description: string, icon: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(services)
        .set({ title, description, icon })
        .where(eq(services.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/services");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error updateService:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.services = local.services.map(s => s.id === id ? { ...s, title, description, icon } : s);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return { success: true, data: local.services };
}

export async function deleteService(id: number): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(services)
        .where(eq(services.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/services");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error deleteService:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.services = local.services.filter(s => s.id !== id);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return { success: true, data: local.services };
}

/* ==========================================
   BLOGS ACTIONS
   ========================================== */

export async function fetchBlogs(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchBlogs:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.blogs };
}

export async function createBlog(title: string, slug: string, content: string, image: string, tag: string, readTime: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.insert(blogs)
        .values({ title, slug, content, image, tag, readTime })
        .returning();
      revalidatePath("/admin");
      revalidatePath("/blog");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error createBlog:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  const newB = { id: Date.now(), title, slug, content, image, tag, readTime, createdAt: new Date().toISOString() };
  local.blogs = [newB, ...local.blogs];
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/", "layout");
  return { success: true, data: newB };
}

export async function updateBlog(id: number, title: string, slug: string, content: string, image: string, tag: string, readTime: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(blogs)
        .set({ title, slug, content, image, tag, readTime })
        .where(eq(blogs.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/blog");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error updateBlog:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.blogs = local.blogs.map(b => b.id === id ? { ...b, title, slug, content, image, tag, readTime } : b);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/", "layout");
  return { success: true, data: local.blogs };
}

export async function deleteBlog(id: number): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(blogs)
        .where(eq(blogs.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/blog");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error deleteBlog:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.blogs = local.blogs.filter(b => b.id !== id);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/", "layout");
  return { success: true, data: local.blogs };
}

/* ==========================================
   SITE CONTENT / CMS ACTIONS
   ========================================== */

export async function fetchSiteContent(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(siteContent);
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchSiteContent:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  const list = Object.entries(local.siteContent).map(([key, value]) => ({ key, value, updatedAt: new Date() }));
  return { success: true, data: list };
}

export async function updateSiteContent(key: string, value: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const existing = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
      let res;
      if (existing.length > 0) {
        res = await db.update(siteContent)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteContent.key, key))
          .returning();
      } else {
        res = await db.insert(siteContent)
          .values({ key, value })
          .returning();
      }
      revalidatePath("/admin");
      revalidatePath("/", "layout");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error updateSiteContent:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.siteContent[key] = value;
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  return { success: true, data: { key, value } };
}
