"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppWidget() {
  const pathname = usePathname();

  // Hide the floating widget in the admin panels
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/message/24XQYF3LERXWA1"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with Ria on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="whatsapp-tooltip">Chat with Ria</span>
    </a>
  );
}
