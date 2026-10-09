"use server";

import { db } from "@/db";
import { pushSubscriptions, inquiries, bookings, subscribers } from "@/db/schema";
import { desc, eq, gt, sql } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { notifyAdmins, pushConfigured } from "@/lib/push";
import { adminRecipients, layout, sendMail } from "@/lib/email";

export type ActionResult<T = unknown> = { success: boolean; data: T; error?: string };

const UNAUTHORIZED = "Unauthorized. Please sign in as an administrator.";

async function requireAdmin() {
  return isAdminAuthenticated();
}

export async function getPushStatus(): Promise<
  ActionResult<{ configured: boolean; publicKey: string | null; devices: number }>
> {
  if (!(await requireAdmin())) {
    return { success: false, data: { configured: false, publicKey: null, devices: 0 }, error: UNAUTHORIZED };
  }

  let devices = 0;
  if (pushConfigured()) {
    try {
      const rows = await db.select({ n: sql<number>`count(*)::int` }).from(pushSubscriptions);
      devices = rows[0]?.n ?? 0;
    } catch (e) {
      console.error("getPushStatus:", e);
    }
  }

  return {
    success: true,
    data: {
      configured: pushConfigured(),
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null,
      devices,
    },
  };
}

export async function savePushSubscription(
  sub: { endpoint: string; keys: { p256dh: string; auth: string } },
  label?: string
): Promise<ActionResult<null>> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED };
  if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return { success: false, data: null, error: "Invalid subscription." };
  }

  try {
    await db
      .insert(pushSubscriptions)
      .values({ endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth, label: label?.slice(0, 255) })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { p256dh: sub.keys.p256dh, auth: sub.keys.auth, label: label?.slice(0, 255) },
      });
    return { success: true, data: null };
  } catch (e) {
    console.error("savePushSubscription:", e);
    return { success: false, data: null, error: "Could not save this device." };
  }
}

export async function removePushSubscription(endpoint: string): Promise<ActionResult<null>> {
  if (!(await requireAdmin())) return { success: false, data: null, error: UNAUTHORIZED };
  try {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
    return { success: true, data: null };
  } catch (e) {
    console.error("removePushSubscription:", e);
    return { success: false, data: null, error: "Could not remove this device." };
  }
}

export async function sendTestPush(): Promise<ActionResult<{ sent: number; failed: number }>> {
  if (!(await requireAdmin())) return { success: false, data: { sent: 0, failed: 0 }, error: UNAUTHORIZED };
  const res = await notifyAdmins({
    title: "Notifications are working",
    body: "You'll get an alert here whenever someone fills in a form.",
    url: "/admin",
    tag: "test",
  });
  return { success: res.sent > 0, data: res, error: res.sent ? undefined : "No device received the notification." };
}

export async function sendTestEmail(): Promise<ActionResult<{ to: string[] }>> {
  if (!(await requireAdmin())) return { success: false, data: { to: [] }, error: UNAUTHORIZED };
  const to = await adminRecipients();
  const res = await sendMail({
    to,
    subject: "Test email from My Skill Counsellor",
    html: layout(
      "Email notifications are working",
      `<p style="color:#334155;line-height:1.6;">If you're reading this, new leads, bookings and subscribers will reach this inbox.</p>`
    ),
  });
  return { success: res.sent, data: { to }, error: res.error };
}

/** Counts of records newer than the given ISO timestamp — drives the live admin badge. */
export async function pollActivity(sinceIso: string): Promise<
  ActionResult<{ inquiries: number; bookings: number; subscribers: number; latest: string | null; now: string }>
> {
  const empty = { inquiries: 0, bookings: 0, subscribers: 0, latest: null, now: new Date().toISOString() };
  if (!(await requireAdmin())) return { success: false, data: empty, error: UNAUTHORIZED };
  if (!process.env.DATABASE_URL) return { success: true, data: empty };

  const since = new Date(sinceIso);
  if (Number.isNaN(since.getTime())) return { success: true, data: empty };

  try {
    const [inq, bk, subsCount, latestInq] = await Promise.all([
      db.select({ n: sql<number>`count(*)::int` }).from(inquiries).where(gt(inquiries.createdAt, since)),
      db.select({ n: sql<number>`count(*)::int` }).from(bookings).where(gt(bookings.createdAt, since)),
      db.select({ n: sql<number>`count(*)::int` }).from(subscribers).where(gt(subscribers.createdAt, since)),
      db.select({ name: inquiries.name }).from(inquiries).orderBy(desc(inquiries.createdAt)).limit(1),
    ]);

    return {
      success: true,
      data: {
        inquiries: inq[0]?.n ?? 0,
        bookings: bk[0]?.n ?? 0,
        subscribers: subsCount[0]?.n ?? 0,
        latest: latestInq[0]?.name ?? null,
        now: new Date().toISOString(),
      },
    };
  } catch (e) {
    console.error("pollActivity:", e);
    return { success: false, data: empty, error: "Could not check for new activity." };
  }
}
