import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, La_Belle_Aurore, Nunito, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import CmsProvider from "@/components/cms/CmsProvider";
import { getSiteContent } from "@/lib/cms";
import { DEFAULT_CONTENT } from "@/lib/siteContent";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "600", "700"] });
const laBelleAurore = La_Belle_Aurore({ subsets: ["latin"], variable: "--font-la-belle-aurore", weight: "400" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope-src", weight: ["500", "600", "700"] });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = content.meta_title || DEFAULT_CONTENT.meta_title;
  const description = content.meta_description || DEFAULT_CONTENT.meta_description;

  return {
    metadataBase: new URL("https://myskillcounsellor.com"),
    title,
    description,
    keywords: [
      "career counselling",
      "study abroad",
      "IELTS preparation",
      "visa support",
      "university admissions",
      "SOP editing",
      "Ria Jain",
      "My Skill Counsellor",
      "education consultant",
      "study in UK",
      "study in USA",
      "study in Dubai",
    ],
    openGraph: {
      title,
      description,
      url: "https://myskillcounsellor.com",
      siteName: "My Skill Counsellor",
      images: [{ url: "/images/logo.png", width: 1536, height: 1024 }],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const pick = (key: string) => content[key] || DEFAULT_CONTENT[key];

  // AEO & GEO Structured Data (JSON-LD)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "My Skill Counsellor",
    founder: {
      "@type": "Person",
      name: pick("founder_name"),
      jobTitle: pick("founder_title"),
    },
    description: pick("meta_description"),
    url: "https://myskillcounsellor.com",
    logo: "https://myskillcounsellor.com/images/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: pick("contact_phone"),
      contactType: "customer service",
      email: pick("contact_email"),
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [pick("linkedin_url"), pick("whatsapp_url")],
  };

  const fontVars = [cormorant, spaceGrotesk, laBelleAurore, nunito, manrope].map((f) => f.variable).join(" ");

  return (
    <html lang="en" className={fontVars}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData).replace(/</g, "\\u003c") }}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <CmsProvider initialContent={content}>
          <Navbar />
          {children}
          <WhatsAppWidget />
          <Footer />
        </CmsProvider>
      </body>
    </html>
  );
}
