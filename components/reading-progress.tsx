"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ReadingProgressProps {
  className?: string
  targetId?: string
}

export function ReadingProgress({ className, targetId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      let scrollHeight: number
      let scrollTop: number

      if (targetId) {
        const target = document.getElementById(targetId)
        if (!target) return
        const rect = target.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const elementHeight = target.offsetHeight
        const elementTop = window.scrollY + rect.top
        scrollTop = Math.max(0, window.scrollY - elementTop)
        scrollHeight = elementHeight - viewportHeight
      } else {
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        scrollTop = window.scrollY
      }

      if (scrollHeight > 0) {
        const currentProgress = Math.min((scrollTop / scrollHeight) * 100, 100)
        setProgress(currentProgress)
      }
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [targetId])

  return (
    <div className={cn("fixed left-0 top-0 z-50 h-1 w-full", className)}>
      <div
        className="h-full bg-primary transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Circular reading progress for blog posts
export function CircularReadingProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setProgress(Math.min((window.scrollY / scrollHeight) * 100, 100))
      }
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative h-10 w-10", className)}>
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary transition-all duration-150"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {Math.round(progress)}%
      </span>
    </div>
  )
}
