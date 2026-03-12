"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DiscordConnection } from "@/components/integrations/discord-connection"
import { RobloxConnection } from "@/components/integrations/roblox-connection"
import Link from "next/link"
import { Shield, Zap, Bell, Gift, CreditCard, Globe } from "lucide-react"

export default function IntegrationsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 pt-24">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <CardTitle>Sign in to manage integrations</CardTitle>
              <CardDescription>Connect your accounts to unlock additional features.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-up">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Zap className="h-3 w-3 mr-1" />
                Connected Services
              </Badge>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Integrations
              </h1>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Connect your accounts to unlock additional features like Discord notifications, Roblox payments, and more.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          {/* Benefits */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <Bell className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Instant Notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get order updates via Discord DM
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">More Payment Options</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pay with Robux or other methods
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Exclusive Rewards</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlock bonus points and perks
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Discord Integration */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Discord</h2>
            <DiscordConnection />
          </div>

          <Separator />

          {/* Roblox Integration */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Roblox</h2>
            <RobloxConnection />
          </div>

          <Separator />

          {/* Coming Soon */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">GitHub</h3>
                      <p className="text-sm text-muted-foreground">Connect for developer perks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">More Integrations</h3>
                      <p className="text-sm text-muted-foreground">Additional platforms coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
