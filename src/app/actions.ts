"use server";

import { db } from "@/db";
import { inquiries, bookings, subscribers } from "@/db/schema";
import { getLocalData, saveLocalData } from "@/db/localStore";
import { revalidatePath } from "next/cache";
import { adminRecipients, detailRows, esc, layout, sendMail } from "@/lib/email";
import { notifyAdmins } from "@/lib/push";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const qualification = formData.get("qualification") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  try {
    // 1. Save to Neon Database if configured
    if (process.env.DATABASE_URL) {
      await db.insert(inquiries).values({
        name,
        phone,
        email,
        qualification,
        service,
        message,
      });
    }

    // 2. Always persist to localStore JSON as well so Admin can see it immediately
    const local = getLocalData();
    const newInquiry = {
      id: Date.now(),
      name,
      phone,
      email,
      qualification,
      service,
      message,
      isContacted: false,
      createdAt: new Date().toISOString()
    };
    local.inquiries = [newInquiry, ...local.inquiries];
    saveLocalData(local);

    revalidatePath("/admin");
    revalidatePath("/adminria");

    // 3. Notify the team, confirm to the visitor, and push to subscribed admin devices.
    await Promise.all([
      sendMail({
        to: await adminRecipients(),
        replyTo: email,
        subject: `New Lead: ${service} enquiry from ${name}`,
        html: layout(
          "New website enquiry",
          detailRows([
            ["Name", name],
            ["Phone", phone],
            ["Email", email],
            ["Qualification", qualification],
            ["Interested service", service],
            ["Message", message],
          ])
        ),
      }),
      sendMail({
        to: email,
        subject: "We've received your enquiry — My Skill Counsellor",
        html: layout(
          `Thank you, ${esc(name)}!`,
          `<p style="color:#334155;line-height:1.6;">We've received your enquiry about <strong>${esc(
            service
          )}</strong> and will get back to you within 24 hours.</p>
           <p style="color:#334155;line-height:1.6;">Here's what you sent us:</p>
           ${detailRows([
             ["Service", service],
             ["Message", message],
           ])}
           <p style="color:#334155;line-height:1.6;">Need us sooner? Reply to this email or message us on WhatsApp at +91 9990004878.</p>`
        ),
      }),
      notifyAdmins({
        title: `New lead: ${name}`,
        body: `${service} · ${phone}`,
        url: "/admin?tab=inquiries",
        tag: "inquiry",
      }),
    ]);

    return { success: true, message: "Inquiry submitted successfully!" };
  } catch (error: any) {
    console.error("Submission Error:", error);
    return { success: false, message: "Failed to submit inquiry. Please try again or message via WhatsApp." };
  }
}

export async function bookSession(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const bookingDate = formData.get("bookingDate") as string;
  const bookingTime = formData.get("bookingTime") as string;
  const notes = (formData.get("notes") as string) || "";

  if (!name || !email || !phone || !service || !bookingDate || !bookingTime) {
    return { success: false, message: "Please fill in all required fields." };
  }

  try {
    // 1. Save to Neon Database if configured
    if (process.env.DATABASE_URL) {
      await db.insert(bookings).values({
        name,
        email,
        phone,
        service,
        bookingDate,
        bookingTime,
        notes,
        status: "confirmed",
      });
    }

    // 2. Always persist to localStore
    const local = getLocalData();
    if (!local.bookings) local.bookings = [];
    const newBooking = {
      id: Date.now(),
      name,
      email,
      phone,
      service,
      bookingDate,
      bookingTime,
      notes,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    local.bookings = [newBooking, ...local.bookings];
    saveLocalData(local);

    revalidatePath("/admin");
    revalidatePath("/adminria");

    // 3. Confirm to the client, notify the team, and push to subscribed admin devices.
    await Promise.all([
      sendMail({
        to: email,
        subject: "Booking confirmed — 1-on-1 session with Ria Jain",
        html: layout(
          "Your session is confirmed",
          `<p style="color:#334155;line-height:1.6;">Hi <strong>${esc(
            name
          )}</strong>, thank you for scheduling a strategy session. Your appointment details are below:</p>
           ${detailRows([
             ["Service", service],
             ["Date", bookingDate],
             ["Time slot", bookingTime],
             ["Phone", phone],
             ["Notes", notes],
           ])}
           <p style="color:#334155;line-height:1.6;">We'll send a meeting link (Google Meet / Zoom) or call you at your scheduled time.</p>`
        ),
      }),
      sendMail({
        to: await adminRecipients(),
        replyTo: email,
        subject: `New booking: ${name} (${bookingDate} @ ${bookingTime})`,
        html: layout(
          "New session booking",
          detailRows([
            ["Client", name],
            ["Email", email],
            ["Phone", phone],
            ["Service", service],
            ["Date", bookingDate],
            ["Time slot", bookingTime],
            ["Notes", notes || "None"],
          ])
        ),
      }),
      notifyAdmins({
        title: `New booking: ${name}`,
        body: `${service} · ${bookingDate} @ ${bookingTime}`,
        url: "/admin?tab=bookings",
        tag: "booking",
      }),
    ]);

    return { success: true, message: "Session booked successfully! Confirmation email has been sent." };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { success: false, message: "Failed to book session. Please try again or contact us via WhatsApp." };
  }
}

export async function subscribeNewsletter(emailInput: string, nameInput?: string) {
  const email = emailInput?.trim();
  const name = nameInput?.trim() || "";

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please provide a valid email address." };
  }

  try {
    // 1. Save to database if configured
    if (process.env.DATABASE_URL) {
      await db.insert(subscribers).values({
        email,
        name,
        isSubscribed: true,
      }).onConflictDoNothing();
    }

    // 2. Always persist to localStore
    const local = getLocalData();
    if (!local.subscribers) local.subscribers = [];
    const existing = local.subscribers.find((s: any) => s.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      local.subscribers = [{
        id: Date.now(),
        email,
        name,
        isSubscribed: true,
        createdAt: new Date().toISOString()
      }, ...local.subscribers];
      saveLocalData(local);
    }

    revalidatePath("/admin");
    revalidatePath("/adminria");

    // 3. Welcome the subscriber and let the team know.
    await Promise.all([
      sendMail({
        to: email,
        subject: "Welcome to My Skill Counsellor Insights",
        html: layout(
          "Welcome to our community",
          `<p style="color:#334155;line-height:1.6;">Hi ${name ? `<strong>${esc(name)}</strong>` : "there"},</p>
           <p style="color:#334155;line-height:1.6;">Thank you for subscribing to the <strong>My Skill Counsellor</strong> newsletter.</p>
           <p style="color:#334155;line-height:1.6;">You'll get updates on global university admissions, SOP strategies, profile building tips and webinar invites straight to your inbox.</p>`
        ),
      }),
      sendMail({
        to: await adminRecipients(),
        subject: `New newsletter subscriber: ${email}`,
        html: layout("New subscriber", detailRows([["Email", email], ["Name", name || "Not provided"]])),
      }),
      notifyAdmins({
        title: "New newsletter subscriber",
        body: email,
        url: "/admin?tab=subscribers",
        tag: "subscriber",
      }),
    ]);

    return { success: true, message: "Thank you for subscribing! Welcome email sent." };
  } catch (error: any) {
    console.error("Newsletter Subscription Error:", error);
    return { success: true, message: "Thank you for subscribing!" };
  }
}
