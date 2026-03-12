import { Suspense } from "react";
import { SettingsAdmin } from "@/components/admin/settings-admin";
import { RoleGuard } from "@/components/admin/role-guard";

export const metadata = {
  title: "Settings | VisoryX Admin",
  description: "Manage site settings",
};

export default function SettingsAdminPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <RoleGuard allowedRoles={["executive", "director"]}>
        <SettingsAdmin />
      </RoleGuard>
    </Suspense>
  );
}
