const fs = require('fs');
const postgres = require('postgres');
require('dotenv').config({path: '.env.local'});

const fallbacks = JSON.parse(fs.readFileSync('fallbacks.json', 'utf8'));
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  let count = 0;
  for (const [key, value] of Object.entries(fallbacks)) {
    await sql`
      INSERT INTO site_content (key, value, updated_at) 
      VALUES (${key}, ${value}, NOW()) 
      ON CONFLICT (key) DO NOTHING
    `;
    count++;
  }
  console.log(`Successfully checked/inserted ${count} keys.`);
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
