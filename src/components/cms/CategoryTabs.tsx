"use client";

import { motion } from "framer-motion";

/** Filter tabs shared by the video and testimonial sections. */
export default function CategoryTabs({
  categories,
  active,
  onChange,
  counts,
  allLabel = "All",
}: {
  categories: string[];
  active: string | null;
  onChange: (value: string | null) => void;
  counts: (string | undefined)[];
  allLabel?: string;
}) {
  if (categories.length < 2) return null;
  const countOf = (name: string | null) =>
    name === null ? counts.length : counts.filter((c) => c === name).length;

  return (
    <div className="cat-tabs" role="tablist">
      {[null, ...categories].map((name) => {
        const isActive = active === name;
        return (
          <button
            key={name ?? "__all"}
            role="tab"
            aria-selected={isActive}
            className={isActive ? "is-active" : ""}
            onClick={() => onChange(name)}
          >
            {isActive && <motion.span layoutId="cat-pill" className="cat-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="cat-label">
              {name ?? allLabel} <small>{countOf(name)}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
