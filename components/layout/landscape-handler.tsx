"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { RotateCcw, Smartphone } from "lucide-react"

interface LandscapeHandlerProps {
  children: React.ReactNode
  showWarning?: boolean
  forcePortrait?: boolean
}

export function LandscapeHandler({ 
  children, 
  showWarning = false,
  forcePortrait = false 
}: LandscapeHandlerProps) {
  const [isLandscape, setIsLandscape] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeOrientation = window.innerWidth > window.innerHeight
      const isMobileDevice = window.innerWidth < 1024 && 'ontouchstart' in window
      
      setIsLandscape(isLandscapeOrientation)
      setIsMobile(isMobileDevice)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  // Show rotate prompt for mobile landscape if forcePortrait is true
  if (forcePortrait && isMobile && isLandscape) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background p-8">
        <div className="relative mb-6">
          <Smartphone className="h-20 w-20 text-muted-foreground" />
          <RotateCcw className="absolute -right-2 -top-2 h-8 w-8 animate-spin text-primary" style={{ animationDuration: "3s" }} />
        </div>
        <h2 className="mb-2 text-xl font-bold">Please Rotate Your Device</h2>
        <p className="text-center text-muted-foreground">
          This page is best viewed in portrait mode.
          <br />
          Please rotate your device for the best experience.
        </p>
      </div>
    )
  }

  // Show subtle warning banner if showWarning is true
  if (showWarning && isMobile && isLandscape) {
    return (
      <>
        <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 px-4 py-2 text-sm text-white">
          <RotateCcw className="h-4 w-4" />
          <span>Rotate to portrait for optimal experience</span>
        </div>
        <div className="pt-10">{children}</div>
      </>
    )
  }

  return <>{children}</>
}

// Hook for landscape detection
export function useLandscape() {
  const [orientation, setOrientation] = useState<{
    isLandscape: boolean
    isMobile: boolean
    isTablet: boolean
    viewportWidth: number
    viewportHeight: number
  }>({
    isLandscape: false,
    isMobile: false,
    isTablet: false,
    viewportWidth: 0,
    viewportHeight: 0,
  })

  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024

      setOrientation({
        isLandscape,
        isMobile,
        isTablet,
        viewportWidth: width,
        viewportHeight: height,
      })
    }

    updateOrientation()
    window.addEventListener("resize", updateOrientation)
    window.addEventListener("orientationchange", updateOrientation)

    return () => {
      window.removeEventListener("resize", updateOrientation)
      window.removeEventListener("orientationchange", updateOrientation)
    }
  }, [])

  return orientation
}

// Responsive component that adapts to landscape
export function LandscapeAdaptive({ 
  children,
  landscapeLayout,
  className 
}: { 
  children: React.ReactNode
  landscapeLayout?: React.ReactNode
  className?: string 
}) {
  const { isLandscape, isMobile } = useLandscape()

  // Use landscape layout on mobile landscape if provided
  if (landscapeLayout && isMobile && isLandscape) {
    return <div className={className}>{landscapeLayout}</div>
  }

  return <div className={className}>{children}</div>
}

// Full-screen landscape mode for galleries/viewers
export function LandscapeViewer({ 
  children,
  isOpen,
  onClose 
}: { 
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void 
}) {
  useEffect(() => {
    if (isOpen) {
      // Try to lock to landscape on mobile
      if (screen.orientation && 'lock' in screen.orientation) {
        (screen.orientation as any).lock?.("landscape").catch(() => {
          // Orientation lock not supported or denied
        })
      }
      document.body.style.overflow = "hidden"
    } else {
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock?.()
      }
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        ✕
      </button>
      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
