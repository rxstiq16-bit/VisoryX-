"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out"
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, once])

  const animationStyles: Record<string, { initial: string; visible: string }> = {
    "fade-up": {
      initial: "opacity-0 translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-down": {
      initial: "opacity-0 -translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-left": {
      initial: "opacity-0 translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      initial: "opacity-0 -translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    "zoom-in": {
      initial: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
    "zoom-out": {
      initial: "opacity-0 scale-105",
      visible: "opacity-100 scale-100",
    },
  }

  const { initial, visible } = animationStyles[animation]

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        isVisible ? visible : initial,
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Stagger children animation wrapper
interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  animation?: ScrollRevealProps["animation"]
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 100,
  animation = "fade-up",
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <ScrollReveal
              key={index}
              animation={animation}
              delay={isVisible ? index * staggerDelay : 0}
            >
              {child}
            </ScrollReveal>
          ))
        : children}
    </div>
  )
}
