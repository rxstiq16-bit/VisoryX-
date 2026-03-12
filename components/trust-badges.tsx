"use client"

import { Shield, Lock, CreditCard, Clock, CheckCircle, Award, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadge {
  icon: React.ElementType
  label: string
  description?: string
}

const badges: TrustBadge[] = [
  { icon: Shield, label: "Secure Checkout", description: "256-bit SSL encryption" },
  { icon: Lock, label: "Privacy Protected", description: "Your data is safe" },
  { icon: CreditCard, label: "Safe Payments", description: "Stripe & PayPal" },
  { icon: Clock, label: "Fast Delivery", description: "2-5 business days" },
  { icon: CheckCircle, label: "Satisfaction Guaranteed", description: "100% money-back" },
  { icon: Award, label: "Quality Assured", description: "Professional designers" },
]

interface TrustBadgesProps {
  variant?: "inline" | "grid" | "compact"
  showDescription?: boolean
  className?: string
  badges?: ("secure" | "privacy" | "payment" | "delivery" | "satisfaction" | "quality")[]
}

export function TrustBadges({
  variant = "inline",
  showDescription = false,
  className,
  badges: selectedBadges,
}: TrustBadgesProps) {
  const displayBadges = selectedBadges
    ? badges.filter((_, i) => selectedBadges.includes(["secure", "privacy", "payment", "delivery", "satisfaction", "quality"][i] as never))
    : badges

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
        {displayBadges.slice(0, 4).map((badge) => {
          const Icon = badge.icon
          return (
            <div key={badge.label} className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-xs">{badge.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6", className)}>
        {displayBadges.map((badge) => {
          const Icon = badge.icon
          return (
            <div key={badge.label} className="flex flex-col items-center text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">{badge.label}</p>
              {showDescription && badge.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{badge.description}</p>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-6", className)}>
      {displayBadges.map((badge) => {
        const Icon = badge.icon
        return (
          <div key={badge.label} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{badge.label}</p>
              {showDescription && badge.description && (
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Simple payment icons row
export function PaymentMethodIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <span className="text-xs text-muted-foreground">We accept:</span>
      <div className="flex items-center gap-2">
        <div className="rounded bg-muted px-2 py-1 text-xs font-medium">Visa</div>
        <div className="rounded bg-muted px-2 py-1 text-xs font-medium">Mastercard</div>
        <div className="rounded bg-muted px-2 py-1 text-xs font-medium">PayPal</div>
        <div className="rounded bg-muted px-2 py-1 text-xs font-medium">Robux</div>
      </div>
    </div>
  )
}

// Stats section
export function TrustStats({ className }: { className?: string }) {
  const stats = [
    { value: "5,247+", label: "Designs Delivered" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "4.9", label: "Average Rating", icon: Star },
    { value: "24/7", label: "Support Available" },
  ]

  return (
    <div className={cn("grid grid-cols-2 gap-6 sm:grid-cols-4", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-3xl font-bold">{stat.value}</p>
              {Icon && <Icon className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
