import { fetchServices, fetchFaqs } from "@/app/admin/actions";
import ServicesClient from "./ServicesClient";

export const revalidate = 60;

export default async function ServicesPage() {
  const [servicesRes, faqsRes] = await Promise.all([
    fetchServices(),
    fetchFaqs()
  ]);

  const initialServices = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const initialFaqs = faqsRes.success && faqsRes.data ? faqsRes.data : [];

  return <ServicesClient initialServices={initialServices} initialFaqs={initialFaqs} />;
}
