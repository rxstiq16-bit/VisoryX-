"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Announcement {
  id: string
  message: string
  link?: string
  linkText?: string
  type: "info" | "promo" | "warning" | "success"
  expiresAt?: string
}

const announcements: Announcement[] = [
  {
    id: "spring-sale",
    message: "Spring Sale: 20% off all services!",
    link: "/services",
    linkText: "Shop Now",
    type: "promo",
    expiresAt: "2026-04-30",
  },
]

const typeStyles = {
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  promo: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  success: "bg-green-500/10 text-green-500 border-green-500/20",
}

export function AnnouncementBar() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const dismissedIds = JSON.parse(localStorage.getItem("dismissed-announcements") || "[]")
    const now = new Date()

    // Find first active, non-dismissed announcement
    const active = announcements.find((a) => {
      if (dismissedIds.includes(a.id)) return false
      if (a.expiresAt && new Date(a.expiresAt) < now) return false
      return true
    })

    setCurrentAnnouncement(active || null)
  }, [])

  const handleDismiss = () => {
    if (!currentAnnouncement) return
    const dismissedIds = JSON.parse(localStorage.getItem("dismissed-announcements") || "[]")
    localStorage.setItem("dismissed-announcements", JSON.stringify([...dismissedIds, currentAnnouncement.id]))
    setDismissed(true)
  }

  if (!currentAnnouncement || dismissed) return null

  return (
    <div className={cn("relative border-b px-4 py-2", typeStyles[currentAnnouncement.type])}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>{currentAnnouncement.message}</span>
        {currentAnnouncement.link && (
          <Link href={currentAnnouncement.link} className="inline-flex items-center gap-1 font-medium hover:underline">
            {currentAnnouncement.linkText || "Learn more"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-background/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
