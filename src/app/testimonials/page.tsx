import { db } from "@/db";
import { testimonials } from "@/db/schema";
import TestimonialsClient from "@/components/TestimonialsClient";

export const revalidate = 60;

export default async function TestimonialsPage() {
  let dbTestimonials: any[] = [];
  
  try {
    if (process.env.DATABASE_URL) {
      dbTestimonials = await db.select().from(testimonials);
    }
  } catch (error) {
    console.error("Failed to fetch testimonials from database:", error);
  }

  // Fallback to static if empty
  const defaultTestimonials = [
    { name: "Aarav Sharma", role: "Admitted to NYU", text: "Ria completely transformed my application. Her insights on my SOP made all the difference." },
    { name: "Mrs. Kapoor", role: "Parent", text: "We were overwhelmed with the visa process for the UK. Ria handled everything smoothly and professionally." },
    { name: "Simran Kaur", role: "IELTS Student (Band 8)", text: "The structured mock interviews and writing evaluations helped me score far above my target." },
    { name: "Rahul Desai", role: "Admitted to University of Toronto", text: "The profile building guidance I received was spectacular. I knew exactly which extracurriculars to focus on." },
    { name: "Sneha V.", role: "Admitted to Kings College London", text: "From university shortlisting to the final visa application, Ria was there at every step. Highly recommended!" },
    { name: "Mr. Iyer", role: "Parent", text: "Very professional and transparent career counselling. My son is now much more confident about his future path." }
  ];

  const testimonialsList = dbTestimonials.length > 0 ? dbTestimonials : defaultTestimonials;

  return <TestimonialsClient testimonialsList={testimonialsList} />;
}
