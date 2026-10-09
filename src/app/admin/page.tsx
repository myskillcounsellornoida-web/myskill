import { db } from "@/db";
import { inquiries, testimonials } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  // Fetch data safely, if DB is not configured it will catch the error
  let inquiriesList: any[] = [];
  let testimonialsList: any[] = [];
  let error: string | null = null;

  try {
    inquiriesList = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(10);
    testimonialsList = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(5);
  } catch (e: any) {
    error = "Database not connected yet. Please add DATABASE_URL in .env.local";
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'var(--font-inter)' }}>
      <h1 style={{ color: 'var(--color-deep-teal)', marginBottom: '30px' }}>Admin Dashboard</h1>
      
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <strong>System Notice: </strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* INQUIRIES WIDGET */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: 'white' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Recent Lead Inquiries</h2>
          {inquiriesList.length === 0 && !error ? <p>No inquiries yet.</p> : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Service</th>
                  <th style={{ padding: '10px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiriesList.map(inq => (
                  <tr key={inq.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{inq.name} <br/><small>{inq.phone}</small></td>
                    <td style={{ padding: '10px' }}>{inq.service}</td>
                    <td style={{ padding: '10px' }}>{inq.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* TESTIMONIALS WIDGET */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Manage Testimonials</h2>
            <button style={{ padding: '8px 15px', background: 'var(--color-soft-teal)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add New</button>
          </div>
          {testimonialsList.length === 0 && !error ? <p>No testimonials yet.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {testimonialsList.map(test => (
                <li key={test.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                  <strong>{test.name}</strong> ({test.role})
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#555' }}>"{test.text.substring(0, 60)}..."</p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
      
      <div style={{ marginTop: '40px' }}>
        <Link href="/" style={{ color: 'var(--color-deep-teal)', textDecoration: 'underline' }}>&larr; Return to Live Website</Link>
      </div>
    </div>
  );
}
