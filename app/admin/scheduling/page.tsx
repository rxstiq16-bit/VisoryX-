import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { StaffScheduling } from "@/components/admin/staff-scheduling"

export const metadata: Metadata = {
  title: "Staff Scheduling | Admin | VisoryX",
  description: "Manage staff shifts and schedules",
}

export default function SchedulingPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Scheduling</h1>
          <p className="text-muted-foreground">
            Manage shifts, availability, and team schedules
          </p>
        </div>
        <StaffScheduling />
      </div>
    </AdminLayout>
  )
}
