"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import BookingModal from "@/components/BookingModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Auto-close menu on route transition (adjust state during render, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <header className={isScrolled ? "scrolled" : ""}>
        <div className="container navbar">
          <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '14px' }}>
            <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
              <Image src="/assets/logo.png" alt="My Skill Counsellor" fill sizes="46px" style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ lineHeight: 1.05 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: '1.4rem', color: 'var(--color-deep-teal)', letterSpacing: '0.2px' }}>
                My Skill
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-deep-teal)', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '1px' }}>
                Counsellor
              </span>
            </span>
          </Link>

          <nav>
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <li>
                <Link 
                  href="/services" 
                  className={pathname === "/services" ? "active" : ""} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/testimonials" 
                  className={pathname === "/testimonials" ? "active" : ""} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className={pathname === "/blog" ? "active" : ""} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li className="mobile-cta-li">
                <button
                  onClick={() => { setIsMenuOpen(false); setIsBookingOpen(true); }}
                  style={{
                    background: "var(--color-accent-gold, #f59e0b)",
                    color: "#0f172a",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  📅 Book Session
                </button>
                <Link 
                  href="/contact" 
                  className="btn btn-primary" 
                  style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 700 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Let&apos;s Connect <i className="fas fa-arrow-right" style={{ marginLeft: 6 }}/>
                </Link>
              </li>
            </ul>
          </nav>

          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
            style={{ position: 'relative', zIndex: 1002, marginLeft: 'auto' }}
          >
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
          
          <div className="nav-cta" style={{ gap: "12px", alignItems: "center" }}>
            <button
              onClick={() => setIsBookingOpen(true)}
              style={{
                background: "var(--color-soft-teal, #0d9488)",
                color: "#FFFFFF",
                border: "none",
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
            >
              <i className="far fa-calendar-alt" /> Book Session
            </button>

            <Link href="/contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>
              Let&apos;s Connect <i className="fas fa-arrow-right" style={{ marginLeft: 6, fontSize: '0.9rem' }}/>
            </Link>
          </div>
        </div>
      </header>

      {/* Calendly-Style Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
