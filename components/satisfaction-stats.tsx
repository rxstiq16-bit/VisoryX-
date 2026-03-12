"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, Clock, Award, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SatisfactionStatsProps {
  className?: string
  variant?: "horizontal" | "grid" | "compact"
}

const stats = [
  {
    label: "Satisfaction Rate",
    value: "98%",
    icon: ThumbsUp,
    description: "Customers happy with their designs",
    color: "text-emerald-500",
  },
  {
    label: "Average Rating",
    value: "4.9",
    suffix: "/5",
    icon: Star,
    description: "Based on 2,400+ reviews",
    color: "text-amber-500",
  },
  {
    label: "On-Time Delivery",
    value: "99%",
    icon: Clock,
    description: "Orders delivered on schedule",
    color: "text-blue-500",
  },
  {
    label: "Return Customers",
    value: "72%",
    icon: TrendingUp,
    description: "Customers who order again",
    color: "text-purple-500",
  },
]

export function SatisfactionStats({ className, variant = "horizontal" }: SatisfactionStatsProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-6", className)}>
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <stat.icon className={cn("h-4 w-4", stat.color)} />
            <span className="font-bold">{stat.value}</span>
            {stat.suffix && <span className="text-muted-foreground">{stat.suffix}</span>}
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "grid") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("rounded-lg bg-muted p-2", `${stat.color}/10`)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="secondary" className="font-normal">
                  Verified
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  {stat.suffix && (
                    <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center gap-8 overflow-x-auto py-4", className)}>
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              {stat.suffix && (
                <span className="text-sm text-muted-foreground">{stat.suffix}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
          {index < stats.length - 1 && (
            <div className="h-8 w-px bg-border" />
          )}
        </div>
      ))}
    </div>
  )
}
