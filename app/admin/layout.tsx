"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminErrorBoundary } from "@/components/admin/admin-error-boundary"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const ADMIN_ROLES = ["executive", "director", "operations_manager", "lead_developer", "developer", "lead_moderator", "community_moderator", "design_lead", "designer", "content_manager", "support_agent", "trial"]

const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/orders/new": "New Order",
  "/admin/portfolio": "Portfolio",
  "/admin/reviews": "Reviews & Partners",
  "/admin/email": "Email Center",
  "/admin/settings": "Settings",
}

function getBreadcrumbs(pathname: string) {
  const crumbs: { label: string; href?: string }[] = []

  // Check for exact matches first
  if (breadcrumbMap[pathname]) {
    crumbs.push({ label: breadcrumbMap[pathname] })
    return crumbs
  }

  // Check order detail pages: /admin/orders/[id]
  if (pathname.startsWith("/admin/orders/") && pathname !== "/admin/orders/new") {
    const id = pathname.split("/").pop()
    crumbs.push({ label: "Orders", href: "/admin/orders" })
    crumbs.push({ label: `#${id?.slice(0, 8) || "..."}` })
    return crumbs
  }

  // Fallback - just show the last segment
  const segments = pathname.split("/").filter(Boolean)
  const last = segments[segments.length - 1]
  crumbs.push({ label: last?.charAt(0).toUpperCase() + last?.slice(1) || "Admin" })
  return crumbs
}

function AdminHeader() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border/40 bg-background/80 backdrop-blur-md px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
          Admin
        </Link>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
            {crumb.href ? (
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground text-xs font-semibold">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side - subtle accent line */}
      <div className="ml-auto flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] text-muted-foreground">Live</span>
      </div>
    </header>
  )
}

function AdminLoadingSpinner() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Skeleton sidebar */}
      <div className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-card/50 p-4 gap-3">
        <div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-muted/50 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
      {/* Skeleton main area */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border/40 bg-background/80 flex items-center px-6">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex-1 p-6 lg:p-8">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, isLoading } = useAuth()

  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) return <AdminLoadingSpinner />

  if (!user) {
    router.replace("/admin/login")
    return <AdminLoadingSpinner />
  }

  if (profile && !profile.roles?.some((r: string) => ADMIN_ROLES.includes(r))) {
    router.replace("/")
    return <AdminLoadingSpinner />
  }

  if (!profile) return <AdminLoadingSpinner />

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            <AdminErrorBoundary>
              {children}
            </AdminErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
