"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Blog() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  const blogFaqs = [
    { q: "How often do you post new study abroad insights?", a: "We publish detailed guides and insights bi-weekly to ensure students and parents are always up-to-date with changing admission landscapes." },
    { q: "Can I suggest a topic for the blog?", a: "Yes! If you have specific questions about a country, university, or test prep, reach out via the Contact page and we may feature it in our next guide." }
  ];

  const blogs = [
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

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: blogFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      {/* HERO SECTION */}
      <section style={{ position: "relative", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "80px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/hero_blogs_page.png)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(28,43,45,0.85) 0%, rgba(28,43,45,0.6) 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "3px", textTransform: "uppercase", padding: "8px 20px", borderRadius: 30, marginBottom: 24, border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(5px)" }}>
              Insights & Advice
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(2.5rem,5vw,4rem)", marginBottom: 20, textShadow: "0 4px 20px rgba(0,0,0,0.3)", fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              Counselling Blog & Articles
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.15rem", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              Expert advice, personal journeys, and comprehensive guides for students and parents navigating global education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section className="bg-sage-section" style={{ padding: '60px 0' }}>
        <div className="container">
           <motion.div className="author-profile-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', background: 'white', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
             <div style={{ flex: '0 0 140px', height: '140px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--color-soft-teal)', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <Image src="/images/ria_portrait.jpg" alt="Ria Jain" fill sizes="140px" style={{ objectFit: 'cover' }} />
             </div>
             <div style={{ flex: '1 1 300px' }}>
                <span className="font-sans" style={{ color: "var(--color-muted-coral)", textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "0.75rem", fontWeight: 700 }}>Lead Editor</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-deep-teal)', margin: '4px 0 10px', fontFamily: "var(--font-heading)", fontWeight: 600 }}>Ria Jain</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.98rem' }}>
                  Founder of My Skill Counsellor, Certified Career Counsellor (EduMilestones, CCCIS), and MA English graduate. Ria brings professional expertise and real-world understanding as both a counsellor and parent of an international student.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {["EduMilestones Certified", "CCCIS Certified", "MA English", "Visa Training Certified"].map((cert, idx) => (
                    <span key={idx} style={{ padding: '4px 12px', borderRadius: '15px', background: 'rgba(62,159,168,0.1)', color: 'var(--color-deep-teal)', fontSize: '0.8rem', fontWeight: 700 }}>
                      <i className="fas fa-check-circle" style={{ color: 'var(--color-soft-teal)', marginRight: '5px' }} />
                      {cert}
                    </span>
                  ))}
                </div>
                <a href="https://www.linkedin.com/in/riajain26" target="_blank" rel="noreferrer" style={{ color: '#0077b5', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
                  <i className="fab fa-linkedin" style={{ fontSize: '1.2rem' }} /> Connect & Verify on LinkedIn
                </a>
             </div>
           </motion.div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="bg-white-section" style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <motion.div 
            className="blog-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '35px' }}
          >
            {blogs.map((b) => (
              <motion.div 
                key={b.id} 
                className="blog-card" 
                variants={fadeUp} 
                onClick={() => setActiveArticle(b)}
                style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}
                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
              >
                <div className="blog-card-img" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <Image src={b.img} alt={b.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                  <span style={{ position: "absolute", top: 16, left: 16, background: "rgba(28,43,45,0.85)", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: "0.7rem", fontFamily: "var(--font-sans)", letterSpacing: "1px", textTransform: "uppercase", backdropFilter: "blur(4px)" }}>
                    {b.category}
                  </span>
                </div>
                <div className="blog-card-content" style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-gold)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{b.date}</span>
                    <h3 style={{ fontSize: '1.35rem', margin: '8px 0 12px', color: 'var(--color-deep-teal)', lineHeight: '1.3', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                      {b.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
                      {b.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span style={{ color: 'var(--color-muted-coral)', fontWeight: 'bold', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)' }}>
                      Read Article <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }} />
                    </span>
                    <i className="fab fa-linkedin" style={{ color: '#0077b5', fontSize: '1.2rem' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE ARTICLE MODAL READER */}
      {activeArticle && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setActiveArticle(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ background: 'white', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '36px', boxShadow: '0 30px 70px rgba(0,0,0,0.3)', position: 'relative', border: '1px solid var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveArticle(null)} 
              style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-primary)', border: 'none', width: 40, height: 40, borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-deep-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-times" />
            </button>

            <span className="font-sans" style={{ color: 'var(--color-muted-coral)', letterSpacing: '1.5px', fontSize: '0.75rem' }}>
              {activeArticle.category}
            </span>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-deep-teal)', margin: '10px 0 16px', lineHeight: 1.2, fontWeight: 600 }}>
              {activeArticle.title}
            </h2>

            <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
              <Image src={activeArticle.img} alt={activeArticle.title} fill style={{ objectFit: 'cover' }} />
            </div>

            <div style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '28px' }}>
              {activeArticle.content}
            </div>

            {/* INTERACTIVE LINKEDIN CTA BOX */}
            <div style={{ background: 'rgba(62,159,168,0.08)', padding: '22px 24px', borderRadius: '16px', borderLeft: '4px solid var(--color-soft-teal)', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#0077b5', fontWeight: 700 }}>
                <i className="fab fa-linkedin" style={{ fontSize: '1.3rem' }} />
                <span style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>Join the Discussion on LinkedIn</span>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {activeArticle.linkedinCTA}
              </p>
              <a 
                href={activeArticle.url} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: '25px', fontSize: '0.9rem' }}
              >
                Like, Comment & Interact on LinkedIn <i className="fas fa-external-link-alt" style={{ fontSize: '0.8rem' }} />
              </a>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
              <button 
                onClick={() => setActiveArticle(null)} 
                className="btn btn-outline"
                style={{ padding: '12px 26px', borderRadius: '30px', fontSize: '0.95rem', width: '100%' }}
              >
                Close Article Reader
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* NEWSLETTER SECTION */}
      <section style={{ padding: '80px 0', background: 'var(--color-deep-teal)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <i className="far fa-envelope" style={{ fontSize: '3rem', color: 'var(--color-accent-gold)', marginBottom: '20px' }}></i>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Subscribe to Our Newsletter</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>Get the latest admission trends, university updates, and test prep tips delivered straight to your inbox every month.</p>
            <form className="newsletter-form" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', width: '100%', maxWidth: '350px', outline: 'none', fontSize: '1rem', color: '#333' }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Subscribe</button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: "center", marginBottom: 30 }}>
            <span className="text-accent font-sans">Blog Resources</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>Frequently Asked Questions</h2>
          </motion.div>

          <div style={{ marginTop: '30px' }}>
             {blogFaqs.map((faq, i) => (
                <div key={i} style={{ marginBottom: '15px', background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--color-deep-teal)', fontFamily: 'var(--font-heading)' }}
                  >
                    {faq.q}
                    <i className={`fas fa-chevron-${openFaq === i ? 'up' : 'down'}`} style={{ color: 'var(--color-soft-teal)' }}></i>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 24px 20px 24px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                      <p style={{ margin: 0 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
             ))}
          </div>
        </div>
      </section>
    </main>
  );
}
