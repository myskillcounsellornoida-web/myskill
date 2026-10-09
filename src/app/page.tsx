"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  // 3D Tilt Effect State
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [15, -15]);
  const rotateY = useTransform(x, [0, 400], [-15, 15]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "When is the right time to start planning for study abroad?", a: "We highly recommend starting as early as Class 9. This gives us ample time to build a robust profile, select the right subjects, and plan extracurricular activities without rushing." },
    { q: "Do you guarantee university admissions?", a: "While no consultant can guarantee admission to ivy-league or top-tier universities, our track record speaks for itself. We maximize your chances by perfectly aligning your profile with university expectations." },
    { q: "Do you help with scholarships and financial aid?", a: "Yes, absolutely. We actively map out merit-based, need-based, and country-specific scholarships to help reduce the financial burden on parents." },
    { q: "How is My Skill Counsellor different from other agencies?", a: "We don't do 'cookie-cutter' applications. Every student gets 1-on-1 personalized mentorship, ensuring their Statement of Purpose and portfolio is uniquely theirs." }
  ];

  return (
    <main>
      {/* AEO FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-grid">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="text-accent" style={{ fontWeight: 600 }}>We Turn Confusion into Career Fusion</span>
            <h1>Building Bridges to <br />Your Global Future.</h1>
            <p className="hero-subtitle">
              Guiding Careers, Defining Destinies Together. We are the architects of dreams, sculpting careers and shaping global journeys.
            </p>
            <div className="hero-buttons">
              <Link href="/contact" className="btn btn-primary trigger-booking">Book a Free Consultation</Link>
              <Link href="/services" className="btn btn-outline">Explore Services</Link>
            </div>
            
            <div className="trust-badges" style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><i className="fas fa-check-circle" style={{ color: 'var(--color-sage-green)' }}></i> 500+ Students Placed</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><i className="fas fa-check-circle" style={{ color: 'var(--color-sage-green)' }}></i> Certified CCCIS Counsellor</span>
            </div>
          </motion.div>
          
          {/* 3D Interactive Hero Element */}
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ perspective: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onMouseMove={handleMouse}
            onMouseLeave={() => {
              x.set(200);
              y.set(200);
            }}
          >
            <motion.div
              className="hero-image-card"
              style={{
                backgroundImage: 'url(/images/img_5289_1.jpg)',
                rotateX,
                rotateY,
              }}
            >
              <motion.div 
                className="hero-image-badge"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-star text-accent"></i>
                  <span style={{ fontWeight: 600, color: 'var(--color-deep-teal)' }}>#1 Global Admit Rate</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: TRUSTED UNIVERSITIES */}
      <section style={{ padding: '40px 0', background: 'var(--color-soft-ivory)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px', fontSize: '0.9rem' }}>Students Placed At Top Universities</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.7 }}>
             <img src="/assets/u1.png" alt="University" style={{ height: '50px', objectFit: 'contain' }} />
             <img src="/assets/u2.png" alt="University" style={{ height: '50px', objectFit: 'contain' }} />
             <img src="/assets/u3.png" alt="University" style={{ height: '50px', objectFit: 'contain' }} />
             <img src="/assets/u4.png" alt="University" style={{ height: '50px', objectFit: 'contain' }} />
             <img src="/assets/u5.png" alt="University" style={{ height: '50px', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* NEW SECTION: IMPACT STATISTICS */}
      <section style={{ background: 'var(--color-deep-teal)', color: 'white', padding: '60px 0' }}>
        <div className="container">
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { value: "160+", label: "Career Paths" },
              { value: "1500+", label: "Top Universities" },
              { value: "500+", label: "Companies" },
              { value: "98%", label: "Success Rate" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <h2 style={{ fontSize: '3rem', color: 'var(--color-soft-teal)', marginBottom: '5px' }}>{stat.value}</h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: ABOUT THE FOUNDER */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center' }}>
            <motion.div style={{ flex: '1 1 300px' }} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
               <div style={{ position: 'relative' }}>
                 <img src="/images/ria_portrait.jpg" alt="Ria Jain - Founder" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }} />
                 <div className="founder-badge" style={{ position: 'absolute', background: 'var(--color-sage-green)', color: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                   <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Ria Jain</h4>
                   <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Lead Counsellor & Founder</p>
                 </div>
               </div>
            </motion.div>
            <motion.div style={{ flex: '1 1 300px' }} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
               <span className="text-accent">About Us</span>
               <h2 style={{ fontSize: '2.5rem', color: 'var(--color-deep-teal)', marginBottom: '20px' }}>Guiding You Beyond Borders</h2>
               <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.7' }}>
                 I work closely with students and families through important academic, career, and study abroad decisions, helping them navigate higher education pathways with greater clarity, confidence, and direction.
               </p>
               <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.7' }}>
                 As both a counsellor and a parent of an international student myself, I bring a balance of professional experience and real-world understanding. Every student has a different story, pace, and aspiration, and my approach focuses on personalised, student-first support rather than one-size-fits-all counselling.
               </p>
               <Link href="/contact" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                 Book a Chat <i className="fas fa-arrow-right"></i>
               </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="text-accent">Expertise</span>
            <h2>Our Core Services</h2>
          </motion.div>

          <motion.div
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              { title: "Study Abroad", icon: "fa-globe-americas", desc: "Comprehensive university admissions mapping for UK, USA, Dubai." },
              { title: "Career Counselling", icon: "fa-compass", desc: "Psychometric analysis and course selection for Class 9-12." },
              { title: "SOP Building", icon: "fa-file-signature", desc: "Crafting unique, compelling personal statements and portfolios." },
            ].map((srv, i) => (
              <motion.div key={i} className="service-card" variants={fadeUp}>
                <div className="service-icon"><i className={`fas ${srv.icon}`}></i></div>
                <h3>{srv.title}</h3>
                <p>{srv.desc}</p>
                <Link href={`/services`} className="service-link">Read More <i className="fas fa-arrow-right"></i></Link>
              </motion.div>
            ))}
          </motion.div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/services" className="btn btn-outline">View All 6 Services</Link>
          </div>
        </div>
      </section>

      {/* NEW SECTION: UPCOMING WORKSHOPS */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            <motion.div style={{ flex: '1 1 300px' }} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
               <img src="/images/whatsapp_image_2024-03-20_at_10.27.00_2_1.jpeg" alt="Workshop" style={{ width: '100%', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </motion.div>
            <motion.div style={{ flex: '1 1 300px' }} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
               <span className="text-accent">Live Events</span>
               <h2 style={{ fontSize: '2.5rem', color: 'var(--color-deep-teal)', marginBottom: '20px' }}>Upcoming Masterclasses</h2>
               <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                 Join our free online masterclasses where we break down the Ivy League admission process, IELTS writing strategies, and profile building secrets.
               </p>
               <div style={{ background: 'var(--color-soft-ivory)', padding: '20px', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid var(--color-soft-teal)' }}>
                  <h4 style={{ color: 'var(--color-deep-teal)' }}>Mastering the Common App</h4>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}><i className="far fa-calendar-alt"></i> August 15th, 2026 | <i className="far fa-clock"></i> 6:00 PM IST</p>
               </div>
               <Link href="/contact" className="btn btn-primary">Register for Free</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: MEDIA RECOGNITION */}
      <section className="bg-deep-teal-section" style={{ padding: '80px 0', background: 'var(--color-deep-teal)', color: 'white' }}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="text-accent" style={{ color: 'var(--color-soft-teal)' }}>In The Media</span>
            <h2 style={{ color: 'white' }}>Recognized for Excellence</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center' }}>
            <img src="/images/shah_times_article.jpg" alt="Shah Times Article Feature" style={{ maxWidth: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '5px solid rgba(255,255,255,0.1)' }} />
          </motion.div>
        </div>
      </section>
      {/* NEW SECTION: OUR PROCESS TIMELINE */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="text-accent">How It Works</span>
            <h2>The 4-Step Process</h2>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '40px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
             {[
               { step: "01", title: "Discovery Profile", desc: "We evaluate your academic background and aspirations." },
               { step: "02", title: "Strategic Roadmap", desc: "We shortlist universities and map out required tests (IELTS)." },
               { step: "03", title: "Application & SOP", desc: "We meticulously build your portfolio and draft essays." },
               { step: "04", title: "Visa & Pre-Departure", desc: "We secure your visa and prepare you for global success." }
             ].map((proc, i) => (
                <motion.div key={i} variants={fadeUp} style={{ background: 'white', padding: '30px', borderRadius: '12px', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'absolute', top: -15, left: 30, background: 'var(--color-deep-teal)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>Step {proc.step}</div>
                  <h3 style={{ marginTop: '10px', fontSize: '1.2rem', color: 'var(--color-deep-teal)' }}>{proc.title}</h3>
                  <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>{proc.desc}</p>
                </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* ENHANCED TESTIMONIALS SECTION */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="text-accent">Success Stories</span>
            <h2>What Parents & Students Say</h2>
          </motion.div>

          <motion.div
            className="testimonial-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}
          >
            {[
              { name: "Aarav Sharma", role: "Admitted to NYU", text: "Ria completely transformed my application. Her insights on my SOP made all the difference." },
              { name: "Mrs. Kapoor", role: "Parent", text: "We were overwhelmed with the visa process for the UK. Ria handled everything smoothly and professionally." },
              { name: "Simran Kaur", role: "IELTS Student (Band 8)", text: "The structured mock interviews and writing evaluations helped me score far above my target." }
            ].map((t, i) => (
              <motion.div key={i} className="testimonial-card" variants={fadeUp} style={{ background: 'var(--color-soft-ivory)', padding: '30px', borderRadius: '12px', borderLeft: '4px solid var(--color-soft-teal)' }}>
                <i className="fas fa-quote-left text-accent" style={{ fontSize: '2rem', opacity: 0.2 }}></i>
                <p style={{ marginTop: '15px', fontStyle: 'italic' }}>"{t.text}"</p>
                <h4 style={{ marginTop: '20px', color: 'var(--color-deep-teal)' }}>{t.name}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.role}</span>
              </motion.div>
            ))}
          </motion.div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/testimonials" className="btn btn-outline">Read All Success Stories</Link>
          </div>
        </div>
      </section>

      {/* NEW SECTION: VIDEOS FROM ORIGINAL SITE */}
      <section className="bg-sage-section" style={{ padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="text-accent">Our Impact</span>
            <h2>Hear From Our Students</h2>
          </motion.div>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <iframe src="https://www.youtube.com/embed/I9BAN9l69TU?si=Csheaq7O03RStyQO" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ width: '100%', maxWidth: '400px', aspectRatio: '16/9', height: 'auto', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: 'none' }}></iframe>
            <iframe src="https://www.youtube.com/embed/NcWqUKWeGfk?si=Lz1J9K3mUjwg2lpf" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ width: '100%', maxWidth: '400px', aspectRatio: '16/9', height: 'auto', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: 'none' }}></iframe>
          </div>
        </div>
      </section>

      {/* NEW SECTION: FAQ (Great for SEO/AEO) */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Clarifications</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>

          <div style={{ marginTop: '40px' }}>
             {faqs.map((faq, i) => (
                <div key={i} style={{ marginBottom: '15px', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
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
