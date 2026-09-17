"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Txt, useCms } from "@/components/cms/CmsProvider";
import Arranged from "@/components/cms/Arranged";
import { CtaBand, PageHero, SectionHeading, fadeUp, stagger } from "@/components/cms/Sections";

type Service = { id?: number; title: string; description: string; icon?: string | null };
type Faq = { question: string; answer: string };

const STAGE_ANCHORS = ["before-offer", "after-offer", "after-departure"];

const DEFAULT_PROGRAMS: Service[] = [
  { title: "Customised Internships", description: "Real-world exposure matched to the student's interests and target courses.", icon: "fa-briefcase" },
  { title: "Leadership Program", description: "Structured projects that build initiative, teamwork and a stand-out profile.", icon: "fa-chess-king" },
  { title: "Career Library", description: "Explore 160+ career paths with clear descriptions, skills and outlooks.", icon: "fa-book-open" },
  { title: "Career Boosters", description: "Short, focused courses and certifications that strengthen applications.", icon: "fa-rocket" },
  { title: "SOP Writing Assistance", description: "Story-first Statements of Purpose that sound authentically like you.", icon: "fa-pen-nib" },
  { title: "Interview Preparation", description: "Mock university and visa interviews with detailed feedback.", icon: "fa-comments" },
];

const DEFAULT_FAQS = [
  { q: "How long does the study abroad counselling process take?", a: "Ideally, the process takes 12-18 months. This allows time for profile building, test preparation, university shortlisting, and completing applications without rushing." },
  { q: "Do you offer targeted SOP review if I already wrote my draft?", a: "Yes. If you have drafted your Statement of Purpose, we offer a specialized editing service to refine the narrative and align it with university expectations." },
  { q: "Can you help with student visas for Dubai and the UK?", a: "Absolutely. Visa processing is a core part of our comprehensive package. We guide you through financial documentation, mock interviews, and the application itself." },
];

// Stored icons may be "fas fa-globe" or just "fa-globe".
const ICON_STYLES = new Set(["fa", "fas", "far", "fab", "fa-solid", "fa-regular", "fa-brands"]);
const iconClass = (icon?: string | null) => {
  if (!icon) return "fas fa-graduation-cap";
  return icon.split(/\s+/).some((c) => ICON_STYLES.has(c)) ? icon : `fas ${icon}`;
};

export default function ServicesClient({ services, faqs }: { services: Service[]; faqs: Faq[] }) {
  const { t, color } = useCms();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const programs = services.length > 0 ? services : DEFAULT_PROGRAMS;
  const displayFaqs = faqs.length > 0 ? faqs.map((f) => ({ q: f.question, a: f.answer })) : DEFAULT_FAQS;

  const sections: Record<string, ReactNode> = {
    stages: (
      <section className="section">
        <div className="container">
          <SectionHeading label="services_stages_label" title="services_stages_title" desc="services_stages_desc" />

          <div className="stage-stack">
            {[1, 2, 3].map((n, idx) => {
              const details = t(`service${n}_details`).split("\n").map((p) => p.trim()).filter(Boolean);
              return (
                <motion.article
                  key={n}
                  id={STAGE_ANCHORS[idx]}
                  className={`service-stage-card ${idx % 2 ? "is-reverse" : ""}`}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ top: `calc(100px + ${idx * 32}px)`, zIndex: idx + 1 }}
                >
                  <div className="service-stage-copy">
                    <div className="service-stage-meta">
                      <span className="stage-pill">Stage 0{n}</span>
                      <Txt k={`service${n}_subtitle`} className="stage-card-sub" />
                    </div>
                    <Txt k={`service${n}_title`} as="h2" />
                    <Txt k={`service${n}_desc`} as="p" className="lead-text" />
                    <ul className="check-list is-grid" data-cms={`service${n}_details`} style={{ color: color(`service${n}_details`) }}>
                      {details.map((pt, i) => (
                        <li key={i}><i className="fas fa-check-circle" />{pt}</li>
                      ))}
                    </ul>
                    <Link href="/contact" className="btn btn-primary">
                      <Txt k="services_stage_cta" /> <i className="fas fa-arrow-right" />
                    </Link>
                  </div>
                  <div className="service-stage-media">
                    <Image src={t(`service${n}_image`)} alt={t(`service${n}_title`)} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    ),
    programs: (
      <section className="section bg-white-section">
        <div className="container">
          <SectionHeading label="services_programs_label" title="services_programs_title" />
          <motion.div className="program-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {programs.map((s, idx) => (
              <motion.div key={s.id ?? idx} variants={fadeUp} className="program-card">
                <div className="program-card-icon"><i className={iconClass(s.icon)} /></div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    ),
    faq: (
      <section className="section">
        <div className="container narrow">
          <SectionHeading label="services_faq_label" title="services_faq_title" />
          <div className="faq-list">
            {displayFaqs.map((faq, i) => (
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
            mainEntity: displayFaqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero prefix="services" />

      <Arranged page="/services" sections={sections} />
    </main>
  );
}
