import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | My Skill Counsellor",
  description:
    "The terms that govern your use of myskillcounsellor.com and the career counselling and study abroad consulting services we provide.",
};

export default function TermsAndConditions() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="21 September 2026"
      sections={[
        {
          heading: "Introduction",
          items: [
            "Welcome to www.myskillcounsellor.com. By accessing or using this website, you agree to comply with these Terms and Conditions.",
          ],
        },
        {
          heading: "Use of the Website",
          items: ["You are responsible for the accuracy of the information you provide to My Skill Counsellor."],
        },
        {
          heading: "Privacy",
          items: ["Our Privacy Policy explains how we collect, use and protect your personal information."],
        },
        {
          heading: "Services",
          items: [
            "My Skill Counsellor provides career counselling and study abroad consulting services.",
            "Our services are intended to provide guidance and support. We do not guarantee admission, scholarships, visa approvals or any specific outcome.",
            "Final decisions are made by universities, government authorities or other relevant third parties.",
          ],
        },
        {
          heading: "Disclaimer",
          items: ["The information on this website is provided for general guidance and on an “as-is” basis."],
        },
        {
          heading: "Limitation of Liability",
          items: [
            "My Skill Counsellor shall not be held responsible for losses arising from the use of this website or decisions made based on the information provided.",
          ],
        },
        {
          heading: "Changes to Terms and Conditions",
          items: [
            "We may update these Terms and Conditions from time to time. Any changes will be posted on this website.",
          ],
        },
        {
          heading: "Contact Information",
          items: ["For any questions or concerns, please contact us at {email}."],
        },
      ]}
    />
  );
}
