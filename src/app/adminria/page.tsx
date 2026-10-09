import { redirect } from "next/navigation";
import AdminDashboard from "../admin/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Secret admin route — accessible at /adminria
export default async function AdminRiaPage() {
  // Belt-and-braces check alongside the proxy — see docs/app/guides/authentication.
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?redirect=%2Fadminria");
  }

  return <AdminDashboard />;
}
