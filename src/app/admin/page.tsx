import {
  fetchInquiries,
  fetchTestimonials,
  fetchBlogs,
  fetchServices,
  fetchSiteContent,
  fetchBookings,
  fetchSubscribers
} from "./actions";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const inquiriesRes = await fetchInquiries();
  const testimonialsRes = await fetchTestimonials();
  const blogsRes = await fetchBlogs();
  const servicesRes = await fetchServices();
  const siteContentRes = await fetchSiteContent();
  const bookingsRes = await fetchBookings();
  const subscribersRes = await fetchSubscribers();

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
      initialBookings={bookingsRes.data || []}
      initialSubscribers={subscribersRes.data || []}
      dbConnected={dbConnected}
      dbError={dbError}
    />
  );
}
