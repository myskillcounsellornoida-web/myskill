"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Txt } from "@/components/cms/CmsProvider";
import Arranged from "@/components/cms/Arranged";
import VideoGallery from "@/components/cms/VideoGallery";
import { CtaBand, PageHero, fadeUp, stagger } from "@/components/cms/Sections";

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

const TEST_FAQS = [
  { q: "Are these reviews verified?", a: "Yes, all our success stories are from actual students and parents who have worked with My Skill Counsellor through the complete admission lifecycle." },
  { q: "Can I speak to a past student?", a: "To protect the privacy of our students, we do not publicly share their direct contact information. However, during your initial consultation, we can discuss specific case studies relevant to your goals." },
];

export default function TestimonialsClient({ testimonialsList: testimonials }: { testimonialsList: Testimonial[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sections: Record<string, ReactNode> = {
    stats: (
      <section className="stats-band is-compact">
        <div className="container">
          <motion.div className="stats-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[1, 2, 3, 4].map((n) => (
              <motion.div key={n} variants={fadeUp} className="stat-item">
                <Txt k={`tstat${n}_value`} className="stat-value" />
                <Txt k={`tstat${n}_label`} className="stat-label" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    ),
    stories: (
      <section className="section bg-sage-section">
        <div className="container">
          <motion.div className="testimonial-wall" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {testimonials.map((item, i) => (
              <motion.figure key={i} variants={fadeUp} className="quote-card">
                <div className="quote-stars" aria-label="5 star review">
                  {Array.from({ length: 5 }, (_, s) => <i key={s} className="fas fa-star" />)}
                </div>
                <blockquote>&ldquo;{item.text}&rdquo;</blockquote>
                <figcaption>
                  <span className="quote-avatar">{item.name.charAt(0)}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>
    ),
    press: (
      <section className="section bg-white-section">
        <div className="container split-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Txt k="press_label" className="eyebrow" />
            <Txt k="press_title" as="h2" />
            <Txt k="press_desc" as="p" className="lead-text" />
          </motion.div>
          <motion.div className="press-collage" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="press-main">
              <Image src="/images/shah_times_article_cropped.jpg" alt="Featured in Shah Times" width={630} height={350} style={{ width: "100%", height: "auto" }} />
            </div>
            <div className="press-side">
              <Image src="/assets/slider3.png" alt="Perfect Woman magazine interview" width={540} height={400} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </div>
          </motion.div>
        </div>
      </section>
    ),
    faq: (
      <section className="section">
        <div className="container narrow">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="eyebrow">Verification</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>
          <div className="faq-list">
            {TEST_FAQS.map((faq, i) => (
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
    ),
    videos: <VideoGallery className="bg-sage-section" />,
    cta: <CtaBand />,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: TEST_FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero prefix="testimonials" />

      <Arranged page="/testimonials" sections={sections} />
    </main>
  );
}
