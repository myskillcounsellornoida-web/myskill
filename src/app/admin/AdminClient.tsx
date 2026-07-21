"use client";

import React, { useState, useEffect } from "react";
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
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
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
  updateSiteContent,
  fetchBookings,
  updateBookingStatus,
  deleteBooking,
  fetchSubscribers,
  deleteSubscriber,
  sendBroadcastEmail,
  saveFaq,
  deleteFaq
} from "./actions";

// Default dummy data if database is empty or not configured
const initialDummyInquiries = [
  { id: 101, name: "Kabir Mehta", email: "kabir.mehta@gmail.com", phone: "+91 98123 45678", qualification: "Class 12 CBSE", service: "Global Study Abroad", message: "Hi Ria, I want to apply for Undergraduate Computer Science in the UK. Looking for shortlisting advice.", isContacted: false, createdAt: new Date(Date.now() - 4 * 3600000) },
  { id: 102, name: "Ananya Sen", email: "ananya.sen@outlook.com", phone: "+91 98765 43210", qualification: "B.Tech Graduate", service: "Profile Building & SOP", message: "Need help editing my SOP for MS in Data Science in USA. Deadline is next month.", isContacted: true, createdAt: new Date(Date.now() - 24 * 3600000) },
  { id: 103, name: "Pranav Joshi", email: "pranav.joshi@yahoo.com", phone: "+91 99000 12345", qualification: "Class 11 IB Board", service: "IELTS Preparation", message: "Looking for online IELTS mock test options and speaking practice feedback sessions.", isContacted: false, createdAt: new Date(Date.now() - 3 * 86400000) },
  { id: 104, name: "Diya Roy", email: "diya.roy@gmail.com", phone: "+91 96543 21098", qualification: "B.A. Psychology", service: "Global Study Abroad", message: "Interested in Masters in Clinical Psychology in Canada or Ireland. Please share details.", isContacted: true, createdAt: new Date(Date.now() - 5 * 86400000) }
];

const initialDummyTestimonials = [
  { id: 1, name: "Aarav Sharma", role: "Admitted to NYU", text: "Ria completely transformed my application. Her insights on my SOP made all the difference.", createdAt: new Date() },
  { id: 2, name: "Mrs. Kapoor", role: "Parent", text: "We were overwhelmed with the visa process for the UK. Ria handled everything smoothly and professionally.", createdAt: new Date() },
  { id: 3, name: "Simran Kaur", role: "IELTS Student (Band 8)", text: "The structured mock interviews and writing evaluations helped me score far above my target.", createdAt: new Date() }
];

const initialDummyBlogs = [
  { id: 1, title: "Demystifying Study Abroad: A Parent's Guide", slug: "parents-guide-study-abroad", content: "Detailed guide on finances, expectations, and safety.", tag: "Study Abroad", readTime: "5 mins", image: "/images/whatsapp_image_2024-12-24_at_14.13.32.jpeg", createdAt: new Date() },
  { id: 2, title: "How Profile Building Can Set Your Application Apart", slug: "profile-building-tips", content: "Academic grades alone are no longer enough for top schools. Here is how to build a portfolio.", tag: "Admissions", readTime: "8 mins", image: "/images/img_5289_1.jpg", createdAt: new Date() }
];

const initialDummyServices = [
  { id: 1, title: "Global Study Abroad Counselling", description: "End-to-end guidance for universities in UK, USA, Dubai, Canada and Europe.", icon: "fas fa-globe", createdAt: new Date() },
  { id: 2, title: "Profile Building & SOP Creation", description: "Helping students draft highly compelling statements of purpose and build extracurricular portfolios.", icon: "fas fa-file-alt", createdAt: new Date() },
  { id: 3, title: "IELTS & TOEFL Preparation", description: "Structured training with mock tests to clear cutoffs for top global universities.", icon: "fas fa-graduation-cap", createdAt: new Date() }
];

const initialDummySiteContent = [
  // ── Hero Carousel ──────────────────────────────────────────
  { key: "hero_badge_label", value: "We Turn Confusion into Career Fusion", updatedAt: new Date() },
  { key: "hero_slide1_caption", value: "Your Gateway to Top Global Universities", updatedAt: new Date() },
  { key: "hero_slide1_sub", value: "Don't leave your future to chance. Get admitted to elite institutions in the UK, USA, Canada, Dubai, and Europe with our proven admission strategies.", updatedAt: new Date() },
  { key: "hero_slide2_caption", value: "Stop Guessing, Start Building.", updatedAt: new Date() },
  { key: "hero_slide2_sub", value: "Transform confusion into absolute clarity. We help you map out a high-demand career path tailored to your unique strengths and aspirations.", updatedAt: new Date() },
  { key: "hero_slide3_caption", value: "Stand Out in a Sea of Applicants", updatedAt: new Date() },
  { key: "hero_slide3_sub", value: "Grades aren't enough. We craft compelling Statements of Purpose and build Ivy-league-worthy portfolios that make admissions officers take notice.", updatedAt: new Date() },
  { key: "hero_slide4_caption", value: "Nail Your Target IELTS Score & Visa", updatedAt: new Date() },
  { key: "hero_slide4_sub", value: "Achieve Band 8+ with our expert coaching. Once you're admitted, we handle the complex visa and financial paperwork so you don't have to.", updatedAt: new Date() },
  { key: "hero_slide5_caption", value: "We Walk With You — Every Step", updatedAt: new Date() },
  { key: "hero_slide5_sub", value: "From the first profile evaluation to your first day on campus. We provide end-to-end support so you never walk alone.", updatedAt: new Date() },
  { key: "hero_cta_primary", value: "Book a Free Consultation", updatedAt: new Date() },
  { key: "hero_cta_secondary", value: "Explore Services", updatedAt: new Date() },

  // ── Services Section (Homepage) ───────────────────────────
  { key: "services_section_title", value: "How We Support Your Journey", updatedAt: new Date() },
  { key: "services_section_subtitle", value: "End-to-end support across every stage of your study abroad journey.", updatedAt: new Date() },
  { key: "service1_title", value: "Before the Offer Letter", updatedAt: new Date() },
  { key: "service1_subtitle", value: "Building the Right Foundation", updatedAt: new Date() },
  { key: "service1_point1", value: "Career & Profile Assessment", updatedAt: new Date() },
  { key: "service1_point2", value: "Course & University Selection", updatedAt: new Date() },
  { key: "service1_point3", value: "SOP & LOR Guidance", updatedAt: new Date() },
  { key: "service1_point4", value: "IELTS / TOEFL Preparation", updatedAt: new Date() },
  { key: "service2_title", value: "After the Offer Letter", updatedAt: new Date() },
  { key: "service2_subtitle", value: "Preparing for the Move", updatedAt: new Date() },
  { key: "service2_point1", value: "Final University Selection", updatedAt: new Date() },
  { key: "service2_point2", value: "Comprehensive Visa Support", updatedAt: new Date() },
  { key: "service2_point3", value: "Financial Documentation", updatedAt: new Date() },
  { key: "service2_point4", value: "Pre-Departure Guidance", updatedAt: new Date() },
  { key: "service3_title", value: "After Departure", updatedAt: new Date() },
  { key: "service3_subtitle", value: "Settling into Your New Life", updatedAt: new Date() },
  { key: "service3_point1", value: "Arrival & Settling-In Support", updatedAt: new Date() },
  { key: "service3_point2", value: "Local Transport Navigation", updatedAt: new Date() },
  { key: "service3_point3", value: "SIM & Banking Setup", updatedAt: new Date() },
  { key: "service3_point4", value: "Campus Orientation", updatedAt: new Date() },

  // ── How It Works ──────────────────────────────────────────
  { key: "steps_section_title", value: "The 4-Step Journey", updatedAt: new Date() },
  { key: "step1_title", value: "Discovery Profile", updatedAt: new Date() },
  { key: "step1_desc", value: "We evaluate your academic background, interests and aspirations.", updatedAt: new Date() },
  { key: "step2_title", value: "Strategic Roadmap", updatedAt: new Date() },
  { key: "step2_desc", value: "We shortlist universities and map required tests like IELTS/TOEFL.", updatedAt: new Date() },
  { key: "step3_title", value: "Application & SOP", updatedAt: new Date() },
  { key: "step3_desc", value: "We meticulously build your portfolio and craft compelling essays.", updatedAt: new Date() },
  { key: "step4_title", value: "Visa & Pre-Departure", updatedAt: new Date() },
  { key: "step4_desc", value: "We secure your visa and prepare you for life in a new country.", updatedAt: new Date() },

  // ── About / Founder ───────────────────────────────────────
  { key: "about_heading", value: "Guiding You Beyond Borders", updatedAt: new Date() },
  { key: "about_para1", value: "Sometimes, all we need is the right guidance at the right time. That's why My Skill Counsellor was founded in 2023—to be a trusted guide, helping individuals navigate important academic and career decisions with clarity and confidence.", updatedAt: new Date() },
  { key: "about_para2", value: "As both a counsellor and a parent of an international student myself, I bring professional expertise and real-world understanding. Every student has a different story, pace, and aspiration.", updatedAt: new Date() },
  { key: "about_cta", value: "Book a Chat", updatedAt: new Date() },
  { key: "founder_name", value: "Ria Jain", updatedAt: new Date() },
  { key: "founder_title", value: "Lead Counsellor & Founder", updatedAt: new Date() },
  { key: "founder_badge1", value: "MA English", updatedAt: new Date() },
  { key: "founder_badge2", value: "CCCIS Certified", updatedAt: new Date() },
  { key: "founder_badge3", value: "Since 2023", updatedAt: new Date() },
  { key: "founder_badge4", value: "Parent of Int'l Student", updatedAt: new Date() },

  // ── Impact Statistics ─────────────────────────────────────
  { key: "stat_students", value: "500+", updatedAt: new Date() },
  { key: "stat_students_label", value: "Students Placed", updatedAt: new Date() },
  { key: "stat_universities", value: "1500+", updatedAt: new Date() },
  { key: "stat_universities_label", value: "Top Universities", updatedAt: new Date() },
  { key: "stat_career_paths", value: "160+", updatedAt: new Date() },
  { key: "stat_career_paths_label", value: "Career Paths", updatedAt: new Date() },
  { key: "stat_success_rate", value: "98%", updatedAt: new Date() },
  { key: "stat_success_rate_label", value: "Success Rate", updatedAt: new Date() },

  // ── Workshop / Masterclass ────────────────────────────────
  { key: "workshop_section_label", value: "Live Events", updatedAt: new Date() },
  { key: "workshop_section_heading", value: "Upcoming Masterclasses", updatedAt: new Date() },
  { key: "workshop_section_desc", value: "Join our free online masterclasses where we break down the Ivy League admission process, IELTS strategies, and profile-building secrets.", updatedAt: new Date() },
  { key: "workshop_title", value: "Mastering the Common App", updatedAt: new Date() },
  { key: "workshop_date", value: "August 15th, 2026 | 6:00 PM IST", updatedAt: new Date() },
  { key: "workshop_cta", value: "Register for Free", updatedAt: new Date() },

  // ── Testimonials ──────────────────────────────────────────
  { key: "testimonials_section_label", value: "Success Stories", updatedAt: new Date() },
  { key: "testimonials_section_title", value: "What Parents & Students Say", updatedAt: new Date() },
  { key: "testimonials_cta", value: "Read All Success Stories", updatedAt: new Date() },

  // ── Media / Recognition ───────────────────────────────────
  { key: "media_section_label", value: "In The Media", updatedAt: new Date() },
  { key: "media_section_title", value: "Recognized for Excellence", updatedAt: new Date() },
  { key: "media_article_caption", value: "Shah Times Feature on Teenage Independence and Restrictions", updatedAt: new Date() },

  // ── FAQs ──────────────────────────────────────────────────
  { key: "faq_section_label", value: "Clarifications", updatedAt: new Date() },
  { key: "faq_section_title", value: "Frequently Asked Questions", updatedAt: new Date() },
  { key: "faq1_q", value: "When is the right time to start planning for study abroad?", updatedAt: new Date() },
  { key: "faq1_a", value: "We recommend starting as early as Class 9. This gives ample time to build a robust profile and plan extracurriculars without rushing.", updatedAt: new Date() },
  { key: "faq2_q", value: "Do you guarantee university admissions?", updatedAt: new Date() },
  { key: "faq2_a", value: "While no consultant can guarantee admission to ivy-league universities, our track record speaks for itself. We maximise your chances by aligning your profile with university expectations.", updatedAt: new Date() },
  { key: "faq3_q", value: "Do you assist with selecting the right major or course?", updatedAt: new Date() },
  { key: "faq3_a", value: "Yes. We use detailed psychometric evaluations and industry insights to help you choose a course that aligns with both your passions and future market demand.", updatedAt: new Date() },
  { key: "faq4_q", value: "How do I start the process?", updatedAt: new Date() },
  { key: "faq4_a", value: "You can start by booking a free initial consultation through our contact page. We will assess your profile and discuss a personalized roadmap.", updatedAt: new Date() },

  // ── Contact Details ───────────────────────────────────────
  { key: "contact_phone", value: "+91 9990004878", updatedAt: new Date() },
  { key: "contact_email", value: "info@myskillcounsellor.com", updatedAt: new Date() },
  { key: "contact_location", value: "Noida, India", updatedAt: new Date() },
  { key: "whatsapp_number", value: "+91 9990004878", updatedAt: new Date() },
  { key: "instagram_url", value: "https://instagram.com/myskillcounsellor", updatedAt: new Date() },
  { key: "linkedin_url", value: "https://linkedin.com/in/riajain26", updatedAt: new Date() },

  // ── Footer ────────────────────────────────────────────────
  { key: "footer_tagline", value: "Empowering students with clarity, strategy, and confidence to achieve global university admissions.", updatedAt: new Date() },
  { key: "footer_copyright", value: "My Skill Counsellor. All Rights Reserved.", updatedAt: new Date() },

  // ── Page Meta ─────────────────────────────────────────────
  { key: "meta_title", value: "My Skill Counsellor | Career & Study Abroad Guidance by Ria Jain", updatedAt: new Date() },
  { key: "meta_description", value: "Expert career counselling, study abroad admissions, IELTS preparation, SOP building, and visa support by Ria Jain.", updatedAt: new Date() },
];

const initialDummyBookings: any[] = [];
const initialDummySubscribers: any[] = [];

const initialDummyFaqs = [
  { id: 1, question: "When is the right time to start planning for study abroad?", answer: "We recommend starting as early as Class 9. This gives ample time to build a robust profile and plan extracurriculars without rushing." },
  { id: 2, question: "Do you guarantee university admissions?", answer: "While no consultant can guarantee admission to ivy-league universities, our track record speaks for itself. We maximise your chances by aligning your profile with university expectations." },
  { id: 3, question: "When is the right time to start the application process?", answer: "We recommend starting as early as Class 9 or 10. This gives ample time to build a robust profile and plan extracurriculars without rushing." },
  { id: 4, question: "How is My Skill Counsellor different from other agencies?", answer: "We don't do cookie-cutter applications. Every student gets 1-on-1 personalised mentorship ensuring their SOP and portfolio is uniquely theirs." },
];

interface AdminClientProps {
  initialInquiries: any[];
  initialTestimonials: any[];
  initialBlogs: any[];
  initialServices: any[];
  initialSiteContent: any[];
  initialBookings?: any[];
  initialSubscribers?: any[];
  initialFaqs?: any[];
  dbConnected: boolean;
  dbError: string | null;
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
  dbConnected,
  dbError
}: AdminClientProps) {
  // Authorization State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "inquiries" | "subscribers" | "testimonials" | "blogs" | "services" | "cms" | "faqs">("dashboard");

  // FAQ State
  const [faqsList, setFaqsList] = useState<any[]>(initialDummyFaqs);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  // Mode state: If DB is not connected, use Memory state
  const [isDemoMode, setIsDemoMode] = useState(!dbConnected);
  
  // Data States (initialized with server props, or dummy data if demo mode/empty)
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [siteContentList, setSiteContentList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [subscribersList, setSubscribersList] = useState<any[]>([]);

  // Search & Filters
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "contacted" | "uncontacted">("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");

  // Broadcast Email Form State
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState<"all" | "subscribers" | "bookings" | "inquiries" | "custom">("all");
  const [customEmailInput, setCustomEmailInput] = useState("");
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

  // Initialize data
  useEffect(() => {
    if (dbConnected) {
      setInquiriesList(initialInquiries || []);
      setTestimonialsList(initialTestimonials || []);
      setBlogsList(initialBlogs || []);
      setServicesList(initialServices || []);
      setSiteContentList(initialSiteContent || []);
      setBookingsList(initialBookings || []);
      setSubscribersList(initialSubscribers || []);
      setFaqsList(initialFaqs || []);
    } else {
      setInquiriesList(initialDummyInquiries);
      setTestimonialsList(initialDummyTestimonials);
      setBlogsList(initialDummyBlogs);
      setServicesList(initialDummyServices);
      setSiteContentList(initialDummySiteContent);
      setBookingsList(initialDummyBookings);
      setSubscribersList(initialDummySubscribers);
      setFaqsList(initialDummyFaqs);
    }
  }, [initialInquiries, initialTestimonials, initialBlogs, initialServices, initialSiteContent, initialBookings, initialSubscribers, initialFaqs, dbConnected]);

  // Auth local check
  useEffect(() => {
    const isSaved = localStorage.getItem("msc_admin_auth") === "true";
    if (isSaved) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Secure Admin Passkey check
    if (username === "admin" && password === "RiaAdmin@2026") {
      setIsAuthenticated(true);
      localStorage.setItem("msc_admin_auth", "true");
      showNotify("Authorized successfully", "success");
    } else {
      setAuthError("Incorrect administrator credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("msc_admin_auth");
    showNotify("Logged out", "info");
  };

  const showNotify = (text: string, type: "success" | "error" | "info") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  /* ====================================================
     INQUIRIES BUSINESS LOGIC
     ==================================================== */
  const handleToggleContacted = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    
    // Update local UI immediately (Optimistic update)
    setInquiriesList(prev => prev.map(inq => inq.id === id ? { ...inq, isContacted: nextStatus } : inq));
    
    if (isDemoMode) {
      showNotify(`Updated status (Demo Mode)`, "success");
      return;
    }

    const res = await toggleInquiryContacted(id, nextStatus);
    if (res.success) {
      showNotify(`Lead marked as ${nextStatus ? "contacted" : "uncontacted"}.`, "success");
    } else {
      showNotify(`Error writing to DB: ${res.error}. Falling back to memory.`, "error");
      setIsDemoMode(true);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead inquiry?")) return;

    setInquiriesList(prev => prev.filter(inq => inq.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);

    if (isDemoMode) {
      showNotify("Deleted lead in Demo Mode.", "success");
      return;
    }

    const res = await deleteInquiry(id);
    if (res.success) {
      showNotify("Lead deleted successfully.", "success");
    } else {
      showNotify("Error: " + res.error, "error");
      setIsDemoMode(true);
    }
  };

  /* ====================================================
     BOOKINGS & SUBSCRIBERS & BROADCAST LOGIC
     ==================================================== */
  const handleUpdateBookingStatus = async (id: number, nextStatus: string) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
    const res = await updateBookingStatus(id, nextStatus);
    if (res.success) {
      showNotify(`Booking status updated to ${nextStatus}`, "success");
    } else {
      showNotify(`Error updating status: ${res.error}`, "error");
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Delete this session booking?")) return;
    setBookingsList(prev => prev.filter(b => b.id !== id));
    const res = await deleteBooking(id);
    if (res.success) {
      showNotify("Booking deleted", "success");
    } else {
      showNotify(`Error deleting: ${res.error}`, "error");
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    if (!confirm("Delete subscriber?")) return;
    setSubscribersList(prev => prev.filter(s => s.id !== id));
    const res = await deleteSubscriber(id);
    if (res.success) {
      showNotify("Subscriber removed", "success");
    } else {
      showNotify(`Error deleting: ${res.error}`, "error");
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      showNotify("Subject and Body are required.", "error");
      return;
    }
    if (broadcastTarget === "custom" && (!customEmailInput || !customEmailInput.includes("@"))) {
      showNotify("Valid email address required for custom target.", "error");
      return;
    }

    setIsSendingBroadcast(true);
    setBroadcastReport(null);

    const res = await sendBroadcastEmail(
      broadcastSubject,
      broadcastBody,
      broadcastTarget,
      customEmailInput
    );

    setIsSendingBroadcast(false);
    if (res.success && res.data) {
      setBroadcastReport(res.data);
      showNotify(`Broadcast executed! Sent ${res.data.sent} of ${res.data.total} emails.`, "success");
    } else {
      showNotify(`Broadcast failed: ${res.error}`, "error");
    }
  };

  /* ====================================================
     TESTIMONIALS BUSINESS LOGIC
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
    if (!testimonialForm.name || !testimonialForm.role || !testimonialForm.text) {
      showNotify("Please fill in all fields.", "error");
      return;
    }

    if (editingTestimonial) {
      // Edit
      setTestimonialsList(prev => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm } : t));
      
      if (!isDemoMode) {
        const res = await updateTestimonial(editingTestimonial.id, testimonialForm.name, testimonialForm.role, testimonialForm.text);
        if (res.success) {
          showNotify("Testimonial updated.", "success");
        } else {
          showNotify("DB error: " + res.error + ". Switched to Demo Mode.", "error");
          setIsDemoMode(true);
        }
      } else {
        showNotify("Testimonial updated (Demo Mode).", "success");
      }
    } else {
      // Add
      const newId = Date.now();
      const newT = { id: newId, ...testimonialForm, createdAt: new Date() };
      setTestimonialsList(prev => [newT, ...prev]);

      if (!isDemoMode) {
        const res = await createTestimonial(testimonialForm.name, testimonialForm.role, testimonialForm.text);
        if (res.success) {
          showNotify("Testimonial created.", "success");
        } else {
          showNotify("DB error: " + res.error + ". Switched to Demo Mode.", "error");
          setIsDemoMode(true);
        }
      } else {
        showNotify("Testimonial created (Demo Mode).", "success");
      }
    }

    setShowTestimonialModal(false);
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;

    setTestimonialsList(prev => prev.filter(t => t.id !== id));

    if (isDemoMode) {
      showNotify("Deleted in Demo Mode.", "success");
      return;
    }

    const res = await deleteTestimonial(id);
    if (res.success) {
      showNotify("Testimonial deleted.", "success");
    } else {
      showNotify("DB error: " + res.error, "error");
      setIsDemoMode(true);
    }
  };

  /* ====================================================
     BLOGS BUSINESS LOGIC
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
    if (!blogForm.title || !blogForm.slug || !blogForm.content) {
      showNotify("Title, slug, and content are required.", "error");
      return;
    }

    if (editingBlog) {
      setBlogsList(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogForm } : b));
      if (!isDemoMode) {
        const res = await updateBlog(editingBlog.id, blogForm.title, blogForm.slug, blogForm.content, blogForm.image, blogForm.tag, blogForm.readTime);
        if (res.success) {
          showNotify("Blog article updated.", "success");
        } else {
          showNotify("DB error. Switched to Demo Mode.", "error");
          setIsDemoMode(true);
        }
      } else {
        showNotify("Blog updated (Demo Mode).", "success");
      }
    } else {
      const newId = Date.now();
      const newB = { id: newId, ...blogForm, createdAt: new Date() };
      setBlogsList(prev => [newB, ...prev]);

      if (!isDemoMode) {
        const res = await createBlog(blogForm.title, blogForm.slug, blogForm.content, blogForm.image, blogForm.tag, blogForm.readTime);
        if (res.success) {
          showNotify("Blog article published.", "success");
        } else {
          showNotify("DB error. Switched to Demo Mode.", "error");
          setIsDemoMode(true);
        }
      } else {
        showNotify("Blog published (Demo Mode).", "success");
      }
    }
    setShowBlogModal(false);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setBlogsList(prev => prev.filter(b => b.id !== id));

    if (isDemoMode) {
      showNotify("Blog deleted in Demo Mode.", "success");
      return;
    }

    const res = await deleteBlog(id);
    if (res.success) {
      showNotify("Blog deleted.", "success");
    } else {
      showNotify("DB error: " + res.error, "error");
      setIsDemoMode(true);
    }
  };

  /* ====================================================
     SERVICES BUSINESS LOGIC
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
    if (!serviceForm.title || !serviceForm.description) {
      showNotify("Title and description are required.", "error");
      return;
    }

    if (editingService) {
      setServicesList(prev => prev.map(s => s.id === editingService.id ? { ...s, ...serviceForm } : s));
      if (!isDemoMode) {
        const res = await updateService(editingService.id, serviceForm.title, serviceForm.description, serviceForm.icon);
        if (res.success) {
          showNotify("Service updated.", "success");
        } else {
          showNotify("DB error. Switched to Demo Mode.", "error");
          setIsDemoMode(true);
        }
      } else {
        showNotify("Service updated (Demo Mode).", "success");
      }
    } else {
      const newId = Date.now();
      const newS = { id: newId, ...serviceForm, createdAt: new Date() };
      setServicesList(prev => [newS, ...prev]);

      if (!isDemoMode) {
        const res = await createService(serviceForm.title, serviceForm.description, serviceForm.icon);
        if (res.success) {
          showNotify("Service created.", "success");
        } else {
          showNotify("DB error. Switched to Demo Mode.", "error");
          setIsDemoMode(true);
        }
      } else {
        showNotify("Service created (Demo Mode).", "success");
      }
    }
    setShowServiceModal(false);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setServicesList(prev => prev.filter(s => s.id !== id));

    if (isDemoMode) {
      showNotify("Service deleted in Demo Mode.", "success");
      return;
    }

    const res = await deleteService(id);
    if (res.success) {
      showNotify("Service deleted.", "success");
    } else {
      showNotify("DB error: " + res.error, "error");
      setIsDemoMode(true);
    }
  };

  /* ====================================================
     FAQ BUSINESS LOGIC
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

  /* ====================================================
     CMS / SITE SETTINGS BUSINESS LOGIC
     ==================================================== */
  const handleLivePreviewChange = (key: string, value: string) => {
    const iframe = document.getElementById("live-preview-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "CMS_UPDATE", key, value }, "*");
    }
  };

  // Real-time Canva-like Live Preview syncing for all data models
  useEffect(() => {
    const iframe = document.getElementById("live-preview-iframe") as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;
    const data = showTestimonialModal 
      ? (editingTestimonial ? testimonialsList.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm } : t) : [...testimonialsList, { id: 999999, ...testimonialForm }])
      : testimonialsList;
    iframe.contentWindow.postMessage({ type: "TESTIMONIALS_PREVIEW", data }, "*");
  }, [testimonialForm, testimonialsList, showTestimonialModal, editingTestimonial]);

  useEffect(() => {
    const iframe = document.getElementById("live-preview-iframe") as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;
    const data = showServiceModal 
      ? (editingService ? servicesList.map(s => s.id === editingService.id ? { ...s, ...serviceForm } : s) : [...servicesList, { id: 999999, ...serviceForm }])
      : servicesList;
    iframe.contentWindow.postMessage({ type: "SERVICES_PREVIEW", data }, "*");
  }, [serviceForm, servicesList, showServiceModal, editingService]);

  useEffect(() => {
    const iframe = document.getElementById("live-preview-iframe") as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;
    const data = showBlogModal 
      ? (editingBlog ? blogsList.map(b => b.id === editingBlog.id ? { ...b, ...blogForm } : b) : [...blogsList, { id: 999999, ...blogForm }])
      : blogsList;
    iframe.contentWindow.postMessage({ type: "BLOGS_PREVIEW", data }, "*");
  }, [blogForm, blogsList, showBlogModal, editingBlog]);

  useEffect(() => {
    const iframe = document.getElementById("live-preview-iframe") as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;
    const data = showFaqModal 
      ? (editingFaq ? faqsList.map(f => f.id === editingFaq.id ? { ...f, ...faqForm } : f) : [...faqsList, { id: 999999, ...faqForm }])
      : faqsList;
    iframe.contentWindow.postMessage({ type: "FAQS_PREVIEW", data }, "*");
  }, [faqForm, faqsList, showFaqModal, editingFaq]);

  const handleUpdateCmsKey = async (key: string, value: string) => {
    setSiteContentList(prev => prev.map(item => item.key === key ? { ...item, value } : item));
    
    if (isDemoMode) {
      showNotify(`Updated ${key} in Demo Mode.`, "success");
      return;
    }

    const res = await updateSiteContent(key, value);
    if (res.success) {
      showNotify(`Updated ${key} successfully.`, "success");
    } else {
      showNotify(`DB error: ${res.error}. Switched to Demo Mode.`, "error");
      setIsDemoMode(true);
    }
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
  const contactedLeads = inquiriesList.filter(i => i.isContacted).length;
  const totalTestimonials = testimonialsList.length;
  const totalBlogs = blogsList.length;

  // Custom Chart Data: Inquiries by Service Category
  const getServiceStats = () => {
    const stats: Record<string, number> = {};
    inquiriesList.forEach(inq => {
      const s = inq.service || "Unspecified";
      stats[s] = (stats[s] || 0) + 1;
    });
    return stats;
  };
  const serviceStats = getServiceStats();

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 10% 20%, rgba(45, 111, 122, 0.95) 0%, rgba(77, 168, 179, 0.9) 90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "var(--font-body)"
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            borderRadius: "var(--radius-lg)",
            padding: "50px 40px",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center"
          }}
        >
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(77, 168, 179, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto"
          }}>
            <Lock size={32} style={{ color: "var(--color-deep-teal)" }} />
          </div>

          <h2 style={{ color: "var(--color-deep-teal)", marginBottom: "8px", fontSize: "1.8rem" }}>Admin Gateway</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "0.95rem" }}>
            Welcome back. Please input your secure administrator credentials.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ position: "relative", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username..."
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  outline: "none",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  backgroundColor: "#FCFAF6",
                  transition: "var(--transition-smooth)"
                }}
                autoFocus
              />
            </div>

            <div style={{ position: "relative", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
                ADMIN PASSWORD
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                style={{
                  width: "100%",
                  padding: "14px 45px 14px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  outline: "none",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  backgroundColor: "#FCFAF6",
                  transition: "var(--transition-smooth)"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "39px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {authError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: "#FDF2F2",
                  color: "#9B1C1C",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #FDE8E8"
                }}
              >
                <AlertCircle size={16} />
                <span>{authError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "14px 0",
                justifyContent: "center",
                borderRadius: "var(--radius-sm)",
                fontSize: "1.05rem"
              }}
            >
              Sign In to Panel
            </button>
          </form>

          <p style={{ marginTop: "30px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Tip: Try using default credentials <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "3px" }}>admin123</code>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
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
              { id: "cms", label: "Site Content (CMS)", icon: <Settings size={20} /> }
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
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        
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
              {activeTab === "cms" ? "Site Content Editor" : `${activeTab} Management`}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {isDemoMode ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(217, 123, 102, 0.1)",
                color: "var(--color-muted-coral)",
                padding: "8px 16px",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: "1px solid rgba(217, 123, 102, 0.2)"
              }}>
                <Info size={16} />
                <span>Demo Sandbox Mode (Database Unconnected)</span>
              </div>
            ) : (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(77, 168, 179, 0.1)",
                color: "var(--color-deep-teal)",
                padding: "8px 16px",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontWeight: 600
              }}>
                <Database size={16} />
                <span>Connected to Neon Database</span>
              </div>
            )}

            <a href="/" target="_blank" style={{
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
          <div style={{ flex: "1", padding: "40px", overflowY: "auto" }}>
          
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
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Lead Inquiry Activity (Weekly Trends)</h3>
                  <div style={{ position: "relative", width: "100%", height: "240px" }}>
                    {/* SVG GRAPH */}
                    <svg viewBox="0 0 500 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-soft-teal)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--color-soft-teal)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#eee" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#eee" strokeWidth="1" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#eee" strokeWidth="1" />
                      <line x1="0" y1="10" x2="500" y2="10" stroke="#eee" strokeWidth="1" />

                      {/* Area under the line */}
                      <path
                        d="M 10 180 Q 90 140 170 120 T 330 50 T 490 30 L 490 180 Z"
                        fill="url(#chartGradient)"
                      />
                      {/* Trend Line */}
                      <path
                        d="M 10 180 Q 90 140 170 120 T 330 50 T 490 30"
                        fill="none"
                        stroke="var(--color-soft-teal)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Markers */}
                      <circle cx="10" cy="180" r="5" fill="var(--color-deep-teal)" />
                      <circle cx="170" cy="120" r="5" fill="var(--color-deep-teal)" />
                      <circle cx="330" cy="50" r="5" fill="var(--color-deep-teal)" />
                      <circle cx="490" cy="30" r="5" fill="var(--color-deep-teal)" />

                      {/* Labels */}
                      <text x="10" y="196" fill="#888" fontSize="10" textAnchor="middle">Mon</text>
                      <text x="170" y="196" fill="#888" fontSize="10" textAnchor="middle">Wed</text>
                      <text x="330" y="196" fill="#888" fontSize="10" textAnchor="middle">Fri</text>
                      <text x="490" y="196" fill="#888" fontSize="10" textAnchor="middle">Sun</text>
                    </svg>
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
                    <svg width="150" height="150" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2DDD6" strokeWidth="4"></circle>
                      
                      {/* Segment 1: Study Abroad (60%) */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-deep-teal)" strokeWidth="4.5"
                        strokeDasharray="60 40" strokeDashoffset="25"></circle>
                      {/* Segment 2: IELTS Prep (25%) */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-soft-teal)" strokeWidth="4.5"
                        strokeDasharray="25 75" strokeDashoffset="65"></circle>
                      {/* Segment 3: SOP/Portfolio (15%) */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-muted-coral)" strokeWidth="4.5"
                        strokeDasharray="15 85" strokeDashoffset="90"></circle>
                    </svg>
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center"
                    }}>
                      <strong style={{ fontSize: "1.4rem", color: "var(--color-deep-teal)", display: "block" }}>{totalLeads}</strong>
                      <span style={{ fontSize: "0.7rem", color: "#888", textTransform: "uppercase" }}>Leads</span>
                    </div>
                  </div>
                  
                  {/* Chart Legend */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-deep-teal)" }}></span>
                        Study Abroad
                      </span>
                      <strong>{Math.round(0.6 * totalLeads) || 0}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-soft-teal)" }}></span>
                        IELTS/TOEFL Prep
                      </span>
                      <strong>{Math.round(0.25 * totalLeads) || 0}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-muted-coral)" }}></span>
                        SOP Editing
                      </span>
                      <strong>{Math.round(0.15 * totalLeads) || 0}</strong>
                    </div>
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
                    <span>All services running normally. Drizzle ORM connected.</span>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
                        <option value="custom">Custom Single Target Email</option>
                      </select>
                    </div>

                    {broadcastTarget === "custom" && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
                          Recipient Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. client@example.com"
                          value={customEmailInput}
                          onChange={(e) => setCustomEmailInput(e.target.value)}
                          style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                        />
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
                    {isSendingBroadcast ? "Sending Broadcast Mails..." : "Send Live Broadcast Email"}
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
                        "{t.text}"
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
                      <img src={b.image || "/images/img_5289_1.jpg"} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div>
                <p style={{ color: "var(--text-secondary)", marginBottom: "30px", lineHeight: 1.7 }}>
                  ✏️ <strong>Live Content Editor.</strong> Type in the fields below to instantly preview your changes on the right. Click away from the field to automatically save to the database.
                </p>

                {/* Group CMS keys by section */}
                {[
                  { section: "🎯 Hero Carousel", keys: ["hero_badge_label","hero_slide1_caption","hero_slide1_sub","hero_slide2_caption","hero_slide2_sub","hero_slide3_caption","hero_slide3_sub","hero_slide4_caption","hero_slide4_sub","hero_slide5_caption","hero_slide5_sub","hero_cta_primary","hero_cta_secondary"] },
                  { section: "🎓 Services Cards", keys: ["services_section_title","services_section_subtitle","service1_title","service1_subtitle","service1_point1","service1_point2","service1_point3","service1_point4","service2_title","service2_subtitle","service2_point1","service2_point2","service2_point3","service2_point4","service3_title","service3_subtitle","service3_point1","service3_point2","service3_point3","service3_point4"] },
                  { section: "🔢 How It Works Steps", keys: ["steps_section_title","step1_title","step1_desc","step2_title","step2_desc","step3_title","step3_desc","step4_title","step4_desc"] },
                  { section: "👤 About / Founder", keys: ["about_heading","about_para1","about_para2","about_cta","founder_name","founder_title","founder_badge1","founder_badge2","founder_badge3","founder_badge4"] },
                  { section: "📊 Impact Statistics", keys: ["stat_students","stat_students_label","stat_universities","stat_universities_label","stat_career_paths","stat_career_paths_label","stat_success_rate","stat_success_rate_label"] },
                  { section: "🎤 Workshop / Masterclass", keys: ["workshop_section_label","workshop_section_heading","workshop_section_desc","workshop_title","workshop_date","workshop_cta"] },
                  { section: "⭐ Testimonials", keys: ["testimonials_section_label","testimonials_section_title","testimonials_cta"] },
                  { section: "📰 Media / Recognition", keys: ["media_section_label","media_section_title","media_article_caption"] },
                  { section: "❓ Homepage FAQs", keys: ["faq_section_label","faq_section_title","faq1_q","faq1_a","faq2_q","faq2_a","faq3_q","faq3_a","faq4_q","faq4_a"] },
                  { section: "📞 Contact Details", keys: ["contact_phone","contact_email","contact_location","whatsapp_number","instagram_url","linkedin_url"] },
                  { section: "🦶 Footer", keys: ["footer_tagline","footer_copyright"] },
                  { section: "🔍 Page Meta (SEO)", keys: ["meta_title","meta_description"] },
                ].map(group => {
                  const items = siteContentList.filter(i => group.keys.includes(i.key));
                  if (!items.length) return null;
                  return (
                    <div key={group.section} style={{ marginBottom: "28px", backgroundColor: "white", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                      <div style={{ padding: "14px 24px", backgroundColor: "rgba(37,95,107,0.05)", borderBottom: "1px solid var(--border-color)" }}>
                        <h4 style={{ margin: 0, color: "var(--color-deep-teal)", fontSize: "0.95rem", fontWeight: 700 }}>{group.section}</h4>
                      </div>
                      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                        {items.map(item => (
                          <div key={item.key}>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                              {item.key.replace(/_/g, " ")}
                            </label>
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                              {item.value.length > 60 ? (
                                <textarea
                                  defaultValue={item.value}
                                  onChange={e => handleLivePreviewChange(item.key, e.target.value)}
                                  onBlur={e => handleUpdateCmsKey(item.key, e.target.value)}
                                  rows={3}
                                  style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none", lineHeight: 1.6 }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  defaultValue={item.value}
                                  onChange={e => handleLivePreviewChange(item.key, e.target.value)}
                                  onBlur={e => handleUpdateCmsKey(item.key, e.target.value)}
                                  style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.9rem", outline: "none" }}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          </div>

          {/* GLOBAL RIGHT PANE: Live Preview */}
          <div style={{ flex: "1.1", position: "relative", borderLeft: "2px solid var(--border-color)", background: "white", display: "flex", flexDirection: "column", boxShadow: "-5px 0 15px rgba(0,0,0,0.03)" }}>
            <div style={{ background: "var(--color-deep-teal)", padding: "12px 16px", color: "white", fontSize: "0.85rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fas fa-desktop"></i> Live Website Preview
              </div>
              <button 
                onClick={() => { const f = document.getElementById("live-preview-iframe") as HTMLIFrameElement; if(f) f.src = f.src; }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              >
                <i className="fas fa-sync-alt"></i> Refresh Preview
              </button>
            </div>
            <iframe id="live-preview-iframe" src={activeTab === "blogs" ? "/blog" : activeTab === "services" ? "/services" : "/"} style={{ width: "100%", flex: 1, border: "none" }} />
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
                    <input
                      type="text"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="e.g. /images/img.jpg"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "5px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
                    />
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
