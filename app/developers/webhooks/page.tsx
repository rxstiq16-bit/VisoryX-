import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DeveloperWebhooks } from "@/components/developers/webhooks"

export const metadata: Metadata = {
  title: "Webhooks | VisoryX Developers",
  description: "Configure webhooks to receive real-time updates about orders and events.",
}

export default function DeveloperWebhooksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
            <p className="mt-2 text-muted-foreground">
              Receive real-time notifications when events happen in your account
            </p>
          </div>
          <DeveloperWebhooks />
        </div>
      </main>
      <Footer />
    </div>
  )
}
