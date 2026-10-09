import {
  fetchInquiries,
  fetchTestimonials,
  fetchBlogs,
  fetchServices,
  fetchSiteContent
} from "../admin/actions";
import AdminClient from "../admin/AdminClient";

export const dynamic = "force-dynamic";

// Secret admin route — accessible at /adminria
export default async function AdminRiaPage() {
  const inquiriesRes = await fetchInquiries();
  const testimonialsRes = await fetchTestimonials();
  const blogsRes = await fetchBlogs();
  const servicesRes = await fetchServices();
  const siteContentRes = await fetchSiteContent();

  const dbConnected = !!process.env.DATABASE_URL && inquiriesRes.success;
  const dbError = !process.env.DATABASE_URL
    ? "DATABASE_URL is not configured in .env.local"
    : (!inquiriesRes.success ? inquiriesRes.error || "Failed to connect to the database" : null);

  return (
    <AdminClient
      initialInquiries={inquiriesRes.data || []}
      initialTestimonials={testimonialsRes.data || []}
      initialBlogs={blogsRes.data || []}
      initialServices={servicesRes.data || []}
      initialSiteContent={siteContentRes.data || []}
      dbConnected={dbConnected}
      dbError={dbError}
    />
  );
}
