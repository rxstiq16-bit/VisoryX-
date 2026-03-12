"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isTransitioning: false,
  startTransition: () => {},
})

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  const startTransition = () => {
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
    </PageTransitionContext.Provider>
  )
}

type TransitionType = "fade" | "slide-up" | "slide-left" | "scale" | "blur"

interface PageTransitionProps {
  children: React.ReactNode
  type?: TransitionType
  className?: string
  duration?: number
}

export function PageTransition({ 
  children, 
  type = "fade",
  className,
  duration = 300
}: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter")

  useEffect(() => {
    setTransitionStage("exit")
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage("enter")
    }, duration)
    return () => clearTimeout(timer)
  }, [pathname, children, duration])

  const getTransitionClasses = () => {
    const base = "transition-all"
    const durationClass = `duration-${duration}`

    switch (type) {
      case "fade":
        return cn(
          base,
          durationClass,
          transitionStage === "enter" ? "opacity-100" : "opacity-0"
        )
      case "slide-up":
        return cn(
          base,
          durationClass,
          transitionStage === "enter" 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4"
        )
      case "slide-left":
        return cn(
          base,
          durationClass,
          transitionStage === "enter" 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-4"
        )
      case "scale":
        return cn(
          base,
          durationClass,
          transitionStage === "enter" 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        )
      case "blur":
        return cn(
          base,
          durationClass,
          transitionStage === "enter" 
            ? "opacity-100 blur-0" 
            : "opacity-0 blur-sm"
        )
      default:
        return base
    }
  }

  return (
    <div className={cn(getTransitionClasses(), className)}>
      {displayChildren}
    </div>
  )
}

// Loading bar component for page transitions
export function PageLoadingBar() {
  const { isTransitioning } = usePageTransition()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isTransitioning) {
      setProgress(0)
      const timer1 = setTimeout(() => setProgress(30), 50)
      const timer2 = setTimeout(() => setProgress(60), 150)
      const timer3 = setTimeout(() => setProgress(90), 250)
      const timer4 = setTimeout(() => setProgress(100), 300)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    } else {
      setProgress(100)
      const timer = setTimeout(() => setProgress(0), 200)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  if (progress === 0) return null

  return (
    <div className="fixed left-0 top-0 z-[100] h-1 w-full">
      <div 
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Skeleton loader for page content
export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 w-1/3 rounded bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-4/6 rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded-lg bg-muted" />
        <div className="h-32 rounded-lg bg-muted" />
        <div className="h-32 rounded-lg bg-muted" />
      </div>
    </div>
  )
}
