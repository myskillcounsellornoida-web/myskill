import { fetchTestimonials, fetchFaqs, fetchServices } from "@/app/admin/actions";
import HomePageClient from "./HomePageClient";
import type { Program } from "@/lib/programs";

const DEFAULT_TESTIMONIALS = [
  { name: "Aarav Sharma", role: "Admitted to NYU", text: "Ria completely transformed my application. Her insights on my SOP made all the difference." },
  { name: "Mrs. Kapoor", role: "Parent", text: "We were overwhelmed with the UK visa process. Ria handled everything smoothly and professionally." },
  { name: "Simran Kaur", role: "IELTS Band 8", text: "The structured mock interviews and writing evaluations helped me score far above my target." },
];

export default async function Home() {
  const [testimonialsRes, faqsRes, servicesRes] = await Promise.all([fetchTestimonials(), fetchFaqs(), fetchServices()]);

  const testimonials = testimonialsRes.success && testimonialsRes.data?.length ? testimonialsRes.data : DEFAULT_TESTIMONIALS;
  const faqs = faqsRes.success && faqsRes.data ? faqsRes.data : [];
  const programs: Program[] = servicesRes.success && servicesRes.data ? servicesRes.data : [];

  return <HomePageClient testimonials={testimonials} faqs={faqs} programs={programs} />;
}
