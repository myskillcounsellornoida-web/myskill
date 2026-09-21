"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCms } from "@/components/cms/CmsProvider";

export interface LegalClause {
  /** Rendered as "<n>.<i>" beside each paragraph. */
  heading: string;
  items: string[];
}

export const LEGAL_PAGES = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/payment-policy", label: "Payment Policy" },
  { href: "/privacy", label: "Privacy Policy" },
];

/** `{email}` in any clause is replaced with the editable contact address. */
export default function LegalPage({
  title,
  intro,
  sections,
  updated,
}: {
  title: string;
  intro?: string;
  sections: LegalClause[];
  updated: string;
}) {
  const pathname = usePathname();
  const { t } = useCms();
  const email = t("legal_email");

  const withEmail = (line: string) =>
    line.split("{email}").flatMap((part, i) =>
      i === 0
        ? [part]
        : [
            <a key={i} href={`mailto:${email}`} className="legal-link">
              {email}
            </a>,
            part,
          ]
    );

  return (
    <main>
      <section className="page-hero is-legal">
        <div className="page-hero-overlay" />
        <div className="container page-hero-inner">
          <span className="hero-pill">Legal</span>
          <h1 className="page-hero-title">{title}</h1>
          <p className="page-hero-sub">Last updated: {updated}</p>
        </div>
      </section>

      <section className="section">
        <div className="container legal-layout">
          <nav className="legal-nav" aria-label="Policies">
            <span className="legal-nav-title">Our Policies</span>
            {LEGAL_PAGES.map((p) => (
              <Link key={p.href} href={p.href} className={pathname === p.href ? "is-current" : ""}>
                {p.label}
              </Link>
            ))}
          </nav>

          <article className="legal-body">
            {intro && <p className="legal-intro">{withEmail(intro)}</p>}
            {sections.map((s, n) => (
              <section key={s.heading} className="legal-section">
                <h2>
                  <span className="legal-num">{n + 1}</span>
                  {s.heading}
                </h2>
                {s.items.map((line, i) => (
                  <p key={i}>
                    <span className="legal-clause">
                      {n + 1}.{i + 1}
                    </span>
                    {withEmail(line)}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}
