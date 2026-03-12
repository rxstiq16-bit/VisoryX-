import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CalendarIntegration } from "@/components/calendar-integration"
import { Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Calendar Integration | VisoryX",
  description: "Connect your calendar to track order deadlines and milestones",
}

export default function SettingsCalendarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Calendar Integration</h1>
              <p className="text-muted-foreground">Sync order deadlines with your calendar</p>
            </div>
          </div>
        </div>

        <CalendarIntegration />
      </main>
      <Footer />
    </div>
  )
}
