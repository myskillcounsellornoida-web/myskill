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

  const blogFaqs = [
    { q: "How often do you post new study abroad insights?", a: "We publish detailed guides and insights bi-weekly to ensure students and parents are always up-to-date with changing admission landscapes." },
    { q: "Can I suggest a topic for the blog?", a: "Yes! If you have specific questions about a country, university, or test prep, reach out via the Contact page and we may feature it in our next guide." }
  ];

  const blogs = [
    {
      img: "/images/poster_journey.png",
      title: "One Story Step: Daily Lessons from My Path (Day 0)",
      desc: "Insights on starting a counselling journey, personal growth, and taking small consistent steps towards your career goals.",
      url: "https://www.linkedin.com/pulse/one-story-step-daily-lessons-from-my-path-day-0-ria-vkf2c"
    },
    {
      img: "/images/poster_study_abroad.png",
      title: "A Mother's Journey of Learning to Let Go",
      desc: "A personal perspective on supporting children as they prepare for international education and independence.",
      url: "https://www.linkedin.com/posts/riajain26_a-mothers-journey-of-learning-to-let-go-activity-7477334864858345472-c7NN?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAClBJu4BRZFv7BreULj10-xogiz1UcSS78E"
    },
    {
      img: "/images/poster_career_compass.png",
      title: "Career Story Counsellor — Part 1",
      desc: "Deep dive into career storytelling, identifying strengths, and helping students find their authentic direction.",
      url: "https://www.linkedin.com/pulse/career-story-counsellor-part-1-ria-lnoxc"
    },
    {
      img: "/images/poster_sop_profile.png",
      title: "Three Offers → Three Programs → One Decision",
      desc: "Case study: How personalized guidance helped a student secure 3 international university offers for business & marketing in Dubai.",
      url: "https://www.linkedin.com/posts/riajain26_studentsuccess-careercounselling-studyabroad-activity-7449459855624441856-BBZH?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAClBJu4BRZFv7BreULj10-xogiz1UcSS78E"
    },
    {
      img: "/images/poster_ielts_visa.png",
      title: "How Profile Building Can Set Your Application Apart",
      desc: "Why academic grades alone are no longer enough for top-tier universities, and how to start building a portfolio today.",
      url: "#"
    },
    {
      img: "/images/poster_journey.png",
      title: "Demystifying Study Abroad: A Parent's Guide",
      desc: "Essential advice and financial checkpoints for parents navigating the complex landscape of international admissions.",
      url: "#"
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

      <section style={{ position: "relative", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "80px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/hero_blogs_page.png)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(37,95,107,0.85) 0%, rgba(37,95,107,0.5) 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "3px", textTransform: "uppercase", padding: "8px 20px", borderRadius: 30, marginBottom: 24, border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(5px)" }}>
              Insights & Advice
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(2.5rem,5vw,4rem)", marginBottom: 20, textShadow: "0 4px 20px rgba(0,0,0,0.3)", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              Counselling Blog & Articles
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.15rem", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              Expert advice, personal journeys, and comprehensive guides for students and parents navigating global education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: AUTHOR BIO */}
      <section className="bg-sage-section" style={{ padding: '60px 0' }}>
        <div className="container">
           <motion.div className="author-profile-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
             <div style={{ flex: '0 0 150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '5px solid var(--color-soft-teal)', position: 'relative' }}>
                <Image src="/images/ria_portrait.jpg" alt="Ria Jain" fill sizes="150px" style={{ objectFit: 'cover' }} />
             </div>
             <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-deep-teal)', marginBottom: '10px' }}>Meet the Lead Editor: Ria Jain</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Founder of My Skill Counsellor, Certified Career Counsellor (EduMilestones, CCCIS), and MA English graduate. Ria brings professional expertise and real-world understanding as both a counsellor and parent of an international student.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {["EduMilestones Certified", "CCCIS Certified", "MA English", "Visa Training Certified"].map((cert, idx) => (
                    <span key={idx} style={{ padding: '4px 12px', borderRadius: '15px', background: 'rgba(37,95,107,0.1)', color: 'var(--color-deep-teal)', fontSize: '0.8rem', fontWeight: 700 }}>
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

      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div 
            className="blog-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}
          >
            {blogs.map((b, i) => (
              <motion.div key={i} className="blog-card" variants={fadeUp} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                <div className="blog-card-img" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <Image src={b.img} alt={b.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.5s' }} className="hover-scale" />
                </div>
                <div className="blog-card-content" style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--color-deep-teal)', lineHeight: '1.4' }}>{b.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>{b.desc}</p>
                  <a href={b.url} target={b.url !== "#" ? "_blank" : "_self"} rel="noreferrer" style={{ color: 'var(--color-soft-teal)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Read Full Article {b.url !== "#" ? <i className="fab fa-linkedin" /> : "→"}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: NEWSLETTER */}
      <section style={{ padding: '80px 0', background: 'var(--color-deep-teal)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <i className="far fa-envelope" style={{ fontSize: '3rem', color: 'var(--color-soft-teal)', marginBottom: '20px' }}></i>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'white' }}>Subscribe to Our Newsletter</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>Get the latest admission trends, university updates, and test prep tips delivered straight to your inbox every month.</p>
            <form className="newsletter-form" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', width: '100%', maxWidth: '350px', outline: 'none', fontSize: '1rem', color: '#333' }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Subscribe</button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Blog Resources</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>

          <div style={{ marginTop: '40px' }}>
             {blogFaqs.map((faq, i) => (
                <div key={i} style={{ marginBottom: '15px', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-deep-teal)' }}
                  >
                    {faq.q}
                    <i className={`fas fa-chevron-${openFaq === i ? 'up' : 'down'}`} style={{ color: 'var(--color-soft-teal)' }}></i>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 20px 20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      <p>{faq.a}</p>
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
