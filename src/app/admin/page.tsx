import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Belt-and-braces check alongside the proxy — see docs/app/guides/authentication.
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?redirect=%2Fadmin");
  }

  return <AdminDashboard />;
}
