"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCms } from "@/components/cms/CmsProvider";

/** Brand colours are fixed — these are other companies' marks, not our palette. */
const SOCIALS = [
  { key: "instagram_url", label: "Instagram", icon: "fab fa-instagram", color: "#E1306C" },
  { key: "youtube_url", label: "YouTube", icon: "fab fa-youtube", color: "#FF0000" },
  { key: "linkedin_url", label: "LinkedIn", icon: "fab fa-linkedin-in", color: "#0A66C2" },
  { key: "facebook_url", label: "Facebook", icon: "fab fa-facebook-f", color: "#1877F2" },
];

const CYCLE_MS = 2200;

export default function SocialDock() {
  const pathname = usePathname();
  const { t } = useCms();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [cycle, setCycle] = useState(0);
  const dockRef = useRef<HTMLDivElement>(null);

  const links = SOCIALS.map((s) => ({ ...s, href: t(s.key) })).filter((s) => s.href.trim());

  // Idle state teases what's inside by rotating through the icons; once the
  // dock is open (or the visitor prefers less motion) it holds still.
  useEffect(() => {
    if (open || reduceMotion || links.length < 2) return;
    const timer = setInterval(() => setCycle((c) => (c + 1) % links.length), CYCLE_MS);
    return () => clearInterval(timer);
  }, [open, reduceMotion, links.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!dockRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Navigating away closes the dock on its own: a mouse leaves it, and a tap
  // elsewhere is caught by the pointerdown handler above.
  if (pathname?.startsWith("/admin") || links.length === 0) return null;

  const current = links[cycle % links.length];

  return (
    <div
      ref={dockRef}
      className={`social-dock ${open ? "is-open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <AnimatePresence>
        {open && (
          <motion.ul className="social-dock-list" initial="hidden" animate="visible" exit="hidden">
            {links.map((s, i) => (
              <motion.li
                key={s.key}
                custom={i}
                variants={{
                  hidden: { opacity: 0, y: 14, scale: 0.7 },
                  visible: (idx: number) => ({
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: reduceMotion
                      ? { duration: 0.12 }
                      : { type: "spring", stiffness: 480, damping: 26, delay: idx * 0.055 },
                  }),
                }}
              >
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-dock-link"
                  style={{ "--brand": s.color } as React.CSSProperties}
                  aria-label={s.label}
                >
                  <i className={s.icon} aria-hidden="true" />
                  <span className="social-dock-label">{s.label}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="social-dock-toggle"
        style={{ "--brand": open ? "var(--color-deep-teal)" : current.color } as React.CSSProperties}
        aria-expanded={open}
        aria-label={open ? "Hide social links" : "Follow My Skill Counsellor"}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.i
            key={open ? "close" : current.key}
            className={open ? "fas fa-xmark" : current.icon}
            aria-hidden="true"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -55, scale: 0.6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 55, scale: 0.6 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
        {!open && <span className="social-dock-ping" aria-hidden="true" />}
      </button>
    </div>
  );
}
