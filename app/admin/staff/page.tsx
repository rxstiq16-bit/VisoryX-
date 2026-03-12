import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { StaffDirectory } from "@/components/admin/staff-directory"

export const metadata: Metadata = {
  title: "Staff Directory | Admin | VisoryX",
  description: "Manage your team members and staff roles",
}

export default function StaffPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground">
            Manage your team members, roles, and permissions
          </p>
        </div>
        <StaffDirectory />
      </div>
    </AdminLayout>
  )
}
