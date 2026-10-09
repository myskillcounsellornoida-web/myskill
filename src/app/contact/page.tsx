"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { submitContactForm } from "../actions";
import { useState } from "react";
import { Txt, useCms } from "@/components/cms/CmsProvider";
import { PageHero, fadeUp, stagger } from "@/components/cms/Sections";

const CONTACT_FAQS = [
  { q: "Is the first consultation free?", a: "Yes! We offer a complimentary initial profile assessment to understand your goals and explain how our services can help you achieve them." },
  { q: "How do virtual sessions work?", a: "We conduct highly interactive 1-on-1 virtual sessions via Google Meet or Zoom, ensuring that we can support students globally without geographical limitations." },
];

export default function Contact() {
  const { t } = useCms();
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleAction(formData: FormData) {
    setIsSubmitting(true);
    setStatus(null);
    const res = await submitContactForm(formData);
    setStatus({ text: res.message, ok: res.success });
    setIsSubmitting(false);
  }

  const phone = t("contact_phone");
  const email = t("contact_email");

  const infoCards = [
    { icon: "fa-phone-alt", title: "Call Us", valueKey: "contact_phone", href: `tel:${phone.replace(/\s/g, "")}`, noteKey: "contact_hours" },
    { icon: "fa-envelope", title: "Email Us", valueKey: "contact_email", href: `mailto:${email}`, noteKey: "contact_reply_time" },
    { icon: "fa-map-marker-alt", title: "Visit Us", valueKey: "contact_location", href: undefined, noteKey: "contact_visit_note" },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: CONTACT_FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero prefix="contact" />

      <section className="section">
        <div className="container contact-grid">
          <motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Txt k="contact_intro_label" className="eyebrow" />
            <Txt k="contact_intro_title" as="h2" />
            <Txt k="contact_intro_desc" as="p" className="lead-text" />

            <ul className="contact-quick">
              {infoCards.map((c) => (
                <li key={c.icon}>
                  <span className="contact-quick-icon"><i className={`fas ${c.icon}`} /></span>
                  {c.href ? <a href={c.href}><Txt k={c.valueKey} /></a> : <Txt k={c.valueKey} />}
                </li>
              ))}
              <li>
                <span className="contact-quick-icon is-whatsapp"><i className="fab fa-whatsapp" /></span>
                <a href={t("whatsapp_url")} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              </li>
            </ul>

            <div className="contact-photo">
              <Image src="/images/img_5288_1.jpg" alt="Ria Jain in a virtual counselling session" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          </motion.div>

          <motion.div className="contact-form-container" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Txt k="contact_form_title" as="h3" />
            <form action={handleAction}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name">Full Name *</label>
                  <input id="c-name" type="text" name="name" className="form-control" autoComplete="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number *</label>
                  <input id="c-phone" type="tel" name="phone" className="form-control" autoComplete="tel" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-email">Email Address *</label>
                <input id="c-email" type="email" name="email" className="form-control" autoComplete="email" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-qual">Current Stage *</label>
                  <select id="c-qual" name="qualification" className="form-control" required defaultValue="">
                    <option value="" disabled>Select your current stage</option>
                    <option value="Class 9-12">High School (Class 9-12)</option>
                    <option value="Undergraduate">Undergraduate Student</option>
                    <option value="Graduate">Graduate Student</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="c-service">Interested Service *</label>
                  <select id="c-service" name="service" className="form-control" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    <option value="Study Abroad">Study Abroad Counselling</option>
                    <option value="Career Counselling">Career Counselling</option>
                    <option value="SOP Building">SOP / Profile Building</option>
                    <option value="IELTS / TOEFL">IELTS / TOEFL Preparation</option>
                    <option value="Visa Support">Visa Support</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-msg">How can I help you? *</label>
                <textarea id="c-msg" name="message" className="form-control" rows={4} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send Enquiry & Connect"}
              </button>
              {status && <p className={`form-status ${status.ok ? "is-success" : "is-error"}`} role="status">{status.text}</p>}
            </form>
          </motion.div>
        </div>
      </section>

      {/* DIRECT CONTACT INFO */}
      <section className="section bg-white-section">
        <div className="container">
          <motion.div className="info-card-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {infoCards.map((info) => (
              <motion.div key={info.icon} variants={fadeUp} className="info-card">
                <div className="info-card-icon"><i className={`fas ${info.icon}`} /></div>
                <h3>{info.title}</h3>
                <p className="info-card-value">
                  {info.href ? <a href={info.href}><Txt k={info.valueKey} /></a> : <Txt k={info.valueKey} />}
                </p>
                <Txt k={info.noteKey} as="p" className="info-card-note" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-sage-section">
        <div className="container narrow">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="eyebrow">Consultation Support</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>
          <div className="faq-list">
            {CONTACT_FAQS.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "is-open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span>{faq.q}</span>
                  <i className="fas fa-plus" />
                </button>
                {openFaq === i && <div className="faq-answer"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
