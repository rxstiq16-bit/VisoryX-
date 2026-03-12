import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Payroll } from "@/components/admin/payroll"

export const metadata: Metadata = {
  title: "Payroll | Admin | VisoryX",
  description: "Manage staff payments and compensation",
}

export default function PayrollPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            Track earnings, process payments, and manage compensation
          </p>
        </div>
        <Payroll />
      </div>
    </AdminLayout>
  )
}
