"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, ShoppingCart, Star, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialProofEvent {
  id: string
  type: "order" | "review" | "signup"
  name: string
  avatar?: string
  message: string
  location?: string
  timeAgo: string
}

const mockEvents: SocialProofEvent[] = [
  { id: "1", type: "order", name: "Alex M.", message: "just ordered a Logo Design", location: "California, US", timeAgo: "2 minutes ago" },
  { id: "2", type: "review", name: "Sarah K.", message: "left a 5-star review", location: "Texas, US", timeAgo: "5 minutes ago" },
  { id: "3", type: "order", name: "Jordan P.", message: "just ordered ERLC Liveries", location: "Florida, US", timeAgo: "8 minutes ago" },
  { id: "4", type: "signup", name: "Mike R.", message: "just joined VisoryX", location: "New York, US", timeAgo: "12 minutes ago" },
  { id: "5", type: "order", name: "Emma L.", message: "just ordered Discord Setup", location: "Canada", timeAgo: "15 minutes ago" },
]

const typeIcons = {
  order: ShoppingCart,
  review: Star,
  signup: UserPlus,
}

const typeColors = {
  order: "text-green-500",
  review: "text-yellow-500",
  signup: "text-blue-500",
}

export function SocialProofPopup() {
  const [currentEvent, setCurrentEvent] = useState<SocialProofEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    
    // Check if user dismissed recently
    const dismissedTime = localStorage.getItem("social-proof-dismissed")
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 3600000) { // 1 hour
      setDismissed(true)
      return
    }

    let eventIndex = 0

    const showNextEvent = () => {
      setCurrentEvent(mockEvents[eventIndex])
      setIsVisible(true)

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      eventIndex = (eventIndex + 1) % mockEvents.length
    }

    // Show first popup after 10 seconds
    const initialDelay = setTimeout(showNextEvent, 10000)

    // Then show every 30 seconds
    const interval = setInterval(showNextEvent, 30000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [dismissed])

  const handleDismiss = () => {
    localStorage.setItem("social-proof-dismissed", Date.now().toString())
    setDismissed(true)
    setIsVisible(false)
  }

  if (!currentEvent || !isVisible || dismissed) return null

  const Icon = typeIcons[currentEvent.type]

  return (
    <Card className={cn(
      "fixed bottom-4 left-4 z-50 flex items-start gap-3 p-3 shadow-lg transition-all duration-300",
      isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
    )}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={currentEvent.avatar} />
        <AvatarFallback>{currentEvent.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-medium">{currentEvent.name}</span>
          {" "}
          <span className="text-muted-foreground">{currentEvent.message}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {currentEvent.location && `${currentEvent.location} • `}
          {currentEvent.timeAgo}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", typeColors[currentEvent.type])} />
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}
