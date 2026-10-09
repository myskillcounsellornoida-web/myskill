import { fetchFaqs } from "./src/app/admin/actions";
async function run() {
  const res = await fetchFaqs();
  console.log(res);
}
run();
