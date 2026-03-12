import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { WebhookManagement } from "@/components/admin/webhook-management"
import { Webhook } from "lucide-react"

export const metadata: Metadata = {
  title: "Webhooks | Admin | VisoryX",
  description: "Manage webhook endpoints and event subscriptions",
}

export default function AdminWebhooksPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Webhook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Webhook Management</h1>
              <p className="text-muted-foreground">Configure webhook endpoints and manage event subscriptions</p>
            </div>
          </div>
        </div>

        <WebhookManagement />
      </main>
    </div>
  )
}
