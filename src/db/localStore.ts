import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "db.json");

export interface LocalData {
  inquiries: any[];
  testimonials: any[];
  blogs: any[];
  services: any[];
  siteContent: Record<string, string>;
  faqs: any[];
  bookings: any[];
  subscribers: any[];
}

const defaultData: LocalData = {
  inquiries: [
    {
      id: 101,
      name: "Kabir Mehta",
      email: "kabir.mehta@gmail.com",
      phone: "+91 98123 45678",
      qualification: "Class 12 CBSE",
      service: "Global Study Abroad",
      message: "Hi Ria, I want to apply for Undergraduate Computer Science in the UK. Looking for shortlisting advice.",
      isContacted: false,
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: 102,
      name: "Ananya Sen",
      email: "ananya.sen@outlook.com",
      phone: "+91 98765 43210",
      qualification: "B.Tech Graduate",
      service: "Profile Building & SOP",
      message: "Need help editing my SOP for MS in Data Science in USA. Deadline is next month.",
      isContacted: true,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    }
  ],
  testimonials: [
    { id: 1, name: "Aarav Sharma", role: "Admitted to NYU", text: "Ria completely transformed my application. Her insights on my SOP made all the difference.", createdAt: new Date().toISOString() },
    { id: 2, name: "Mrs. Kapoor", role: "Parent", text: "We were overwhelmed with the visa process for the UK. Ria handled everything smoothly and professionally.", createdAt: new Date().toISOString() },
    { id: 3, name: "Simran Kaur", role: "IELTS Student (Band 8)", text: "The structured mock interviews and writing evaluations helped me score far above my target.", createdAt: new Date().toISOString() },
    { id: 4, name: "Rahul Desai", role: "Admitted to University of Toronto", text: "The profile building guidance I received was spectacular. I knew exactly which extracurriculars to focus on.", createdAt: new Date().toISOString() }
  ],
  blogs: [
    {
      id: 1,
      image: "/images/poster_journey.png",
      title: "One Story Step: Daily Lessons from My Path (Day 0)",
      tag: "Personal Journey & Mindset",
      readTime: "Published on LinkedIn",
      desc: "Insights on starting a counselling journey, personal growth, and taking small consistent steps towards your career goals.",
      content: `Every journey begins with a single step. When students first approach career counselling, they often feel overwhelmed by the sheer magnitude of decisions ahead—choosing a major, selecting universities across different continents, writing Statements of Purpose, and preparing for standardized tests.

My philosophy at My Skill Counsellor is centered on breaking down this monumental process into daily, manageable actions: 'One Story Step'.

1. **Embrace Your Unique Narrative**: No two students have the same background or aspirations. Admissions committees at top global universities don't look for flawless robots—they seek authentic human stories of curiosity, effort, and growth.

2. **Focus on Small Daily Progress**: Profile building isn't achieved overnight. Spending 30 minutes a day reading research papers, working on a passion project, or refining an essay draft yields exponential growth over 12 months.

3. **Self-Awareness Over Popularity**: Choosing a university based purely on rankings often leads to misalignment. True success comes from selecting programs that align with your personality, learning style, and long-term career goals.

As we take this journey together, remember: progress is not a sprint; it is the compound interest of daily, focused effort.`,
      linkedinCTA: "Originally published as part of my daily LinkedIn thoughts. Have thoughts or questions on starting your career path? Like, comment, and connect with me on LinkedIn to join the discussion!",
      url: "https://www.linkedin.com/pulse/one-story-step-daily-lessons-from-my-path-day-0-ria-vkf2c",
      slug: "one-story-step-day-0",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      image: "/images/poster_study_abroad.png",
      title: "A Mother's Journey of Learning to Let Go",
      tag: "Parent Insights",
      readTime: "Published on LinkedIn",
      desc: "A personal perspective on supporting children as they prepare for international education and independence.",
      content: `As a career counsellor and a mother who has supported her own child through the journey of studying abroad, I have walked in both shoes. I understand the intense mix of pride, excitement, and quiet anxiety that fills a parent's heart when their child prepares to cross oceans for higher education.

Navigating this transition requires a delicate balance between guiding and letting go.

1. **Shifting from Director to Anchor**: As parents, our instinct is to protect and manage every detail. However, preparing a student for international living requires allowing them to lead their application process, make choices, and solve problems independently while knowing we remain their steady anchor.

2. **Open Conversations Around Budget & Expectations**: Financial transparency early in the process creates trust. Discussing tuition, living expenses, and scholarships openly prevents last-minute disappointments and ensures your child understands the value of investment in their education.

3. **Fostering Real-World Independence**: Long before packing suitcases, help your child master basic life skills—budgeting, cooking, basic healthcare navigation, and time management. Confidence in daily living is as crucial as academic readiness.

To every parent reading this: your dedication has laid the foundation. Trust in the values and strength you have instilled in your child as they step into the world.`,
      linkedinCTA: "This personal reflection resonated deeply with many fellow parents on LinkedIn. Are you a parent navigating international admissions? Share your thoughts or leave a comment on LinkedIn!",
      url: "https://www.linkedin.com/posts/riajain26_a-mothers-journey-of-learning-to-let-go-activity-7477334864858345472-c7NN?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAClBJu4BRZFv7BreULj10-xogiz1UcSS78E",
      slug: "a-mothers-journey-learning-to-let-go",
      createdAt: new Date().toISOString()
    }
  ],
  services: [
    { id: 1, title: "Global Study Abroad Counselling", description: "End-to-end guidance for universities in UK, USA, Dubai, Canada and Europe.", icon: "fas fa-globe", createdAt: new Date().toISOString() },
    { id: 2, title: "Profile Building & SOP Creation", description: "Helping students draft highly compelling statements of purpose and build extracurricular portfolios.", icon: "fas fa-file-alt", createdAt: new Date().toISOString() },
    { id: 3, title: "IELTS & TOEFL Preparation", description: "Structured training with mock tests to clear cutoffs for top global universities.", icon: "fas fa-graduation-cap", createdAt: new Date().toISOString() }
  ],
  siteContent: {
    hero_badge_label: "We Turn Confusion into Career Fusion",
    hero_slide1_caption: "Your Gateway to Top Global Universities",
    hero_slide1_sub: "Don't leave your future to chance. Get admitted to elite institutions in the UK, USA, Canada, Dubai, and Europe with our proven admission strategies.",
    founder_name: "Ria Jain",
    founder_title: "Lead Counsellor & Founder",
    contact_phone: "+91 9990004878",
    contact_email: "info@myskillcounsellor.com"
  },
  faqs: [
    { id: 1, question: "When is the right time to start planning for study abroad?", answer: "We recommend starting as early as Class 9. This gives ample time to build a robust profile and plan extracurriculars without rushing." },
    { id: 2, question: "Do you guarantee university admissions?", answer: "While no consultant can guarantee admission to ivy-league universities, our track record speaks for itself. We maximise your chances by aligning your profile with university expectations." }
  ],
  bookings: [
    {
      id: 201,
      name: "Rohan Varma",
      email: "rohan.varma@example.com",
      phone: "+91 98765 00011",
      service: "Global Study Abroad Counselling",
      bookingDate: "2026-07-25",
      bookingTime: "11:00 AM",
      notes: "Interested in UK Master's degree programs",
      status: "confirmed",
      createdAt: new Date().toISOString()
    }
  ],
  subscribers: [
    {
      id: 301,
      email: "subscriber1@example.com",
      name: "Rohan Varma",
      isSubscribed: true,
      createdAt: new Date().toISOString()
    }
  ]
};

export function getLocalData(): LocalData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
      return defaultData;
    }
    const content = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading local DB file:", error);
    return defaultData;
  }
}

export function saveLocalData(data: LocalData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local DB file:", error);
  }
}
