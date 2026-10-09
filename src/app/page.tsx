import { fetchSiteContent, fetchServices, fetchTestimonials, fetchFaqs } from "@/app/admin/actions";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const [siteContentRes, servicesRes, testimonialsRes, faqsRes] = await Promise.all([
    fetchSiteContent(),
    fetchServices(),
    fetchTestimonials(),
    fetchFaqs()
  ]);

  const cmsData: Record<string, string> = {};
  if (siteContentRes.success && siteContentRes.data) {
    siteContentRes.data.forEach((item: any) => {
      cmsData[item.key] = item.value;
    });
  }

  const initialServices = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const initialTestimonials = testimonialsRes.success && testimonialsRes.data ? testimonialsRes.data : [];
  const initialFaqs = faqsRes.success && faqsRes.data ? faqsRes.data : [];

  return (
    <HomePageClient 
      initialCmsData={cmsData} 
      initialServices={initialServices} 
      initialTestimonials={initialTestimonials} 
      initialFaqs={initialFaqs}
    />
  );
}
