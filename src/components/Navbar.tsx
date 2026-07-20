"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close menu on route transition
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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

  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <div className="container navbar">
        <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '14px' }}>
          <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
            <Image src="/assets/logo.png" alt="My Skill Counsellor" fill sizes="46px" style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ lineHeight: 1.15 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.45rem', color: 'var(--color-deep-teal)', letterSpacing: '0.4px' }}>
              My Skill
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.74rem', color: 'var(--color-muted-coral)', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '2px' }}>
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
            <li className="mobile-cta-li" style={{ marginTop: "20px" }}>
              <Link 
                href="/contact" 
                className="btn btn-primary" 
                style={{ padding: '14px 28px', fontSize: '1.05rem', fontWeight: 700 }}
                onClick={() => setIsMenuOpen(false)}
              >
                Let's Connect <i className="fas fa-arrow-right" style={{ marginLeft: 6 }}/>
              </Link>
            </li>
          </ul>
        </nav>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
        >
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
        
        <div className="nav-cta">
          <Link href="/contact" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: '1.02rem', fontWeight: 700, fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}>
            Let's Connect <i className="fas fa-arrow-right" style={{ marginLeft: 6, fontSize: '0.9rem' }}/>
          </Link>
        </div>
      </div>
    </header>
  );
}
