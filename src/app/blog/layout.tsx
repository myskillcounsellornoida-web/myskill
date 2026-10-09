import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Insights & Study Abroad Blog | My Skill Counsellor",
  description: "Read the latest tips, guides, and expert advice on university admissions, IELTS strategies, and financial aid planning from top career counsellors.",
  keywords: ["study abroad blog", "admissions tips", "IELTS strategies", "financial aid guide", "career counselling insights"],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
