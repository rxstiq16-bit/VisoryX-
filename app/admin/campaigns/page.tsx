import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DripCampaigns } from "@/components/admin/drip-campaigns"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Campaigns | Admin | VisoryX",
  description: "Create and manage drip email campaigns",
}

export default function AdminCampaignsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Drip Campaigns</h1>
              <p className="text-muted-foreground">Create automated email sequences to engage customers</p>
            </div>
          </div>
        </div>

        <DripCampaigns />
      </main>
    </div>
  )
}
