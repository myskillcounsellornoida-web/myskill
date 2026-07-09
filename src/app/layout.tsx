import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://myskillcounsellor.com"),
  title: "My Skill Counsellor | Career & Study Abroad Guidance by Ria Jain",
  description:
    "Expert career counselling, study abroad admissions, IELTS preparation, SOP building, and visa support by Ria Jain. Get personalized guidance to achieve your academic goals.",
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
    title: "My Skill Counsellor | Study Abroad & Career Guidance",
    description: "Get personalized guidance for global university admissions, IELTS, and career pathways.",
    url: "https://myskillcounsellor.com",
    siteName: "My Skill Counsellor",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // AEO & GEO Structured Data (JSON-LD)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "My Skill Counsellor",
    founder: {
      "@type": "Person",
      name: "Ria Jain",
      jobTitle: "Lead Career Counsellor",
    },
    description:
      "Expert career counselling and study abroad admissions support.",
    url: "https://myskillcounsellor.com",
    logo: "https://myskillcounsellor.com/images/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9990004878",
      contactType: "customer service",
      email: "ria.myskillcounsellor@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.linkedin.com/in/riajain26",
      "https://wa.me/message/24XQYF3LERXWA1",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} ${dmSans.variable}`}>
        <Navbar />
        {children}
        <WhatsAppWidget />
        <Footer />
      </body>
    </html>
  );
}
