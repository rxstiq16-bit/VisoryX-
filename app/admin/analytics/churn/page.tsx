import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ChurnPrediction } from "@/components/admin/churn-prediction"
import { UserMinus } from "lucide-react"

export const metadata: Metadata = {
  title: "Churn Prediction | Admin | VisoryX",
  description: "Identify at-risk customers and reduce churn",
}

export default function AdminChurnPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserMinus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Churn Prediction</h1>
              <p className="text-muted-foreground">Identify at-risk customers and take proactive action</p>
            </div>
          </div>
        </div>

        <ChurnPrediction />
      </main>
    </div>
  )
}
