import { db } from "./src/db/index";
import { blogs as blogsTable } from "./src/db/schema";
import { eq } from "drizzle-orm";

const defaultBlogs = [
  {
    title: "One Story Step: Daily Lessons from My Path (Day 0)",
    slug: "one-story-step-daily-lessons-from-my-path-day-0",
    category: "Personal Journey & Mindset",
    date: "Published on LinkedIn",
    content: "Every journey begins with a single step. When students first approach career counselling, they often feel overwhelmed by the sheer magnitude of decisions ahead—choosing a major, selecting universities across different continents, writing Statements of Purpose, and preparing for standardized tests.\n\nMy philosophy at My Skill Counsellor is centered on breaking down this monumental process into daily, manageable actions: 'One Story Step'.\n\n1. **Embrace Your Unique Narrative**: No two students have the same background or aspirations. Admissions committees at top global universities don't look for flawless robots—they seek authentic human stories of curiosity, effort, and growth.\n\n2. **Focus on Small Daily Progress**: Profile building isn't achieved overnight. Spending 30 minutes a day reading research papers, working on a passion project, or refining an essay draft yields exponential growth over 12 months.\n\n3. **Self-Awareness Over Popularity**: Choosing a university based purely on rankings often leads to misalignment. True success comes from selecting programs that align with your personality, learning style, and long-term career goals.\n\nAs we take this journey together, remember: progress is not a sprint; it is the compound interest of daily, focused effort.",
    image: "/images/poster_journey.png",
    tag: "Personal Journey & Mindset",
    readTime: "5 mins"
  },
  {
    title: "A Mother's Journey of Learning to Let Go",
    slug: "a-mothers-journey-of-learning-to-let-go",
    category: "Parent Insights",
    date: "Published on LinkedIn",
    content: "As a career counsellor and a mother who has supported her own child through the journey of studying abroad, I have walked in both shoes. I understand the intense mix of pride, excitement, and quiet anxiety that fills a parent's heart when their child prepares to cross oceans for higher education.\n\nNavigating this transition requires a delicate balance between guiding and letting go.\n\n1. **Shifting from Director to Anchor**: As parents, our instinct is to protect and manage every detail. However, preparing a student for international living requires allowing them to lead their application process, make choices, and solve problems independently while knowing we remain their steady anchor.\n\n2. **Open Conversations Around Budget & Expectations**: Financial transparency early in the process creates trust. Discussing tuition, living expenses, and scholarships openly prevents last-minute disappointments and ensures your child understands the value of investment in their education.\n\n3. **Fostering Real-World Independence**: Long before packing suitcases, help your child master basic life skills—budgeting, cooking, basic healthcare navigation, and time management. Confidence in daily living is as crucial as academic readiness.\n\nTo every parent reading this: your dedication has laid the foundation. Trust in the values and strength you have instilled in your child as they step into the world.",
    image: "/images/poster_study_abroad.png",
    tag: "Parent Insights",
    readTime: "6 mins"
  },
  {
    title: "Career Story Counsellor — Part 1: Finding Your Authentic Voice",
    slug: "career-story-counsellor-part-1",
    category: "Career Strategy",
    date: "Published on LinkedIn",
    content: "When university admissions officers review thousands of Statements of Purpose (SOPs), test scores and grades quickly blend together. What makes an application truly unforgettable is a compelling, authentic career story.\n\nCareer storytelling is not about exaggerating achievements or using complex vocabulary; it is about articulating your 'why'.\n\n1. **Uncovering the Catalyst**: Why did you choose this field? Was it a childhood curiosity, a real-world problem you witnessed, or a specific project that sparked your interest? Identifying this catalyst gives your application a strong, memorable theme.\n\n2. **Connecting Past Projects to Future Impact**: Admissions committees want to see how your past coursework, internships, and extracurricular activities connect logically to the master's or bachelor's program you are applying for—and how that program will enable your future career vision.\n\n3. **Demonstrating Resilience**: Imperfections in your academic record aren't deal-breakers if explained with honesty and maturity. Showing how you overcame a challenge or learned from a setback demonstrates the psychological resilience required for university success.\n\nCrafting your career story takes introspection and multiple drafts. Take the time to discover your authentic voice.",
    image: "/images/poster_career_compass.png",
    tag: "Career Strategy",
    readTime: "7 mins"
  },
  {
    title: "Three Offers → Three Programs → One Decision",
    slug: "three-offers-three-programs-one-decision",
    category: "Case Study",
    date: "Published on LinkedIn",
    content: "In international career counselling, receiving multiple university acceptance letters is a cause for celebration—but it also brings a critical decision-making challenge.\n\nRecently, an undergraduate student specializing in Business & Marketing received three coveted admission offers across three prestigious institutions in Dubai, each offering distinct program structures:\n\n- **Option A**: A traditional, research-focused Bachelor of Business Administration.\n- **Option B**: A specialized Marketing & Digital Media degree with integrated industry modules.\n- **Option C**: A dual-degree program with an international exchange semester.\n\nRather than relying solely on brand reputation, we conducted a rigorous comparative analysis:\n\n1. **Curriculum Alignment**: We analyzed specific course modules against the student's passion for digital brand strategy and data analytics.\n2. **Industry Placements & Local Internship Ecosystem**: We evaluated Dubai's media hub proximity, company partnership networks, and post-study internship conversion rates for each university.\n3. **Financial Investment & ROI**: We calculated tuition fees, living costs, and potential merit scholarship awards across all three programs.\n\nThe Result: The student made a confident, well-informed decision that aligned perfectly with their long-term career trajectory in regional digital marketing.",
    image: "/images/poster_sop_profile.png",
    tag: "Case Study",
    readTime: "5 mins"
  },
  {
    title: "How Profile Building Can Set Your Application Apart",
    slug: "how-profile-building-can-set-your-application-apart",
    category: "Profile Building",
    date: "Expert Guide",
    content: "In today's competitive global education landscape, high marks and standardized test scores are just the baseline requirement for top-tier universities. To stand out among thousands of qualified applicants worldwide, students must demonstrate a rich, multi-dimensional profile.\n\nStrategic profile building involves intentional development across four key pillars:\n\n1. **Academic Enrichment Beyond the Classroom**: Taking advanced certification courses, participating in Olympiads, or writing independent research papers showcases intellectual curiosity.\n\n2. **Leadership & Initiative**: Admissions committees look for students who take initiative—whether starting a school club, organizing a community fundraiser, or founding a social impact project.\n\n3. **Practical Experience & Internships**: Gaining hands-on experience through virtual or local internships demonstrates professional discipline and real-world applicability.\n\n4. **Authentic Community Impact**: Sustained engagement with a social cause reflects character, empathy, and global citizenship.\n\nStarting your profile-building journey 12 to 18 months before applications ensures your portfolio grows organically and authentically.",
    image: "/images/poster_ielts_visa.png",
    tag: "Profile Building",
    readTime: "6 mins"
  },
  {
    title: "Demystifying Study Abroad: A Comprehensive Parent & Student Guide",
    slug: "demystifying-study-abroad",
    category: "Parent Advice",
    date: "Expert Guide",
    content: "Planning an international education journey can feel like navigating a complex maze. From choosing destination countries and understanding tuition fee structures to handling visa financial proofs and accommodation, clear guidance is essential.\n\nHere is your essential study abroad checklist:\n\n1. **Country & Cultural Fit**: Understand post-study work visa policies, job market demand, and lifestyle preferences across popular destinations (USA, UK, Canada, Australia, Europe, Dubai).\n\n2. **Financial Proof & Loan Documentation**: Visas require precise proof of funds, liquid assets, and acceptable loan sanction letters. Preparing financial documentation early prevents last-minute delays.\n\n3. **Visa Interview Preparation**: For countries requiring face-to-face visa interviews (like the USA), thorough mock preparation builds confidence in articulating study plans and ties to home country.\n\n4. **Pre-Departure Accommodation & Orientation**: Securing safe housing, student health insurance, and local SIM/banking setups ensures a seamless arrival experience.\n\nAt My Skill Counsellor, we guide families through every single milestone with complete transparency and dedicated personal care.",
    image: "/images/poster_journey.png",
    tag: "Parent Advice",
    readTime: "7 mins"
  }
];

async function sync() {
  for (const b of defaultBlogs) {
    const existing = await db.select().from(blogsTable).where(eq(blogsTable.slug, b.slug));
    if (existing.length === 0) {
      await db.insert(blogsTable).values({
        title: b.title,
        slug: b.slug,
        content: b.content,
        image: b.image,
        tag: b.tag,
        readTime: b.readTime
      });
      console.log(`Inserted: ${b.title}`);
    } else {
      console.log(`Skipped (already exists): ${b.title}`);
    }
  }
  console.log("Done syncing blogs!");
  process.exit(0);
}

sync();
