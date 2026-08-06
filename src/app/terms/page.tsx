export default function TermsOfService() {
  return (
    <main>
      <section className="inner-hero" style={{ padding: '80px 0', background: 'var(--color-deep-teal)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Terms of Service</h1>
          <p style={{ opacity: 0.8 }}>Effective Date: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>1. Agreement to Terms</h2>
          <p style={{ marginBottom: '30px' }}>By accessing our website and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          
          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>2. Use License</h2>
          <p style={{ marginBottom: '30px' }}>Permission is granted to temporarily download one copy of the materials (information or software) on My Skill Counsellor&apos;s website for personal, non-commercial transitory viewing only.</p>

          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>3. Disclaimer</h2>
          <p style={{ marginBottom: '30px' }}>The materials on My Skill Counsellor&apos;s website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>4. Limitations</h2>
          <p style={{ marginBottom: '30px' }}>In no event shall My Skill Counsellor or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

          <h2 style={{ color: 'var(--color-deep-teal)', marginBottom: '20px' }}>5. Contact Us</h2>
          <p>For any questions regarding these Terms, please contact us at info@myskillcounsellor.com.</p>
        </div>
      </section>
    </main>
  );
}
