import "server-only";
import webpush from "web-push";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export type PushPayload = {
  title: string;
  body: string;
  /** Path opened when the notification is clicked. */
  url?: string;
  /** Collapses repeat notifications of the same kind. */
  tag?: string;
};

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

export const pushConfigured = () => Boolean(PUBLIC_KEY && PRIVATE_KEY && process.env.DATABASE_URL);

let configured = false;
function configure() {
  if (configured || !PUBLIC_KEY || !PRIVATE_KEY) return;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@myskillcounsellor.com", PUBLIC_KEY, PRIVATE_KEY);
  configured = true;
}

/**
 * Fans a notification out to every subscribed admin device. Like sendMail this
 * never throws — the lead is already saved by the time it runs. Subscriptions
 * the push service rejects as gone (404/410) are pruned.
 */
export async function notifyAdmins(payload: PushPayload): Promise<{ sent: number; failed: number }> {
  if (!pushConfigured()) return { sent: 0, failed: 0 };
  configure();

  let subs: { endpoint: string; p256dh: string; auth: string }[] = [];
  try {
    subs = await db.select().from(pushSubscriptions);
  } catch (e) {
    console.error("notifyAdmins: could not load subscriptions", e);
    return { sent: 0, failed: 0 };
  }

  const body = JSON.stringify({ ...payload, at: Date.now() });

  const results = await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body
        );
        return true;
      } catch (e) {
        const status = (e as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint)).catch(() => {});
        } else {
          console.error("notifyAdmins: push failed", status, e);
        }
        return false;
      }
    })
  );

  const sent = results.filter(Boolean).length;
  return { sent, failed: results.length - sent };
}
