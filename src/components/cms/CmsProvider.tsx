"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTENT, THEME_FIELDS, colorKey } from "@/lib/siteContent";

// Messages exchanged with the admin live-preview editor (same-origin iframe).
export const CMS_MSG = {
  ready: "msc-cms:ready",
  update: "msc-cms:update",
  focus: "msc-cms:focus",
  select: "msc-cms:select",
  section: "msc-cms:section",
} as const;

const HEX_COLOR = /^#[0-9a-f]{3,8}$/i;
export const isValidColor = (v: string | undefined): v is string => !!v && HEX_COLOR.test(v);

interface CmsContextValue {
  content: Record<string, string>;
  isPreview: boolean;
  t: (key: string) => string;
  color: (key: string) => string | undefined;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}

function isInPreviewFrame(): boolean {
  if (typeof window === "undefined" || window.parent === window) return false;
  try {
    // Throws for cross-origin parents, which must never drive the preview.
    return window.parent.location.origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function CmsProvider({
  initialContent,
  children,
}: {
  initialContent: Record<string, string>;
  children: React.ReactNode;
}) {
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const content = draft ?? initialContent;

  useEffect(() => {
    if (!isInPreviewFrame()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preview mode can only be detected after mount
    setIsPreview(true);
    document.documentElement.classList.add("cms-preview");

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data = event.data;
      if (data?.type === CMS_MSG.update && data.content && typeof data.content === "object") {
        setDraft(data.content);
      } else if (data?.type === CMS_MSG.section && typeof data.id === "string") {
        const anchor = document.querySelector<HTMLElement>(`[data-section="${CSS.escape(data.id)}"]`);
        const target = anchor?.nextElementSibling as HTMLElement | null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          target.classList.remove("cms-section-flash");
          void target.offsetWidth;
          target.classList.add("cms-section-flash");
        }
      } else if (data?.type === CMS_MSG.focus && typeof data.key === "string") {
        const el = document.querySelector<HTMLElement>(`[data-cms="${CSS.escape(data.key)}"]`);
        document.querySelectorAll(".cms-focused").forEach((n) => n.classList.remove("cms-focused"));
        if (el) {
          el.classList.add("cms-focused");
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    // Clicking any editable text in the preview jumps to its field in the editor.
    const onClick = (event: MouseEvent) => {
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cms]");
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      window.parent.postMessage({ type: CMS_MSG.select, key: el.dataset.cms }, window.location.origin);
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    window.parent.postMessage({ type: CMS_MSG.ready }, window.location.origin);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
      document.documentElement.classList.remove("cms-preview");
    };
  }, []);

  const t = useCallback((key: string) => content[key] || DEFAULT_CONTENT[key] || "", [content]);
  const color = useCallback((key: string) => {
    const value = content[colorKey(key)];
    return isValidColor(value) ? value : undefined;
  }, [content]);

  const themeCss = useMemo(() => {
    const vars = THEME_FIELDS
      .filter((f) => isValidColor(content[f.key]))
      .map((f) => `${f.cssVar}:${content[f.key]};`)
      .join("");
    return vars ? `:root{${vars}}` : "";
  }, [content]);

  const value = useMemo(() => ({ content, isPreview, t, color }), [content, isPreview, t, color]);

  return (
    <CmsContext.Provider value={value}>
      {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      {children}
    </CmsContext.Provider>
  );
}

type TxtProps = {
  k: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "strong" | "small";
  /** Colour used when the admin hasn't picked one. */
  defaultColor?: string;
  className?: string;
  style?: React.CSSProperties;
};

/** Renders one CMS text with its colour override and click-to-edit hook. */
export function Txt({ k, as = "span", style, defaultColor, className }: TxtProps) {
  const { t, color } = useCms();
  const c = color(k) ?? defaultColor;
  return React.createElement(as, { "data-cms": k, className, style: c ? { ...style, color: c } : style }, t(k));
}
