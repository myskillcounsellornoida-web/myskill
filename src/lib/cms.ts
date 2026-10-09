import "server-only";
import { cache } from "react";
import { fetchSiteContent } from "@/app/admin/actions";

// Stored overrides only; defaults are merged in by useCms() so the payload sent
// to the client stays small. Memoized so layout + generateMetadata share a read.
export const getSiteContent = cache(async (): Promise<Record<string, string>> => {
  const res = await fetchSiteContent();
  const map: Record<string, string> = {};
  if (res.success && Array.isArray(res.data)) {
    for (const item of res.data as { key: string; value: string }[]) {
      map[item.key] = item.value;
    }
  }
  return map;
});
