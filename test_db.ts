import { db } from "./src/db";
import { inquiries } from "./src/db/schema";
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

async function check() {
  try {
    const res = await db.select().from(inquiries).limit(1);
    console.log("DB Success:", res);
  } catch (e: any) {
    console.log("DB Error:", e);
  }
}
check();
