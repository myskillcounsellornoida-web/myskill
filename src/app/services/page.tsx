"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Services() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceFaqs = [
    { q: "How long does the study abroad counselling process take?", a: "Ideally, the process takes 12-18 months. This allows time for profile building, test preparation (IELTS/SAT), university shortlisting, and completing applications before the early deadlines." },
    { q: "Do you offer targeted SOP review if I already wrote my draft?", a: "Yes. If you have already drafted your Statement of Purpose, we offer a specialized editing service to refine the narrative, ensure structural flow, and align it with what top universities look for." },
    { q: "Can you help with student visas for Dubai and the UK?", a: "Absolutely. Visa processing is a core part of our comprehensive package. We guide you through financial documentation, mock visa interviews, and the actual application process." }
  ];

  return (
    <main>
      {/* AEO Schema for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: serviceFaqs.map((faq) => ({
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

      <section className="inner-hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="text-accent">Our Offerings</span>
            <h1>Comprehensive Counselling Services</h1>
          </motion.div>
        </div>
      </section>

      {/* Service 1 */}
      <section className="bg-white-section service-detail-block">
        <div className="container service-detail-grid">
          <motion.div className="service-detail-content" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Service 01</span>
            <h2>Global Study Abroad Counselling</h2>
            <p>Navigating international admissions requires careful strategy. We assist students from start to finish for top-tier universities in Dubai, UK, USA, Canada, and Europe.</p>
            <ul className="service-detail-features">
              <li><i className="fas fa-check-circle"></i> Complete University Shortlisting</li>
              <li><i className="fas fa-check-circle"></i> Pre-Departure Briefings</li>
            </ul>
            <Link href="/contact" className="btn btn-primary">Inquire Now</Link>
          </motion.div>
          <motion.div className="service-detail-visual" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
            <img src="/images/whatsapp_image_2024-12-24_at_14.13.32.jpeg" alt="Study Abroad" style={{ width: '100%', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </motion.div>
        </div>
      </section>

      {/* Service 2 */}
      <section className="bg-sage-section service-detail-block">
        <div className="container service-detail-grid reverse">
          <motion.div className="service-detail-content" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Service 02</span>
            <h2>Profile Building & SOP Creation</h2>
            <p>Your Statement of Purpose is where your voice is heard. We help draft and polish your narrative and build high-impact portfolios.</p>
            <ul className="service-detail-features">
              <li><i className="fas fa-check-circle"></i> Unique SOP Structuring</li>
              <li><i className="fas fa-check-circle"></i> Extracurricular Portfolio Curation</li>
            </ul>
            <Link href="/contact" className="btn btn-primary">Review My Profile</Link>
          </motion.div>
          <motion.div className="service-detail-visual" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
            <img src="/images/whatsapp_image_2024-12-24_at_13.54.39.jpeg" alt="SOP Building" />
          </motion.div>
        </div>
      </section>

      {/* Service 3 */}
      <section className="bg-white-section service-detail-block">
        <div className="container service-detail-grid">
          <motion.div className="service-detail-content" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Service 03</span>
            <h2>IELTS & TOEFL Preparation</h2>
            <p>Don't let language barriers hold you back. Our intensive, structured coaching ensures you hit the band scores required by top universities.</p>
            <ul className="service-detail-features">
              <li><i className="fas fa-check-circle"></i> Weekly Mock Tests & Feedback</li>
              <li><i className="fas fa-check-circle"></i> Intensive Speaking Practice</li>
            </ul>
            <Link href="/contact" className="btn btn-primary">Book a Demo Class</Link>
          </motion.div>
          <motion.div className="service-detail-visual" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
            <img src="/images/whatsapp_image_2024-08-16_at_15.04.54_2.jpeg" alt="IELTS Prep" />
          </motion.div>
        </div>
      </section>

      {/* NEW GALLERY: Workshop Highlights */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container">
           <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '40px' }}>
             <span className="text-accent">Inside The Process</span>
             <h2>Counselling & Workshop Highlights</h2>
             <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '20px auto 0' }}>A glimpse into our vibrant sessions, seminars, and personalized student consultations across various cities and schools.</p>
           </motion.div>
           <motion.div 
             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
           >
             {[
               "/images/whatsapp_image_2024-01-03_at_4.39.54_pm_2.jpeg",
               "/images/whatsapp_image_2024-01-03_at_5.06.36_pm_2.jpeg",
               "/images/whatsapp_image_2024-03-20_at_10.27.00_1_1.jpeg",
               "/images/whatsapp_image_2024-09-24_at_16.15.48_1_2.jpeg",
               "/images/whatsapp_image_2024-11-25_at_14.49.36_1.jpeg",
               "/images/whatsapp_image_2024-12-18_at_18.16.48_1.jpeg",
               "/images/whatsapp_image_2024-12-24_at_14.18.39_6.jpeg",
               "/images/whatsapp_image_2024-12-24_at_14.38.57.jpeg",
               "/images/whatsapp_image_2024-12-30_at_15.24.05.jpeg",
               "/images/whatsapp_image_2024-12-30_at_15.24.05_2_2.jpeg"
             ].map((img, idx) => (
               <motion.div key={idx} variants={fadeUp} style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s' }} whileHover={{ scale: 1.05 }}>
                 <img src={img} alt="Counselling Session" style={{ width: '100%', height: '250px', objectFit: 'cover' }} loading="lazy" />
               </motion.div>
             ))}
           </motion.div>
        </div>
      </section>

      {/* NEW SECTION: SPECIALIZED SERVICES (FROM LIVE SITE) */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="text-accent">Browse through our Services</span>
            <h2>Specialized Programs & Guidance</h2>
          </motion.div>
          
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              "Customised Internships",
              "Leadership Program",
              "Career Library",
              "Career Boosters",
              "SOP Writing assistance",
              "Profile Building Guidance",
              "Study Abroad Interview Preparation",
              "Scholarship Guidance"
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeUp} style={{ background: 'var(--color-soft-ivory)', padding: '25px', borderRadius: '10px', borderLeft: '4px solid var(--color-deep-teal)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <i className="fas fa-arrow-right" style={{ color: 'var(--color-soft-teal)' }}></i>
                <h4 style={{ margin: 0, color: 'var(--color-deep-teal)', fontSize: '1.1rem' }}>{service}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* GLOBAL DESTINATIONS */}
      <section className="bg-deep-teal-section" style={{ background: 'var(--color-deep-teal)', color: 'white', padding: '80px 0' }}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent" style={{ color: 'var(--color-soft-teal)' }}>Where We Send Students</span>
            <h2 style={{ color: 'white' }}>Top Global Destinations</h2>
          </motion.div>

          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            {[
              { country: "Canada", flag: "/assets/canada.svg", highlights: ["High Permanent Residency (PR) Chance", "Co-op Programs", "Safe & Multicultural"] },
              { country: "Australia", flag: "/assets/australia.png", highlights: ["World-Class Research Hubs", "Post-Study Work Rights", "Booming Job Markets"] },
              { country: "Germany", flag: "/assets/germany.png", highlights: ["Free/Low Tuition Fees", "Engineering & Tech Hub", "Strong Economy"] },
              { country: "France", flag: "/assets/FRANCE.png", highlights: ["Top Business Schools", "Rich Culture", "Post-Study Visas"] },
              { country: "Ireland", flag: "/assets/IRELAND.png", highlights: ["European Tech HQ", "English Speaking", "Welcoming Culture"] },
              { country: "Singapore", flag: "/assets/singapore.png", highlights: ["Asian Financial Hub", "Proximity to India", "High Quality of Life"] }
            ].map((dest, i) => (
              <motion.div key={i} variants={fadeUp} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-soft-teal)', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  <img src={dest.flag} alt={`${dest.country} Flag`} style={{ width: '30px', marginRight: '10px', borderRadius: '4px' }} />
                  {dest.country}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {dest.highlights.map((h, idx) => (
                    <li key={idx} style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}><i className="fas fa-check" style={{ color: 'var(--color-soft-teal)', marginRight: '8px' }}></i> {h}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Services FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>

          <div style={{ marginTop: '40px' }}>
             {serviceFaqs.map((faq, i) => (
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
    </main>
  );
}
