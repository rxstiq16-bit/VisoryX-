import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { TimeTracker } from "@/components/admin/time-tracker"
import { StaffPerformance } from "@/components/admin/staff-performance"
import { CapacityPlanning } from "@/components/admin/capacity-planning"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Time Tracking | Admin | VisoryX",
  description: "Track time, manage staff performance, and plan capacity",
}

export default function TimeTrackingPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">
            Track designer time, monitor performance, and plan capacity
          </p>
        </div>

        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tracker">Time Tracker</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker">
            <TimeTracker />
          </TabsContent>

          <TabsContent value="performance">
            <StaffPerformance />
          </TabsContent>

          <TabsContent value="capacity">
            <CapacityPlanning />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
