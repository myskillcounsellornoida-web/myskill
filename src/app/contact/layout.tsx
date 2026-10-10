import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Expert Career Counsellor in Noida | My Skill Counsellor",
  description: "Get in touch with Ria Jain, the best career counsellor in Noida, to schedule a free career assessment, book a consultation, or ask questions about study abroad planning.",
  keywords: ["contact study abroad consultant in noida", "career counselor near me", "book career counselling session", "Ria Jain contact", "best career counsellor in noida"],
  alternates: {
    canonical: "https://myskillcounsellor.com/contact",
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
