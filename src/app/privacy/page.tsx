import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <main>
      <section className="inner-hero" style={{ padding: '80px 0', background: 'var(--color-deep-teal)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Privacy Policy</h1>
          <p style={{ opacity: 0.8 }}>Effective Date: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '30px' }}>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us.</p>
          
          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: '30px' }}>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          
          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>3. Will Your Information Be Shared?</h2>
          <p style={{ marginBottom: '30px' }}>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your data to third parties.</p>

          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>4. Contact Us</h2>
          <p>If you have questions or comments about this notice, you may email us at info@myskillcounsellor.com or by post to our office in Noida, India.</p>
        </div>
      </section>
    </main>
  );
}
