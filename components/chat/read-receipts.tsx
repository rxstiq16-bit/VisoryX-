"use client"

import { useState, useEffect } from "react"
import { Check, CheckCheck, Clock, Eye } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type MessageStatus = "sending" | "sent" | "delivered" | "read"

interface ReadReceiptProps {
  status: MessageStatus
  readAt?: Date
  deliveredAt?: Date
  sentAt?: Date
  readBy?: Array<{ name: string; avatar?: string; readAt: Date }>
  showDetails?: boolean
  className?: string
}

export function ReadReceipt({ 
  status, 
  readAt, 
  deliveredAt, 
  sentAt, 
  readBy = [],
  showDetails = false,
  className 
}: ReadReceiptProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "sending":
        return "Sending..."
      case "sent":
        return sentAt ? `Sent ${formatDistanceToNow(sentAt, { addSuffix: true })}` : "Sent"
      case "delivered":
        return deliveredAt ? `Delivered ${formatDistanceToNow(deliveredAt, { addSuffix: true })}` : "Delivered"
      case "read":
        return readAt ? `Read ${formatDistanceToNow(readAt, { addSuffix: true })}` : "Read"
    }
  }

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("inline-flex items-center", className)}>
              {getStatusIcon()}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{getStatusText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
            {getStatusIcon()}
            <span className="capitalize">{status}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{getStatusText()}</p>
            {readBy.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Read by:
                </p>
                {readBy.map((reader, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {reader.avatar ? (
                      <img src={reader.avatar} alt={reader.name} className="h-4 w-4 rounded-full" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                        {reader.name[0]}
                      </div>
                    )}
                    <span>{reader.name}</span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(reader.readAt, { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ReadReceiptAPIProps {
  messageId: string
  userId: string
}

export function useReadReceipts(orderId: string) {
  const [receipts, setReceipts] = useState<Record<string, MessageStatus>>({})

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/orders/${orderId}/messages/${messageId}/read`, {
        method: "POST",
      })
      setReceipts(prev => ({ ...prev, [messageId]: "read" }))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  return { receipts, markAsRead }
}
