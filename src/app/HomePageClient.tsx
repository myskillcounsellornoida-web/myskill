"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import { Txt, useCms } from "@/components/cms/CmsProvider";
import { CtaBand, SectionHeading, cssUrl, fadeUp, stagger } from "@/components/cms/Sections";
import Arranged from "@/components/cms/Arranged";
import VideoGallery from "@/components/cms/VideoGallery";

type Testimonial = { name: string; role: string; text: string };
type Faq = { question: string; answer: string };

const SLIDE_COUNT = 5;

const DESTINATIONS = [
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "USA" },
  { code: "ca", name: "Canada" },
  { code: "ae", name: "Dubai" },
  { code: "au", name: "Australia" },
  { code: "ie", name: "Ireland" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "sg", name: "Singapore" },
];

const PARTNER_LOGOS = [
  { src: "/assets/u2.png", alt: "ERC Institute", dark: true },
  { src: "/assets/u4.png", alt: "European Institute of Management & Technology" },
  { src: "/assets/u5.png", alt: "IIAD" },
];

const STEP_ICONS = ["fa-user-graduate", "fa-map-marked-alt", "fa-pen-fancy", "fa-passport"];
const STAGE_ICONS = ["fa-seedling", "fa-file-contract", "fa-globe-americas"];
const STAGE_ANCHORS = ["before-offer", "after-offer", "after-departure"];

// 4-column grid: one wide + one tall tile + four singles fill two rows exactly.
const GALLERY = [
  { src: "/images/whatsapp_image_2024-01-03_at_4.39.54_pm_2.jpeg", alt: "Career counselling program session", wide: true },
  { src: "/images/whatsapp_image_2024-01-03_at_5.06.36_pm_2.jpeg", alt: "My Skill Counsellor services stand", tall: true },
  { src: "/images/whatsapp_image_2024-03-20_at_10.27.00_1_1.jpeg", alt: "Community outreach with school children" },
  { src: "/images/whatsapp_image_2024-12-24_at_14.13.32.jpeg", alt: "Study abroad fair booth" },
  { src: "/images/whatsapp_image_2024-11-25_at_14.49.36_1.jpeg", alt: "Meeting university representatives" },
  { src: "/images/whatsapp_image_2024-03-20_at_10.27.00_2_1.jpeg", alt: "Career awareness session for children" },
];

const MEDIA = [
  { src: "/images/shah_times_article_cropped.jpg", key: "media_item1_caption", icon: "fa-newspaper" },
  { src: "/assets/slider3.png", key: "media_item2_caption", icon: "fa-microphone" },
  { src: "/images/whatsapp_image_2024-08-16_at_15.04.54_2.jpeg", key: "media_item3_caption", icon: "fa-award" },
  { src: "/images/whatsapp_image_2024-09-24_at_16.15.48_1_2.jpeg", key: "media_item4_caption", icon: "fa-video" },
];

export default function HomePageClient({
  testimonials,
  faqs,
}: {
  testimonials: Testimonial[];
  faqs: Faq[];
}) {
  const { t } = useCms();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setSlide((p) => (p + 1) % SLIDE_COUNT), 5500);
    return () => clearInterval(timer);
  }, [paused]);

  const slideNo = slide + 1;

  // Admin-managed FAQs take precedence; otherwise fall back to the CMS copy.
  const displayFaqs = faqs.length > 0
    ? faqs.map((f) => ({ q: f.question, a: f.answer, qKey: undefined, aKey: undefined }))
    : [1, 2, 3, 4].map((n) => ({ q: t(`faq${n}_q`), a: t(`faq${n}_a`), qKey: `faq${n}_q`, aKey: `faq${n}_a` }));

  const sections: Record<string, ReactNode> = {
    destinations: (
      <section className="destinations-strip">
        <div className="container destinations-inner">
          <Txt k="destinations_label" className="eyebrow" />
          <ul className="destinations-list">
            {DESTINATIONS.map((d) => (
              <li key={d.code}>
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny external flag sprites */}
                <img src={`https://flagcdn.com/w80/${d.code}.png`} alt="" width={28} height={20} loading="lazy" />
                <span>{d.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    stages: (
      <section className="section bg-sage-section">
        <div className="container">
          <SectionHeading label="services_section_title" title="services_heading" highlight="services_heading_highlight" desc="services_section_desc" />
          <motion.div className="stage-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[1, 2, 3].map((n, i) => (
              <motion.div key={n} variants={fadeUp}>
                <Link href={`/services#${STAGE_ANCHORS[i]}`} className="stage-card">
                  <div className="stage-card-img">
                    <Image src={t(`service${n}_image`)} alt={t(`service${n}_title`)} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                    <span className="stage-card-num">0{n}</span>
                    <span className="stage-card-icon"><i className={`fas ${STAGE_ICONS[i]}`} /></span>
                  </div>
                  <div className="stage-card-body">
                    <Txt k={`service${n}_subtitle`} className="stage-card-sub" />
                    <Txt k={`service${n}_title`} as="h3" />
                    <ul className="check-list">
                      {[1, 2, 3, 4].map((p) => (
                        <li key={p}>
                          <i className="fas fa-check-circle" />
                          <Txt k={`service${n}_point${p}`} />
                        </li>
                      ))}
                    </ul>
                    <span className="stage-card-more">Learn more <i className="fas fa-arrow-right" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="section-cta">
            <Link href="/services" className="btn btn-secondary"><Txt k="services_cta" /></Link>
          </div>
        </div>
      </section>
    ),
    steps: (
      <section className="section bg-white-section">
        <div className="container">
          <SectionHeading label="steps_section_title" title="steps_heading" />
          <motion.div className="steps-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[1, 2, 3, 4].map((n, i) => (
              <motion.div key={n} variants={fadeUp} className="step-card">
                <span className="step-card-num">0{n}</span>
                <div className="step-card-icon"><i className={`fas ${STEP_ICONS[i]}`} /></div>
                <Txt k={`step${n}_title`} as="h3" />
                <Txt k={`step${n}_desc`} as="p" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    ),
    about: (
      <section className="section">
        <div className="container founder-grid">
          <motion.div className="founder-photo" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="founder-photo-frame">
              <Image src={t("founder_image")} alt={`${t("founder_name")} – ${t("founder_title")}`} width={500} height={620} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="founder-badge">
              <Txt k="founder_name" className="font-cursive founder-badge-name" />
              <Txt k="founder_title" as="p" className="founder-badge-title" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Txt k="about_label" className="eyebrow" />
            <h2 className="founder-heading">
              <Txt k="about_title" /> <Txt k="about_title_highlight" className="text-highlight" />
            </h2>
            <Txt k="about_para1" as="p" className="lead-text" />
            <Txt k="about_para2" as="p" className="lead-text" />
            <div className="badge-row">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className="cred-badge">
                  <i className="fas fa-certificate" />
                  <Txt k={`founder_badge${n}`} />
                </span>
              ))}
            </div>
            <div className="founder-actions">
              <Link href="/contact" className="btn btn-primary">
                <Txt k="about_cta" /> <i className="fas fa-arrow-right" />
              </Link>
              <a href={t("linkedin_url")} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                <i className="fab fa-linkedin" /> Verify on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    ),
    stats: (
      <section className="stats-band">
        <div className="container">
          <motion.div className="stats-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {["stat_students", "stat_universities", "stat_career_paths", "stat_success_rate"].map((k) => (
              <motion.div key={k} variants={fadeUp} className="stat-item">
                <Txt k={k} className="stat-value" />
                <Txt k={`${k}_label`} className="stat-label" />
              </motion.div>
            ))}
          </motion.div>
          <div className="partners">
            <Txt k="partners_label" className="partners-label" />
            <div className="partners-row">
              {PARTNER_LOGOS.map((l) => (
                <div key={l.src} className={`partner-logo ${l.dark ? "is-dark" : ""}`}>
                  <div className="partner-logo-inner">
                    <Image src={l.src} alt={l.alt} fill sizes="200px" style={{ objectFit: "contain" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    videos: <VideoGallery className="bg-sage-section" />,
    gallery: (
      <section className="section bg-white-section">
        <div className="container">
          <SectionHeading label="gallery_section_label" title="gallery_section_title" desc="gallery_section_desc" />
          <motion.div className="gallery-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {GALLERY.map((g) => (
              <motion.figure key={g.src} variants={fadeUp} className={`gallery-item ${g.wide ? "is-wide" : ""} ${g.tall ? "is-tall" : ""}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
                <figcaption>{g.alt}</figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>
    ),
    testimonials: (
      <section className="section bg-sage-section">
        <div className="container">
          <SectionHeading label="testimonials_section_label" title="testimonials_section_title" />
          <motion.div className="testimonial-grid-home" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {testimonials.slice(0, 3).map((item, i) => (
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
          <div className="section-cta">
            <Link href="/testimonials" className="btn btn-secondary"><Txt k="testimonials_cta" /></Link>
          </div>
        </div>
      </section>
    ),
    workshop: (
      <section className="section">
        <div className="container split-grid">
          <motion.div className="split-media" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Image src={t("workshop_image")} alt="Workshop event" width={640} height={480} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Txt k="workshop_section_label" className="eyebrow" />
            <Txt k="workshop_section_heading" as="h2" />
            <Txt k="workshop_section_desc" as="p" className="lead-text" />
            <div className="event-card">
              <div className="event-card-icon"><i className="far fa-calendar-alt" /></div>
              <div>
                <Txt k="workshop_title" as="h4" />
                <Txt k="workshop_date" as="p" />
              </div>
            </div>
            <Link href="/contact" className="btn btn-primary"><Txt k="workshop_cta" /></Link>
          </motion.div>
        </div>
      </section>
    ),
    media: (
      <section className="section bg-white-section">
        <div className="container">
          <SectionHeading label="media_section_label" title="media_section_title" />
          <motion.div className="media-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {MEDIA.map((m) => (
              <motion.figure key={m.key} variants={fadeUp} className="media-card">
                <div className="media-card-img">
                  <Image src={m.src} alt={t(m.key)} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
                <figcaption>
                  <i className={`fas ${m.icon}`} />
                  <Txt k={m.key} />
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>
    ),
    faq: (
      <section className="section">
        <div className="container narrow">
          <SectionHeading label="faq_section_label" title="faq_section_title" />
          <div className="faq-list">
            {displayFaqs.map((f, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "is-open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {f.qKey ? <Txt k={f.qKey} /> : <span>{f.q}</span>}
                  <i className="fas fa-plus" />
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    {f.aKey ? <Txt k={f.aKey} as="p" /> : <p>{f.a}</p>}
                  </div>
                )}
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
            mainEntity: displayFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO CAROUSEL */}
      <section
        className="hero home-hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <div
            key={i}
            className={`home-hero-slide ${slide === i ? "is-active" : ""}`}
            style={{ backgroundImage: cssUrl(t(`hero_slide${i + 1}_image`)) }}
            aria-hidden={slide !== i}
          />
        ))}
        <div className="home-hero-overlay" />

        <div className="container home-hero-inner">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="home-hero-copy">
            <Txt k="hero_badge_label" className="hero-pill" />
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
              >
                <Txt k={`hero_slide${slideNo}_caption`} as="h1" className="home-hero-title" />
                <Txt k={`hero_slide${slideNo}_sub`} as="p" className="home-hero-sub" />
              </motion.div>
            </AnimatePresence>
            <div className="hero-buttons">
              <Link href="/contact" className="btn btn-accent btn-lg">
                <Txt k="hero_cta_primary" /> <i className="fas fa-arrow-right" />
              </Link>
              <Link href="/services" className="btn btn-ghost-light btn-lg">
                <Txt k="hero_cta_secondary" />
              </Link>
            </div>
          </motion.div>

          <div className="hero-controls">
            <button aria-label="Previous slide" onClick={() => setSlide((p) => (p - 1 + SLIDE_COUNT) % SLIDE_COUNT)} className="hero-nav-btn">
              <i className="fas fa-chevron-left" />
            </button>
            <div className="hero-dots">
              {Array.from({ length: SLIDE_COUNT }, (_, i) => (
                <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setSlide(i)} className={slide === i ? "is-active" : ""} />
              ))}
            </div>
            <button aria-label="Next slide" onClick={() => setSlide((p) => (p + 1) % SLIDE_COUNT)} className="hero-nav-btn">
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      </section>

      <Arranged page="/" sections={sections} />
    </main>
  );
}
