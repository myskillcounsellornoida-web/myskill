import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });
import { fetchInquiries } from "./src/app/admin/actions";

async function run() {
  const res = await fetchInquiries();
  console.log("RES:", res);
}
run();
