"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stag = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function ServicesClient({ initialServices = [], initialFaqs = [] }: { initialServices?: any[]; initialFaqs?: any[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const defaultServices = [
  {
    title: "Before the Offer Letter",
    subtitle: "Building the Right Foundation",
    icon: "fa-seedling",
    image: "/images/service_card_before_offer.png",
    desc: "The foundation of a successful study abroad journey begins years before the application. We guide students through strategic profile building and selection.",
    points: [
      "Career & Profile Assessment",
      "Strategic Profile Building",
      "Course & University Selection",
      "Study Abroad Planning",
      "SOP & LOR Guidance",
      "Application Support",
      "Interview Preparation",
      "IELTS / TOEFL Preparation"
    ]
  },
  {
    title: "After the Offer Letter",
    subtitle: "Preparing for the Move",
    icon: "fa-file-contract",
    image: "/images/service_card_after_offer.png",
    desc: "Receiving the offer is just the beginning. We handle the complex logistics of visas, finances, and pre-departure planning to ensure a smooth transition.",
    points: [
      "Final University Selection",
      "Offer Acceptance Guidance",
      "Comprehensive Visa Support",
      "Financial Documentation",
      "Accommodation Support",
      "Pre-Departure Guidance",
      "Packing & Travel Planning",
      "Banking, Insurance & Currency"
    ],
    reverse: true
  },
  {
    title: "After Departure",
    subtitle: "Settling into Your New Life",
    icon: "fa-globe-americas",
    image: "/images/service_card_after_departure.png",
    desc: "Our support doesn't end at the airport. We remain your trusted point of contact as you navigate the initial weeks of settling into a new country.",
    points: [
      "Arrival & Settling-In Support",
      "Local Transport & Safety Navigation",
      "SIM, Banking & Healthcare Setup",
      "Campus & Academic Orientation",
      "Daily Living Support",
      "Personalised Check-ins"
    ]
  }
  ];

  const mapDbService = (s: any, i: number) => ({
    title: s.title,
    subtitle: s.subtitle || "Specialized Service",
    icon: s.icon || "fa-seedling",
    image: ["/images/service_card_before_offer.png", "/images/service_card_after_offer.png", "/images/service_card_after_departure.png"][i % 3],
    desc: s.description || "",
    points: s.description ? s.description.split('\n').filter((p:string) => p.trim()) : [],
    reverse: i % 2 !== 0
  });

  const [services, setServices] = useState<any[]>(
    initialServices.length > 0 ? initialServices : defaultServices
  );

  const displayServices = services === defaultServices ? defaultServices : services.map(mapDbService);

  const defaultFaqs = [
    { q: "How long does the study abroad counselling process take?", a: "Ideally, the process takes 12-18 months. This allows time for profile building, test preparation, university shortlisting, and completing applications before early deadlines." },
    { q: "Do you offer targeted SOP review if I already wrote my draft?", a: "Yes. If you have drafted your Statement of Purpose, we offer a specialized editing service to refine the narrative and align it with university expectations." },
    { q: "Can you help with student visas for Dubai and the UK?", a: "Absolutely. Visa processing is a core part of our comprehensive package. We guide you through financial documentation, mock interviews, and the application process." }
  ];

  const [faqs, setFaqs] = useState<any[]>(
    initialFaqs.length > 0 ? initialFaqs : defaultFaqs
  );

  const displayFaqs = faqs === defaultFaqs ? defaultFaqs : faqs.map(f => ({ q: f.question, a: f.answer }));



  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: displayFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      {/* HERO SECTION */}
      <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "80px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/hero_services_page.png)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(37,95,107,0.85) 0%, rgba(37,95,107,0.5) 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "3px", textTransform: "uppercase", padding: "8px 20px", borderRadius: 30, marginBottom: 24, border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(5px)" }}>
              Our Offerings
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(2.5rem,5vw,4rem)", marginBottom: 20, textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              Comprehensive Counselling Services
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.15rem", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              End-to-end guidance tailored to every stage of your academic journey — from the first profile assessment to settling into your new dorm room.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DETAILED SERVICES - STICKY OVERLAPPING ANIMATED STACK */}
      <section style={{ padding: "100px 0 140px 0", background: "var(--bg-primary)", position: "relative" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="text-accent">Step-By-Step Journey</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-deep-teal)" }}>
              The Three Pillars of Guidance
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: 650, margin: "12px auto 0" }}>
              Explore how our structured process walks alongside you before application, during decision-making, and after arrival.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {displayServices.map((service, idx) => (
              <motion.div 
                key={idx} 
                id={idx === 0 ? "before-offer" : idx === 1 ? "after-offer" : "after-departure"}
                className="service-stage-card"
                initial={{ opacity: 0, y: 60 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-40px" }} 
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  position: "sticky",
                  top: `calc(100px + ${idx * 35}px)`,
                  zIndex: idx + 1,
                  background: "white",
                  borderRadius: "28px",
                  padding: "48px",
                  boxShadow: `0 ${15 + idx * 10}px 45px rgba(37,95,107,${0.1 + idx * 0.05})`,
                  border: "1px solid var(--border-color)",
                  marginBottom: idx === displayServices.length - 1 ? "0" : "40px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "50px",
                  alignItems: "center",
                  flexDirection: service.reverse ? "row-reverse" : "row"
                }}
              >
                <div style={{ flex: "1 1 380px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white", background: "var(--color-deep-teal)", padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "2px", fontFamily: "var(--font-heading)" }}>
                      Stage 0{idx + 1}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-muted-coral)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {service.subtitle}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", color: "var(--color-deep-teal)", marginBottom: 12, fontFamily: "var(--font-heading)", fontWeight: 800 }}>
                    {service.title}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 24 }}>
                    {service.desc}
                  </p>
                  <div className="points-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: 32 }}>
                    {service.points.map((pt: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--color-deep-teal)", fontWeight: 600, fontSize: "0.9rem" }}>
                        <i className="fas fa-check-circle" style={{ color: "var(--color-soft-teal)" }} />
                        {pt}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="btn btn-primary" style={{ borderRadius: "30px", padding: "12px 28px" }}>
                    Discuss Your Stage <i className="fas fa-arrow-right" style={{ marginLeft: 6 }}/>
                  </Link>
                </div>
                <div style={{ flex: "1 1 380px", position: "relative", minHeight: "320px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}>
                  <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIZED PROGRAMS */}
      <section style={{ background: "var(--bg-secondary)", padding: "80px 0" }}>
        <div className="container">
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="text-accent">Additional Offerings</span>
            <h2>Specialized Programs & Guidance</h2>
          </motion.div>
          <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stag}>
            {[
              "Customised Internships",
              "Leadership Program",
              "Career Library",
              "Career Boosters",
              "SOP Writing Assistance",
              "Profile Building Guidance",
              "Interview Preparation"
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeUp} style={{ background: "var(--bg-primary)", padding: "25px", borderRadius: "12px", borderLeft: "4px solid var(--color-deep-teal)", display: "flex", alignItems: "center", gap: "15px", boxShadow: "var(--shadow-soft)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(37,95,107,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-deep-teal)" }}>
                  <i className="fas fa-arrow-right" />
                </div>
                <h4 style={{ margin: 0, color: "var(--color-deep-teal)", fontSize: "1.05rem" }}>{service}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0", background: "var(--bg-primary)" }}>
        <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="text-accent">Services FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>
          <div style={{ marginTop: 40 }}>
             {displayFaqs.map((faq, i) => (
                <div key={i} style={{ marginBottom: 15, background: "var(--bg-secondary)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-soft)", border: "1px solid var(--border-color)" }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-deep-teal)", fontFamily: "var(--font-heading)" }}
                  >
                    {faq.q}
                    <i className={`fas fa-chevron-${openFaq === i ? "up" : "down"}`} style={{ color: "var(--color-soft-teal)" }} />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 20px 24px", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
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
