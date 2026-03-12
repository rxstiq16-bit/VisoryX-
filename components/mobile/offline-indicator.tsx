"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)
    setShowBanner(!navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        // Show "back online" message briefly
        setShowBanner(true)
        setTimeout(() => setShowBanner(false), 3000)
      }
      setWasOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
      setWasOffline(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [wasOffline])

  const handleRetry = () => {
    window.location.reload()
  }

  if (!showBanner) return null

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-white transition-all",
        isOnline
          ? "bg-green-600"
          : "bg-amber-600"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Back online!</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>You're offline. Some features may be limited.</span>
          <Button
            variant="secondary"
            size="sm"
            className="h-7 gap-1.5 bg-white/20 text-white hover:bg-white/30"
            onClick={handleRetry}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </>
      )}

      <button
        onClick={() => setShowBanner(false)}
        className="absolute right-4 text-white/80 hover:text-white"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
