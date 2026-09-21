"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Txt, useCms } from "./CmsProvider";

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Safe CSS background-image value for an admin-provided URL. */
export const cssUrl = (u: string) => `url("${u.replace(/["\\\n\r]/g, "")}")`;

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// Icons saved from the admin may be "fas fa-globe" or just "fa-globe".
const ICON_STYLES = new Set(["fa", "fas", "far", "fab", "fa-solid", "fa-regular", "fa-brands"]);
export const iconClass = (icon?: string | null) => {
  if (!icon) return "fas fa-graduation-cap";
  return icon.split(/\s+/).some((c) => ICON_STYLES.has(c)) ? icon : `fas ${icon}`;
};

/** Full-bleed image hero used by the inner pages. */
export function PageHero({ prefix }: { prefix: string }) {
  const { t } = useCms();
  const image = t(`${prefix}_hero_image`);
  return (
    <section className="page-hero">
      {image && <div className="page-hero-bg" style={{ backgroundImage: cssUrl(image) }} />}
      <div className="page-hero-overlay" />
      <div className="container page-hero-inner">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Txt k={`${prefix}_hero_label`} className="hero-pill" />
          <Txt k={`${prefix}_hero_title`} as="h1" className="page-hero-title" />
          <Txt k={`${prefix}_hero_sub`} as="p" className="page-hero-sub" />
        </motion.div>
      </div>
    </section>
  );
}

/** Eyebrow label + heading (+ optional italic highlight and description). */
export function SectionHeading({
  label,
  title,
  highlight,
  desc,
  align = "center",
  light = false,
}: {
  label?: string;
  title: string;
  highlight?: string;
  desc?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <motion.div
      className={`section-heading ${align === "left" ? "is-left" : ""} ${light ? "is-light" : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      {label && <Txt k={label} className="eyebrow" />}
      <h2>
        <Txt k={title} />
        {highlight && (
          <>
            {" "}
            <Txt k={highlight} className="text-highlight" />
          </>
        )}
      </h2>
      {desc && <Txt k={desc} as="p" />}
    </motion.div>
  );
}

/** Closing call-to-action banner shared by several pages. */
export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-band-inner">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Txt k="cta_title" as="h2" />
          <Txt k="cta_desc" as="p" />
          <Link href="/contact" className="btn btn-accent btn-lg">
            <Txt k="cta_button" /> <i className="fas fa-arrow-right" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
