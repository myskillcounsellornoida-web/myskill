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

interface BlogClientProps {
  blogsList: any[];
}

export default function BlogClient({ blogsList }: BlogClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  const blogFaqs = [
    { q: "How often do you post new study abroad insights?", a: "We publish detailed guides and insights bi-weekly to ensure students and parents are always up-to-date with changing admission landscapes." },
    { q: "Can I suggest a topic for the blog?", a: "Yes! If you have specific questions about a country, university, or test prep, reach out via the Contact page and we may feature it in our next guide." }
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
            {blogsList.map((b) => (
              <motion.div 
                key={b.id || b.title} 
                className="blog-card" 
                variants={fadeUp} 
                onClick={() => setActiveArticle(b)}
                style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}
                whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
              >
                <div className="blog-card-img" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <Image src={b.image || b.img || "/images/poster_journey.png"} alt={b.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                  <span style={{ position: "absolute", top: 16, left: 16, background: "rgba(28,43,45,0.85)", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: "0.7rem", fontFamily: "var(--font-sans)", letterSpacing: "1px", textTransform: "uppercase", backdropFilter: "blur(4px)" }}>
                    {b.tag || b.category || "Article"}
                  </span>
                </div>
                <div className="blog-card-content" style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-gold)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{b.date || b.readTime || "Published"}</span>
                    <h3 style={{ fontSize: '1.35rem', margin: '8px 0 12px', color: 'var(--color-deep-teal)', lineHeight: '1.3', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                      {b.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
                      {b.desc || (b.content ? b.content.slice(0, 120) + "..." : "")}
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
              {activeArticle.tag || activeArticle.category || "Article"}
            </span>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-deep-teal)', margin: '10px 0 16px', lineHeight: 1.2, fontWeight: 600 }}>
              {activeArticle.title}
            </h2>

            <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
              <Image src={activeArticle.image || activeArticle.img || "/images/poster_journey.png"} alt={activeArticle.title} fill style={{ objectFit: 'cover' }} />
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
                {activeArticle.linkedinCTA || "Have thoughts or questions on this topic? Like, comment, and connect with Ria Jain on LinkedIn to join the discussion!"}
              </p>
              <a 
                href={activeArticle.url || "https://www.linkedin.com/in/riajain26"} 
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
