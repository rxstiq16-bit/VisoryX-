import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DiscordConnect } from "@/components/integrations/discord-connect"
import { RobloxConnect } from "@/components/integrations/roblox-connect"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Integrations | VisoryX",
  description: "Connect your Discord and Roblox accounts to enhance your VisoryX experience.",
}

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="container flex-1 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Integrations</h1>
            <Badge variant="secondary">Settings</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            Connect external accounts to enhance your VisoryX experience
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DiscordConnect />
          <RobloxConnect />
        </div>

        {/* Future integrations placeholder */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Coming Soon</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Twitter/X", description: "Share your designs automatically" },
              { name: "Twitch", description: "Stream overlay designs" },
              { name: "YouTube", description: "Thumbnail & banner services" },
            ].map((integration) => (
              <div
                key={integration.name}
                className="rounded-xl border border-dashed bg-muted/30 p-6 text-center"
              >
                <p className="font-medium text-muted-foreground">{integration.name}</p>
                <p className="mt-1 text-sm text-muted-foreground/70">{integration.description}</p>
                <Badge variant="outline" className="mt-3">Coming Soon</Badge>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
