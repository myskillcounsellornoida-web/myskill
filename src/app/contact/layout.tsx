import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Expert Career Counsellor | My Skill Counsellor",
  description: "Get in touch with Ria Jain to schedule a free career assessment, book a consultation, or ask questions about study abroad planning.",
  keywords: ["contact study abroad consultant", "book career counselling session", "Ria Jain contact", "study abroad consultation booking"],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
