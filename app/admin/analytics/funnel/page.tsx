import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ConversionFunnel } from "@/components/admin/conversion-funnel"
import { TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Conversion Funnel | Admin | VisoryX",
  description: "Analyze customer journey and conversion rates",
}

export default function AdminFunnelPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Conversion Funnel</h1>
              <p className="text-muted-foreground">Track customer journey from visit to purchase</p>
            </div>
          </div>
        </div>

        <ConversionFunnel />
      </main>
    </div>
  )
}
