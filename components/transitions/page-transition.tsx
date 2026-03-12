"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

type TransitionType = "fade" | "slide" | "scale" | "slideUp"

export function PageTransition({ 
  children, 
  className,
}: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      setIsTransitioning(true)
      
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
        previousPathname.current = pathname
      }, 200)

      return () => clearTimeout(timer)
    } else {
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out",
        isTransitioning && "opacity-0 translate-y-2",
        !isTransitioning && "opacity-100 translate-y-0",
        className
      )}
    >
      {displayChildren}
    </div>
  )
}

// Alternative slide transition
export function SlideTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
        className
      )}
    >
      {children}
    </div>
  )
}

// Scale transition for modals/dialogs
export function ScaleTransition({ 
  children, 
  isOpen,
  className 
}: { 
  children: React.ReactNode
  isOpen: boolean
  className?: string 
}) {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      {children}
    </div>
  )
}

// Staggered children animation
export function StaggeredList({ 
  children, 
  className,
  staggerDelay = 50 
}: { 
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const pathname = usePathname()

  useEffect(() => {
    setVisibleItems([])
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index])
      }, index * staggerDelay)
    })
  }, [pathname, children.length, staggerDelay])

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-300 ease-out",
            visibleItems.includes(index) 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Loading bar transition (like YouTube)
export function LoadingBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)

    const timer1 = setTimeout(() => setProgress(30), 50)
    const timer2 = setTimeout(() => setProgress(60), 150)
    const timer3 = setTimeout(() => setProgress(80), 300)
    const timer4 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 200)
    }, 400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [pathname])

  if (!isLoading && progress === 0) return null

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] h-1">
      <div
        className={cn(
          "h-full bg-primary transition-all duration-300 ease-out",
          progress === 100 && "opacity-0"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Fade in on scroll
export function FadeInOnScroll({ 
  children, 
  className,
  threshold = 0.1 
}: { 
  children: React.ReactNode
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  )
}
