"use client"

import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import { 
  ShoppingCart, 
  CreditCard, 
  UserCheck, 
  Palette, 
  Send, 
  MessageSquare, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Star,
  FileCheck,
  Download
} from "lucide-react"

interface TimelineEvent {
  id: string
  type: "created" | "paid" | "assigned" | "in_progress" | "submitted" | "message" | "revision" | "approved" | "completed" | "review" | "delivered"
  title: string
  description?: string
  timestamp: Date
  user?: {
    name: string
    role: "customer" | "designer" | "admin" | "system"
  }
}

interface OrderTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const eventIcons = {
  created: ShoppingCart,
  paid: CreditCard,
  assigned: UserCheck,
  in_progress: Palette,
  submitted: Send,
  message: MessageSquare,
  revision: RotateCcw,
  approved: FileCheck,
  completed: CheckCircle2,
  review: Star,
  delivered: Download,
}

const eventColors = {
  created: "bg-blue-500",
  paid: "bg-green-500",
  assigned: "bg-purple-500",
  in_progress: "bg-amber-500",
  submitted: "bg-cyan-500",
  message: "bg-gray-500",
  revision: "bg-orange-500",
  approved: "bg-green-500",
  completed: "bg-green-600",
  review: "bg-yellow-500",
  delivered: "bg-emerald-500",
}

export function OrderTimeline({ events, className }: OrderTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />

      <div className="space-y-6">
        {events.map((event, index) => {
          const Icon = eventIcons[event.type] || Clock
          const color = eventColors[event.type] || "bg-gray-500"
          const isLast = index === events.length - 1

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
                  color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    {event.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                    {event.user && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        by {event.user.name}
                        <span className="ml-1 capitalize">({event.user.role})</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    <div>{format(event.timestamp, "MMM d, yyyy")}</div>
                    <div>{format(event.timestamp, "h:mm a")}</div>
                    <div className="mt-1 text-muted-foreground/70">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Example usage component
export function OrderTimelineExample() {
  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "created",
      title: "Order Created",
      description: "Logo Design - Premium Package",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      user: { name: "You", role: "customer" },
    },
    {
      id: "2",
      type: "paid",
      title: "Payment Received",
      description: "$149.99 via Card ending in 4242",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60000),
      user: { name: "System", role: "system" },
    },
    {
      id: "3",
      type: "assigned",
      title: "Designer Assigned",
      description: "Sarah M. will be working on your design",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      user: { name: "System", role: "system" },
    },
    {
      id: "4",
      type: "in_progress",
      title: "Work Started",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3600000),
      user: { name: "Sarah M.", role: "designer" },
    },
    {
      id: "5",
      type: "message",
      title: "New Message",
      description: "Quick question about the color palette...",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      user: { name: "Sarah M.", role: "designer" },
    },
    {
      id: "6",
      type: "submitted",
      title: "Design Submitted",
      description: "First draft ready for review",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: { name: "Sarah M.", role: "designer" },
    },
    {
      id: "7",
      type: "revision",
      title: "Revision Requested",
      description: "Could you make the text slightly larger?",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: { name: "You", role: "customer" },
    },
    {
      id: "8",
      type: "submitted",
      title: "Revision Completed",
      description: "Version 2 ready for review",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: { name: "Sarah M.", role: "designer" },
    },
    {
      id: "9",
      type: "approved",
      title: "Design Approved",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: { name: "You", role: "customer" },
    },
    {
      id: "10",
      type: "delivered",
      title: "Files Delivered",
      description: "4 files available for download",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: { name: "System", role: "system" },
    },
    {
      id: "11",
      type: "completed",
      title: "Order Completed",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: { name: "System", role: "system" },
    },
  ]

  return <OrderTimeline events={events} />
}
