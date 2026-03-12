"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface DesignerAvailabilityProps {
  className?: string
  variant?: "badge" | "detailed" | "minimal"
}

export function DesignerAvailability({ className, variant = "badge" }: DesignerAvailabilityProps) {
  const [data, setData] = useState({
    onlineDesigners: 3,
    totalDesigners: 8,
    averageResponseTime: "2 hours",
    currentQueueLength: 5,
    isAcceptingRush: true,
  })

  // In production, fetch from API
  useEffect(() => {
    // Would fetch from /api/designers/availability
  }, [])

  const availabilityPercentage = Math.round((data.onlineDesigners / data.totalDesigners) * 100)
  const isHighAvailability = data.onlineDesigners >= 3

  if (variant === "minimal") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-1.5", className)}>
              <span className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                isHighAvailability ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <span className="text-xs text-muted-foreground">
                {data.onlineDesigners} online
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{data.onlineDesigners} of {data.totalDesigners} designers available</p>
            <p className="text-xs text-muted-foreground">
              Average response: {data.averageResponseTime}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (variant === "badge") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1.5",
          isHighAvailability
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
            : "border-amber-500/50 bg-amber-500/10 text-amber-600",
          className
        )}
      >
        <span className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse",
          isHighAvailability ? "bg-emerald-500" : "bg-amber-500"
        )} />
        {data.onlineDesigners} designers online
      </Badge>
    )
  }

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Designer Availability</h3>
        <Badge
          variant="outline"
          className={cn(
            isHighAvailability
              ? "border-emerald-500/50 text-emerald-600"
              : "border-amber-500/50 text-amber-600"
          )}
        >
          {isHighAvailability ? "High Availability" : "Limited Availability"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Online Now</p>
            <p className="font-semibold">
              {data.onlineDesigners}/{data.totalDesigners} designers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Response</p>
            <p className="font-semibold">{data.averageResponseTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rush Available</p>
            <p className="font-semibold">
              {data.isAcceptingRush ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Capacity</span>
          <span className="font-medium">{availabilityPercentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isHighAvailability ? "bg-emerald-500" : "bg-amber-500"
            )}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
