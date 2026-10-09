"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <div className="container navbar">
        <Link href="/" className="logo">
          <img src="/assets/logo.png" alt="My Skill Counsellor" />
          <span>My Skill<br />Counsellor</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link href="/services" className={pathname === "/services" ? "active" : ""}>Services</Link></li>
            <li><Link href="/testimonials" className={pathname === "/testimonials" ? "active" : ""}>Testimonials</Link></li>
            <li><Link href="/blog" className={pathname === "/blog" ? "active" : ""}>Blog</Link></li>
          </ul>
        </nav>
        <div className="nav-cta">
          <Link href="/contact" className="btn btn-primary">Let's Connect</Link>
        </div>
      </div>
    </header>
  );
}
