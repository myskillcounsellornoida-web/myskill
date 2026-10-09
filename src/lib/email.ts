import "server-only";
import { Resend } from "resend";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getLocalData } from "@/db/localStore";
import { parseEmailList } from "@/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

/**
 * Must stay on a Resend-verified domain. The shared onboarding@resend.dev sender
 * only delivers to the Resend account owner, so visitor-facing mail silently fails.
 */
export const MAIL_FROM = process.env.MAIL_FROM || "My Skill Counsellor <noreply@myskillcounsellor.com>";

const FALLBACK_ADMIN_EMAIL = "ria.myskillcounsellor@gmail.com";

/** Escapes values that get interpolated into email HTML. */
export const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Who gets "new lead / new booking" mail — editable in the admin under Notifications. */
export async function adminRecipients(): Promise<string[]> {
  let stored = "";
  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(siteContent).where(eq(siteContent.key, "admin_notify_emails")).limit(1);
      stored = rows[0]?.value ?? "";
    } catch (e) {
      console.error("adminRecipients: DB read failed", e);
    }
  } else {
    stored = getLocalData().siteContent?.admin_notify_emails ?? "";
  }

  const list = parseEmailList(stored || process.env.ADMIN_NOTIFY_EMAILS || FALLBACK_ADMIN_EMAIL);
  return list.length ? list : [FALLBACK_ADMIN_EMAIL];
}

/**
 * Sends mail without ever throwing: a form submission is already persisted by the
 * time we get here, so a mail outage must not turn into a failed submission.
 */
export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean; id?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { sent: false, error: "RESEND_API_KEY not set" };

  const to = (Array.isArray(opts.to) ? opts.to : [opts.to]).filter(Boolean);
  if (!to.length) return { sent: false, error: "no recipients" };

  try {
    const res = await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    if (res.error) {
      console.error("sendMail:", opts.subject, res.error);
      return { sent: false, error: res.error.message };
    }
    return { sent: true, id: res.data?.id };
  } catch (e) {
    console.error("sendMail threw:", opts.subject, e);
    return { sent: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Shared branded shell so every outgoing email looks the same. */
export function layout(heading: string, bodyHtml: string) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#14505C;padding:20px 24px;">
        <div style="color:#ffffff;font-size:20px;font-weight:700;">My Skill</div>
        <div style="color:#E0B973;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;">Counsellor</div>
      </div>
      <div style="padding:24px;">
        <h1 style="color:#14505C;font-size:20px;margin:0 0 16px;">${heading}</h1>
        ${bodyHtml}
      </div>
      <div style="border-top:1px solid #e2e8f0;padding:16px 24px;color:#64748b;font-size:12px;">
        <p style="margin:2px 0;"><strong>Ria Jain</strong> · Lead Counsellor &amp; Founder</p>
        <p style="margin:2px 0;">info@myskillcounsellor.com · +91 9990004878</p>
        <p style="margin:2px 0;"><a href="https://myskillcounsellor.com" style="color:#3E8E98;">myskillcounsellor.com</a></p>
      </div>
    </div>
  </div>`;
}

/** Renders a label/value table for the admin-facing notification mails. */
export function detailRows(rows: [string, unknown][]) {
  return `<table style="width:100%;border-collapse:collapse;margin:8px 0 16px;">${rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(
      ([label, value]) =>
        `<tr><td style="padding:7px 10px;background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:13px;width:34%;"><strong>${esc(
          label
        )}</strong></td><td style="padding:7px 10px;border:1px solid #e2e8f0;color:#1e293b;font-size:13px;">${esc(
          value
        )}</td></tr>`
    )
    .join("")}</table>`;
}
