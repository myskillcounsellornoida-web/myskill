"use server";

import { db } from "@/db";
import { inquiries } from "@/db/schema";
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
