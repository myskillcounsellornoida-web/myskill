import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprehensive Study Abroad Services | My Skill Counsellor",
  description: "Explore our expert career counselling, IELTS coaching, SOP editing, and visa support services for universities in the USA, UK, Canada, and Dubai.",
  keywords: ["study abroad services", "IELTS coaching", "SOP building", "visa assistance", "university admissions consulting"],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
