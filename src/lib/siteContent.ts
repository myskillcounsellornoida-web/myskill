// Single source of truth for every CMS-editable text on the public website.
// The admin "Edit Website" editor is generated from CONTENT_GROUPS, and the
// public pages read the same keys through useCms(), so a field added here is
// immediately editable and previewable.

export type PreviewPage = "/" | "/services" | "/testimonials" | "/blog" | "/contact";

export interface ContentField {
  key: string;
  label: string;
  default: string;
  multiline?: boolean;
  /** Image/URL fields get an upload button instead of a colour picker. */
  kind?: "text" | "image" | "url";
}

export interface ContentGroup {
  id: string;
  title: string;
  page: PreviewPage;
  fields: ContentField[];
}

export const PREVIEW_PAGES: { path: PreviewPage; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/testimonials", label: "Testimonials" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
];

/** Colour overrides are stored alongside the text as `<key>__color`. */
export const COLOR_SUFFIX = "__color";
export const colorKey = (key: string) => `${key}${COLOR_SUFFIX}`;

export interface ThemeField {
  key: string;
  label: string;
  cssVar: string;
  default: string;
}

export const THEME_FIELDS: ThemeField[] = [
  { key: "theme_primary", label: "Primary (headings, header, footer)", cssVar: "--color-deep-teal", default: "#1C2B2D" },
  { key: "theme_secondary", label: "Secondary (buttons, icons)", cssVar: "--color-soft-teal", default: "#3E8E98" },
  { key: "theme_accent", label: "Accent (highlights, labels)", cssVar: "--color-muted-coral", default: "#B84A39" },
  { key: "theme_gold", label: "Gold (stats, badges)", cssVar: "--color-accent-gold", default: "#C5A880" },
  { key: "theme_background", label: "Page background", cssVar: "--bg-primary", default: "#F7F4ED" },
  { key: "theme_body_text", label: "Body text", cssVar: "--text-secondary", default: "#5C6263" },
];

const STAGE_DEFAULTS = [
  {
    title: "Before the Offer Letter",
    subtitle: "Building the Right Foundation",
    image: "/images/service_card_before_offer.png",
    points: ["Career & Profile Assessment", "Course & University Selection", "SOP & LOR Guidance", "IELTS / TOEFL Preparation"],
    desc: "The foundation of a successful study abroad journey begins years before the application. We guide students through strategic profile building and selection.",
    details: ["Career & Profile Assessment", "Strategic Profile Building", "Course & University Selection", "Study Abroad Planning", "SOP & LOR Guidance", "Application Support", "Interview Preparation", "IELTS / TOEFL Preparation"],
  },
  {
    title: "After the Offer Letter",
    subtitle: "Preparing for the Move",
    image: "/images/service_card_after_offer.png",
    points: ["Final University Selection", "Comprehensive Visa Support", "Financial Documentation", "Pre-Departure Guidance"],
    desc: "Receiving the offer is just the beginning. We handle the complex logistics of visas, finances, and pre-departure planning to ensure a smooth transition.",
    details: ["Final University Selection", "Offer Acceptance Guidance", "Comprehensive Visa Support", "Financial Documentation", "Accommodation Support", "Pre-Departure Guidance", "Packing & Travel Planning", "Banking, Insurance & Currency"],
  },
  {
    title: "After Departure",
    subtitle: "Settling into Your New Life",
    image: "/images/service_card_after_departure.png",
    points: ["Arrival & Settling-In Support", "Local Transport Navigation", "SIM & Banking Setup", "Campus Orientation"],
    desc: "Our support doesn't end at the airport. We remain your trusted point of contact as you navigate the initial weeks of settling into a new country.",
    details: ["Arrival & Settling-In Support", "Local Transport & Safety Navigation", "SIM, Banking & Healthcare Setup", "Campus & Academic Orientation", "Daily Living Support", "Personalised Check-ins"],
  },
];

const text = (key: string, label: string, def: string): ContentField => ({ key, label, default: def });
const para = (key: string, label: string, def: string): ContentField => ({ key, label, default: def, multiline: true });
const image = (key: string, label: string, def: string): ContentField => ({ key, label, default: def, kind: "image" });
const url = (key: string, label: string, def: string): ContentField => ({ key, label, default: def, kind: "url" });

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "hero",
    title: "Hero Carousel",
    page: "/",
    fields: [
      text("hero_badge_label", "Badge above headline", "We Turn Confusion into Career Fusion"),
      text("hero_slide1_caption", "Slide 1 · Headline", "Your Gateway to Top Global Universities"),
      para("hero_slide1_sub", "Slide 1 · Description", "Don't leave your future to chance. Get admitted to elite institutions in the UK, USA, Canada, Dubai, and Europe with our proven admission strategies."),
      image("hero_slide1_image", "Slide 1 · Background image", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop"),
      text("hero_slide2_caption", "Slide 2 · Headline", "Stop Guessing, Start Building."),
      para("hero_slide2_sub", "Slide 2 · Description", "Transform confusion into absolute clarity. We help you map out a high-demand career path tailored to your unique strengths and aspirations."),
      image("hero_slide2_image", "Slide 2 · Background image", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop"),
      text("hero_slide3_caption", "Slide 3 · Headline", "Stand Out in a Sea of Applicants"),
      para("hero_slide3_sub", "Slide 3 · Description", "Grades aren't enough. We craft compelling Statements of Purpose and build Ivy-league-worthy portfolios that make admissions officers take notice."),
      image("hero_slide3_image", "Slide 3 · Background image", "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop"),
      text("hero_slide4_caption", "Slide 4 · Headline", "Nail Your Target IELTS Score & Visa"),
      para("hero_slide4_sub", "Slide 4 · Description", "Achieve Band 8+ with our expert coaching. Once you're admitted, we handle the complex visa and financial paperwork so you don't have to."),
      image("hero_slide4_image", "Slide 4 · Background image", "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1600&auto=format&fit=crop"),
      text("hero_slide5_caption", "Slide 5 · Headline", "We Walk With You — Every Step"),
      para("hero_slide5_sub", "Slide 5 · Description", "From the first profile evaluation to your first day on campus. We provide end-to-end support so you never walk alone."),
      image("hero_slide5_image", "Slide 5 · Background image", "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=1600&auto=format&fit=crop"),
      text("hero_cta_primary", "Primary button", "Book a Free Consultation"),
      text("hero_cta_secondary", "Secondary button", "Explore Services"),
    ],
  },
  {
    id: "destinations",
    title: "Destinations & Institutions",
    page: "/",
    fields: [
      text("destinations_label", "Destinations label", "Where our students go"),
      text("partners_label", "Institution logos label", "Institutions in our network"),
    ],
  },
  {
    id: "stages",
    title: "Services · Three Stages",
    page: "/",
    fields: [
      text("services_section_title", "Section label", "Our Services"),
      text("services_heading", "Section heading", "How We Support"),
      text("services_heading_highlight", "Heading highlight (italic)", "Your Journey"),
      para("services_section_desc", "Section description", "End-to-end support across every stage of your study abroad journey."),
      ...[1, 2, 3].flatMap((n) => {
        const d = STAGE_DEFAULTS[n - 1];
        return [
          text(`service${n}_title`, `Stage ${n} · Title`, d.title),
          text(`service${n}_subtitle`, `Stage ${n} · Subtitle`, d.subtitle),
          ...d.points.map((p, i) => text(`service${n}_point${i + 1}`, `Stage ${n} · Home bullet ${i + 1}`, p)),
          para(`service${n}_desc`, `Stage ${n} · Services page description`, d.desc),
          para(`service${n}_details`, `Stage ${n} · Services page checklist (one per line)`, d.details.join("\n")),
          image(`service${n}_image`, `Stage ${n} · Image`, d.image),
        ];
      }),
      text("services_cta", "Button below cards", "View Full Service Details"),
    ],
  },
  {
    id: "steps",
    title: "How It Works",
    page: "/",
    fields: [
      text("steps_section_title", "Section label", "How It Works"),
      text("steps_heading", "Section heading", "The 4-Step Journey"),
      text("step1_title", "Step 1 · Title", "Discovery Profile"),
      para("step1_desc", "Step 1 · Description", "We evaluate your academic background, interests and aspirations."),
      text("step2_title", "Step 2 · Title", "Strategic Roadmap"),
      para("step2_desc", "Step 2 · Description", "We shortlist universities and map required tests like IELTS/TOEFL."),
      text("step3_title", "Step 3 · Title", "Application & SOP"),
      para("step3_desc", "Step 3 · Description", "We meticulously build your portfolio and craft compelling essays."),
      text("step4_title", "Step 4 · Title", "Visa & Pre-Departure"),
      para("step4_desc", "Step 4 · Description", "We secure your visa and prepare you for life in a new country."),
    ],
  },
  {
    id: "about",
    title: "About the Founder",
    page: "/",
    fields: [
      text("about_label", "Section label", "About Us"),
      text("about_title", "Heading", "Guiding You"),
      text("about_title_highlight", "Heading highlight (italic)", "Beyond Borders"),
      para("about_para1", "Paragraph 1", "Sometimes, all we need is the right guidance at the right time. That's why My Skill Counsellor was founded in 2023—to be a trusted guide, helping individuals navigate important academic and career decisions with clarity and confidence."),
      para("about_para2", "Paragraph 2", "As both a counsellor and a parent of an international student myself, I bring professional expertise and real-world understanding. Every student has a different story, pace, and aspiration."),
      text("about_cta", "Button", "Book a Chat"),
      text("founder_name", "Founder name", "Ria Jain"),
      text("founder_title", "Founder title", "Lead Counsellor & Founder"),
      image("founder_image", "Founder photo", "/images/ria_portrait.jpg"),
      text("founder_badge1", "Credential 1", "MA English Degree"),
      text("founder_badge2", "Credential 2", "EduMilestones Certified"),
      text("founder_badge3", "Credential 3", "CCCIS Certified"),
      text("founder_badge4", "Credential 4", "USA / UK / Canada Visa Certified"),
    ],
  },
  {
    id: "stats",
    title: "Impact Statistics",
    page: "/",
    fields: [
      text("stat_students", "Stat 1 · Number", "500+"),
      text("stat_students_label", "Stat 1 · Label", "Students Placed"),
      text("stat_universities", "Stat 2 · Number", "1500+"),
      text("stat_universities_label", "Stat 2 · Label", "Top Universities"),
      text("stat_career_paths", "Stat 3 · Number", "160+"),
      text("stat_career_paths_label", "Stat 3 · Label", "Career Paths"),
      text("stat_success_rate", "Stat 4 · Number", "98%"),
      text("stat_success_rate_label", "Stat 4 · Label", "Success Rate"),
    ],
  },
  {
    id: "testimonials_home",
    title: "Testimonials (Home)",
    page: "/",
    fields: [
      text("testimonials_section_label", "Section label", "Success Stories"),
      text("testimonials_section_title", "Section heading", "What Parents & Students Say"),
      text("testimonials_cta", "Button", "Read All Success Stories"),
    ],
  },
  {
    id: "gallery",
    title: "Moments Gallery",
    page: "/",
    fields: [
      text("gallery_section_label", "Section label", "In Action"),
      text("gallery_section_title", "Section heading", "Workshops, Schools & Fairs"),
      para("gallery_section_desc", "Section description", "From school career programs to study-abroad fairs, we meet students where they are."),
    ],
  },
  {
    id: "workshop",
    title: "Workshop / Masterclass",
    page: "/",
    fields: [
      text("workshop_section_label", "Section label", "Live Events"),
      text("workshop_section_heading", "Heading", "Upcoming Masterclasses"),
      para("workshop_section_desc", "Description", "Join our free online masterclasses where we break down the Ivy League admission process, IELTS strategies, and profile-building secrets."),
      text("workshop_title", "Event title", "Mastering the Common App"),
      text("workshop_date", "Event date", "August 15th, 2026 | 6:00 PM IST"),
      text("workshop_cta", "Button", "Register for Free"),
      image("workshop_image", "Image", "/images/whatsapp_image_2024-12-30_at_15.24.05.jpeg"),
    ],
  },
  {
    id: "media",
    title: "Media & Recognition",
    page: "/",
    fields: [
      text("media_section_label", "Section label", "In The Media"),
      text("media_section_title", "Section heading", "Recognized for Excellence"),
      text("media_item1_caption", "Feature 1 · Caption", "Shah Times feature on teenage independence"),
      text("media_item2_caption", "Feature 2 · Caption", "Perfect Woman — Dynamic Woman interview"),
      text("media_item3_caption", "Feature 3 · Caption", "Nominee — 9 Perfect Achievers Award 2024"),
      text("media_item4_caption", "Feature 4 · Caption", "Live session with Perfect Woman magazine"),
    ],
  },
  {
    id: "faq_home",
    title: "FAQs (Home)",
    page: "/",
    fields: [
      text("faq_section_label", "Section label", "Clarifications"),
      text("faq_section_title", "Section heading", "Frequently Asked Questions"),
      text("faq1_q", "Fallback Q1", "When is the right time to start planning for study abroad?"),
      para("faq1_a", "Fallback A1", "We recommend starting as early as Class 9. This gives ample time to build a robust profile and plan extracurriculars without rushing."),
      text("faq2_q", "Fallback Q2", "Do you guarantee university admissions?"),
      para("faq2_a", "Fallback A2", "While no consultant can guarantee admission to ivy-league universities, our track record speaks for itself. We maximise your chances by aligning your profile with university expectations."),
      text("faq3_q", "Fallback Q3", "Do you assist with selecting the right major or course?"),
      para("faq3_a", "Fallback A3", "Yes. We use detailed psychometric evaluations and industry insights to help you choose a course that aligns with both your passions and future market demand."),
      text("faq4_q", "Fallback Q4", "How do I start the process?"),
      para("faq4_a", "Fallback A4", "You can start by booking a free initial consultation through our contact page. We will assess your profile and discuss a personalized roadmap."),
    ],
  },
  {
    id: "cta_band",
    title: "Call-to-Action Banner",
    page: "/",
    fields: [
      text("cta_title", "Heading", "Ready to Write Your Own Success Story?"),
      para("cta_desc", "Description", "Book a free strategy session and leave with a clear, personalised roadmap for your study abroad journey."),
      text("cta_button", "Button", "Book Your Free Strategy Session"),
    ],
  },
  {
    id: "services_page",
    title: "Services Page",
    page: "/services",
    fields: [
      text("services_hero_label", "Hero label", "Our Offerings"),
      text("services_hero_title", "Hero heading", "Comprehensive Counselling Services"),
      para("services_hero_sub", "Hero description", "End-to-end guidance tailored to every stage of your academic journey — from the first profile assessment to settling into your new dorm room."),
      image("services_hero_image", "Hero image", "/images/hero_services_page.png"),
      text("services_stages_label", "Stages label", "Step-By-Step Journey"),
      text("services_stages_title", "Stages heading", "The Three Pillars of Guidance"),
      para("services_stages_desc", "Stages description", "Explore how our structured process walks alongside you before application, during decision-making, and after arrival."),
      text("services_stage_cta", "Stage button", "Discuss Your Stage"),
      text("services_programs_label", "Programs label", "Additional Offerings"),
      text("services_programs_title", "Programs heading", "Specialized Programs & Guidance"),
      text("services_faq_label", "FAQ label", "Services FAQ"),
      text("services_faq_title", "FAQ heading", "Frequently Asked Questions"),
    ],
  },
  {
    id: "testimonials_page",
    title: "Testimonials Page",
    page: "/testimonials",
    fields: [
      text("testimonials_hero_label", "Hero label", "Our Impact"),
      text("testimonials_hero_title", "Hero heading", "Success Stories"),
      para("testimonials_hero_sub", "Hero description", "Hear directly from students and parents who turned their global education dreams into reality with our guidance."),
      image("testimonials_hero_image", "Hero image", "/images/hero_testimonials_page.png"),
      text("tstat1_value", "Stat 1 · Number", "500+"),
      text("tstat1_label", "Stat 1 · Label", "Successful Admits"),
      text("tstat2_value", "Stat 2 · Number", "250+"),
      text("tstat2_label", "Stat 2 · Label", "Programs Mapped"),
      text("tstat3_value", "Stat 3 · Number", "50+"),
      text("tstat3_label", "Stat 3 · Label", "Partner Universities"),
      text("tstat4_value", "Stat 4 · Number", "10+"),
      text("tstat4_label", "Stat 4 · Label", "Years of Experience"),
      text("press_label", "Press label", "Press Recognition"),
      text("press_title", "Press heading", "Featured in Shah Times"),
      para("press_desc", "Press description", "My Skill Counsellor's approach to profile building and transparent university admissions has been recognized by leading regional publications. We believe in providing actionable, honest advice to every student."),
    ],
  },
  {
    id: "blog_page",
    title: "Blog Page",
    page: "/blog",
    fields: [
      text("blog_hero_label", "Hero label", "Insights & Advice"),
      text("blog_hero_title", "Hero heading", "Counselling Blog & Articles"),
      para("blog_hero_sub", "Hero description", "Expert advice, personal journeys, and comprehensive guides for students and parents navigating global education."),
      image("blog_hero_image", "Hero image", "/images/hero_blogs_page.png"),
      text("blog_author_label", "Author card label", "Lead Editor"),
      para("blog_author_bio", "Author bio", "Founder of My Skill Counsellor, Certified Career Counsellor (EduMilestones, CCCIS), and MA English graduate. Ria brings professional expertise and real-world understanding as both a counsellor and parent of an international student."),
      text("blog_newsletter_title", "Newsletter heading", "Subscribe to Our Newsletter"),
      para("blog_newsletter_desc", "Newsletter description", "Get the latest admission trends, university updates, and test prep tips delivered straight to your inbox every month."),
    ],
  },
  {
    id: "contact_page",
    title: "Contact Page",
    page: "/contact",
    fields: [
      text("contact_hero_label", "Hero label", "Get in Touch"),
      text("contact_hero_title", "Hero heading", "Contact Us"),
      para("contact_hero_sub", "Hero description", "Tell us where you are in your journey and we'll get back to you within 24 hours."),
      image("contact_hero_image", "Hero image", "/images/whatsapp_image_2024-12-24_at_14.13.32.jpeg"),
      text("contact_intro_label", "Intro label", "Reach Out"),
      text("contact_intro_title", "Intro heading", "Start a Conversation"),
      para("contact_intro_desc", "Intro text", "Whether you are a parent exploring study abroad options or a student looking for profile building and career clarity, we are here to support you at every stage."),
      text("contact_form_title", "Form heading", "Submit an Enquiry"),
      text("contact_hours", "Phone hours", "Mon-Sat, 9am - 7pm IST"),
      text("contact_reply_time", "Email reply time", "We typically reply within 24 hours"),
      text("contact_visit_note", "Location note", "Virtual Consultations Available Globally"),
    ],
  },
  {
    id: "contact",
    title: "Contact Details & Social",
    page: "/contact",
    fields: [
      text("contact_phone", "Phone", "+91 9990004878"),
      text("contact_email", "Email", "info@myskillcounsellor.com"),
      text("contact_location", "Location", "Noida, India"),
      url("whatsapp_url", "WhatsApp link", "https://wa.me/message/24XQYF3LERXWA1"),
      url("instagram_url", "Instagram link", "https://instagram.com/myskillcounsellor"),
      url("linkedin_url", "LinkedIn link", "https://www.linkedin.com/in/riajain26"),
    ],
  },
  {
    id: "footer",
    title: "Footer",
    page: "/",
    fields: [
      para("footer_tagline", "Tagline", "Empowering students with clarity, strategy, and confidence to achieve global university admissions."),
      text("footer_copyright", "Copyright text (year is added automatically)", "My Skill Counsellor. All Rights Reserved."),
    ],
  },
  {
    id: "seo",
    title: "SEO (browser tab & Google)",
    page: "/",
    fields: [
      text("meta_title", "Page title", "My Skill Counsellor | Career & Study Abroad Guidance by Ria Jain"),
      para("meta_description", "Meta description", "Expert career counselling, study abroad admissions, IELTS preparation, SOP building, and visa support by Ria Jain. Get personalized guidance to achieve your academic goals."),
    ],
  },
];

export const DEFAULT_CONTENT: Record<string, string> = Object.fromEntries(
  CONTENT_GROUPS.flatMap((g) => g.fields.map((f) => [f.key, f.default]))
);
