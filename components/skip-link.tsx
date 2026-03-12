"use client"

import { Button } from "@/components/ui/button"

export function SkipLink() {
  return (
    <Button
      asChild
      variant="default"
      className="absolute left-4 top-4 z-[9999] -translate-y-20 transition-transform focus:translate-y-0"
    >
      <a href="#main-content">
        Skip to main content
      </a>
    </Button>
  )
}
