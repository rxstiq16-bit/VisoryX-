import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AuditLog } from "@/components/admin/audit-log"
import { ScrollText } from "lucide-react"

export const metadata: Metadata = {
  title: "Audit Log | Admin | VisoryX",
  description: "View system audit logs and activity history",
}

export default function AdminAuditLogPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ScrollText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Audit Log</h1>
              <p className="text-muted-foreground">View detailed system activity and security events</p>
            </div>
          </div>
        </div>

        <AuditLog />
      </main>
    </div>
  )
}
