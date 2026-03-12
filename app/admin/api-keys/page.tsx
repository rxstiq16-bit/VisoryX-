import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { APIKeys } from "@/components/admin/api-keys"
import { Key } from "lucide-react"

export const metadata: Metadata = {
  title: "API Keys | Admin | VisoryX",
  description: "Manage API keys for external integrations",
}

export default function AdminAPIKeysPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">API Key Management</h1>
              <p className="text-muted-foreground">Create and manage API keys for external integrations</p>
            </div>
          </div>
        </div>

        <APIKeys />
      </main>
    </div>
  )
}
