"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  once?: boolean
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  once = true,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (once && hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimated(true)
            animateCount()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once, hasAnimated, end, duration])

  const animateCount = () => {
    const startTime = performance.now()
    const startValue = start

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (end - startValue) * easeOut

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  )
}

// Stats card with animated counter
interface StatsCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  className?: string
}

export function StatsCard({ label, value, prefix, suffix, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn("p-6 rounded-xl border bg-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold">
            <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
          </p>
          {trend && (
            <p className={cn(
              "mt-1 text-sm font-medium flex items-center gap-1",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              <svg
                className={cn("h-4 w-4", !trend.isPositive && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// Multiple stats in a row
interface StatsRowProps {
  stats: Array<{
    label: string
    value: number
    prefix?: string
    suffix?: string
  }>
  className?: string
}

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center p-4">
          <p className="text-3xl md:text-4xl font-bold text-foreground">
            <AnimatedCounter
              end={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
