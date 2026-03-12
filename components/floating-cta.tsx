"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingCtaProps {
  text?: string
  href?: string
  showAfterScroll?: number
  className?: string
}

export function FloatingCta({
  text = "Start Your Order",
  href = "/order",
  showAfterScroll = 300,
  className,
}: FloatingCtaProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showAfterScroll])

  if (!isVisible || dismissed) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
      isVisible && !dismissed ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
      className
    )}>
      <div className="flex items-center gap-2 rounded-full border bg-background/95 p-1 shadow-lg backdrop-blur">
        <Button asChild className="rounded-full">
          <Link href={href}>
            {text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Mobile-specific bottom CTA bar
export function MobileCtaBar({
  text = "Start Order",
  href = "/order",
  price,
}: {
  text?: string
  href?: string
  price?: number
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 md:hidden">
      <div className="flex items-center justify-between gap-4">
        {price !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-lg font-bold">${price.toFixed(2)}</p>
          </div>
        )}
        <Button asChild className={cn("flex-1", !price && "w-full")}>
          <Link href={href}>
            {text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
