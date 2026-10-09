"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <div className="container navbar">
        <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <img src="/assets/logo.png" alt="My Skill Counsellor" />
          <span>My Skill<br />Counsellor</span>
        </Link>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
        >
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

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
              <Link 
                href="/contact" 
                className="btn btn-primary" 
                onClick={() => setIsMenuOpen(false)}
                style={{ width: "100%", display: "block", textAlign: "center" }}
              >
                Let's Connect
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="nav-cta">
          <Link href="/contact" className="btn btn-primary">Let's Connect</Link>
        </div>
      </div>
    </header>
  );
}
