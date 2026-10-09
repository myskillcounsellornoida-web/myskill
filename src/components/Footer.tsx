"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer style={{ background: 'var(--color-deep-teal)', color: 'white', paddingTop: '80px', paddingBottom: '30px' }}>
      <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px', marginBottom: '50px' }}>
        
        {/* Brand & Newsletter */}
        <div className="footer-brand">
          <Link href="/">
             {/* Using text logo here for better contrast against dark background if image logo is dark */}
             <h3 style={{ color: 'var(--color-soft-teal)', fontSize: '1.8rem', marginBottom: '15px' }}>My Skill Counsellor</h3>
          </Link>
          <p style={{ color: 'var(--color-soft-ivory)', opacity: 0.8, marginBottom: '25px', lineHeight: '1.6' }}>
            Empowering students with clarity, strategy, and confidence to achieve global university admissions.
          </p>
          <form className="footer-subscribe-form" style={{ display: 'flex', gap: '10px' }}>
            <input type="email" placeholder="Subscribe for updates" style={{ padding: '10px', borderRadius: '4px', border: 'none', width: '100%' }} required />
            <button type="submit" style={{ background: 'var(--color-muted-coral)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Join</button>
          </form>
        </div>

        {/* Useful Links & Study Boards */}
        <div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--color-soft-teal)', paddingBottom: '10px', display: 'inline-block' }}>Useful Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Home</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Our Services</Link></li>
            <li><Link href="/testimonials" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Success Stories</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>SOP Maker & Personality Test</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Application & Loan Documents</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--color-soft-teal)', paddingBottom: '10px', display: 'inline-block' }}>Study Boards</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'white', opacity: 0.8 }}>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none' }}>CBSE & ICSE</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none' }}>IB BOARD & CAIE</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none' }}>IGCSE</Link></li>
            <li><Link href="/services" style={{ color: 'white', textDecoration: 'none' }}>K-12 & STATE BOARDS</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--color-soft-teal)', paddingBottom: '10px', display: 'inline-block' }}>Get in Touch</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--color-soft-ivory)', opacity: 0.8 }}>
            <li><i className="fas fa-envelope" style={{ marginRight: '10px', color: 'var(--color-soft-teal)' }}></i> <a href="mailto:info@myskillcounsellor.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@myskillcounsellor.com</a></li>
            <li><i className="fab fa-whatsapp" style={{ marginRight: '10px', color: 'var(--color-soft-teal)' }}></i> +91 9990004878</li>
            <li><i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: 'var(--color-soft-teal)' }}></i> Noida, India</li>
          </ul>
          
          {/* Social Icons */}
          <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
            <a href="https://www.linkedin.com/in/riajain26" target="_blank" style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'white', transition: 'all 0.3s' }}><i className="fab fa-linkedin-in"></i></a>
            <a href="https://wa.me/message/24XQYF3LERXWA1" target="_blank" style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'white', transition: 'all 0.3s' }}><i className="fab fa-whatsapp"></i></a>
            <a href="#" style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'white', transition: 'all 0.3s' }}><i className="fab fa-instagram"></i></a>
          </div>
        </div>

      </div>

      <div className="container footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
        <p>&copy; {new Date().getFullYear()} My Skill Counsellor. All Rights Reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
