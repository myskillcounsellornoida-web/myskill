import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | My Skill Counsellor",
  description:
    "How My Skill Counsellor collects, uses, shares and protects the personal information of students and parents.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="21 September 2026"
      intro="At My Skill Counsellor, we respect your privacy and are committed to protecting your personal information."
      sections={[
        {
          heading: "Information We Collect",
          items: [
            "We may collect information such as your name, email address, contact details, academic records and other information required to provide our services.",
          ],
        },
        {
          heading: "Use of Information",
          items: [
            "We use this information to provide career counselling, study abroad guidance and application-related support.",
          ],
        },
        {
          heading: "Information Sharing",
          items: [
            "Where required for the application process, student information may be shared with relevant universities and educational institutions.",
            "We do not sell, rent or trade your personal information.",
          ],
        },
        {
          heading: "Data Retention",
          items: [
            "Student information is retained for the duration of the relevant application process, and afterwards only for as long as we need it to support you or to meet a legal or accounting obligation.",
            "You can ask us to delete your information at any time and we will do so unless we are required to keep it.",
          ],
        },
        {
          heading: "Cookies and Tracking",
          items: [
            "We do not use advertising, analytics or tracking cookies, and we do not profile visitors to this website.",
            "A single essential cookie is used to keep the site administrator signed in to the admin area. It is not set for ordinary visitors.",
            "Some pages embed videos and posts from YouTube and Instagram. When such content loads, those providers may set their own cookies under their own privacy policies, which we do not control.",
          ],
        },
        {
          heading: "Email and Marketing",
          items: [
            "We use your contact details to reply to your enquiry and to manage your counselling or application process.",
            "We send newsletters and updates only to people who have subscribed through this website. Every such email includes a way to unsubscribe, and you can also ask us to remove you at any time.",
            "We do not sell or share your contact details with third parties for their own marketing.",
          ],
        },
        {
          heading: "Your Rights",
          items: [
            "You may contact us to request access to, correction of or deletion of your personal information.",
          ],
        },
        {
          heading: "Contact Information",
          items: ["For any privacy-related questions or requests, please contact us at {email}."],
        },
        {
          heading: "Changes to This Policy",
          items: ["We may update this Privacy Policy from time to time. Any changes will be posted on this website."],
        },
      ]}
    />
  );
}
