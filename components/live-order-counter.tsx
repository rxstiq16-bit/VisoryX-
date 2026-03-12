"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LiveOrderCounterProps {
  className?: string
  variant?: "badge" | "inline" | "hero"
}

export function LiveOrderCounter({ className, variant = "badge" }: LiveOrderCounterProps) {
  const [count, setCount] = useState(5247)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        setIsAnimating(true)
        setCount((prev) => prev + 1)
        setTimeout(() => setIsAnimating(false), 500)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const formattedCount = count.toLocaleString()

  if (variant === "hero") {
    return (
      <div className={cn("inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2", className)}>
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm">
          <span className={cn("font-bold transition-transform", isAnimating && "scale-110")}>{formattedCount}</span>
          {" "}designs delivered and counting
        </span>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <span className={cn("text-muted-foreground", className)}>
        Join{" "}
        <span className={cn("font-semibold text-foreground transition-transform", isAnimating && "scale-110")}>
          {formattedCount}+
        </span>
        {" "}happy customers
      </span>
    )
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1",
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className={cn("text-sm font-medium transition-transform", isAnimating && "scale-105")}>
        {formattedCount}
      </span>
      <span className="text-xs text-muted-foreground">orders</span>
    </div>
  )
}
