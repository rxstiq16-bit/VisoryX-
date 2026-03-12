"use client"

import { useState, useEffect, useCallback } from "react"

interface PresenceUser {
  id: string
  name: string
  avatar?: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen?: Date
  currentPage?: string
  isTyping?: boolean
}

interface UsePresenceOptions {
  channelId: string
  userId: string
  userName: string
  userAvatar?: string
  heartbeatInterval?: number
  awayTimeout?: number
}

interface PresenceState {
  users: Map<string, PresenceUser>
  isConnected: boolean
  error: Error | null
}

export function usePresence({
  channelId,
  userId,
  userName,
  userAvatar,
  heartbeatInterval = 30000,
  awayTimeout = 60000,
}: UsePresenceOptions) {
  const [state, setState] = useState<PresenceState>({
    users: new Map(),
    isConnected: false,
    error: null,
  })
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now())
    
    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    events.forEach(event => document.addEventListener(event, updateActivity, { passive: true }))
    
    return () => {
      events.forEach(event => document.removeEventListener(event, updateActivity))
    }
  }, [])

  // Determine current status based on activity
  const getCurrentStatus = useCallback((): "online" | "away" => {
    const timeSinceActivity = Date.now() - lastActivity
    return timeSinceActivity > awayTimeout ? "away" : "online"
  }, [lastActivity, awayTimeout])

  // Send heartbeat
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch("/api/presence/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId,
            userId,
            userName,
            userAvatar,
            status: getCurrentStatus(),
            currentPage: window.location.pathname,
          }),
        })
      } catch (error) {
        console.error("[Presence] Heartbeat failed:", error)
      }
    }

    sendHeartbeat()
    const interval = setInterval(sendHeartbeat, heartbeatInterval)

    return () => clearInterval(interval)
  }, [channelId, userId, userName, userAvatar, heartbeatInterval, getCurrentStatus])

  // Subscribe to presence updates
  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      eventSource = new EventSource(`/api/presence/subscribe?channelId=${channelId}`)

      eventSource.onopen = () => {
        setState(prev => ({ ...prev, isConnected: true, error: null }))
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === "presence_sync") {
            const users = new Map<string, PresenceUser>()
            data.users.forEach((user: PresenceUser) => {
              users.set(user.id, user)
            })
            setState(prev => ({ ...prev, users }))
          }
          
          if (data.type === "user_joined") {
            setState(prev => {
              const users = new Map(prev.users)
              users.set(data.user.id, data.user)
              return { ...prev, users }
            })
          }
          
          if (data.type === "user_left") {
            setState(prev => {
              const users = new Map(prev.users)
              users.delete(data.userId)
              return { ...prev, users }
            })
          }
          
          if (data.type === "user_updated") {
            setState(prev => {
              const users = new Map(prev.users)
              const existing = users.get(data.user.id)
              users.set(data.user.id, { ...existing, ...data.user })
              return { ...prev, users }
            })
          }
          
          if (data.type === "typing_start") {
            setState(prev => {
              const users = new Map(prev.users)
              const user = users.get(data.userId)
              if (user) users.set(data.userId, { ...user, isTyping: true })
              return { ...prev, users }
            })
          }
          
          if (data.type === "typing_stop") {
            setState(prev => {
              const users = new Map(prev.users)
              const user = users.get(data.userId)
              if (user) users.set(data.userId, { ...user, isTyping: false })
              return { ...prev, users }
            })
          }
        } catch (error) {
          console.error("[Presence] Parse error:", error)
        }
      }

      eventSource.onerror = () => {
        setState(prev => ({ ...prev, isConnected: false }))
        eventSource?.close()
        // Reconnect after delay
        setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      eventSource?.close()
      // Send leave signal
      navigator.sendBeacon?.("/api/presence/leave", JSON.stringify({ channelId, userId }))
    }
  }, [channelId, userId])

  // Helper to broadcast typing status
  const setTyping = useCallback(async (isTyping: boolean) => {
    try {
      await fetch("/api/presence/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, userId, isTyping }),
      })
    } catch (error) {
      console.error("[Presence] Typing broadcast failed:", error)
    }
  }, [channelId, userId])

  // Get array of online users (excluding self)
  const onlineUsers = Array.from(state.users.values())
    .filter(u => u.id !== userId && (u.status === "online" || u.status === "away"))

  // Get users currently typing
  const typingUsers = Array.from(state.users.values())
    .filter(u => u.id !== userId && u.isTyping)

  return {
    users: state.users,
    onlineUsers,
    typingUsers,
    isConnected: state.isConnected,
    error: state.error,
    setTyping,
    onlineCount: onlineUsers.length,
  }
}

// Presence API routes would need to be created
export function createPresenceApiRoutes() {
  // This is a placeholder - actual implementation would use
  // Supabase Realtime, Pusher, or similar for WebSocket support
  return {
    heartbeat: "/api/presence/heartbeat",
    subscribe: "/api/presence/subscribe", 
    leave: "/api/presence/leave",
    typing: "/api/presence/typing",
  }
}
