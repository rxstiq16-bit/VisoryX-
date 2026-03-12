"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, RefreshCw, Zap, Award, Heart, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const guarantees = [
  {
    icon: Shield,
    title: "100% Satisfaction Guarantee",
    description: "Not happy? Get your money back. No questions asked within 14 days.",
    badge: "Money-Back",
    color: "text-emerald-500",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We deliver on schedule or you get 25% off your next order.",
    badge: "Guaranteed",
    color: "text-blue-500",
  },
  {
    icon: RefreshCw,
    title: "Unlimited Revisions",
    description: "We revise until you are 100% satisfied with your design.",
    badge: "Included",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Rush Delivery Available",
    description: "Need it fast? Get same-day or next-day delivery on select services.",
    badge: "24-48hrs",
    color: "text-orange-500",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Every design reviewed by senior designers before delivery.",
    badge: "QA Checked",
    color: "text-amber-500",
  },
  {
    icon: Heart,
    title: "Lifetime Support",
    description: "Questions after delivery? We are here to help, forever.",
    badge: "Forever",
    color: "text-rose-500",
  },
]

interface GuaranteesProps {
  className?: string
  variant?: "grid" | "compact" | "inline"
}

export function Guarantees({ className, variant = "grid" }: GuaranteesProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
        {guarantees.slice(0, 4).map((guarantee) => (
          <div
            key={guarantee.title}
            className="flex items-center gap-2 rounded-full border bg-card px-4 py-2"
          >
            <guarantee.icon className={cn("h-4 w-4", guarantee.color)} />
            <span className="text-sm font-medium">{guarantee.badge}</span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-center gap-8 text-sm text-muted-foreground", className)}>
        {guarantees.slice(0, 3).map((guarantee, index) => (
          <div key={guarantee.title} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>{guarantee.title.replace(" Guarantee", "")}</span>
            {index < 2 && <span className="ml-6 text-border">|</span>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">Our Promises</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Guarantees You Can Trust
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We stand behind our work with industry-leading guarantees
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guarantees.map((guarantee) => (
            <Card key={guarantee.title} className="group transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "rounded-xl bg-muted p-3 transition-colors group-hover:bg-primary/10",
                  )}>
                    <guarantee.icon className={cn("h-6 w-6", guarantee.color)} />
                  </div>
                  <Badge variant="secondary">{guarantee.badge}</Badge>
                </div>
                <CardTitle className="mt-4">{guarantee.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {guarantee.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
