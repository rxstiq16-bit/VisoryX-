"use client"

import { useState, useEffect, useCallback } from "react"

interface UsePushNotificationsReturn {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permission: NotificationPermission | "default"
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    const checkSupport = async () => {
      const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
        
        // Check if already subscribed
        try {
          const registration = await navigator.serviceWorker.ready
          const subscription = await registration.pushManager.getSubscription()
          setIsSubscribed(!!subscription)
        } catch (error) {
          console.error("Error checking push subscription:", error)
        }
      }
      
      setIsLoading(false)
    }

    checkSupport()
  }, [])

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false
    
    setIsLoading(true)
    
    try {
      // Request permission
      const perm = await Notification.requestPermission()
      setPermission(perm)
      
      if (perm !== "granted") {
        setIsLoading(false)
        return false
      }

      // Get VAPID public key from server
      const keyResponse = await fetch("/api/push/vapid-key")
      const { publicKey } = await keyResponse.json()
      
      if (!publicKey) {
        console.error("No VAPID public key available")
        setIsLoading(false)
        return false
      }

      // Subscribe to push
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      // Send subscription to server
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        setIsLoading(false)
        return true
      } else {
        console.error("Failed to save push subscription")
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Error subscribing to push:", error)
      setIsLoading(false)
      return false
    }
  }, [isSupported])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false
    
    setIsLoading(true)
    
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe()
        
        // Remove from server
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
      }
      
      setIsSubscribed(false)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Error unsubscribing from push:", error)
      setIsLoading(false)
      return false
    }
  }, [isSupported])

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
  }
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  
  return outputArray
}
