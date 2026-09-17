// Inline categories for videos and testimonials. The order is admin-controlled
// and stored separately from the items, so renaming/reordering never loses data.

export const VIDEO_CATEGORIES_KEY = "video_categories";
export const TESTIMONIAL_CATEGORIES_KEY = "testimonial_categories";
export const TESTIMONIAL_CATEGORY_MAP_KEY = "testimonial_category_map";
export const CATEGORY_KEYS = [VIDEO_CATEGORIES_KEY, TESTIMONIAL_CATEGORIES_KEY, TESTIMONIAL_CATEGORY_MAP_KEY];

export const MAX_CATEGORIES = 20;
const MAX_NAME = 40;

export function parseCategories(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    for (const item of data) {
      if (typeof item !== "string") continue;
      const name = item.trim().slice(0, MAX_NAME);
      if (name) seen.add(name);
    }
    return [...seen].slice(0, MAX_CATEGORIES);
  } catch {
    return [];
  }
}

export function parseCategoryMap(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const out: Record<string, string> = {};
    for (const [id, name] of Object.entries(data as Record<string, unknown>)) {
      if (typeof name === "string" && name.trim()) out[String(id)] = name.trim().slice(0, MAX_NAME);
    }
    return out;
  } catch {
    return {};
  }
}

/** Keeps the admin's order, then appends any category only present on items. */
export function orderedCategories(order: string[], used: (string | undefined)[]): string[] {
  const result = order.filter((c) => used.includes(c));
  for (const name of used) {
    if (name && !result.includes(name)) result.push(name);
  }
  return result;
}
