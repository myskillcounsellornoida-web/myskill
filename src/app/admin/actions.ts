"use server";

import { db } from "@/db";
import { inquiries, testimonials, services, blogs, siteContent, bookings, subscribers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getLocalData, saveLocalData } from "@/db/localStore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

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

/* ==========================================
   BOOKINGS ACTIONS
   ========================================== */

export async function fetchBookings(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchBookings:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.bookings || [] };
}

export async function updateBookingStatus(id: number, status: string): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(bookings)
        .set({ status })
        .where(eq(bookings.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error updateBookingStatus:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  if (!local.bookings) local.bookings = [];
  local.bookings = local.bookings.map(b => b.id === id ? { ...b, status } : b);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/adminria");
  return { success: true, data: local.bookings };
}

export async function deleteBooking(id: number): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(bookings)
        .where(eq(bookings.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error deleteBooking:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  if (!local.bookings) local.bookings = [];
  local.bookings = local.bookings.filter(b => b.id !== id);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/adminria");
  return { success: true, data: local.bookings };
}

/* ==========================================
   SUBSCRIBERS ACTIONS
   ========================================== */

export async function fetchSubscribers(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchSubscribers:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.subscribers || [] };
}

export async function deleteSubscriber(id: number): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(subscribers)
        .where(eq(subscribers.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error deleteSubscriber:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  if (!local.subscribers) local.subscribers = [];
  local.subscribers = local.subscribers.filter(s => s.id !== id);
  saveLocalData(local);
  revalidatePath("/admin");
  revalidatePath("/adminria");
  return { success: true, data: local.subscribers };
}

/* ==========================================
   BROADCAST EMAIL ACTIONS
   ========================================== */

export async function sendBroadcastEmail(
  subject: string,
  bodyHtml: string,
  targetAudience: "subscribers" | "bookings" | "inquiries" | "all" | "custom",
  customEmail?: string
): Promise<ActionResult<{ total: number; sent: number; failed: number }>> {
  if (!subject.trim() || !bodyHtml.trim()) {
    return { success: false, data: { total: 0, sent: 0, failed: 0 }, error: "Subject and Body content are required." };
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, data: { total: 0, sent: 0, failed: 0 }, error: "RESEND_API_KEY is missing in environment." };
  }

  try {
    let emailList: string[] = [];

    if (targetAudience === "custom") {
      if (customEmail && customEmail.includes("@")) {
        emailList = [customEmail.trim()];
      }
    } else {
      // Gather emails from DB or localStore based on targetAudience
      let subEmails: string[] = [];
      let bookEmails: string[] = [];
      let inqEmails: string[] = [];

      if (process.env.DATABASE_URL) {
        if (targetAudience === "subscribers" || targetAudience === "all") {
          const subs = await db.select({ email: subscribers.email }).from(subscribers);
          subEmails = subs.map(s => s.email);
        }
        if (targetAudience === "bookings" || targetAudience === "all") {
          const bks = await db.select({ email: bookings.email }).from(bookings);
          bookEmails = bks.map(b => b.email);
        }
        if (targetAudience === "inquiries" || targetAudience === "all") {
          const inqs = await db.select({ email: inquiries.email }).from(inquiries);
          inqEmails = inqs.map(i => i.email);
        }
      }

      // Merge with localStore if any
      const local = getLocalData();
      if (targetAudience === "subscribers" || targetAudience === "all") {
        subEmails = [...subEmails, ...(local.subscribers || []).map(s => s.email)];
      }
      if (targetAudience === "bookings" || targetAudience === "all") {
        bookEmails = [...bookEmails, ...(local.bookings || []).map(b => b.email)];
      }
      if (targetAudience === "inquiries" || targetAudience === "all") {
        inqEmails = [...inqEmails, ...(local.inquiries || []).map(i => i.email)];
      }

      // Deduplicate emails & sanitize
      emailList = Array.from(
        new Set([...subEmails, ...bookEmails, ...inqEmails].map(e => e?.trim().toLowerCase()))
      ).filter(e => e && e.includes("@"));
    }

    if (emailList.length === 0) {
      return { success: false, data: { total: 0, sent: 0, failed: 0 }, error: "No target email addresses found for the selected audience." };
    }

    let sent = 0;
    let failed = 0;

    for (const toEmail of emailList) {
      try {
        await resend.emails.send({
          from: "My Skill Counsellor <onboarding@resend.dev>",
          to: toEmail,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              ${bodyHtml}
              <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; color: #64748b; font-size: 12px; text-align: center;">
                <p>Sent by <strong>My Skill Counsellor</strong> | Career & Study Abroad Guidance</p>
                <p>Noida, India | info@myskillcounsellor.com</p>
              </div>
            </div>
          `,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send broadcast email to ${toEmail}:`, err);
        failed++;
      }
    }

    return {
      success: true,
      data: { total: emailList.length, sent, failed },
    };
  } catch (e: any) {
    console.error("Broadcast Error:", e);
    return { success: false, data: { total: 0, sent: 0, failed: 0 }, error: e.message };
  }
}

