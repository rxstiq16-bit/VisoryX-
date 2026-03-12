"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if user dismissed before
    const dismissed = localStorage.getItem("pwa-prompt-dismissed")
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) return // Don't show for 7 days after dismissal
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)

    // For iOS, show custom prompt after delay
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 5000)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setShowPrompt(false)
        setDeferredPrompt(null)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", new Date().toISOString())
  }

  if (isStandalone || !showPrompt) return null

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:max-w-sm",
        "bg-card border rounded-xl shadow-lg p-4",
        "animate-in slide-in-from-bottom-4 duration-300"
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">Install VisoryX</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isIOS
              ? "Tap the share button, then 'Add to Home Screen'"
              : "Get quick access and offline support"}
          </p>

          {!isIOS && deferredPrompt && (
            <Button
              size="sm"
              onClick={handleInstall}
              className="mt-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
