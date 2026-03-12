import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CustomerSegmentation } from "@/components/admin/customer-segmentation"
import { Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Customer Segments | Admin | VisoryX",
  description: "Create and manage customer segments for targeted marketing",
}

export default function AdminSegmentsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Customer Segmentation</h1>
              <p className="text-muted-foreground">Group customers for targeted campaigns and analysis</p>
            </div>
          </div>
        </div>

        <CustomerSegmentation />
      </main>
    </div>
  )
}
