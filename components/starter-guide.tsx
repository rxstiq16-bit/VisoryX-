"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Circle, ChevronRight, X, User, ShoppingCart, Settings, Award, MessageSquare, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

interface Step {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href?: string
  action?: string
  completed: boolean
}

export function StarterGuide() {
  const { user, profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [steps, setSteps] = useState<Step[]>([
    { id: "profile", title: "Complete your profile", description: "Add your avatar and bio", icon: User, href: "/settings/profile", completed: false },
    { id: "browse", title: "Browse our services", description: "Explore what we offer", icon: ShoppingCart, href: "/services", completed: false },
    { id: "first-order", title: "Place your first order", description: "Start your creative journey", icon: Sparkles, href: "/order", completed: false },
    { id: "notifications", title: "Enable notifications", description: "Stay updated on your orders", icon: Settings, href: "/settings/notifications", completed: false },
    { id: "discord", title: "Join our Discord", description: "Connect with the community", icon: MessageSquare, action: "discord", completed: false },
    { id: "referral", title: "Share your referral link", description: "Earn rewards for referrals", icon: Award, href: "/referrals", completed: false },
  ])

  useEffect(() => {
    if (!user) return
    const dismissedKey = `starter-guide-dismissed-${user.id}`
    if (localStorage.getItem(dismissedKey)) { setDismissed(true); return }

    // Check completion status
    const completed: Record<string, boolean> = {}
    completed.profile = Boolean(profile?.avatar_url && profile?.bio)
    // Other completions would be checked from API/database
    
    setSteps((prev) => prev.map((step) => ({ ...step, completed: completed[step.id] || false })))
    
    // Show guide if not all steps are completed
    const allCompleted = Object.values(completed).every(Boolean)
    if (!allCompleted) {
      setTimeout(() => setIsOpen(true), 2000)
    }
  }, [user, profile])

  const completedSteps = steps.filter((s) => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  const handleDismiss = () => {
    if (user) localStorage.setItem(`starter-guide-dismissed-${user.id}`, "1")
    setDismissed(true)
    setIsOpen(false)
  }

  if (dismissed || !user) return null

  return (
    <>
      {/* Floating trigger */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Getting Started</DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>Skip</Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{completedSteps} of {steps.length} complete</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <Link
                    key={step.id}
                    href={step.href || "#"}
                    onClick={() => { if (!step.href) setIsOpen(false) }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted",
                      step.completed && "bg-green-500/5 border-green-500/20"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      step.completed ? "bg-green-500 text-white" : "bg-muted"
                    )}>
                      {step.completed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-medium", step.completed && "line-through text-muted-foreground")}>{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {!step.completed && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </Link>
                )
              })}
            </div>

            {completedSteps === steps.length && (
              <div className="rounded-lg bg-green-500/10 p-4 text-center">
                <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="font-medium text-green-500">All done!</p>
                <p className="text-sm text-muted-foreground">You&apos;re all set to get the most out of VisoryX!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Inline progress card
export function StarterProgressCard({ className }: { className?: string }) {
  const completedSteps = 3
  const totalSteps = 6
  const progress = (completedSteps / totalSteps) * 100

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Getting Started</CardTitle>
        <CardDescription>{completedSteps} of {totalSteps} tasks complete</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2" />
        <Button asChild variant="link" className="mt-2 h-auto p-0">
          <Link href="/getting-started">View all tasks →</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
