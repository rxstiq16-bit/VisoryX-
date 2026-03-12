"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-4 left-4 z-[100] px-4 py-2 rounded-md",
        "bg-primary text-primary-foreground font-medium text-sm",
        "transform -translate-y-full focus:translate-y-0",
        "transition-transform duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
    >
      Skip to main content
    </a>
  )
}

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      variant="secondary"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full shadow-lg",
        "transition-all duration-200",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}
