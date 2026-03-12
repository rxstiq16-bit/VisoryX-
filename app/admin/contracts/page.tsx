import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ContractManagement } from "@/components/admin/contract-management"

export const metadata: Metadata = {
  title: "Contracts | Admin | VisoryX",
  description: "Manage client contracts and agreements",
}

export default function ContractsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and track client contracts and service agreements
          </p>
        </div>

        <ContractManagement />
      </div>
    </AdminLayout>
  )
}
