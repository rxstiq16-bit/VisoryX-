"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  className?: string
  threshold?: number
  maxPull?: number
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const isPulling = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only start pull if at top of scroll
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY
        isPulling.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      if (diff > 0 && container.scrollTop === 0) {
        e.preventDefault()
        const pull = Math.min(diff * 0.5, maxPull) // Resistance
        setPullDistance(pull)
        setCanRefresh(pull >= threshold)
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling.current || isRefreshing) return
      isPulling.current = false

      if (canRefresh) {
        setIsRefreshing(true)
        setPullDistance(threshold) // Hold at threshold
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
          setCanRefresh(false)
        }
      } else {
        setPullDistance(0)
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [canRefresh, isRefreshing, maxPull, onRefresh, threshold])

  const progress = Math.min(pullDistance / threshold, 1)

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
    >
      {/* Pull indicator */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance,
          transition: isPulling.current ? "none" : "height 0.3s ease-out",
        }}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10",
            canRefresh && "bg-primary/20"
          )}
          style={{
            opacity: progress,
            transform: `scale(${0.5 + progress * 0.5})`,
          }}
        >
          <RefreshCw
            className={cn(
              "h-5 w-5 text-primary transition-transform",
              isRefreshing && "animate-spin"
            )}
            style={{
              transform: `rotate(${progress * 180}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling.current ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}
