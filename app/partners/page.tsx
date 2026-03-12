"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PartnerDashboard } from "@/components/partners/partner-dashboard"

export default function PartnersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Partner Portal</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your partnership, track commissions, and access resources
            </p>
          </div>
          <PartnerDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
