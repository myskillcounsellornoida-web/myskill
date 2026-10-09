"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { subscribeNewsletter } from "@/app/actions";
import { Txt, useCms } from "@/components/cms/CmsProvider";
import { LEGAL_PAGES } from "@/components/LegalPage";

/** Brand colours are fixed — these are other companies' marks, not our palette. */
const FOOTER_SOCIALS = [
  { key: "whatsapp_url", label: "WhatsApp", icon: "fab fa-whatsapp", color: "#25D366" },
  { key: "instagram_url", label: "Instagram", icon: "fab fa-instagram", color: "#E1306C" },
  { key: "youtube_url", label: "YouTube", icon: "fab fa-youtube", color: "#FF0000" },
  { key: "linkedin_url", label: "LinkedIn", icon: "fab fa-linkedin-in", color: "#0A66C2" },
  { key: "facebook_url", label: "Facebook", icon: "fab fa-facebook-f", color: "#1877F2" },
];

/** Board guides Ria wrote, served as PDFs from /public/boards. */
const STUDY_BOARDS = [
  { label: "CBSE", href: "/boards/cbse.pdf" },
  { label: "ICSE & ISC", href: "/boards/icse-isc.pdf" },
  { label: "IGCSE & O-Level", href: "/boards/igcse-o-level.pdf" },
  { label: "International Baccalaureate", href: "/boards/ib.pdf" },
  { label: "CAIE", href: "/boards/caie.pdf" },
  { label: "K-12 Boards", href: "/boards/k-12.pdf" },
  { label: "State Boards", href: "/boards/state-boards.pdf" },
];

export default function Footer() {
  const pathname = usePathname();
  const { t } = useCms();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage(null);
    const res = await subscribeNewsletter(email);
    setLoading(false);
    if (res.success) {
      setMessage({ text: "Subscribed! Welcome email sent ✨" });
      setEmail("");
    } else {
      setMessage({ text: res.message, error: true });
    }
  };

  return (
    <footer style={{ background: 'var(--color-deep-teal)', color: 'white', paddingTop: '80px', paddingBottom: '30px' }}>
      <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px', marginBottom: '50px' }}>
        
        {/* Brand & Newsletter */}
        <div className="footer-brand">
          <Link href="/" style={{ textDecoration: 'none' }}>
             <span style={{ lineHeight: 1.15, display: 'inline-block', marginBottom: '15px' }}>
               <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.65rem', color: '#FFFFFF', letterSpacing: '0.4px' }}>
                 My Skill
               </span>
               <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-accent-gold)', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '2px' }}>
                 Counsellor
               </span>
             </span>
          </Link>
          <Txt k="footer_tagline" as="p" style={{ color: 'var(--color-soft-ivory)', opacity: 0.8, marginBottom: '25px', lineHeight: '1.6' }} />
          
          <form onSubmit={handleSubscribe} className="footer-subscribe-form" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <div className="subscribe-input-group" style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="Subscribe for updates" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px', borderRadius: '4px', border: 'none', width: '100%', color: '#333' }} 
                required 
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ background: 'var(--color-muted-coral)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                {loading ? "..." : "Join"}
              </button>
            </div>
            {message && (
              <span style={{ fontSize: '0.82rem', color: message.error ? '#fca5a5' : '#86efac' }}>
                {message.text}
              </span>
            )}
          </form>
        </div>

        {/* Useful Links & Study Boards */}
        <div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--color-soft-teal)', paddingBottom: '10px', display: 'inline-block' }}>Useful Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Home</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Our Services</Link></li>
            <li><Link href="/testimonials" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Success Stories</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>SOP Maker & Personality Test</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--color-soft-teal)', paddingBottom: '10px', display: 'inline-block' }}>Study Boards</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'white', opacity: 0.8 }}>
            {STUDY_BOARDS.map((b) => (
              <li key={b.href}>
                <a href={b.href} target="_blank" rel="noopener noreferrer" className="footer-board-link">
                  {b.label}
                  <i className="fas fa-file-pdf" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--color-soft-teal)', paddingBottom: '10px', display: 'inline-block' }}>Get in Touch</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--color-soft-ivory)', opacity: 0.8 }}>
            <li><i className="fas fa-envelope" style={{ marginRight: '10px', color: 'var(--color-soft-teal)' }}></i> <a href={`mailto:${t("contact_email")}`} style={{ color: 'inherit', textDecoration: 'none' }}><Txt k="contact_email" /></a></li>
            <li><i className="fab fa-whatsapp" style={{ marginRight: '10px', color: 'var(--color-soft-teal)' }}></i> <a href={`tel:${t("contact_phone").replace(/\s/g, "")}`} style={{ color: 'inherit', textDecoration: 'none' }}><Txt k="contact_phone" /></a></li>
            <li><i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: 'var(--color-soft-teal)' }}></i> <Txt k="contact_location" /></li>
          </ul>
          
          {/* Social Icons */}
          <div style={{ marginTop: '25px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {FOOTER_SOCIALS.map((s) => {
              const href = t(s.key);
              if (!href.trim()) return null;
              return (
                <a
                  key={s.key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social"
                  style={{ '--brand': s.color } as React.CSSProperties}
                >
                  <i className={s.icon}></i>
                </a>
              );
            })}
          </div>
        </div>

      </div>

      <div className="container footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
        <p>{t("footer_copyright").trim().startsWith("©") ? null : <>&copy; {new Date().getFullYear()} </>}<Txt k="footer_copyright" /></p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {LEGAL_PAGES.map((p) => (
              <Link key={p.href} href={p.href} style={{ color: 'inherit', textDecoration: 'none' }}>{p.label}</Link>
            ))}
        </div>
      </div>
    </footer>
  );
}
