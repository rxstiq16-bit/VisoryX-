"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Zap, Bell, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-prompt-dismissed")
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) return // 7 days
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after user has been on site for a bit
      setTimeout(() => setShowPrompt(true), 30000) // 30 seconds
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString())
    setShowPrompt(false)
  }

  if (!showPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-2xl">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Smartphone className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Install VisoryX</CardTitle>
              <CardDescription>Add to your home screen</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Feature icon={Zap} label="Faster" />
            <Feature icon={Bell} label="Notifications" />
            <Feature icon={Wifi} label="Offline" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleDismiss}>
              Not Now
            </Button>
            <Button className="flex-1" onClick={handleInstall}>
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Feature({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-muted p-2 text-center">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// Mini banner variant
export function PwaInstallBanner({ className }: { className?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return
    const dismissed = localStorage.getItem("pwa-banner-dismissed")
    if (!dismissed) setShow(true)
  }, [])

  if (!show) return null

  return (
    <div className={cn("flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2", className)}>
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-primary" />
        <span className="text-sm">Install VisoryX for a better experience</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => { localStorage.setItem("pwa-banner-dismissed", "1"); setShow(false) }}>
          <X className="h-4 w-4" />
        </Button>
        <Button size="sm">Install</Button>
      </div>
    </div>
  )
}
