"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function TestimonialsClient({ testimonialsList }: { testimonialsList: Testimonial[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testFaqs = [
    { q: "Are these reviews verified?", a: "Yes, all our success stories are from actual students and parents who have worked with My Skill Counsellor through the complete admission lifecycle." },
    { q: "Can I speak to a past student?", a: "To protect the privacy of our students, we do not publicly share their direct contact information. However, during your initial consultation, we can discuss specific case studies relevant to your goals." }
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: testFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      <section className="inner-hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="text-accent">Our Impact</span>
            <h1>Success Stories</h1>
          </motion.div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="bg-sage-section" style={{ padding: '60px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
          >
            {[
              { label: 'Successful Admits', value: '500+' },
              { label: 'Scholarships Secured', value: '$2M+' },
              { label: 'Partner Universities', value: '50+' },
              { label: 'Years of Experience', value: '10+' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '3rem', color: 'var(--color-deep-teal)', marginBottom: '10px' }}>{stat.value}</h3>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: MEDIA FEATURE */}
      <section className="bg-white-section" style={{ padding: '60px 0' }}>
        <div className="container">
           <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
             <div style={{ flex: '1 1 400px' }}>
                <span className="text-accent">Press Recognition</span>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-deep-teal)', marginBottom: '20px' }}>Featured in Shah Times</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
                   My Skill Counsellor's innovative approach to profile building and transparent university admissions has been recognized by leading regional publications. We believe in providing actionable, honest advice to every student.
                </p>
             </div>
             <div style={{ flex: '1 1 400px' }}>
                <img src="/images/shah_times_article.jpg" alt="Featured in Shah Times" style={{ width: '100%', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
             </div>
           </motion.div>
        </div>
      </section>

      <section className="bg-sage-section" style={{ padding: '80px 0', minHeight: '60vh' }}>
        <div className="container">
          <motion.div
            className="testimonial-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
          >
            {testimonialsList.map((t, i) => (
              <motion.div key={i} className="testimonial-card" variants={fadeUp} style={{ background: 'white', padding: '30px', borderRadius: '12px', borderTop: '4px solid var(--color-deep-teal)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <i className="fas fa-quote-left text-accent" style={{ fontSize: '2rem', opacity: 0.2 }}></i>
                <p style={{ marginTop: '15px', fontStyle: 'italic', lineHeight: '1.6' }}>"{t.text}"</p>
                <h4 style={{ marginTop: '20px', color: 'var(--color-deep-teal)' }}>{t.name}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.role}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Verification</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>

          <div style={{ marginTop: '40px' }}>
             {testFaqs.map((faq, i) => (
                <div key={i} style={{ marginBottom: '15px', background: 'var(--color-soft-ivory)', borderRadius: '8px', overflow: 'hidden' }}>
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

      {/* CALL TO ACTION SECTION */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, var(--color-deep-teal) 0%, #0d3b36 100%)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'white' }}>Ready to Write Your Own Success Story?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9, lineHeight: '1.6' }}>
              Join hundreds of successful students who have achieved their dream university admits with our expert guidance.
            </p>
            <a href="/contact" style={{ display: 'inline-block', padding: '15px 40px', background: 'var(--color-accent)', color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease', boxShadow: '0 10px 20px rgba(230, 57, 70, 0.3)' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 25px rgba(230, 57, 70, 0.4)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(230, 57, 70, 0.3)'; }}
            >
              Book Your Free Strategy Session
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
