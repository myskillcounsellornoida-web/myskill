"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { CustomItem, CustomSection } from "@/lib/customSections";
import { fadeUp, stagger } from "./Sections";
import { CountUp, Tilt } from "./motion3d";

const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

function ItemLink({ item, className }: { item: CustomItem; className: string }) {
  if (!item.link) return null;
  const label = item.linkLabel || "Learn more";
  return isInternal(item.link) ? (
    <Link href={item.link} className={className}>{label} <i className="fas fa-arrow-right" /></Link>
  ) : (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>
      {label} <i className="fas fa-arrow-right" />
    </a>
  );
}

function CardItem({ item }: { item: CustomItem }) {
  return (
    <motion.div variants={fadeUp}>
      <Tilt className="cs-card" max={7}>
        {item.image && (
          <div className="cs-card-img">
            <Image src={item.image} alt={item.title || ""} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
          </div>
        )}
        <div className="cs-card-body">
          {item.icon && <span className="cs-card-icon"><i className={item.icon} /></span>}
          {item.title && <h3>{item.title}</h3>}
          {item.text && <p>{item.text}</p>}
          <ItemLink item={item} className="cs-card-link" />
        </div>
      </Tilt>
    </motion.div>
  );
}

function FeatureItem({ item }: { item: CustomItem }) {
  return (
    <motion.div variants={fadeUp} className="cs-feature">
      <span className="cs-feature-icon"><i className={item.icon || "fas fa-star"} /></span>
      {item.title && <h3>{item.title}</h3>}
      {item.text && <p>{item.text}</p>}
      <ItemLink item={item} className="cs-card-link" />
    </motion.div>
  );
}

export default function CustomSectionView({ section }: { section: CustomSection }) {
  const { items, layout, columns, background, align } = section;
  const style = {
    "--cs-columns": String(columns),
    ...(section.accentColor ? { "--cs-accent": section.accentColor } : {}),
    ...(section.textColor ? { "--cs-text": section.textColor } : {}),
  } as React.CSSProperties;

  const hasHeading = !!(section.title || section.label || section.description);

  return (
    <section className={`section cs-section cs-bg-${background} cs-layout-${layout}`} style={style}>
      <div className="container">
        {hasHeading && (
          <motion.div
            className={`section-heading ${align === "left" ? "is-left" : ""}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {section.label && <span className="eyebrow" style={section.accentColor ? { color: section.accentColor } : undefined}>{section.label}</span>}
            {section.title && <h2 style={section.titleColor ? { color: section.titleColor } : undefined}>{section.title}</h2>}
            {section.description && <p style={section.textColor ? { color: section.textColor } : undefined}>{section.description}</p>}
          </motion.div>
        )}

        {items.length > 0 && (
          <motion.div className="cs-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {items.map((item, i) => {
              if (layout === "cards") return <CardItem key={item.id} item={item} />;
              if (layout === "features") return <FeatureItem key={item.id} item={item} />;
              if (layout === "stats") {
                return (
                  <motion.div key={item.id} variants={fadeUp} className="cs-stat">
                    <CountUp value={item.title || ""} className="cs-stat-value" />
                    <span className="cs-stat-label">{item.text}</span>
                  </motion.div>
                );
              }
              if (layout === "gallery") {
                return (
                  <motion.figure key={item.id} variants={fadeUp} className="cs-gallery-item">
                    {item.image && <Image src={item.image} alt={item.title || ""} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />}
                    {item.title && <figcaption>{item.title}</figcaption>}
                  </motion.figure>
                );
              }
              if (layout === "text") {
                return (
                  <motion.div key={item.id} variants={fadeUp} className="cs-text-block">
                    {item.title && <h3>{item.title}</h3>}
                    {item.text && <p>{item.text}</p>}
                    <ItemLink item={item} className="cs-card-link" />
                  </motion.div>
                );
              }
              // list — alternating image / copy rows
              return (
                <motion.div key={item.id} variants={fadeUp} className={`cs-row ${i % 2 ? "is-reverse" : ""}`}>
                  {item.image && (
                    <div className="cs-row-media">
                      <Image src={item.image} alt={item.title || ""} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                    </div>
                  )}
                  <div className="cs-row-copy">
                    {item.icon && <span className="cs-feature-icon"><i className={item.icon} /></span>}
                    {item.title && <h3>{item.title}</h3>}
                    {item.text && <p>{item.text}</p>}
                    <ItemLink item={item} className="btn btn-primary" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
