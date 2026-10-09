"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { submitContactForm } from "../actions";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactFaqs = [
    { q: "Is the first consultation free?", a: "Yes! We offer a complimentary initial profile assessment to understand your goals and explain how our services can help you achieve them." },
    { q: "How do virtual sessions work?", a: "We conduct highly interactive 1-on-1 virtual sessions via Google Meet or Zoom, ensuring that we can support students globally without geographical limitations." }
  ];

  async function handleAction(formData: FormData) {
    setIsSubmitting(true);
    setStatus("Submitting...");
    const res = await submitContactForm(formData);
    setStatus(res.message);
    setIsSubmitting(false);
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: contactFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      <section className="inner-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-accent">Get in Touch</span>
            <h1>Contact Us</h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container contact-grid">
          <motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="contact-info-block" style={{ marginBottom: '40px' }}>
              <span className="text-accent">Reach Out</span>
              <h2>Start a Conversation</h2>
              <p style={{ marginBottom: '20px' }}>Whether you are a parent exploring study abroad options or a student looking for profile building and career clarity, we are here to support you at every stage.</p>
              
              <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', height: '400px' }}>
                 <Image src="/images/img_5288_1.jpg" alt="Office Environment" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </motion.div>
          
          <motion.div className="contact-form-container" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h3 style={{ marginBottom: '25px', color: 'var(--color-deep-teal)' }}>Submit an Enquiry</h3>
            <form action={handleAction}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" className="form-control" required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" className="form-control" required />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" className="form-control" required />
              </div>
              <div className="form-group">
                <label>Current Class / Qualification *</label>
                <select name="qualification" className="form-control" required defaultValue="">
                  <option value="" disabled>Select your current stage</option>
                  <option value="Class 9-12">High School (Class 9-12)</option>
                  <option value="Undergraduate">Undergraduate Student</option>
                  <option value="Graduate">Graduate Student</option>
                </select>
              </div>
              <div className="form-group">
                <label>Interested Service *</label>
                <select name="service" className="form-control" required defaultValue="">
                  <option value="" disabled>Select service of interest</option>
                  <option value="Study Abroad">Study Abroad Counselling</option>
                  <option value="Career Counselling">Career Counselling</option>
                  <option value="SOP Building">SOP / Profile Building</option>
                </select>
              </div>
              <div className="form-group">
                <label>How can I help you? *</label>
                <textarea name="message" className="form-control" rows={4} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Enquiry & Connect"}
              </button>
              {status && <p style={{ marginTop: '15px', color: status.includes('success') ? 'green' : 'red' }}>{status}</p>}
            </form>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: DIRECT CONTACT INFO */}
      <section className="bg-white-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              { icon: 'fa-phone-alt', title: 'Call Us', detail: '+91 9990004878', subtext: 'Mon-Sat, 9am - 7pm IST' },
              { icon: 'fa-envelope', title: 'Email Us', detail: 'info@myskillcounsellor.com', subtext: 'We typically reply within 24 hours' },
              { icon: 'fa-map-marker-alt', title: 'Visit Us', detail: 'Noida, India', subtext: 'Virtual Consultations Available Globally' }
            ].map((info, i) => (
              <motion.div key={i} variants={fadeUp} style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--color-soft-ivory)', borderRadius: '15px', borderBottom: '4px solid var(--color-soft-teal)' }}>
                <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <i className={`fas ${info.icon}`} style={{ fontSize: '1.5rem', color: 'var(--color-deep-teal)' }}></i>
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-deep-teal)', marginBottom: '10px' }}>{info.title}</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '5px' }}>
                  {info.icon === 'fa-envelope' ? (
                    <a href={`mailto:${info.detail}`} style={{ color: 'inherit', textDecoration: 'none' }}>{info.detail}</a>
                  ) : info.icon === 'fa-phone-alt' ? (
                    <a href={`tel:${info.detail.replace(/ /g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{info.detail}</a>
                  ) : (
                    info.detail
                  )}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{info.subtext}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-sage-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-accent">Consultation Support</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>

          <div style={{ marginTop: '40px' }}>
             {contactFaqs.map((faq, i) => (
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
