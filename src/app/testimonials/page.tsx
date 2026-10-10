import { fetchTestimonials } from "@/app/admin/actions";
import TestimonialsClient from "@/components/TestimonialsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials & Success Stories | My Skill Counsellor",
  description: "Read success stories and reviews from students and parents who have benefited from our career counselling and study abroad services in Noida.",
  keywords: ["student testimonials", "study abroad success stories", "career counsellor reviews noida", "My Skill Counsellor reviews"],
  alternates: {
    canonical: "https://myskillcounsellor.com/testimonials",
  }
};

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonialsRes = await fetchTestimonials();

  // Fallback to static if empty
  const defaultTestimonials = [
    { name: "Aarav Sharma", role: "Admitted to NYU", text: "Ria completely transformed my application. Her insights on my SOP made all the difference." },
    { name: "Mrs. Kapoor", role: "Parent", text: "We were overwhelmed with the visa process for the UK. Ria handled everything smoothly and professionally." },
    { name: "Simran Kaur", role: "IELTS Student (Band 8)", text: "The structured mock interviews and writing evaluations helped me score far above my target." },
    { name: "Rahul Desai", role: "Admitted to University of Toronto", text: "The profile building guidance I received was spectacular. I knew exactly which extracurriculars to focus on." },
    { name: "Sneha V.", role: "Admitted to Kings College London", text: "From university shortlisting to the final visa application, Ria was there at every step. Highly recommended!" },
    { name: "Mr. Iyer", role: "Parent", text: "Very professional and transparent career counselling. My son is now much more confident about his future path." }
  ];

  const testimonialsList = testimonialsRes.success && testimonialsRes.data && testimonialsRes.data.length > 0 
    ? testimonialsRes.data 
    : defaultTestimonials;

  return <TestimonialsClient testimonialsList={testimonialsList} />;
}
