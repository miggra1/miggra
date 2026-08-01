import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLogin } from "./login";
import { AdminNav } from "./admin-nav";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) return <AdminLogin />;

  return (
    <div className="admin-shell">
      <div className="admin-frame">
        <AdminNav />
        <main className="studio-main">{children}</main>
      </div>
    </div>
  );
}
