"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TypingIndicatorProps {
  users: string[]
  className?: string
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const text = users.length === 1 
    ? `${users[0]} is typing...`
    : users.length === 2
    ? `${users[0]} and ${users[1]} are typing...`
    : `${users[0]} and ${users.length - 1} others are typing...`

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
      <span>{text}</span>
    </div>
  )
}

// Hook for managing typing state
interface UseTypingOptions {
  orderId: string
  userId: string
  debounceMs?: number
}

export function useTyping({ orderId, userId, debounceMs = 2000 }: UseTypingOptions) {
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const sendTypingEvent = useCallback(async (typing: boolean) => {
    try {
      await fetch(`/api/orders/${orderId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, typing }),
      })
    } catch (error) {
      console.error("Failed to send typing event:", error)
    }
  }, [orderId, userId])

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      sendTypingEvent(true)
    }

    // Reset timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTypingEvent(false)
    }, debounceMs)
  }, [isTyping, sendTypingEvent, debounceMs])

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (isTyping) {
      setIsTyping(false)
      sendTypingEvent(false)
    }
  }, [isTyping, sendTypingEvent])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { isTyping, startTyping, stopTyping }
}
