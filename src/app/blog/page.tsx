import { db } from "@/db";
import { blogs as blogsTable } from "@/db/schema";
import BlogClient from "@/components/BlogClient";

export const revalidate = 60;

const defaultBlogs = [
  {
    id: 1,
    img: "/images/poster_journey.png",
    title: "One Story Step: Daily Lessons from My Path (Day 0)",
    category: "Personal Journey & Mindset",
    date: "Published on LinkedIn",
    desc: "Insights on starting a counselling journey, personal growth, and taking small consistent steps towards your career goals.",
    content: `Every journey begins with a single step. When students first approach career counselling, they often feel overwhelmed by the sheer magnitude of decisions ahead—choosing a major, selecting universities across different continents, writing Statements of Purpose, and preparing for standardized tests.

My philosophy at My Skill Counsellor is centered on breaking down this monumental process into daily, manageable actions: 'One Story Step'.

1. **Embrace Your Unique Narrative**: No two students have the same background or aspirations. Admissions committees at top global universities don't look for flawless robots—they seek authentic human stories of curiosity, effort, and growth.

2. **Focus on Small Daily Progress**: Profile building isn't achieved overnight. Spending 30 minutes a day reading research papers, working on a passion project, or refining an essay draft yields exponential growth over 12 months.

3. **Self-Awareness Over Popularity**: Choosing a university based purely on rankings often leads to misalignment. True success comes from selecting programs that align with your personality, learning style, and long-term career goals.

As we take this journey together, remember: progress is not a sprint; it is the compound interest of daily, focused effort.`,
    linkedinCTA: "Originally published as part of my daily LinkedIn thoughts. Have thoughts or questions on starting your career path? Like, comment, and connect with me on LinkedIn to join the discussion!",
    url: "https://www.linkedin.com/pulse/one-story-step-daily-lessons-from-my-path-day-0-ria-vkf2c"
  },
  {
    id: 2,
    img: "/images/poster_study_abroad.png",
    title: "A Mother's Journey of Learning to Let Go",
    category: "Parent Insights",
    date: "Published on LinkedIn",
    desc: "A personal perspective on supporting children as they prepare for international education and independence.",
    content: `As a career counsellor and a mother who has supported her own child through the journey of studying abroad, I have walked in both shoes. I understand the intense mix of pride, excitement, and quiet anxiety that fills a parent's heart when their child prepares to cross oceans for higher education.

Navigating this transition requires a delicate balance between guiding and letting go.

1. **Shifting from Director to Anchor**: As parents, our instinct is to protect and manage every detail. However, preparing a student for international living requires allowing them to lead their application process, make choices, and solve problems independently while knowing we remain their steady anchor.

2. **Open Conversations Around Budget & Expectations**: Financial transparency early in the process creates trust. Discussing tuition, living expenses, and scholarships openly prevents last-minute disappointments and ensures your child understands the value of investment in their education.

3. **Fostering Real-World Independence**: Long before packing suitcases, help your child master basic life skills—budgeting, cooking, basic healthcare navigation, and time management. Confidence in daily living is as crucial as academic readiness.

To every parent reading this: your dedication has laid the foundation. Trust in the values and strength you have instilled in your child as they step into the world.`,
    linkedinCTA: "This personal reflection resonated deeply with many fellow parents on LinkedIn. Are you a parent navigating international admissions? Share your thoughts or leave a comment on LinkedIn!",
    url: "https://www.linkedin.com/posts/riajain26_a-mothers-journey-of-learning-to-let-go-activity-7477334864858345472-c7NN?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAClBJu4BRZFv7BreULj10-xogiz1UcSS78E"
  },
  {
    id: 3,
    img: "/images/poster_career_compass.png",
    title: "Career Story Counsellor — Part 1: Finding Your Authentic Voice",
    category: "Career Strategy",
    date: "Published on LinkedIn",
    desc: "Deep dive into career storytelling, identifying strengths, and helping students find their authentic direction.",
    content: `When university admissions officers review thousands of Statements of Purpose (SOPs), test scores and grades quickly blend together. What makes an application truly unforgettable is a compelling, authentic career story.

Career storytelling is not about exaggerating achievements or using complex vocabulary; it is about articulating your 'why'.

1. **Uncovering the Catalyst**: Why did you choose this field? Was it a childhood curiosity, a real-world problem you witnessed, or a specific project that sparked your interest? Identifying this catalyst gives your application a strong, memorable theme.

2. **Connecting Past Projects to Future Impact**: Admissions committees want to see how your past coursework, internships, and extracurricular activities connect logically to the master's or bachelor's program you are applying for—and how that program will enable your future career vision.

3. **Demonstrating Resilience**: Imperfections in your academic record aren't deal-breakers if explained with honesty and maturity. Showing how you overcame a challenge or learned from a setback demonstrates the psychological resilience required for university success.

Crafting your career story takes introspection and multiple drafts. Take the time to discover your authentic voice.`,
    linkedinCTA: "Read Part 1 of the Career Story series on LinkedIn. Want to share your thoughts on SOP writing or ask a question? Join the conversation on LinkedIn!",
    url: "https://www.linkedin.com/pulse/career-story-counsellor-part-1-ria-lnoxc"
  },
  {
    id: 4,
    img: "/images/poster_sop_profile.png",
    title: "Three Offers → Three Programs → One Decision",
    category: "Case Study",
    date: "Published on LinkedIn",
    desc: "Case study: How personalized guidance helped a student secure 3 international university offers for business & marketing in Dubai.",
    content: `In international career counselling, receiving multiple university acceptance letters is a cause for celebration—but it also brings a critical decision-making challenge.

Recently, an undergraduate student specializing in Business & Marketing received three coveted admission offers across three prestigious institutions in Dubai, each offering distinct program structures:

- **Option A**: A traditional, research-focused Bachelor of Business Administration.
- **Option B**: A specialized Marketing & Digital Media degree with integrated industry modules.
- **Option C**: A dual-degree program with an international exchange semester.

Rather than relying solely on brand reputation, we conducted a rigorous comparative analysis:

1. **Curriculum Alignment**: We analyzed specific course modules against the student's passion for digital brand strategy and data analytics.
2. **Industry Placements & Local Internship Ecosystem**: We evaluated Dubai's media hub proximity, company partnership networks, and post-study internship conversion rates for each university.
3. **Financial Investment & ROI**: We calculated tuition fees, living costs, and potential merit scholarship awards across all three programs.

The Result: The student made a confident, well-informed decision that aligned perfectly with their long-term career trajectory in regional digital marketing.`,
    linkedinCTA: "Check out this live case study discussion on LinkedIn! Have questions about studying in Dubai or comparing university offers? Drop a comment on LinkedIn!",
    url: "https://www.linkedin.com/posts/riajain26_studentsuccess-careercounselling-studyabroad-activity-7449459855624441856-BBZH?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAClBJu4BRZFv7BreULj10-xogiz1UcSS78E"
  },
  {
    id: 5,
    img: "/images/poster_ielts_visa.png",
    title: "How Profile Building Can Set Your Application Apart",
    category: "Profile Building",
    date: "Expert Guide",
    desc: "Why academic grades alone are no longer enough for top-tier universities, and how to start building a portfolio today.",
    content: `In today's competitive global education landscape, high marks and standardized test scores are just the baseline requirement for top-tier universities. To stand out among thousands of qualified applicants worldwide, students must demonstrate a rich, multi-dimensional profile.

Strategic profile building involves intentional development across four key pillars:

1. **Academic Enrichment Beyond the Classroom**: Taking advanced certification courses, participating in Olympiads, or writing independent research papers showcases intellectual curiosity.

2. **Leadership & Initiative**: Admissions committees look for students who take initiative—whether starting a school club, organizing a community fundraiser, or founding a social impact project.

3. **Practical Experience & Internships**: Gaining hands-on experience through virtual or local internships demonstrates professional discipline and real-world applicability.

4. **Authentic Community Impact**: Sustained engagement with a social cause reflects character, empathy, and global citizenship.

Starting your profile-building journey 12 to 18 months before applications ensures your portfolio grows organically and authentically.`,
    linkedinCTA: "Want tips on building a standout profile for US, UK, or European universities? Connect and chat with Ria Jain on LinkedIn!",
    url: "https://www.linkedin.com/in/riajain26/details/certifications/"
  },
  {
    id: 6,
    img: "/images/poster_journey.png",
    title: "Demystifying Study Abroad: A Comprehensive Parent & Student Guide",
    category: "Parent Advice",
    date: "Expert Guide",
    desc: "Essential advice and financial checkpoints for parents navigating the complex landscape of international admissions.",
    content: `Planning an international education journey can feel like navigating a complex maze. From choosing destination countries and understanding tuition fee structures to handling visa financial proofs and accommodation, clear guidance is essential.

Here is your essential study abroad checklist:

1. **Country & Cultural Fit**: Understand post-study work visa policies, job market demand, and lifestyle preferences across popular destinations (USA, UK, Canada, Australia, Europe, Dubai).

2. **Financial Proof & Loan Documentation**: Visas require precise proof of funds, liquid assets, and acceptable loan sanction letters. Preparing financial documentation early prevents last-minute delays.

3. **Visa Interview Preparation**: For countries requiring face-to-face visa interviews (like the USA), thorough mock preparation builds confidence in articulating study plans and ties to home country.

4. **Pre-Departure Accommodation & Orientation**: Securing safe housing, student health insurance, and local SIM/banking setups ensures a seamless arrival experience.

At My Skill Counsellor, we guide families through every single milestone with complete transparency and dedicated personal care.`,
    linkedinCTA: "Found this checklist helpful? Follow Ria Jain on LinkedIn to receive regular study abroad updates, advice, and interactive Q&As!",
    url: "https://www.linkedin.com/in/riajain26/"
  }
];

export default async function BlogPage() {
  let dbBlogs: any[] = [];
  try {
    if (process.env.DATABASE_URL) {
      dbBlogs = await db.select().from(blogsTable);
    }
  } catch (error) {
    console.error("Failed to fetch blogs from database:", error);
  }

  const blogsList = dbBlogs.length > 0 ? [...dbBlogs, ...defaultBlogs] : defaultBlogs;

  return <BlogClient blogsList={blogsList} />;
}
