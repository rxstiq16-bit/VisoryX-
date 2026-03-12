"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
  className?: string
  variant?: "default" | "compact" | "large"
  showLabels?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({
  targetDate,
  onComplete,
  className,
  variant = "default",
  showLabels = true,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime()
      
      if (difference <= 0) {
        setIsComplete(true)
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (isComplete) {
    return (
      <div className={cn("text-center", className)}>
        <span className="text-2xl font-bold text-primary animate-pulse">Time's Up!</span>
      </div>
    )
  }

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ]

  if (variant === "compact") {
    return (
      <div className={cn("font-mono text-lg", className)}>
        {String(timeLeft.days).padStart(2, "0")}:
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 sm:gap-4", className)}>
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center rounded-lg bg-card border font-mono font-bold tabular-nums",
                variant === "large" ? "w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-4xl" : "w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl"
              )}
            >
              {String(unit.value).padStart(2, "0")}
            </div>
            {showLabels && (
              <span className={cn(
                "mt-1 text-muted-foreground uppercase tracking-wider",
                variant === "large" ? "text-xs" : "text-[10px]"
              )}>
                {unit.label}
              </span>
            )}
          </div>
          {index < units.length - 1 && (
            <span className={cn(
              "text-muted-foreground font-bold",
              variant === "large" ? "text-3xl" : "text-xl",
              showLabels && "mb-5"
            )}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// Flash sale countdown with urgency styling
interface FlashSaleCountdownProps {
  endDate: Date
  discount: number
  onExpire?: () => void
}

export function FlashSaleCountdown({ endDate, discount, onExpire }: FlashSaleCountdownProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-lg text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium opacity-90">Flash Sale - Limited Time!</p>
          <p className="text-2xl font-bold">{discount}% OFF</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-90">Ends in:</span>
          <CountdownTimer
            targetDate={endDate}
            onComplete={onExpire}
            variant="compact"
            className="bg-white/20 px-3 py-1 rounded"
          />
        </div>
      </div>
    </div>
  )
}
