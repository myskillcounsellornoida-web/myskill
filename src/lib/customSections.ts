// Admin-built content sections: the admin creates a section, picks a layout and
// colours, then adds items to it. Stored as JSON in site content (no migration).

import type { PreviewPage } from "./siteContent";

export const CUSTOM_SECTIONS_KEY = "custom_sections";
export const CUSTOM_PREFIX = "custom:";
export const MAX_CUSTOM_SECTIONS = 24;
export const MAX_ITEMS_PER_SECTION = 24;

export type SectionLayout = "cards" | "features" | "gallery" | "list" | "stats" | "text";
export type SectionBackground = "page" | "white" | "sage" | "dark" | "accent";

export interface CustomItem {
  id: string;
  title?: string;
  text?: string;
  image?: string;
  icon?: string;
  link?: string;
  linkLabel?: string;
}

export interface CustomSection {
  id: string;
  page: PreviewPage;
  label?: string;
  title?: string;
  description?: string;
  layout: SectionLayout;
  columns: 2 | 3 | 4;
  background: SectionBackground;
  align: "center" | "left";
  titleColor?: string;
  textColor?: string;
  accentColor?: string;
  items: CustomItem[];
}

export const LAYOUT_OPTIONS: { value: SectionLayout; label: string; hint: string }[] = [
  { value: "cards", label: "Cards", hint: "Image, title, text and an optional button" },
  { value: "features", label: "Features", hint: "Icon, title and text — no images" },
  { value: "gallery", label: "Gallery", hint: "Images only, with a caption on hover" },
  { value: "list", label: "Alternating rows", hint: "Large image beside text, sides alternate" },
  { value: "stats", label: "Numbers", hint: "Big number with a label underneath" },
  { value: "text", label: "Text", hint: "Headed paragraphs, good for notes and policies" },
];

export const BACKGROUND_OPTIONS: { value: SectionBackground; label: string }[] = [
  { value: "page", label: "Page (ivory)" },
  { value: "white", label: "White" },
  { value: "sage", label: "Soft mint" },
  { value: "dark", label: "Dark teal" },
  { value: "accent", label: "Accent tint" },
];

export const sectionKey = (id: string) => `${CUSTOM_PREFIX}${id}`;
export const isCustomKey = (key: string) => key.startsWith(CUSTOM_PREFIX);

const HEX = /^#[0-9a-f]{3,8}$/i;
const clean = (v: unknown, max = 400): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
};
const color = (v: unknown): string | undefined => (typeof v === "string" && HEX.test(v) ? v : undefined);

export function newId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function emptySection(page: PreviewPage): CustomSection {
  return {
    id: newId(),
    page,
    label: "New section",
    title: "Give this section a heading",
    description: "",
    layout: "cards",
    columns: 3,
    background: "page",
    align: "center",
    items: [],
  };
}

function parseItem(raw: unknown): CustomItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const item: CustomItem = {
    id: clean(r.id, 40) ?? newId(),
    title: clean(r.title, 160),
    text: clean(r.text, 1200),
    image: clean(r.image, 600),
    icon: clean(r.icon, 60),
    link: clean(r.link, 600),
    linkLabel: clean(r.linkLabel, 60),
  };
  return item;
}

/** Tolerant parser — anything malformed is dropped rather than breaking the page. */
export function parseCustomSections(raw: string | undefined): CustomSection[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const out: CustomSection[] = [];
    for (const entry of data.slice(0, MAX_CUSTOM_SECTIONS)) {
      if (!entry || typeof entry !== "object") continue;
      const r = entry as Record<string, unknown>;
      const id = clean(r.id, 40);
      const page = r.page as PreviewPage;
      if (!id || seen.has(id) || typeof page !== "string") continue;
      seen.add(id);
      const layout = (LAYOUT_OPTIONS.some((l) => l.value === r.layout) ? r.layout : "cards") as SectionLayout;
      const background = (BACKGROUND_OPTIONS.some((b) => b.value === r.background) ? r.background : "page") as SectionBackground;
      const columns = ([2, 3, 4] as const).includes(r.columns as 2 | 3 | 4) ? (r.columns as 2 | 3 | 4) : 3;
      out.push({
        id,
        page,
        label: clean(r.label, 60) ?? "Section",
        title: clean(r.title, 200),
        description: clean(r.description, 600),
        layout,
        columns,
        background,
        align: r.align === "left" ? "left" : "center",
        titleColor: color(r.titleColor),
        textColor: color(r.textColor),
        accentColor: color(r.accentColor),
        items: Array.isArray(r.items)
          ? (r.items.slice(0, MAX_ITEMS_PER_SECTION).map(parseItem).filter(Boolean) as CustomItem[])
          : [],
      });
    }
    return out;
  } catch {
    return [];
  }
}

export const sectionsForPage = (sections: CustomSection[], page: PreviewPage) =>
  sections.filter((s) => s.page === page);
