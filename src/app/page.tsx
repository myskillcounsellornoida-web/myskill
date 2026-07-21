import { fetchSiteContent, fetchServices, fetchTestimonials } from "@/app/admin/actions";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const [siteContentRes, servicesRes, testimonialsRes] = await Promise.all([
    fetchSiteContent(),
    fetchServices(),
    fetchTestimonials()
  ]);

  let cmsData: Record<string, string> = {};
  if (siteContentRes.success && siteContentRes.data) {
    siteContentRes.data.forEach((item: any) => {
      cmsData[item.key] = item.value;
    });
  }

  const initialServices = servicesRes.success && servicesRes.data ? servicesRes.data : [];
  const initialTestimonials = testimonialsRes.success && testimonialsRes.data ? testimonialsRes.data : [];

  return (
    <HomePageClient 
      initialCmsData={cmsData} 
      initialServices={initialServices} 
      initialTestimonials={initialTestimonials} 
    />
  );
}
