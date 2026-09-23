import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const ALLOWED_HOSTS = new Set(["myskillcounsellor.com", "www.myskillcounsellor.com", "myskillcounsellor.in", "www.myskillcounsellor.in"]);
const DEFAULT_DOMAIN = "https://myskillcounsellor.com";

const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/testimonials", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/payment-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host")?.split(":")[0].toLowerCase() ?? "";
  const domain = ALLOWED_HOSTS.has(host) ? `https://${host}` : DEFAULT_DOMAIN;
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${domain}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
