"use client"

import { useEffect, useState, createContext, useContext } from "react"
import { cn } from "@/lib/utils"
import { RotateCcw } from "lucide-react"

type Orientation = "portrait" | "landscape"
type DeviceType = "mobile" | "tablet" | "desktop"

interface OrientationContextType {
  orientation: Orientation
  deviceType: DeviceType
  isLandscapeMobile: boolean
}

const OrientationContext = createContext<OrientationContextType>({
  orientation: "portrait",
  deviceType: "desktop",
  isLandscapeMobile: false,
})

export function useOrientation() {
  return useContext(OrientationContext)
}

export function OrientationProvider({ children }: { children: React.ReactNode }) {
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop")

  useEffect(() => {
    const updateOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? "landscape" : "portrait")

      // Determine device type
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType("mobile")
      } else if (width < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    updateOrientation()
    window.addEventListener("resize", updateOrientation)
    window.addEventListener("orientationchange", updateOrientation)

    return () => {
      window.removeEventListener("resize", updateOrientation)
      window.removeEventListener("orientationchange", updateOrientation)
    }
  }, [])

  const isLandscapeMobile = orientation === "landscape" && deviceType === "mobile"

  return (
    <OrientationContext.Provider value={{ orientation, deviceType, isLandscapeMobile }}>
      {children}
    </OrientationContext.Provider>
  )
}

// Component that adapts layout for landscape mobile
interface LandscapeAdaptiveProps {
  children: React.ReactNode
  landscapeLayout?: "side-by-side" | "compact" | "hidden"
  className?: string
}

export function LandscapeAdaptive({ 
  children, 
  landscapeLayout = "side-by-side",
  className 
}: LandscapeAdaptiveProps) {
  const { isLandscapeMobile } = useOrientation()

  if (landscapeLayout === "hidden" && isLandscapeMobile) {
    return null
  }

  return (
    <div className={cn(
      isLandscapeMobile && landscapeLayout === "side-by-side" && "flex flex-row",
      isLandscapeMobile && landscapeLayout === "compact" && "scale-90 origin-top",
      className
    )}>
      {children}
    </div>
  )
}

// Grid that adjusts for landscape
interface LandscapeGridProps {
  children: React.ReactNode
  portraitCols?: number
  landscapeCols?: number
  className?: string
}

export function LandscapeGrid({ 
  children, 
  portraitCols = 1, 
  landscapeCols = 2,
  className 
}: LandscapeGridProps) {
  const { isLandscapeMobile } = useOrientation()

  return (
    <div className={cn(
      "grid gap-4",
      isLandscapeMobile ? `grid-cols-${landscapeCols}` : `grid-cols-${portraitCols}`,
      className
    )}>
      {children}
    </div>
  )
}

// Prompt to rotate device for better experience
interface RotatePromptProps {
  show?: "portrait" | "landscape"
  message?: string
}

export function RotatePrompt({ 
  show = "portrait", 
  message = "Rotate your device for a better experience" 
}: RotatePromptProps) {
  const { orientation, deviceType } = useOrientation()

  if (deviceType === "desktop") return null
  if (orientation !== show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center p-6">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <RotateCcw className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold">{message}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This content is optimized for {show === "portrait" ? "landscape" : "portrait"} view
        </p>
      </div>
    </div>
  )
}

// Safe area wrapper for notched devices
export function SafeAreaWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
      "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
      className
    )}>
      {children}
    </div>
  )
}

// Video/media player optimized for landscape
interface LandscapeMediaProps {
  children: React.ReactNode
  className?: string
}

export function LandscapeMedia({ children, className }: LandscapeMediaProps) {
  const { isLandscapeMobile } = useOrientation()

  return (
    <div className={cn(
      "relative",
      isLandscapeMobile && "fixed inset-0 z-40 bg-black flex items-center justify-center",
      className
    )}>
      {children}
    </div>
  )
}

// Navigation that adapts for landscape mobile
export function LandscapeNav({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isLandscapeMobile } = useOrientation()

  if (isLandscapeMobile) {
    return (
      <nav className={cn(
        "fixed left-0 top-0 bottom-0 w-16 bg-background border-r flex flex-col items-center py-4 gap-2",
        className
      )}>
        {children}
      </nav>
    )
  }

  return (
    <nav className={cn("w-full", className)}>
      {children}
    </nav>
  )
}

// Content wrapper that accounts for landscape nav
export function LandscapeContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isLandscapeMobile } = useOrientation()

  return (
    <main className={cn(
      isLandscapeMobile && "ml-16",
      className
    )}>
      {children}
    </main>
  )
}
