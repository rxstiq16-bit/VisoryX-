"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutCountdownProps {
  initialMinutes?: number
  onExpire?: () => void
  showProgress?: boolean
  variant?: "default" | "urgent" | "minimal"
  className?: string
}

export function CheckoutCountdown({
  initialMinutes = 15,
  onExpire,
  showProgress = true,
  variant = "default",
  className,
}: CheckoutCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      onExpire?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = (timeLeft / (initialMinutes * 60)) * 100
  const isUrgent = timeLeft < 300 // Less than 5 minutes

  if (isExpired) {
    return (
      <Card className={cn("border-destructive bg-destructive/5", className)}>
        <CardContent className="flex items-center gap-3 py-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Session Expired</p>
            <p className="text-sm text-muted-foreground">
              Your cart reservation has expired. Please refresh to continue.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Clock className={cn("h-4 w-4", isUrgent && "text-destructive animate-pulse")} />
        <span className={cn(isUrgent && "text-destructive font-medium")}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "transition-colors",
        isUrgent && "border-destructive bg-destructive/5",
        className
      )}
    >
      <CardContent className="py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isUrgent ? (
              <Flame className="h-5 w-5 text-destructive animate-pulse" />
            ) : (
              <Clock className="h-5 w-5 text-primary" />
            )}
            <span className={cn("font-medium", isUrgent && "text-destructive")}>
              {isUrgent ? "Hurry! Cart expires soon" : "Cart reserved for"}
            </span>
          </div>
          <div
            className={cn(
              "font-mono text-xl font-bold tabular-nums",
              isUrgent && "text-destructive"
            )}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>

        {showProgress && (
          <Progress
            value={progress}
            className={cn("h-2", isUrgent && "[&>div]:bg-destructive")}
          />
        )}

        {variant === "urgent" && (
          <p className="mt-2 text-xs text-muted-foreground">
            Complete your purchase to secure your items and pricing
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Stock urgency indicator
interface StockUrgencyProps {
  stockLevel: number
  maxStock?: number
  showExact?: boolean
  className?: string
}

export function StockUrgency({
  stockLevel,
  maxStock = 10,
  showExact = false,
  className,
}: StockUrgencyProps) {
  if (stockLevel <= 0) {
    return (
      <div className={cn("flex items-center gap-1 text-destructive text-sm", className)}>
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">Out of stock</span>
      </div>
    )
  }

  if (stockLevel <= 3) {
    return (
      <div className={cn("flex items-center gap-1 text-amber-500 text-sm", className)}>
        <Flame className="h-4 w-4 animate-pulse" />
        <span className="font-medium">
          Only {stockLevel} left{showExact ? "" : " - order soon!"}
        </span>
      </div>
    )
  }

  if (stockLevel <= maxStock / 2) {
    return (
      <div className={cn("flex items-center gap-1 text-amber-600 text-sm", className)}>
        <Clock className="h-4 w-4" />
        <span>Limited availability</span>
      </div>
    )
  }

  return null
}
