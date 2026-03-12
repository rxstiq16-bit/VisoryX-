"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export function AdminLogin() {
  const router = useRouter()
  const { user, profile, isLoading } = useAuth()

  const ADMIN_ROLES = ["executive", "director", "operations_manager", "design_lead", "designer", "community_moderator"]

  const hasAdminAccess = profile?.roles?.some((r: string) =>
    ADMIN_ROLES.includes(r)
  )

  useEffect(() => {
    if (isLoading) return
    if (user && profile && hasAdminAccess) {
      router.replace("/admin/dashboard")
    }
  }, [isLoading, user, profile, hasAdminAccess, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <img src="/images/mascot/virox-face.png" alt="Loading" className="h-12 w-12 rounded-full animate-pulse" />
          <p className="text-xs text-muted-foreground">Checking access...</p>
        </div>
      </div>
    )
  }

  // Logged in but no admin access
  if (user && profile && !hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="relative w-full max-w-sm">
          {/* Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5 blur-xl" />
          <div className="relative rounded-2xl border border-destructive/30 bg-card p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Access Denied
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account does not have permission to access the admin panel.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user.email}</span>
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <a href="/">Return to Home</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Not logged in - show login
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background subtle pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative w-full max-w-sm">
        {/* Glow effect */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 blur-2xl" />

        <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 text-center">
          {/* ViroX Mascot */}
          <div className="relative mx-auto mb-6 w-fit">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
            <img
              src="/images/mascot/virox-hi.png"
              alt="ViroX mascot"
              className="relative h-28 w-auto drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Admin Panel
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage VisoryX
          </p>

          <Button asChild className="mt-8 w-full h-11 font-semibold">
            <a href="/auth/login">Sign In with Your Account</a>
          </Button>

          <p className="mt-4 text-[11px] text-muted-foreground/60">
            Access restricted to authorized team members only.
          </p>
        </div>
      </div>
    </div>
  )
}
