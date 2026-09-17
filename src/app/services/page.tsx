import { fetchServices, fetchFaqs } from "@/app/admin/actions";
import ServicesClient from "./ServicesClient";

export const revalidate = 60;

export default async function ServicesPage() {
  const [servicesRes, faqsRes] = await Promise.all([fetchServices(), fetchFaqs()]);

  const services = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const faqs = faqsRes.success && faqsRes.data ? faqsRes.data : [];

  return <ServicesClient services={services} faqs={faqs} />;
}
