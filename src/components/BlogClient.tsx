"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { subscribeNewsletter } from "@/app/actions";
import { Txt, useCms } from "@/components/cms/CmsProvider";
import { PageHero, fadeUp, stagger } from "@/components/cms/Sections";

interface Blog {
  id?: number;
  title: string;
  content?: string;
  desc?: string;
  image?: string | null;
  img?: string;
  tag?: string | null;
  category?: string;
  readTime?: string | null;
  date?: string;
  url?: string;
  linkedinCTA?: string;
}

const BLOG_FAQS = [
  { q: "How often do you post new study abroad insights?", a: "We publish detailed guides and insights bi-weekly to ensure students and parents are always up-to-date with changing admission landscapes." },
  { q: "Can I suggest a topic for the blog?", a: "Yes! If you have specific questions about a country, university, or test prep, reach out via the Contact page and we may feature it in our next guide." },
];

const CREDENTIALS = ["EduMilestones Certified", "CCCIS Certified", "MA English", "Visa Training Certified"];

export default function BlogClient({ blogsList: blogs }: { blogsList: Blog[] }) {
  const { t } = useCms();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeArticle, setActiveArticle] = useState<Blog | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    if (!activeArticle) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveArticle(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeArticle]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    setSubscribeMsg(null);
    const res = await subscribeNewsletter(email);
    setSubscribing(false);
    setSubscribeMsg({ text: res.message, error: !res.success });
    if (res.success) setEmail("");
  };

  const imageOf = (b: Blog) => b.image || b.img || "/images/poster_journey.png";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: BLOG_FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero prefix="blog" />

      {/* AUTHOR BIO */}
      <section className="section bg-sage-section is-tight">
        <div className="container">
          <motion.div className="author-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="author-card-photo">
              <Image src={t("founder_image")} alt={t("founder_name")} fill sizes="140px" style={{ objectFit: "cover" }} />
            </div>
            <div className="author-card-body">
              <Txt k="blog_author_label" className="eyebrow" />
              <Txt k="founder_name" as="h3" />
              <Txt k="blog_author_bio" as="p" />
              <div className="badge-row">
                {CREDENTIALS.map((cert) => (
                  <span key={cert} className="cred-badge"><i className="fas fa-check-circle" />{cert}</span>
                ))}
              </div>
              <a href={t("linkedin_url")} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                <i className="fab fa-linkedin" /> Connect & Verify on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="section">
        <div className="container">
          {blogs.length === 0 ? (
            <p className="empty-state">New articles are on the way — check back soon.</p>
          ) : (
            <motion.div className="blog-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              {blogs.map((b) => (
                <motion.article key={b.id ?? b.title} variants={fadeUp} className="blog-card" onClick={() => setActiveArticle(b)}>
                  <div className="blog-card-img">
                    <Image src={imageOf(b)} alt={b.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                    <span className="blog-card-tag">{b.tag || b.category || "Article"}</span>
                  </div>
                  <div className="blog-card-content">
                    <span className="blog-card-meta">{b.date || b.readTime || "Published"}</span>
                    <h3>{b.title}</h3>
                    <p>{b.desc || (b.content ? b.content.replace(/\*\*/g, "").slice(0, 130) + "…" : "")}</p>
                    <button type="button" className="blog-card-link">
                      Read Article <i className="fas fa-arrow-right" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ARTICLE READER */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            className="reader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activeArticle.title}
              className="reader"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setActiveArticle(null)} className="reader-close" aria-label="Close article">
                <i className="fas fa-times" />
              </button>
              <span className="eyebrow">{activeArticle.tag || activeArticle.category || "Article"}</span>
              <h2>{activeArticle.title}</h2>
              <div className="reader-img">
                <Image src={imageOf(activeArticle)} alt={activeArticle.title} fill sizes="750px" style={{ objectFit: "cover" }} />
              </div>
              <div className="reader-body">{activeArticle.content?.replace(/\*\*/g, "")}</div>

              <div className="reader-cta">
                <div className="reader-cta-title"><i className="fab fa-linkedin" /> Join the Discussion on LinkedIn</div>
                <p>{activeArticle.linkedinCTA || "Have thoughts or questions on this topic? Like, comment, and connect with Ria Jain on LinkedIn to join the discussion!"}</p>
                <a href={activeArticle.url || t("linkedin_url")} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Open on LinkedIn <i className="fas fa-external-link-alt" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEWSLETTER */}
      <section className="cta-band">
        <div className="container cta-band-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <i className="far fa-envelope cta-band-icon" />
            <Txt k="blog_newsletter_title" as="h2" />
            <Txt k="blog_newsletter_desc" as="p" />
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-accent" disabled={subscribing}>
                {subscribing ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {subscribeMsg && (
              <p className={`form-status ${subscribeMsg.error ? "is-error" : "is-success"}`}>{subscribeMsg.text}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container narrow">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="eyebrow">Blog Resources</span>
            <h2>Frequently Asked Questions</h2>
          </motion.div>
          <div className="faq-list">
            {BLOG_FAQS.map((faq, i) => (
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
