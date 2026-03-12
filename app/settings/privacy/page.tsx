import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GDPRTools } from "@/components/settings/gdpr-tools"
import { Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Settings | VisoryX",
  description: "Manage your data privacy, export data, and GDPR settings",
}

export default function SettingsPrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Privacy Settings</h1>
              <p className="text-muted-foreground">Control your data and privacy preferences</p>
            </div>
          </div>
        </div>

        <GDPRTools />
      </main>
      <Footer />
    </div>
  )
}
