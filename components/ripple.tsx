"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface RippleProps {
  className?: string
  color?: string
  duration?: number
  children: React.ReactNode
}

interface RippleEffect {
  x: number
  y: number
  size: number
  id: number
}

export function Ripple({
  className,
  color = "rgba(255, 255, 255, 0.4)",
  duration = 600,
  children,
}: RippleProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple: RippleEffect = {
        x,
        y,
        size,
        id: Date.now(),
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, duration)
    },
    [duration]
  )

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  )
}
