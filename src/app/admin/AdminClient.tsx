"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Briefcase,
  Settings,
  LogOut,
  Check,
  X,
  Trash2,
  Plus,
  Edit2,
  ChevronRight,
  Search,
  FileText,
  Phone,
  Mail,
  User,
  ExternalLink,
  Database,
  Info
} from "lucide-react";
import {
  toggleInquiryContacted,
  deleteInquiry,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createService,
  updateService,
  deleteService,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBookingStatus,
  deleteBooking,
  deleteSubscriber,
  sendBroadcastEmail,
  saveFaq,
  deleteFaq
} from "./actions";
import { logout } from "./login/actions";
import RecipientPicker from "./RecipientPicker";
import { MAX_MANUAL_RECIPIENTS, invalidEmails, parseEmailList } from "@/lib/emails";
import ContentEditor from "./ContentEditor";
import ImageUploadButton from "./ImageUploadButton";

const TAB_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  bookings: "Session Bookings",
  inquiries: "Leads & Inquiries",
  subscribers: "Broadcast Mailer",
  testimonials: "Testimonials",
  blogs: "Counselling Blogs",
  services: "Services",
  faqs: "FAQ Manager",
  cms: "Edit Website Content",
};

interface AdminClientProps {
  initialInquiries: any[];
  initialTestimonials: any[];
  initialBlogs: any[];
  initialServices: any[];
  initialSiteContent: Record<string, string>;
  initialBookings?: any[];
  initialSubscribers?: any[];
  initialFaqs?: any[];
  storageMode: "database" | "local";
  loadError: string | null;
}

export default function AdminClient({
  initialInquiries,
  initialTestimonials,
  initialBlogs,
  initialServices,
  initialSiteContent,
  initialBookings = [],
  initialSubscribers = [],
  initialFaqs = [],
  storageMode,
  loadError
}: AdminClientProps) {
  // Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "inquiries" | "subscribers" | "testimonials" | "blogs" | "services" | "cms" | "faqs">("dashboard");

  // FAQ State
  const [faqsList, setFaqsList] = useState<any[]>(initialFaqs);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  // Data states are seeded once from the server; handlers keep them in sync.
  const [inquiriesList, setInquiriesList] = useState<any[]>(initialInquiries);
  const [testimonialsList, setTestimonialsList] = useState<any[]>(initialTestimonials);
  const [blogsList, setBlogsList] = useState<any[]>(initialBlogs);
  const [servicesList, setServicesList] = useState<any[]>(initialServices);
  const [bookingsList, setBookingsList] = useState<any[]>(initialBookings);
  const [subscribersList, setSubscribersList] = useState<any[]>(initialSubscribers);

  // Search & Filters
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "contacted" | "uncontacted">("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");

  // Broadcast Email Form State
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState<"all" | "subscribers" | "bookings" | "inquiries" | "custom">("all");
  const [manualRecipients, setManualRecipients] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastReport, setBroadcastReport] = useState<{ total: number; sent: number; failed: number } | null>(null);

  // Modals & Selected Items for editing
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  
  // Forms states
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", text: "" });

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({ title: "", slug: "", tag: "", readTime: "", image: "", content: "" });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", icon: "" });

  // System Notifications
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  const showNotify = (text: string, type: "success" | "error" | "info") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  /* ====================================================
     INQUIRIES
     ==================================================== */
  const handleToggleContacted = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const previous = inquiriesList;
    setInquiriesList(prev => prev.map(inq => inq.id === id ? { ...inq, isContacted: nextStatus } : inq));

    const res = await toggleInquiryContacted(id, nextStatus);
    if (res.success) {
      showNotify(`Lead marked as ${nextStatus ? "contacted" : "uncontacted"}.`, "success");
    } else {
      setInquiriesList(previous);
      showNotify(`Could not update lead: ${res.error}`, "error");
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead inquiry?")) return;
    const previous = inquiriesList;
    setInquiriesList(prev => prev.filter(inq => inq.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);

    const res = await deleteInquiry(id);
    if (res.success) {
      showNotify("Lead deleted successfully.", "success");
    } else {
      setInquiriesList(previous);
      showNotify(`Could not delete lead: ${res.error}`, "error");
    }
  };

  /* ====================================================
     BOOKINGS, SUBSCRIBERS & BROADCAST
     ==================================================== */
  const handleUpdateBookingStatus = async (id: number, nextStatus: string) => {
    const previous = bookingsList;
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
    const res = await updateBookingStatus(id, nextStatus);
    if (res.success) {
      showNotify(`Booking status updated to ${nextStatus}`, "success");
    } else {
      setBookingsList(previous);
      showNotify(`Error updating status: ${res.error}`, "error");
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Delete this session booking?")) return;
    const previous = bookingsList;
    setBookingsList(prev => prev.filter(b => b.id !== id));
    const res = await deleteBooking(id);
    if (res.success) {
      showNotify("Booking deleted", "success");
    } else {
      setBookingsList(previous);
      showNotify(`Error deleting: ${res.error}`, "error");
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    if (!confirm("Delete subscriber?")) return;
    const previous = subscribersList;
    setSubscribersList(prev => prev.filter(s => s.id !== id));
    const res = await deleteSubscriber(id);
    if (res.success) {
      showNotify("Subscriber removed", "success");
    } else {
      setSubscribersList(previous);
      showNotify(`Error deleting: ${res.error}`, "error");
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      showNotify("Subject and Body are required.", "error");
      return;
    }
    if (broadcastTarget === "custom" && manualEmails.length === 0) {
      showNotify("Add at least one valid recipient email address.", "error");
      return;
    }
    if (broadcastTarget === "custom" && manualEmails.length > MAX_MANUAL_RECIPIENTS) {
      showNotify(`Please send to at most ${MAX_MANUAL_RECIPIENTS} addresses at a time.`, "error");
      return;
    }
    const recipientCount = broadcastTarget === "custom" ? manualEmails.length : null;
    if (recipientCount !== null && recipientCount > 1 &&
        !confirm(`Send this email to ${recipientCount} recipients? Each person receives their own copy.`)) {
      return;
    }

    setIsSendingBroadcast(true);
    setBroadcastReport(null);

    const res = await sendBroadcastEmail(broadcastSubject, broadcastBody, broadcastTarget, manualEmails);

    setIsSendingBroadcast(false);
    if (res.success && res.data) {
      setBroadcastReport(res.data);
      showNotify(`Broadcast executed! Sent ${res.data.sent} of ${res.data.total} emails.`, "success");
    } else {
      showNotify(`Broadcast failed: ${res.error}`, "error");
    }
  };

  /* ====================================================
     TESTIMONIALS
     ==================================================== */
  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({ name: "", role: "", text: "" });
    setShowTestimonialModal(true);
  };

  const openEditTestimonial = (t: any) => {
    setEditingTestimonial(t);
    setTestimonialForm({ name: t.name, role: t.role, text: t.text });
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, role, text } = testimonialForm;
    if (!name || !role || !text) {
      showNotify("Please fill in all fields.", "error");
      return;
    }

    if (editingTestimonial) {
      const res = await updateTestimonial(editingTestimonial.id, name, role, text);
      if (!res.success) return showNotify(`Could not save testimonial: ${res.error}`, "error");
      setTestimonialsList(prev => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm } : t));
      showNotify("Testimonial updated.", "success");
    } else {
      const res = await createTestimonial(name, role, text);
      if (!res.success) return showNotify(`Could not add testimonial: ${res.error}`, "error");
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      setTestimonialsList(prev => [created, ...prev]);
      showNotify("Testimonial created.", "success");
    }
    setShowTestimonialModal(false);
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const previous = testimonialsList;
    setTestimonialsList(prev => prev.filter(t => t.id !== id));
    const res = await deleteTestimonial(id);
    if (res.success) {
      showNotify("Testimonial deleted.", "success");
    } else {
      setTestimonialsList(previous);
      showNotify(`Could not delete testimonial: ${res.error}`, "error");
    }
  };

  /* ====================================================
     BLOGS
     ==================================================== */
  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({ title: "", slug: "", tag: "", readTime: "", image: "", content: "" });
    setShowBlogModal(true);
  };

  const openEditBlog = (b: any) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title,
      slug: b.slug,
      tag: b.tag || "",
      readTime: b.readTime || "",
      image: b.image || "",
      content: b.content
    });
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, slug, content, image, tag, readTime } = blogForm;
    if (!title || !slug || !content) {
      showNotify("Title, slug, and content are required.", "error");
      return;
    }

    if (editingBlog) {
      const res = await updateBlog(editingBlog.id, title, slug, content, image, tag, readTime);
      if (!res.success) return showNotify(`Could not save article: ${res.error}`, "error");
      setBlogsList(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogForm } : b));
      showNotify("Blog article updated.", "success");
    } else {
      const res = await createBlog(title, slug, content, image, tag, readTime);
      if (!res.success) return showNotify(`Could not publish article: ${res.error}`, "error");
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      setBlogsList(prev => [created, ...prev]);
      showNotify("Blog article published.", "success");
    }
    setShowBlogModal(false);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const previous = blogsList;
    setBlogsList(prev => prev.filter(b => b.id !== id));
    const res = await deleteBlog(id);
    if (res.success) {
      showNotify("Blog deleted.", "success");
    } else {
      setBlogsList(previous);
      showNotify(`Could not delete article: ${res.error}`, "error");
    }
  };

  /* ====================================================
     SERVICES
     ==================================================== */
  const openAddService = () => {
    setEditingService(null);
    setServiceForm({ title: "", description: "", icon: "fas fa-graduation-cap" });
    setShowServiceModal(true);
  };

  const openEditService = (s: any) => {
    setEditingService(s);
    setServiceForm({ title: s.title, description: s.description, icon: s.icon || "fas fa-graduation-cap" });
    setShowServiceModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, icon } = serviceForm;
    if (!title || !description) {
      showNotify("Title and description are required.", "error");
      return;
    }

    if (editingService) {
      const res = await updateService(editingService.id, title, description, icon);
      if (!res.success) return showNotify(`Could not save service: ${res.error}`, "error");
      setServicesList(prev => prev.map(s => s.id === editingService.id ? { ...s, ...serviceForm } : s));
      showNotify("Service updated.", "success");
    } else {
      const res = await createService(title, description, icon);
      if (!res.success) return showNotify(`Could not add service: ${res.error}`, "error");
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      setServicesList(prev => [created, ...prev]);
      showNotify("Service created.", "success");
    }
    setShowServiceModal(false);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const previous = servicesList;
    setServicesList(prev => prev.filter(s => s.id !== id));
    const res = await deleteService(id);
    if (res.success) {
      showNotify("Service deleted.", "success");
    } else {
      setServicesList(previous);
      showNotify(`Could not delete service: ${res.error}`, "error");
    }
  };

  /* ====================================================
     FAQS
     ==================================================== */
  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: "", answer: "" });
    setShowFaqModal(true);
  };

  const openEditFaq = (f: any) => {
    setEditingFaq(f);
    setFaqForm({ question: f.question, answer: f.answer });
    setShowFaqModal(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      showNotify("Both question and answer are required.", "error");
      return;
    }
    const res = await saveFaq({ id: editingFaq?.id, ...faqForm });
    if (res.success) {
      if (editingFaq) {
        setFaqsList(prev => prev.map(f => f.id === editingFaq.id ? res.data : f));
      } else {
        setFaqsList(prev => [res.data, ...prev]);
      }
      showNotify("FAQ saved successfully.", "success");
      setShowFaqModal(false);
    } else {
      showNotify("Failed to save FAQ: " + res.error, "error");
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    const res = await deleteFaq(id);
    if (res.success) {
      setFaqsList(prev => prev.filter(f => f.id !== id));
      showNotify("FAQ deleted.", "success");
    } else {
      showNotify("Failed to delete FAQ: " + res.error, "error");
    }
  };

  // Manual recipients typed or picked in the broadcast composer.
  const manualEmails = parseEmailList(manualRecipients);
  const manualInvalid = invalidEmails(manualRecipients);
  const addRecipients = (emails: string[]) => {
    setManualRecipients(prev => {
      const merged = parseEmailList([...parseEmailList(prev), ...emails]);
      return merged.join(", ");
    });
  };
  const removeRecipient = (email: string) => {
    setManualRecipients(parseEmailList(manualRecipients).filter(e => e !== email).join(", "));
  };

  // Filter inquiries
  const filteredInquiries = inquiriesList.filter(inq => {
    const matchesSearch =
      inq.name?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.qualification?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.service?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.message?.toLowerCase().includes(inquirySearch.toLowerCase());

    if (inquiryFilter === "all") return matchesSearch;
    if (inquiryFilter === "contacted") return matchesSearch && inq.isContacted;
    return matchesSearch && !inq.isContacted;
  });

  // Stats computation
  const totalLeads = inquiriesList.length;
  const uncontactedLeads = inquiriesList.filter(i => !i.isContacted).length;
  const totalTestimonials = testimonialsList.length;
  const totalBlogs = blogsList.length;

  // Real lead activity for the last 7 days.
  const leadsByDay = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - i));
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = inquiriesList.filter(inq => {
      const created = new Date(inq.createdAt);
      return created >= day && created < next;
    }).length + bookingsList.filter(b => {
      const created = new Date(b.createdAt);
      return created >= day && created < next;
    }).length;
    return { label: day.toLocaleDateString("en-IN", { weekday: "short" }), count };
  });
  const maxDaily = Math.max(1, ...leadsByDay.map(d => d.count));

  // Requested services, most popular first.
  const serviceCounts = Object.entries(
    [...inquiriesList, ...bookingsList].reduce<Record<string, number>>((acc, item) => {
      const key = item.service || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const totalRequests = serviceCounts.reduce((sum, [, n]) => sum + n, 0);
  const SERVICE_COLORS = ["var(--color-deep-teal)", "var(--color-soft-teal)", "var(--color-muted-coral)", "var(--color-accent-gold)", "var(--color-sage-green)"];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#FAF9F5",
      color: "var(--text-primary)",
      fontFamily: "var(--font-body)"
    }}>
      {/* ====================================================
         NOTIFICATION TOAST
         ==================================================== */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              borderRadius: "50px",
              color: "white",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              fontSize: "0.95rem",
              fontWeight: 500,
              backgroundColor: notification.type === "success" ? "#10B981" : notification.type === "error" ? "#EF4444" : "var(--color-soft-teal)"
            }}
          >
            {notification.type === "success" ? <Check size={18} /> : notification.type === "error" ? <X size={18} /> : <Info size={18} />}
            {notification.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
         SIDEBAR NAVIGATION
         ==================================================== */}
      <aside style={{
        width: "280px",
        backgroundColor: "var(--color-deep-teal)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "35px 25px",
        boxShadow: "4px 0 20px rgba(45, 111, 122, 0.15)",
        zIndex: 50
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "white"
            }}>
              MSC
            </div>
            <div>
              <h4 style={{ color: "white", margin: 0, fontSize: "1.1rem" }}>Ria Jain</h4>
              <span style={{ fontSize: "0.75rem", opacity: 0.7, letterSpacing: "1px", textTransform: "uppercase" }}>Administrator</span>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
              { id: "bookings", label: "Session Bookings", icon: <Briefcase size={20} />, badge: bookingsList.length > 0 ? bookingsList.length : null },
              { id: "inquiries", label: "Leads/Inquiries", icon: <MessageSquare size={20} />, badge: uncontactedLeads > 0 ? uncontactedLeads : null },
              { id: "subscribers", label: "Broadcast Mailer", icon: <Mail size={20} />, badge: subscribersList.length > 0 ? subscribersList.length : null },
              { id: "testimonials", label: "Testimonials", icon: <User size={20} /> },
              { id: "blogs", label: "Counselling Blogs", icon: <BookOpen size={20} /> },
              { id: "services", label: "Services", icon: <Briefcase size={20} /> },
              { id: "faqs", label: "FAQ Manager", icon: <FileText size={20} /> },
              { id: "cms", label: "Edit Website", icon: <Settings size={20} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: activeTab === tab.id ? "rgba(255,255,255,0.12)" : "transparent",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontSize: "0.95rem",
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span style={{
                    backgroundColor: "var(--color-muted-coral)",
                    color: "white",
                    borderRadius: "50px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              fontSize: "0.95rem",
              transition: "all 0.2s"
            }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ====================================================
         MAIN BODY CONTENT
         ==================================================== */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        
        {/* HEADER BAR */}
        <header style={{
          position: "sticky",
          top: 0,
          background: "white",
          borderBottom: "1px solid var(--border-color)",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10
        }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", margin: 0, textTransform: "capitalize", color: "var(--color-deep-teal)" }}>
              {TAB_TITLES[activeTab]}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {loadError ? (
              <div title={loadError} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#B91C1C", padding: "8px 16px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                <Info size={16} />
                <span>Database error — some data could not load</span>
              </div>
            ) : (
              <div
                title={storageMode === "local" ? "No DATABASE_URL set: changes are saved to data/db.json on this server." : undefined}
                style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(77, 168, 179, 0.1)", color: "var(--color-deep-teal)", padding: "8px 16px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600 }}
              >
                <Database size={16} />
                <span>{storageMode === "database" ? "Connected to Neon Database" : "Saving to local storage"}</span>
              </div>
            )}

            <a href="/" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.9rem",
              color: "var(--color-deep-teal)",
              fontWeight: 500
            }}>
              <span>Live Site</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* CONTAINER FOR TAB VIEW */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ flex: "1", padding: activeTab === "cms" ? 0 : "40px", overflowY: activeTab === "cms" ? "hidden" : "auto", display: "flex", flexDirection: "column" }}>
          
          {/* ====================================================
             TAB 1: DASHBOARD
             ==================================================== */}
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              {/* STATUS CARDS GRID */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
                marginBottom: "35px"
              }}>
                {[
                  { label: "Total Lead Inquiries", val: totalLeads, desc: "Total submissions", color: "var(--color-soft-teal)" },
                  { label: "Pending Follow-up", val: uncontactedLeads, desc: "Awaiting contact", color: "var(--color-muted-coral)", critical: uncontactedLeads > 0 },
                  { label: "Success Testimonials", val: totalTestimonials, desc: "Active on website", color: "var(--color-sage-green)" },
                  { label: "Blog Publications", val: totalBlogs, desc: "Published posts", color: "var(--color-soft-beige)" }
                ].map((card, i) => (
                  <div key={i} style={{
                    backgroundColor: "white",
                    borderRadius: "var(--radius-md)",
                    padding: "24px",
                    boxShadow: "var(--shadow-soft)",
                    border: card.critical ? "1px solid rgba(217, 123, 102, 0.3)" : "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>{card.label}</span>
                      <h3 style={{ fontSize: "2.4rem", margin: "10px 0 5px 0", color: card.critical ? "var(--color-muted-coral)" : "var(--color-deep-teal)" }}>{card.val}</h3>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{card.desc}</span>
                  </div>
                ))}
              </div>

              {/* DATA VISUALIZATIONS SECTION */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 0.7fr",
                gap: "30px",
                marginBottom: "35px"
              }}>
                {/* SVG Area Chart: Lead Activity */}
                <div style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-soft)",
                  border: "1px solid var(--border-color)"
                }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Leads &amp; Bookings (Last 7 Days)</h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", height: "220px", paddingTop: "10px" }}>
                    {leadsByDay.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-deep-teal)" }}>{d.count}</span>
                        <div
                          title={`${d.count} on ${d.label}`}
                          style={{ width: "100%", maxWidth: "44px", height: `${Math.max(4, (d.count / maxDaily) * 160)}px`, borderRadius: "8px 8px 3px 3px", background: i === 6 ? "var(--color-muted-coral)" : "var(--color-soft-teal)", transition: "height 0.4s ease" }}
                        />
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SVG Circular Donut Chart: Service Breakdown */}
                <div style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-soft)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "15px" }}>Requested Services</h3>
                  <div style={{ position: "relative", height: "150px", display: "flex", justifyContent: "center" }}>
                    <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2DDD6" strokeWidth="4" />
                      {(() => {
                        let offset = 0;
                        return serviceCounts.slice(0, 5).map(([name, n], i) => {
                          const pct = (n / totalRequests) * 100;
                          const seg = (
                            <circle key={name} cx="21" cy="21" r="15.915" fill="transparent" stroke={SERVICE_COLORS[i]} strokeWidth="4.5"
                              strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={-offset} />
                          );
                          offset += pct;
                          return seg;
                        });
                      })()}
                    </svg>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                      <strong style={{ fontSize: "1.4rem", color: "var(--color-deep-teal)", display: "block" }}>{totalRequests}</strong>
                      <span style={{ fontSize: "0.7rem", color: "#888", textTransform: "uppercase" }}>Requests</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "15px" }}>
                    {serviceCounts.length === 0 && <span style={{ fontSize: "0.85rem", color: "#888" }}>No requests yet.</span>}
                    {serviceCounts.slice(0, 5).map(([name, n], i) => (
                      <div key={name} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "0.85rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: SERVICE_COLORS[i], flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                        </span>
                        <strong>{n}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TWO COLUMN ROW: RECENT LEADS & SYSTEM STATUS */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px"
              }}>
                {/* Recent Leads Panel */}
                <div style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-soft)",
                  border: "1px solid var(--border-color)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Recent Hot Leads</h3>
                    <button 
                      onClick={() => setActiveTab("inquiries")}
                      style={{ border: "none", background: "none", color: "var(--color-soft-teal)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {inquiriesList.slice(0, 3).map((inq) => (
                      <div key={inq.id} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        backgroundColor: "#FAF9F5",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: inq.isContacted ? "4px solid var(--color-sage-green)" : "4px solid var(--color-muted-coral)"
                      }}>
                        <div>
                          <h4 style={{ fontSize: "0.95rem", margin: "0 0 4px 0", color: "var(--color-deep-teal)" }}>{inq.name}</h4>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block" }}>
                            {inq.service} &bull; {inq.qualification}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleContacted(inq.id, inq.isContacted)}
                          style={{
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "50px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            backgroundColor: inq.isContacted ? "rgba(168, 185, 163, 0.15)" : "rgba(217, 123, 102, 0.15)",
                            color: inq.isContacted ? "var(--color-deep-teal)" : "var(--color-muted-coral)"
                          }}
                        >
                          {inq.isContacted ? "Contacted" : "Follow Up"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Actions & Status panel */}
                <div style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-soft)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Quick Dashboard Operations</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                      <button onClick={openAddBlog} style={{ padding: "16px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", background: "#FCFAF6", textAlign: "left", cursor: "pointer", transition: "var(--transition-smooth)" }} className="hover-scale">
                        <BookOpen size={24} style={{ color: "var(--color-soft-teal)", marginBottom: "8px" }} />
                        <h4 style={{ fontSize: "0.9rem", margin: 0 }}>Create Blog Post</h4>
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>Add new guidelines</span>
                      </button>

                      <button onClick={openAddTestimonial} style={{ padding: "16px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", background: "#FCFAF6", textAlign: "left", cursor: "pointer", transition: "var(--transition-smooth)" }} className="hover-scale">
                        <User size={24} style={{ color: "var(--color-muted-coral)", marginBottom: "8px" }} />
                        <h4 style={{ fontSize: "0.9rem", margin: 0 }}>Add Testimonial</h4>
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>Publish social proof</span>
                      </button>

                      <button onClick={openAddService} style={{ padding: "16px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", background: "#FCFAF6", textAlign: "left", cursor: "pointer", transition: "var(--transition-smooth)" }} className="hover-scale">
                        <Briefcase size={24} style={{ color: "var(--color-sage-green)", marginBottom: "8px" }} />
                        <h4 style={{ fontSize: "0.9rem", margin: 0 }}>New Service Offering</h4>
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>Update consultancy packages</span>
                      </button>

                      <button onClick={() => setActiveTab("cms")} style={{ padding: "16px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", background: "#FCFAF6", textAlign: "left", cursor: "pointer", transition: "var(--transition-smooth)" }} className="hover-scale">
                        <Settings size={24} style={{ color: "var(--color-deep-teal)", marginBottom: "8px" }} />
                        <h4 style={{ fontSize: "0.9rem", margin: 0 }}>CMS Copywriting</h4>
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>Edit text blocks</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginTop: "20px", display: "flex", gap: "12px", alignItems: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }}></div>
                    <span>{storageMode === "database" ? "All services running normally. Neon database connected." : "Running without a database — data is stored in data/db.json."}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ====================================================
             TAB: SESSION BOOKINGS
             ==================================================== */}
          {activeTab === "bookings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "30px"
              }}>
                <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
                  <Search size={18} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                  <input
                    type="text"
                    placeholder="Search bookings by name, email, service..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 45px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-color)",
                      outline: "none",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 600 }}>
                    Total Bookings: {bookingsList.length}
                  </span>
                </div>
              </div>

              {bookingsList.length === 0 ? (
                <div style={{ backgroundColor: "white", padding: "60px 20px", textAlign: "center", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <Briefcase size={48} style={{ color: "#ccc", marginBottom: "15px" }} />
                  <h3 style={{ color: "var(--color-deep-teal)", marginBottom: "8px" }}>No Session Bookings Yet</h3>
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>When candidates schedule 1-on-1 sessions on the website, they will appear here live.</p>
                </div>
              ) : (
                <div style={{ backgroundColor: "white", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ background: "#FCFAF6", borderBottom: "1px solid var(--border-color)", color: "var(--color-deep-teal)" }}>
                        <th style={{ padding: "16px 20px", fontWeight: 600 }}>Candidate</th>
                        <th style={{ padding: "16px 20px", fontWeight: 600 }}>Service</th>
                        <th style={{ padding: "16px 20px", fontWeight: 600 }}>Date & Time Slot</th>
                        <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                        <th style={{ padding: "16px 20px", fontWeight: 600 }}>Notes</th>
                        <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsList
                        .filter(b => 
                          b.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.email?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.service?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.bookingDate?.toLowerCase().includes(bookingSearch.toLowerCase())
                        )
                        .map((b) => (
                          <tr key={b.id} style={{ borderBottom: "1px solid #F0ECE1" }}>
                            <td style={{ padding: "16px 20px" }}>
                              <strong style={{ color: "var(--color-deep-teal)", display: "block" }}>{b.name}</strong>
                              <span style={{ fontSize: "0.8rem", color: "#666", display: "block" }}>✉ {b.email}</span>
                              <span style={{ fontSize: "0.8rem", color: "#666", display: "block" }}>📞 {b.phone}</span>
                            </td>
                            <td style={{ padding: "16px 20px", fontWeight: 500 }}>{b.service}</td>
                            <td style={{ padding: "16px 20px" }}>
                              <span style={{ background: "rgba(15, 76, 129, 0.08)", color: "#0f4c81", padding: "4px 8px", borderRadius: "4px", fontWeight: 600, fontSize: "0.8rem" }}>
                                📅 {b.bookingDate} at {b.bookingTime}
                              </span>
                            </td>
                            <td style={{ padding: "16px 20px" }}>
                              <select
                                value={b.status || "confirmed"}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  backgroundColor: b.status === "completed" ? "#dcfce7" : b.status === "cancelled" ? "#fee2e2" : "#e0f2fe",
                                  color: b.status === "completed" ? "#166534" : b.status === "cancelled" ? "#991b1b" : "#075985"
                                }}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td style={{ padding: "16px 20px", color: "#666", maxWidth: "200px" }}>
                              {b.notes || "No notes"}
                            </td>
                            <td style={{ padding: "16px 20px", textAlign: "right" }}>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "6px" }}
                                title="Delete booking"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* ====================================================
             TAB: BROADCAST MAILER & SUBSCRIBERS
             ==================================================== */}
          {activeTab === "subscribers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              {/* TOP: BROADCAST EMAIL COMPOSER */}
              <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border-color)", marginBottom: "35px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Mail size={24} style={{ color: "var(--color-soft-teal)" }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--color-deep-teal)" }}>Broadcast Email Center</h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#666" }}>Send live newsletter broadcasts or announcements to candidate audiences.</p>
                  </div>
                </div>

                <form onSubmit={handleSendBroadcast} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: broadcastTarget === "custom" ? "1fr" : "1fr 1fr", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
                        Target Audience
                      </label>
                      <select
                        value={broadcastTarget}
                        onChange={(e: any) => setBroadcastTarget(e.target.value)}
                        style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                      >
                        <option value="all">All Audiences (Subscribers + Bookings + Leads)</option>
                        <option value="subscribers">Newsletter Subscribers ({subscribersList.length})</option>
                        <option value="bookings">Session Bookings ({bookingsList.length})</option>
                        <option value="inquiries">Contact Inquiries ({inquiriesList.length})</option>
                        <option value="custom">Manual — choose recipients ({manualEmails.length} selected)</option>
                      </select>
                    </div>

                    {broadcastTarget === "custom" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", gap: "10px" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)" }}>
                            Recipients ({manualEmails.length})
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPicker(p => !p)}
                            style={{ fontSize: "0.78rem", fontWeight: 600, background: "#f1f5f9", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", color: "var(--color-deep-teal)" }}
                          >
                            <User size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                            {showPicker ? "Hide contacts" : "Pick from contacts"}
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={manualRecipients}
                          onChange={(e) => setManualRecipients(e.target.value)}
                          placeholder="Paste addresses separated by commas, spaces or new lines&#10;e.g. one@example.com, two@example.com"
                          aria-label="Recipient email addresses"
                          style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}
                        />
                        {manualInvalid.length > 0 && (
                          <p style={{ margin: "6px 0 0", fontSize: "0.8rem", color: "#B91C1C" }}>
                            Not a valid address: {manualInvalid.slice(0, 5).join(", ")}{manualInvalid.length > 5 ? "…" : ""}
                          </p>
                        )}
                        {manualEmails.length > 0 && (
                          <div className="recipient-chips">
                            {manualEmails.slice(0, 40).map(email => (
                              <span key={email} className="recipient-chip">
                                {email}
                                <button type="button" onClick={() => removeRecipient(email)} aria-label={`Remove ${email}`}>
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                            {manualEmails.length > 40 && <span className="recipient-chip is-more">+{manualEmails.length - 40} more</span>}
                            <button type="button" className="recipient-clear" onClick={() => setManualRecipients("")}>Clear all</button>
                          </div>
                        )}
                        <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: "#666" }}>
                          Everyone gets their own separate email — recipients never see each other&apos;s addresses.
                        </p>
                        {showPicker && (
                          <RecipientPicker
                            selected={manualEmails}
                            onAdd={addRecipients}
                            onRemove={removeRecipient}
                            onClose={() => setShowPicker(false)}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
                      Email Subject Line *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Masterclass Alert: How to build an Ivy-League SOP for 2026 Admissions"
                      value={broadcastSubject}
                      onChange={(e) => setBroadcastSubject(e.target.value)}
                      style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)" }}>
                        Email Message Body (HTML or Plain Text) *
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setBroadcastSubject("Study Abroad Masterclass: 5 Secrets to Top US & UK Admissions");
                            setBroadcastBody(`<h2>Dear Student,</h2><p>Join Ria Jain this Saturday for an exclusive live counselling session on crafting winning application strategies.</p><p><strong>Date:</strong> Saturday | 6:00 PM IST</p><p>Best regards,<br/>My Skill Counsellor Team</p>`);
                          }}
                          style={{ fontSize: "0.75rem", background: "#f1f5f9", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Template: Webinar Notice
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBroadcastSubject("Important Admission Deadlines & SOP Guidance Update");
                            setBroadcastBody(`<h2>Hello!</h2><p>As application deadlines approach for Fall 2026, here are the top 3 SOP guidelines every student should follow.</p><p>Book your 1-on-1 session with us to get your essays reviewed before submission.</p><p>Warmly,<br/>Ria Jain</p>`);
                          }}
                          style={{ fontSize: "0.75rem", background: "#f1f5f9", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Template: SOP Guidance
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={6}
                      required
                      placeholder="Write your email body here..."
                      value={broadcastBody}
                      onChange={(e) => setBroadcastBody(e.target.value)}
                      style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.95rem", fontFamily: "monospace" }}
                    />
                  </div>

                  {broadcastReport && (
                    <div style={{ padding: "15px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" }}>
                      <strong>🎉 Broadcast Execution Report:</strong>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        Total Target Recipients: {broadcastReport.total} | Successfully Sent: {broadcastReport.sent} | Failed: {broadcastReport.failed}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingBroadcast}
                    style={{
                      padding: "14px 28px",
                      backgroundColor: "var(--color-deep-teal)",
                      color: "#FFF",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      opacity: isSendingBroadcast ? 0.7 : 1
                    }}
                  >
                    <Mail size={18} />
                    {isSendingBroadcast
                      ? "Sending emails..."
                      : broadcastTarget === "custom"
                        ? `Send to ${manualEmails.length} recipient${manualEmails.length === 1 ? "" : "s"}`
                        : "Send Live Broadcast Email"}
                  </button>
                </form>
              </div>

              {/* BOTTOM: SUBSCRIBERS TABLE */}
              <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-deep-teal)" }}>Newsletter Subscribers ({subscribersList.length})</h3>
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem" }}
                  />
                </div>

                {subscribersList.length === 0 ? (
                  <p style={{ color: "#888", textAlign: "center", padding: "20px 0" }}>No newsletter subscribers found yet.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ background: "#FCFAF6", borderBottom: "1px solid var(--border-color)", color: "var(--color-deep-teal)" }}>
                        <th style={{ padding: "12px 16px", fontWeight: 600 }}>Subscriber Email</th>
                        <th style={{ padding: "12px 16px", fontWeight: 600 }}>Date Subscribed</th>
                        <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribersList
                        .filter(s => s.email?.toLowerCase().includes(subscriberSearch.toLowerCase()))
                        .map(s => (
                          <tr key={s.id} style={{ borderBottom: "1px solid #F0ECE1" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 500, color: "var(--color-deep-teal)" }}>✉ {s.email}</td>
                            <td style={{ padding: "12px 16px", color: "#666" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                              <button
                                onClick={() => handleDeleteSubscriber(s.id)}
                                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                                title="Remove subscriber"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>

            </motion.div>
          )}

          {/* ====================================================
             TAB 2: LEADS / INQUIRIES
             ==================================================== */}
          {activeTab === "inquiries" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              {/* SEARCH & FILTER BAR */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "30px"
              }}>
                <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
                  <Search size={18} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                  <input
                    type="text"
                    placeholder="Search leads by name, email, qualifications..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 45px",
                      borderRadius: "50px",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px", backgroundColor: "#E2DDD6", padding: "4px", borderRadius: "50px" }}>
                  {(["all", "uncontacted", "contacted"] as const).map(option => (
                    <button
                      key={option}
                      onClick={() => setInquiryFilter(option)}
                      style={{
                        padding: "8px 18px",
                        border: "none",
                        borderRadius: "50px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        backgroundColor: inquiryFilter === option ? "var(--color-deep-teal)" : "transparent",
                        color: inquiryFilter === option ? "white" : "var(--text-primary)",
                        transition: "all 0.2s"
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* LEADS TABLE CONTAINER */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-soft)",
                border: "1px solid var(--border-color)",
                overflow: "hidden"
              }}>
                {filteredInquiries.length === 0 ? (
                  <div style={{ padding: "50px", textAlign: "center", color: "var(--text-secondary)" }}>
                    <MessageSquare size={48} style={{ margin: "0 auto 15px auto", opacity: 0.3 }} />
                    <p>No lead inquiries matching your search or filters.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#FCFAF6", borderBottom: "2px solid var(--border-color)", color: "var(--color-deep-teal)", fontWeight: "bold" }}>
                        <th style={{ padding: "18px 24px" }}>Date</th>
                        <th style={{ padding: "18px 24px" }}>Student Details</th>
                        <th style={{ padding: "18px 24px" }}>Interest / Service</th>
                        <th style={{ padding: "18px 24px" }}>Qualifications</th>
                        <th style={{ padding: "18px 24px" }}>Follow-up</th>
                        <th style={{ padding: "18px 24px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inq) => (
                        <tr key={inq.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s" }} className="table-row-hover">
                          <td style={{ padding: "18px 24px", color: "var(--text-secondary)" }}>
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "18px 24px" }}>
                            <strong style={{ display: "block", color: "var(--color-deep-teal)" }}>{inq.name}</strong>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>{inq.email}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>{inq.phone}</span>
                          </td>
                          <td style={{ padding: "18px 24px" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: "5px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              backgroundColor: inq.service?.includes("Study Abroad") ? "rgba(45, 111, 122, 0.1)" : "rgba(77, 168, 179, 0.1)",
                              color: inq.service?.includes("Study Abroad") ? "var(--color-deep-teal)" : "var(--color-soft-teal)"
                            }}>
                              {inq.service}
                            </span>
                          </td>
                          <td style={{ padding: "18px 24px", color: "var(--text-secondary)" }}>
                            {inq.qualification}
                          </td>
                          <td style={{ padding: "18px 24px" }}>
                            <button
                              onClick={() => handleToggleContacted(inq.id, inq.isContacted)}
                              style={{
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "5px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                backgroundColor: inq.isContacted ? "rgba(168, 185, 163, 0.15)" : "rgba(217, 123, 102, 0.15)",
                                color: inq.isContacted ? "var(--color-deep-teal)" : "var(--color-muted-coral)"
                              }}
                            >
                              {inq.isContacted ? "Contacted" : "Need Action"}
                            </button>
                          </td>
                          <td style={{ padding: "18px 24px", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                              <button
                                onClick={() => setSelectedInquiry(inq)}
                                style={{
                                  border: "1px solid var(--color-soft-teal)",
                                  padding: "6px 12px",
                                  borderRadius: "5px",
                                  backgroundColor: "white",
                                  color: "var(--color-deep-teal)",
                                  cursor: "pointer",
                                  fontSize: "0.8rem",
                                  fontWeight: 500
                                }}
                              >
                                View Message
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                style={{
                                  border: "none",
                                  padding: "8px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                                  color: "#EF4444",
                                  cursor: "pointer"
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* ====================================================
             TAB 3: TESTIMONIALS
             ==================================================== */}
          {activeTab === "testimonials" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>Manage the success testimonials rendered on the stories page.</p>
                <button onClick={openAddTestimonial} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "var(--radius-sm)" }}>
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>

              {/* GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                {testimonialsList.map((t) => (
                  <div key={t.id} style={{
                    backgroundColor: "white",
                    borderRadius: "var(--radius-md)",
                    padding: "30px",
                    boxShadow: "var(--shadow-soft)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <p style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                        &quot;{t.text}&quot;
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                      <div>
                        <strong style={{ display: "block", color: "var(--color-deep-teal)" }}>{t.name}</strong>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-soft-teal)", fontWeight: 600 }}>{t.role}</span>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => openEditTestimonial(t)} style={{ border: "1px solid var(--border-color)", padding: "6px", borderRadius: "5px", background: "none", cursor: "pointer", color: "var(--color-soft-teal)" }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteTestimonial(t.id)} style={{ border: "none", padding: "6px", borderRadius: "5px", backgroundColor: "rgba(239, 68, 68, 0.08)", cursor: "pointer", color: "#EF4444" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====================================================
             TAB 4: BLOGS
             ==================================================== */}
          {activeTab === "blogs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>Add and edit guidance blogs for prospective students.</p>
                <button onClick={openAddBlog} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "var(--radius-sm)" }}>
                  <Plus size={16} /> Create Article
                </button>
              </div>

              {/* GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                {blogsList.map((b) => (
                  <div key={b.id} style={{
                    backgroundColor: "white",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-soft)",
                    border: "1px solid var(--border-color)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <div style={{ height: "160px", backgroundColor: "#ddd", position: "relative" }}>
                      <Image src={b.image || "/images/img_5289_1.jpg"} alt={b.title} fill style={{ objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: "var(--color-deep-teal)", color: "white", padding: "4px 10px", borderRadius: "30px", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>
                        {b.tag || "Counselling"}
                      </span>
                    </div>

                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <span style={{ fontSize: "0.75rem", color: "#888", marginBottom: "8px" }}>Read time: {b.readTime || "5 mins"}</span>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", lineHeight: "1.4", color: "var(--color-deep-teal)" }}>{b.title}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px", flexGrow: 1 }}>
                        {b.content?.substring(0, 100)}...
                      </p>

                      <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                        <button onClick={() => openEditBlog(b)} style={{ flex: 1, padding: "8px 0", border: "1px solid var(--border-color)", background: "none", borderRadius: "5px", cursor: "pointer", color: "var(--color-deep-teal)", fontWeight: 500, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <Edit2 size={12} /> Edit Post
                        </button>
                        <button onClick={() => handleDeleteBlog(b.id)} style={{ padding: "8px 12px", border: "none", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#EF4444", borderRadius: "5px", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====================================================
             TAB 5: SERVICES
             ==================================================== */}
          {activeTab === "services" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>Configure and list core service specializations.</p>
                <button onClick={openAddService} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "var(--radius-sm)" }}>
                  <Plus size={16} /> New Service
                </button>
              </div>

              {/* GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                {servicesList.map((s) => (
                  <div key={s.id} style={{
                    backgroundColor: "white",
                    borderRadius: "var(--radius-md)",
                    padding: "30px",
                    boxShadow: "var(--shadow-soft)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(77, 168, 179, 0.1)", color: "var(--color-deep-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className={s.icon || "fas fa-graduation-cap"}></i>
                        </div>
                        <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{s.title}</h3>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "20px" }}>
                        {s.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                      <button onClick={() => openEditService(s)} style={{ flex: 1, padding: "8px 0", border: "1px solid var(--border-color)", background: "none", borderRadius: "5px", cursor: "pointer", color: "var(--color-deep-teal)", fontWeight: 500, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Edit2 size={12} /> Edit Details
                      </button>
                      <button onClick={() => handleDeleteService(s.id)} style={{ padding: "8px 12px", border: "none", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#EF4444", borderRadius: "5px", cursor: "pointer" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====================================================
             TAB: FAQ MANAGER
             ==================================================== */}
          {activeTab === "faqs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>Manage the Frequently Asked Questions shown on the homepage.</p>
                <button onClick={openAddFaq} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "var(--radius-sm)" }}>
                  <Plus size={16} /> Add FAQ
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {faqsList.map((faq, idx) => (
                  <div key={faq.id} style={{ backgroundColor: "white", borderRadius: "var(--radius-md)", padding: "24px 28px", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-soft-teal)", fontWeight: 700, textTransform: "uppercase" }}>Q{idx + 1}</span>
                      <h4 style={{ margin: "6px 0 10px", color: "var(--color-deep-teal)", fontSize: "1rem" }}>{faq.question}</h4>
                      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65 }}>{faq.answer}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button onClick={() => openEditFaq(faq)} style={{ border: "1px solid var(--border-color)", padding: "7px", borderRadius: "6px", background: "none", cursor: "pointer", color: "var(--color-soft-teal)" }}><Edit2 size={15} /></button>
                      <button onClick={() => handleDeleteFaq(faq.id)} style={{ border: "none", padding: "7px", borderRadius: "6px", backgroundColor: "rgba(239,68,68,0.08)", cursor: "pointer", color: "#EF4444" }}><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====================================================
             TAB 6: SITE CONTENT (CMS)
             ==================================================== */}
          {activeTab === "cms" && (
            <ContentEditor initialContent={initialSiteContent} notify={showNotify} />
          )}

          </div>

        </div>
      </main>

      {/* ====================================================
         MODAL: LEADS DETAILS VIEW
         ==================================================== */}
      <AnimatePresence>
        {selectedInquiry && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(45, 111, 122, 0.4)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-md)",
                width: "90%",
                maxWidth: "600px",
                padding: "35px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-deep-teal)" }}>Lead Inquiry Details</h3>
                <button onClick={() => setSelectedInquiry(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>STUDENT NAME</span>
                    <strong style={{ color: "var(--color-deep-teal)" }}>{selectedInquiry.name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>QUALIFICATION</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedInquiry.qualification}</strong>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>PHONE</span>
                    <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
                      <Phone size={14} style={{ color: "var(--color-soft-teal)" }} />
                      {selectedInquiry.phone}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>EMAIL</span>
                    <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
                      <Mail size={14} style={{ color: "var(--color-soft-teal)" }} />
                      {selectedInquiry.email}
                    </strong>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "#888", display: "block" }}>INTERESTED SERVICE</span>
                  <strong style={{ color: "var(--color-muted-coral)" }}>{selectedInquiry.service}</strong>
                </div>

                <div style={{ backgroundColor: "#FAF9F5", padding: "16px", borderRadius: "5px", borderLeft: "4px solid var(--color-soft-teal)" }}>
                  <span style={{ fontSize: "0.75rem", color: "#888", display: "block", marginBottom: "6px" }}>MESSAGE</span>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{selectedInquiry.message}</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => {
                    handleToggleContacted(selectedInquiry.id, selectedInquiry.isContacted);
                    setSelectedInquiry(null);
                  }}
                  className="btn btn-primary"
                  style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "var(--radius-sm)" }}
                >
                  {selectedInquiry.isContacted ? "Mark Uncontacted" : "Mark as Contacted"}
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=My Skill Counsellor Consultation Inquiry&body=Hi ${selectedInquiry.name},%0D%0A%0D%0AThank you for reaching out to My Skill Counsellor. I would be happy to discuss your study abroad plans for ${selectedInquiry.service} further.%0D%0A%0D%0ABest regards,%0D%0ARia Jain`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "1px solid var(--color-soft-teal)",
                      color: "var(--color-deep-teal)",
                      fontWeight: 600,
                      fontSize: "0.9rem"
                    }}
                  >
                    <Mail size={16} /> Send Email
                  </a>
                  <button
                    onClick={() => {
                      handleDeleteInquiry(selectedInquiry.id);
                      setSelectedInquiry(null);
                    }}
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                      border: "none",
                      color: "#EF4444",
                      padding: "10px 16px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Delete Lead
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
         MODAL: TESTIMONIAL FORM
         ==================================================== */}
      <AnimatePresence>
        {showTestimonialModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(45, 111, 122, 0.4)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-md)",
                width: "90%",
                maxWidth: "500px",
                padding: "35px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-deep-teal)" }}>
                  {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <button onClick={() => setShowTestimonialModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>STUDENT / PARENT NAME</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Aarav Sharma"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>CREDENTIALS / ROLE</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Admitted to NYU / Parent"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>TESTIMONIAL CONTENT</label>
                  <textarea
                    value={testimonialForm.text}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter success story..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-body)" }}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setShowTestimonialModal(false)} style={{ padding: "10px 20px", border: "1px solid var(--border-color)", background: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.9rem" }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "5px" }}>
                    Save Testimonial
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
         MODAL: BLOG FORM
         ==================================================== */}
      <AnimatePresence>
        {showBlogModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(45, 111, 122, 0.4)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-md)",
                width: "90%",
                maxWidth: "650px",
                padding: "35px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-deep-teal)" }}>
                  {editingBlog ? "Edit Blog Article" : "Create Blog Article"}
                </h3>
                <button onClick={() => setShowBlogModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "4px" }}>ARTICLE TITLE</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => {
                        const t = e.target.value;
                        setBlogForm(prev => ({
                          ...prev,
                          title: t,
                          slug: editingBlog ? prev.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                        }));
                      }}
                      placeholder="e.g. Demystifying Study Abroad"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "4px" }}>SLUG (URL KEY)</label>
                    <input
                      type="text"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, slug: e.target.value }))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "4px" }}>TAG / CATEGORY</label>
                    <input
                      type="text"
                      value={blogForm.tag}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="e.g. Study Abroad"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "4px" }}>READ TIME</label>
                    <input
                      type="text"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, readTime: e.target.value }))}
                      placeholder="e.g. 5 mins"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "4px" }}>IMAGE PATH/URL</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        value={blogForm.image}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="e.g. /images/img.jpg"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
                      />
                      <ImageUploadButton onUploadSuccess={(url) => setBlogForm(prev => ({ ...prev, image: url }))} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "4px" }}>BODY CONTENT</label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write article details..."
                    rows={6}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem", fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setShowBlogModal(false)} style={{ padding: "10px 20px", border: "1px solid var(--border-color)", background: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.9rem" }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "5px" }}>
                    Save Article
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
         MODAL: SERVICE FORM
         ==================================================== */}
      <AnimatePresence>
        {showServiceModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(45, 111, 122, 0.4)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-md)",
                width: "90%",
                maxWidth: "500px",
                padding: "35px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-deep-teal)" }}>
                  {editingService ? "Edit Service" : "Add Service"}
                </h3>
                <button onClick={() => setShowServiceModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveService} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.5fr", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>SERVICE TITLE</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Visa Interview prep"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>FONT ICON</label>
                    <input
                      type="text"
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="fas fa-passport"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>DESCRIPTION</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this service package..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-body)" }}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button type="button" onClick={() => setShowServiceModal(false)} style={{ padding: "10px 20px", border: "1px solid var(--border-color)", background: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.9rem" }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "5px" }}>
                    Save Service
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================
         MODAL: FAQ FORM
         ==================================================== */}
      <AnimatePresence>
        {showFaqModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(37,95,107,0.4)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ backgroundColor: "white", borderRadius: "var(--radius-md)", width: "90%", maxWidth: "560px", padding: "35px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-deep-teal)" }}>{editingFaq ? "Edit FAQ" : "Add FAQ"}</h3>
                <button onClick={() => setShowFaqModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveFaq} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>QUESTION</label>
                  <input type="text" value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))} placeholder="e.g. When should I start planning study abroad?" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem" }} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>ANSWER</label>
                  <textarea value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} placeholder="Write a clear, helpful answer..." rows={5} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-body)", lineHeight: 1.6 }} required />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setShowFaqModal(false)} style={{ padding: "10px 20px", border: "1px solid var(--border-color)", background: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem" }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem", borderRadius: "8px" }}>Save FAQ</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
