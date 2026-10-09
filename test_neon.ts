import postgres from 'postgres';

async function check() {
  const connectionString = "postgresql://neondb_owner:npg_oaQeF49bkdlC@ep-frosty-math-awbidri4.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const client = postgres(connectionString, { prepare: false });
  try {
    const res = await client`select 1`;
    console.log("Neon Connected:", res);
    
    // Check if tables exist
    const tables = await client`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables:", tables.map(t => t.table_name));
  } catch (e: any) {
    console.log("Neon Error:", e.message);
  } finally {
    await client.end();
  }
}
check();
