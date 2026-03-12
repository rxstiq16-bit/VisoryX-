"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface RealtimeEvent<T = unknown> {
  type: string
  data: T
  timestamp: number
}

interface UseRealtimeOptions {
  url: string
  onMessage?: (event: RealtimeEvent) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
  reconnect?: boolean
  reconnectInterval?: number
  maxRetries?: number
}

export function useRealtime<T = unknown>(options: UseRealtimeOptions) {
  const {
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnect = true,
    reconnectInterval = 3000,
    maxRetries = 5,
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<RealtimeEvent<T> | null>(null)
  const [error, setError] = useState<Event | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const retriesRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
      retriesRef.current = 0
      onOpen?.()
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeEvent<T>
        setLastEvent(data)
        onMessage?.(data)
      } catch {
        // Handle non-JSON messages
        setLastEvent({ type: "message", data: event.data as T, timestamp: Date.now() })
      }
    }

    eventSource.onerror = (err) => {
      setError(err)
      setIsConnected(false)
      onError?.(err)
      eventSource.close()

      if (reconnect && retriesRef.current < maxRetries) {
        retriesRef.current++
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval)
      }
    }

    return eventSource
  }, [url, onMessage, onError, onOpen, reconnect, reconnectInterval, maxRetries])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsConnected(false)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return {
    isConnected,
    lastEvent,
    error,
    reconnect: connect,
    disconnect,
  }
}

// Hook for order-specific real-time updates
export function useOrderRealtime(orderId: string) {
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ id: string; content: string; createdAt: string }>>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const { isConnected, lastEvent } = useRealtime({
    url: `/api/orders/${orderId}/stream`,
    onMessage: (event) => {
      switch (event.type) {
        case "status_update":
          setOrderStatus(event.data as string)
          break
        case "new_message":
          setMessages((prev) => [...prev, event.data as { id: string; content: string; createdAt: string }])
          break
        case "typing_start":
          setTypingUsers((prev) => [...new Set([...prev, event.data as string])])
          break
        case "typing_stop":
          setTypingUsers((prev) => prev.filter((u) => u !== event.data))
          break
      }
    },
  })

  return {
    isConnected,
    orderStatus,
    messages,
    typingUsers,
    lastEvent,
  }
}

// Hook for notification real-time updates
export function useNotificationRealtime(userId: string) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string }>>([])

  const { isConnected } = useRealtime({
    url: `/api/notifications/stream?userId=${userId}`,
    onMessage: (event) => {
      if (event.type === "notification") {
        const notification = event.data as { id: string; title: string; body: string }
        setNotifications((prev) => [notification, ...prev])
        setUnreadCount((prev) => prev + 1)
        
        // Show browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification(notification.title, { body: notification.body })
        }
      }
    },
  })

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  return {
    isConnected,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
  }
}
