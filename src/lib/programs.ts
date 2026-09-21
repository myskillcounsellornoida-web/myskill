/** Specialised services, shown on the home page and the services page. */
export type Program = { id?: number; title: string; description: string; icon?: string | null };

/** Used until the admin adds services under Dashboard → Services. */
export const DEFAULT_PROGRAMS: Program[] = [
  { title: "Customised Internships", description: "Real-world exposure matched to the student's interests and target courses.", icon: "fa-briefcase" },
  { title: "Leadership Program", description: "Structured projects that build initiative, teamwork and a stand-out profile.", icon: "fa-chess-king" },
  { title: "Career Library", description: "Explore 160+ career paths with clear descriptions, skills and outlooks.", icon: "fa-book-open" },
  { title: "Career Boosters", description: "Short, focused courses and certifications that strengthen applications.", icon: "fa-rocket" },
  { title: "SOP Writing Assistance", description: "Story-first Statements of Purpose that sound authentically like you.", icon: "fa-pen-nib" },
  { title: "Interview Preparation", description: "Mock university and visa interviews with detailed feedback.", icon: "fa-comments" },
];
