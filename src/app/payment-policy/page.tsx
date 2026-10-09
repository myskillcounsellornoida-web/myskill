import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Payment Policy | My Skill Counsellor",
  description:
    "How fees are agreed and paid for My Skill Counsellor's career counselling and study abroad consulting services.",
};

export default function PaymentPolicy() {
  return (
    <LegalPage
      title="Payment Policy"
      updated="21 September 2026"
      intro="Thank you for choosing My Skill Counsellor for your career counselling and study abroad consulting services."
      sections={[
        {
          heading: "Service Fees",
          items: ["All service fees will be clearly communicated and agreed upon before the service is provided."],
        },
        {
          heading: "Payment Methods",
          items: [
            "Payments may be made through UPI, bank transfer or any other payment method agreed upon with the client.",
          ],
        },
        {
          heading: "Third-Party Charges",
          items: [
            "Any fees payable to universities, examination bodies, visa authorities or other third parties shall be the responsibility of the client unless agreed otherwise.",
          ],
        },
        {
          heading: "Contact Information",
          items: ["For any payment-related questions, please contact us at {email}."],
        },
      ]}
    />
  );
}
