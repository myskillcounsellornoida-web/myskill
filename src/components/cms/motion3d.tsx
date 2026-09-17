"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pointer-driven 3D tilt. Returns props to spread on the element; the transform
 * runs on the compositor (rotate/translate only) so it stays smooth on phones.
 */
export function useTilt(maxDeg = 9) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxDeg, -maxDeg]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxDeg, maxDeg]), spring);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { style: { rotateX, rotateY, transformStyle: "preserve-3d" as const }, onPointerMove, onPointerLeave };
}

/** Wraps children in a perspective container and tilts them toward the pointer. */
export function Tilt({
  children,
  className = "",
  max = 9,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
} & React.ComponentProps<typeof motion.div>) {
  const tilt = useTilt(max);
  return (
    <div className="tilt-scene">
      <motion.div className={className} {...tilt} {...rest}>
        {children}
      </motion.div>
    </div>
  );
}

/** Counts up to a number the first time it scrolls into view. */
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // null until the animation actually starts, so the real value is rendered
  // server-side and for anyone who never scrolls here or prefers less motion.
  const [count, setCount] = useState<number | null>(null);

  const parts = value.match(/^(\D*)([\d,.]+)(.*)$/);
  const target = parts ? Number(parts[2].replace(/,/g, "")) : NaN;
  const animatable = !!parts && Number.isFinite(target);

  useEffect(() => {
    if (!inView || !animatable || prefersReducedMotion()) return;
    const duration = 1100;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, animatable, target]);

  const shown = count === null || !parts ? value : `${parts[1]}${count.toLocaleString("en-IN")}${parts[3]}`;

  return <span ref={ref} className={className} style={style}>{shown}</span>;
}

/** Vertical parallax for decorative media, disabled for reduced-motion users. */
export function useParallax(scrollY: MotionValue<number>, distance = 60) {
  return useTransform(scrollY, [0, 1], [0, prefersReducedMotion() ? 0 : distance]);
}
