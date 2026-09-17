import {
  fetchInquiries,
  fetchTestimonials,
  fetchBlogs,
  fetchServices,
  fetchBookings,
  fetchSubscribers,
  fetchFaqs
} from "./actions";
import AdminClient from "./AdminClient";
import { getSiteContent } from "@/lib/cms";

// Shared by /admin and /adminria. Callers must verify the session first.
export default async function AdminDashboard() {
  const results = await Promise.all([
    fetchInquiries(),
    fetchTestimonials(),
    fetchBlogs(),
    fetchServices(),
    fetchBookings(),
    fetchSubscribers(),
    fetchFaqs()
  ]);
  const [inquiriesRes, testimonialsRes, blogsRes, servicesRes, bookingsRes, subscribersRes, faqsRes] = results;
  const siteContent = await getSiteContent();

  const loadError = results.find(r => !r.success)?.error ?? null;

  return (
    <AdminClient
      initialInquiries={inquiriesRes.data || []}
      initialTestimonials={testimonialsRes.data || []}
      initialBlogs={blogsRes.data || []}
      initialServices={servicesRes.data || []}
      initialSiteContent={siteContent}
      initialBookings={bookingsRes.data || []}
      initialSubscribers={subscribersRes.data || []}
      initialFaqs={faqsRes.data || []}
      storageMode={process.env.DATABASE_URL ? "database" : "local"}
      loadError={loadError}
    />
  );
}
