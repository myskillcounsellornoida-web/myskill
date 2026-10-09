"use server";

import { db } from "@/db";
import { inquiries, testimonials, services, blogs, siteContent, bookings, subscribers, faqs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getLocalData, saveLocalData } from "@/db/localStore";
import { Resend } from "resend";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  DEFAULT_CONTENT,
  THEME_FIELDS,
  COLOR_SUFFIX,
  LAYOUT_KEY_LIST,
  PAGE_SECTIONS,
  layoutKey,
  resolveLayout,
  type PreviewPage,
} from "@/lib/siteContent";
import { VIDEOS_KEY, parseVideoList } from "@/lib/videos";
import { CUSTOM_SECTIONS_KEY, parseCustomSections, sectionKey, sectionsForPage } from "@/lib/customSections";
import { CATEGORY_KEYS, TESTIMONIAL_CATEGORY_MAP_KEY, parseCategories, parseCategoryMap } from "@/lib/categories";
import { EMAIL_RE, MAX_MANUAL_RECIPIENTS, parseEmailList } from "@/lib/emails";
import { MAIL_FROM } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export type ActionResult<T = any> = { success: boolean; data: T; error?: string };

const UNAUTHORIZED_ERROR = "Unauthorized. Please sign in as an administrator.";

// Every action below is reachable directly (Server Actions are public endpoints),
// so the proxy's cookie check alone is not sufficient — see docs/app/guides/authentication.
async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}

/* ==========================================
   INQUIRIES ACTIONS
   ========================================== */

export async function fetchInquiries(): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: [], error: UNAUTHORIZED_ERROR };
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(inquiries)
        .set({ isContacted })
        .where(eq(inquiries.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  return { success: true, data: local.inquiries };
}

export async function deleteInquiry(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(inquiries)
        .where(eq(inquiries.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.insert(testimonials)
        .values({ name, role, text })
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/testimonials");
  revalidatePath("/", "layout");
  return { success: true, data: newT };
}

export async function updateTestimonial(id: number, name: string, role: string, text: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(testimonials)
        .set({ name, role, text })
        .where(eq(testimonials.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/testimonials");
  revalidatePath("/", "layout");
  return { success: true, data: local.testimonials };
}

export async function deleteTestimonial(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(testimonials)
        .where(eq(testimonials.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.insert(services)
        .values({ title, description, icon })
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return { success: true, data: newS };
}

export async function updateService(id: number, title: string, description: string, icon: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(services)
        .set({ title, description, icon })
        .where(eq(services.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return { success: true, data: local.services };
}

export async function deleteService(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(services)
        .where(eq(services.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.insert(blogs)
        .values({ title, slug, content, image, tag, readTime })
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/blog");
  revalidatePath("/", "layout");
  return { success: true, data: newB };
}

export async function updateBlog(id: number, title: string, slug: string, content: string, image: string, tag: string, readTime: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.update(blogs)
        .set({ title, slug, content, image, tag, readTime })
        .where(eq(blogs.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/blog");
  revalidatePath("/", "layout");
  return { success: true, data: local.blogs };
}

export async function deleteBlog(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(blogs)
        .where(eq(blogs.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
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
      revalidatePath("/adminria");
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
  revalidatePath("/adminria");
  revalidatePath("/", "layout");
  return { success: true, data: { key, value } };
}

const EDITABLE_KEYS = new Set([...Object.keys(DEFAULT_CONTENT), ...THEME_FIELDS.map((f) => f.key), ...LAYOUT_KEY_LIST, VIDEOS_KEY, CUSTOM_SECTIONS_KEY, ...CATEGORY_KEYS]);
const MAX_CONTENT_LENGTH = 5000;
const MAX_STRUCTURED_LENGTH = 20000;

const PAGE_BY_LAYOUT_KEY = Object.fromEntries(
  (Object.keys(PAGE_SECTIONS) as PreviewPage[]).map((page) => [layoutKey(page), page])
) as Record<string, PreviewPage>;

// JSON-valued keys are re-serialized from their validated form so junk never reaches the site.
function normalizeValue(key: string, value: string, all: Record<string, string>): string {
  if (value === "") return value;
  if (key === VIDEOS_KEY) return JSON.stringify(parseVideoList(value));
  if (key === CUSTOM_SECTIONS_KEY) return JSON.stringify(parseCustomSections(value));
  if (key === TESTIMONIAL_CATEGORY_MAP_KEY) return JSON.stringify(parseCategoryMap(value));
  if (CATEGORY_KEYS.includes(key)) return JSON.stringify(parseCategories(value));
  const page = PAGE_BY_LAYOUT_KEY[key];
  if (page) {
    // Custom section ids must survive layout normalization.
    const custom = sectionsForPage(parseCustomSections(all[CUSTOM_SECTIONS_KEY] ?? ""), page);
    return JSON.stringify(resolveLayout(value, page, custom.map((s) => sectionKey(s.id))));
  }
  return value;
}

function isEditableKey(key: string): boolean {
  const base = key.endsWith(COLOR_SUFFIX) ? key.slice(0, -COLOR_SUFFIX.length) : key;
  return EDITABLE_KEYS.has(base);
}

// Publishes every pending edit from the live editor in one round-trip.
// An empty string removes the override so the site falls back to the default.
async function readStoredValue(key: string): Promise<string> {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
      return rows[0]?.value ?? "";
    } catch (e) {
      console.error("DB Error readStoredValue:", e);
      return "";
    }
  }
  return getLocalData().siteContent[key] ?? "";
}

export async function updateSiteContentBatch(entries: Record<string, string>): Promise<ActionResult<number>> {
  if (!(await requireAdmin())) return { success: false, data: 0, error: UNAUTHORIZED_ERROR };

  const raw = Object.entries(entries).filter(([key, value]) => isEditableKey(key) && typeof value === "string");
  const tooLong = raw.find(([key, value]) =>
    value.length > (key === VIDEOS_KEY || key === CUSTOM_SECTIONS_KEY || CATEGORY_KEYS.includes(key) || PAGE_BY_LAYOUT_KEY[key] ? MAX_STRUCTURED_LENGTH : MAX_CONTENT_LENGTH)
  );
  if (tooLong) {
    return { success: false, data: 0, error: `"${tooLong[0]}" is too long.` };
  }
  // Layout normalization needs the current section list: from this publish when
  // it is part of it, otherwise from what is already stored.
  const merged: Record<string, string> = Object.fromEntries(raw);
  if (!(CUSTOM_SECTIONS_KEY in merged) && raw.some(([key]) => PAGE_BY_LAYOUT_KEY[key])) {
    merged[CUSTOM_SECTIONS_KEY] = await readStoredValue(CUSTOM_SECTIONS_KEY);
  }
  const pairs = raw.map(([key, value]) => [key, normalizeValue(key, value, merged)] as const);

  try {
    if (process.env.DATABASE_URL) {
      await db.transaction(async (tx) => {
        for (const [key, value] of pairs) {
          if (value === "") {
            await tx.delete(siteContent).where(eq(siteContent.key, key));
          } else {
            await tx.insert(siteContent)
              .values({ key, value })
              .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
          }
        }
      });
    } else {
      const local = getLocalData();
      for (const [key, value] of pairs) {
        if (value === "") delete local.siteContent[key];
        else local.siteContent[key] = value;
      }
      saveLocalData(local);
    }
  } catch (e: any) {
    console.error("Error updateSiteContentBatch:", e);
    return { success: false, data: 0, error: e.message };
  }

  revalidatePath("/", "layout");
  return { success: true, data: pairs.length };
}

/* ==========================================
   BOOKINGS ACTIONS
   ========================================== */

export async function fetchBookings(): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: [], error: UNAUTHORIZED_ERROR };
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
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
  if (!(await requireAdmin())) return { success: false, data: [], error: UNAUTHORIZED_ERROR };
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
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
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

const BATCH_SIZE = 100; // Resend batch limit

function wrapEmailBody(bodyHtml: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      ${bodyHtml}
      <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; color: #64748b; font-size: 12px; text-align: center;">
        <p>Sent by <strong>My Skill Counsellor</strong> | Career & Study Abroad Guidance</p>
        <p>Noida, India | info@myskillcounsellor.com</p>
      </div>
    </div>
  `;
}

/** Every known contact, for the "pick recipients" list in the mailer. */
export async function fetchContacts(): Promise<ActionResult<{ email: string; name: string; source: string }[]>> {
  if (!(await requireAdmin())) return { success: false, data: [], error: UNAUTHORIZED_ERROR };

  const rows: { email: string; name: string; source: string }[] = [];
  const push = (email: unknown, name: unknown, source: string) => {
    if (typeof email === "string" && EMAIL_RE.test(email.trim().toLowerCase())) {
      rows.push({ email: email.trim().toLowerCase(), name: typeof name === "string" ? name : "", source });
    }
  };

  try {
    if (process.env.DATABASE_URL) {
      const [subs, bks, inqs] = await Promise.all([
        db.select({ email: subscribers.email, name: subscribers.name }).from(subscribers),
        db.select({ email: bookings.email, name: bookings.name }).from(bookings),
        db.select({ email: inquiries.email, name: inquiries.name }).from(inquiries),
      ]);
      subs.forEach((r) => push(r.email, r.name, "Subscriber"));
      bks.forEach((r) => push(r.email, r.name, "Booking"));
      inqs.forEach((r) => push(r.email, r.name, "Lead"));
    } else {
      const local = getLocalData();
      (local.subscribers || []).forEach((r) => push(r.email, r.name, "Subscriber"));
      (local.bookings || []).forEach((r) => push(r.email, r.name, "Booking"));
      (local.inquiries || []).forEach((r) => push(r.email, r.name, "Lead"));
    }
  } catch (e: any) {
    console.error("DB Error fetchContacts:", e);
    return { success: false, data: [], error: e.message };
  }

  // Keep the first entry per address but remember every source it came from.
  const byEmail = new Map<string, { email: string; name: string; source: string }>();
  for (const row of rows) {
    const existing = byEmail.get(row.email);
    if (!existing) byEmail.set(row.email, row);
    else {
      if (!existing.name && row.name) existing.name = row.name;
      if (!existing.source.includes(row.source)) existing.source += `, ${row.source}`;
    }
  }
  return { success: true, data: [...byEmail.values()].sort((a, b) => a.email.localeCompare(b.email)) };
}

export async function sendBroadcastEmail(
  subject: string,
  bodyHtml: string,
  targetAudience: "subscribers" | "bookings" | "inquiries" | "all" | "custom",
  customEmails?: string | string[]
): Promise<ActionResult<{ total: number; sent: number; failed: number }>> {
  const empty = { total: 0, sent: 0, failed: 0 };
  if (!(await requireAdmin())) {
    return { success: false, data: empty, error: UNAUTHORIZED_ERROR };
  }
  if (!subject.trim() || !bodyHtml.trim()) {
    return { success: false, data: empty, error: "Subject and Body content are required." };
  }
  if (!process.env.RESEND_API_KEY) {
    return { success: false, data: empty, error: "RESEND_API_KEY is missing in environment." };
  }

  try {
    let emailList: string[] = [];

    if (targetAudience === "custom") {
      emailList = parseEmailList(customEmails ?? []);
      if (emailList.length > MAX_MANUAL_RECIPIENTS) {
        return { success: false, data: empty, error: `Please send to at most ${MAX_MANUAL_RECIPIENTS} addresses at a time.` };
      }
    } else {
      const contactsRes = await fetchContacts();
      if (!contactsRes.success) {
        return { success: false, data: empty, error: contactsRes.error };
      }
      const wanted =
        targetAudience === "subscribers" ? "Subscriber" :
        targetAudience === "bookings" ? "Booking" :
        targetAudience === "inquiries" ? "Lead" : null;
      emailList = contactsRes.data
        .filter((c) => !wanted || c.source.includes(wanted))
        .map((c) => c.email);
    }

    if (emailList.length === 0) {
      return { success: false, data: empty, error: "No valid email addresses found for the selected audience." };
    }

    const html = wrapEmailBody(bodyHtml);
    let sent = 0;
    let failed = 0;

    // Batched so a large send goes out in one go; each person still gets their own email.
    for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
      const chunk = emailList.slice(i, i + BATCH_SIZE);
      try {
        const res = await resend.batch.send(
          chunk.map((to) => ({ from: MAIL_FROM, to, subject, html })),
          { batchValidation: "permissive" }
        );
        if (res.error) {
          console.error("Broadcast batch error:", res.error);
          failed += chunk.length;
        } else {
          const rejected = res.data?.errors?.length ?? 0;
          sent += chunk.length - rejected;
          failed += rejected;
        }
      } catch (err) {
        console.error(`Failed to send broadcast batch starting at ${i}:`, err);
        failed += chunk.length;
      }
    }

    return { success: true, data: { total: emailList.length, sent, failed } };
  } catch (e: any) {
    console.error("Broadcast Error:", e);
    return { success: false, data: empty, error: e.message };
  }
}

/* ==========================================
   FAQS ACTIONS
   ========================================== */

export async function fetchFaqs(): Promise<ActionResult> {
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.select().from(faqs).orderBy(desc(faqs.createdAt));
      return { success: true, data: res };
    } catch (e: any) {
      console.error("DB Error fetchFaqs:", e);
      return { success: false, data: [], error: e.message };
    }
  }
  const local = getLocalData();
  return { success: true, data: local.faqs || [] };
}

export async function saveFaq(data: any): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      if (data.id) {
        const res = await db.update(faqs)
          .set({ question: data.question, answer: data.answer, category: data.category })
          .where(eq(faqs.id, data.id))
          .returning();
        revalidatePath("/admin");
        revalidatePath("/adminria");
        revalidatePath("/", "layout");
      return { success: true, data: res[0] };
      } else {
        const res = await db.insert(faqs)
          .values({ question: data.question, answer: data.answer, category: data.category })
          .returning();
        revalidatePath("/admin");
        revalidatePath("/adminria");
        revalidatePath("/", "layout");
      return { success: true, data: res[0] };
      }
    } catch (e: any) {
      console.error("DB Error saveFaq:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  if (!local.faqs) local.faqs = [];
  const faq = { question: data.question, answer: data.answer, category: data.category ?? null };
  let saved;
  if (data.id) {
    local.faqs = local.faqs.map(f => f.id === data.id ? (saved = { ...f, ...faq }) : f);
  } else {
    saved = { id: Date.now(), ...faq, createdAt: new Date().toISOString() };
    local.faqs = [saved, ...local.faqs];
  }
  saveLocalData(local);
  revalidatePath("/", "layout");
  return saved ? { success: true, data: saved } : { success: false, data: null, error: "FAQ not found." };
}

export async function deleteFaq(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED_ERROR };
  if (process.env.DATABASE_URL) {
    try {
      const res = await db.delete(faqs)
        .where(eq(faqs.id, id))
        .returning();
      revalidatePath("/admin");
      revalidatePath("/adminria");
      revalidatePath("/", "layout");
      return { success: true, data: res[0] };
    } catch (e: any) {
      console.error("DB Error deleteFaq:", e);
      return { success: false, data: null, error: e.message };
    }
  }

  const local = getLocalData();
  local.faqs = (local.faqs || []).filter(f => f.id !== id);
  saveLocalData(local);
  revalidatePath("/", "layout");
  return { success: true, data: null };
}

