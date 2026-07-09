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

export default function Blog() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const blogFaqs = [
    { q: "How often do you post new study abroad insights?", a: "We publish detailed guides and insights bi-weekly to ensure students and parents are always up-to-date with changing admission landscapes." },
    { q: "Can I suggest a topic for the blog?", a: "Yes! If you have specific questions about a country, university, or test prep, reach out via the Contact page and we may feature it in our next guide." }
  ];

  const blogs = [
    { img: "/images/whatsapp_image_2024-12-24_at_14.13.32.jpeg", title: "Demystifying Study Abroad: A Parent's Guide", desc: "Essential advice and financial checkpoints for parents navigating the complex landscape of international admissions." },
    { img: "/images/img_5289_1.jpg", title: "How Profile Building Can Set Your Application Apart", desc: "Why academic grades alone are no longer enough for top-tier universities, and how to start building a portfolio today." },
    { img: "/images/whatsapp_image_2024-03-20_at_10.27.00_2_1.jpeg", title: "IELTS vs TOEFL: Which test should you take?", desc: "A comprehensive breakdown of both exams to help you decide which format best aligns with your target universities and strengths." },
    { img: "/images/whatsapp_image_2024-12-24_at_13.54.39.jpeg", title: "The Ultimate Statement of Purpose (SOP) Checklist", desc: "Ensure your essay hooks the admissions officer. Avoid these 5 common mistakes that most students make in their first drafts." },
    { img: "/images/whatsapp_image_2024-12-30_at_15.24.05.jpeg", title: "Understanding Need-Blind vs Need-Aware Admissions in the USA", desc: "How your financial aid requests can actively impact your chances of getting admitted into US universities." },
    { img: "/images/whatsapp_image_2024-12-30_at_15.24.05_2_2.jpeg", title: "Top 10 Emerging Careers for the Next Decade", desc: "Psychometric insights into which fields will experience the most growth, helping Class 9-10 students pick the right streams." }
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

      <section className="inner-hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="text-accent">Insights & Advice</span>
            <h1>Counselling Blog</h1>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: AUTHOR BIO */}
      <section className="bg-sage-section" style={{ padding: '60px 0' }}>
        <div className="container">
           <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
             <div style={{ flex: '0 0 150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '5px solid var(--color-soft-teal)' }}>
                <img src="/images/ria_portrait.jpg" alt="Ria Jain" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-deep-teal)', marginBottom: '10px' }}>Meet the Lead Editor: Ria Jain</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>With years of hands-on experience in global university admissions and career psychology, Ria curates every article on this blog to ensure students receive the most accurate, actionable, and up-to-date guidance possible.</p>
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
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}
          >
            {blogs.map((b, i) => (
              <motion.div key={i} className="blog-card" variants={fadeUp} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                <div className="blog-card-img" style={{ height: '220px', overflow: 'hidden' }}>
                  <img src={b.img} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="hover-scale" />
                </div>
                <div className="blog-card-content" style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--color-deep-teal)', lineHeight: '1.4' }}>{b.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>{b.desc}</p>
                  <a href="#" style={{ color: 'var(--color-soft-teal)', fontWeight: 'bold', textDecoration: 'none' }}>Read Full Article &rarr;</a>
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
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>Get the latest admission trends, scholarship alerts, and test prep tips delivered straight to your inbox every month.</p>
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
