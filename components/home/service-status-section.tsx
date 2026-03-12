"use client"

import { ServiceStatusBadges } from "@/components/service-status-badges"

export function ServiceStatusSection() {
  return (
    <section className="border-t border-border/30 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">Service Availability</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current status of our design services
          </p>
        </div>
        <ServiceStatusBadges />
      </div>
    </section>
  )
}
