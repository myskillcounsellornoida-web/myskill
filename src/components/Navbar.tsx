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
        <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={{ position: 'relative', width: '40px', height: '40px', marginRight: '12px' }}>
            <Image src="/assets/logo.png" alt="My Skill Counsellor" fill sizes="40px" style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ lineHeight: 1.1 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-deep-teal)', letterSpacing: '0.3px' }}>My Skill</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.68rem', color: 'var(--color-muted-coral)', letterSpacing: '2px', textTransform: 'uppercase' }}>Counsellor</span>
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
                onClick={() => setIsMenuOpen(false)}
              >
                Let's Connect
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
          <Link href="/contact" className="btn btn-primary">Let's Connect</Link>
        </div>
      </div>
    </header>
  );
}
