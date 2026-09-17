"use client";

import { usePathname } from "next/navigation";
import { useCms } from "@/components/cms/CmsProvider";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const { t } = useCms();

  // Hide the floating widget in the admin panels
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href={t("whatsapp_url")}
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
