"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Sparkles, ArrowRight, X } from "lucide-react"
import Link from "next/link"

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [hasShown, setHasShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Check if already shown this session
    const shown = sessionStorage.getItem("exitIntentShown")
    if (shown) {
      setHasShown(true)
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true)
        setHasShown(true)
        sessionStorage.setItem("exitIntentShown", "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent" }),
      })
      setIsSubscribed(true)
    } catch (error) {
      console.error("Failed to subscribe:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {!isSubscribed ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl">Wait! Don't leave empty-handed</DialogTitle>
              <DialogDescription className="text-base">
                Get 15% off your first order when you join our newsletter.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Exclusive deals
                </Badge>
                <Badge variant="secondary">Design tips</Badge>
                <Badge variant="secondary">Early access</Badge>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "..." : "Get 15% Off"}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                No spam, unsubscribe anytime. Use code WELCOME15 at checkout.
              </p>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Sparkles className="h-8 w-8 text-green-500" />
            </div>
            <DialogTitle className="mb-2 text-2xl">You're in!</DialogTitle>
            <DialogDescription className="mb-6 text-base">
              Use code <span className="font-bold text-primary">WELCOME15</span> for 15% off your first order.
            </DialogDescription>
            <Button asChild>
              <Link href="/order">
                Start Your Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
