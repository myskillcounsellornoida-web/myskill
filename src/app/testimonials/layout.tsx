import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Success Stories & Reviews | My Skill Counsellor",
  description: "Read genuine success stories and reviews from students and parents who achieved admission into top global universities with Ria Jain.",
  keywords: ["student success stories", "study abroad reviews", "My Skill Counsellor testimonials", "university admit results"],
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
