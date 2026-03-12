"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SubscriptionManager } from "@/components/subscriptions/subscription-manager"

export default function SubscriptionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions & Retainers</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your monthly design subscriptions and retainer packages
            </p>
          </div>
          <SubscriptionManager />
        </div>
      </main>
      <Footer />
    </div>
  )
}
