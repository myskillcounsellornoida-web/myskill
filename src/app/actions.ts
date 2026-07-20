"use server";

import { db } from "@/db";
import { inquiries, bookings, subscribers } from "@/db/schema";
import { Resend } from "resend";
import { getLocalData, saveLocalData } from "@/db/localStore";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

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

    // 3. Send Email Notification via Resend if key present
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "My Skill Counsellor <onboarding@resend.dev>",
        to: "ria.myskillcounsellor@gmail.com",
        subject: `New Lead: ${service} Inquiry from ${name}`,
        html: `
          <h2>New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Qualification:</strong> ${qualification}</p>
          <p><strong>Interested Service:</strong> ${service}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });
    }

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

    // 3. Send Email Confirmation via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "My Skill Counsellor <onboarding@resend.dev>",
          to: email,
          subject: `Booking Confirmed: 1-on-1 Counselling Session with Ria Jain`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0f4c81; font-size: 24px; margin-bottom: 8px;">Session Booking Confirmed! 🎉</h1>
                <p style="color: #64748b; font-size: 14px;">My Skill Counsellor</p>
              </div>
              <p style="color: #334155; font-size: 15px;">Hi <strong>${name}</strong>,</p>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">Thank you for scheduling a strategy session. Your appointment details are below:</p>

              <div style="background-color: #f8fafc; padding: 18px; border-left: 4px solid #0f4c81; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 6px 0; color: #1e293b;"><strong>Service:</strong> ${service}</p>
                <p style="margin: 6px 0; color: #1e293b;"><strong>Date:</strong> ${bookingDate}</p>
                <p style="margin: 6px 0; color: #1e293b;"><strong>Time Slot:</strong> ${bookingTime}</p>
                <p style="margin: 6px 0; color: #1e293b;"><strong>Phone:</strong> ${phone}</p>
                ${notes ? `<p style="margin: 6px 0; color: #1e293b;"><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>

              <p style="color: #334155; font-size: 14px; line-height: 1.6;">Our team will send a meeting link (Google Meet / Zoom) or connect with you via call at your scheduled time.</p>

              <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; color: #64748b; font-size: 13px;">
                <p style="margin: 2px 0;"><strong>Ria Jain</strong></p>
                <p style="margin: 2px 0;">Lead Counsellor & Founder, My Skill Counsellor</p>
                <p style="margin: 2px 0;">Email: info@myskillcounsellor.com | Phone: +91 9990004878</p>
              </div>
            </div>
          `,
        });
      } catch (clientMailErr) {
        console.error("Error sending client confirmation mail:", clientMailErr);
      }

      try {
        await resend.emails.send({
          from: "My Skill Counsellor <onboarding@resend.dev>",
          to: "ria.myskillcounsellor@gmail.com",
          subject: `📅 New Session Booking: ${name} (${bookingDate} @ ${bookingTime})`,
          html: `
            <h2>New Session Booking Received!</h2>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time Slot:</strong> ${bookingTime}</p>
            <p><strong>Notes:</strong> ${notes || 'None'}</p>
          `,
        });
      } catch (adminMailErr) {
        console.error("Error sending admin booking mail:", adminMailErr);
      }
    }

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

    // 3. Send Welcome Email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "My Skill Counsellor <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to My Skill Counsellor Insights ✨",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0f4c81;">Welcome to our Community! 🎓</h2>
            <p style="color: #334155;">Hi ${name ? `<strong>${name}</strong>` : 'there'},</p>
            <p style="color: #334155; line-height: 1.6;">Thank you for subscribing to <strong>My Skill Counsellor</strong> newsletter.</p>
            <p style="color: #334155; line-height: 1.6;">You will get exclusive updates on global university admissions, SOP strategies, profile building tips, and webinar invites directly in your inbox.</p>
            <p style="margin-top: 30px; font-size: 0.9em; color: #64748b;">Warm regards,<br/><strong>Ria Jain</strong><br/>Founder, My Skill Counsellor</p>
          </div>
        `,
      });
    }

    return { success: true, message: "Thank you for subscribing! Welcome email sent." };
  } catch (error: any) {
    console.error("Newsletter Subscription Error:", error);
    return { success: true, message: "Thank you for subscribing!" };
  }
}
