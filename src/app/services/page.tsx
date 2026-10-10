import { fetchServices, fetchFaqs } from "@/app/admin/actions";
import ServicesClient from "./ServicesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Counselling & Study Abroad Services | My Skill Counsellor Noida",
  description: "Explore our expert career counseling, study abroad consultation, IELTS preparation, and university admission services in Noida. Start your successful journey today.",
  keywords: ["career counsellor in noida", "study abroad consultant in noida", "best career counsellor in noida", "student career counselling", "IELTS preparation", "university admissions"],
  alternates: {
    canonical: "https://myskillcounsellor.com/services",
  }
};

export const revalidate = 60;

export default async function ServicesPage() {
  const [servicesRes, faqsRes] = await Promise.all([fetchServices(), fetchFaqs()]);

  const services = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const faqs = faqsRes.success && faqsRes.data ? faqsRes.data : [];

  return <ServicesClient services={services} faqs={faqs} />;
}
