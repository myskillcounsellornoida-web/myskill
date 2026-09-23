import type { Metadata, Viewport } from "next";

/** Makes /admin installable as its own app and keeps it out of search results. */
export const metadata: Metadata = {
  title: "MSC Admin",
  manifest: "/admin-manifest.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "MSC Admin", statusBarStyle: "default" },
  icons: { icon: "/images/admin-icon-192.png", apple: "/images/admin-icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#14505C" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
