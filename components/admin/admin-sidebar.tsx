"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShoppingCart,
  ImageIcon,
  Star,
  Mail,
  Inbox,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

// Permission tiers for nav item visibility
// Empty array = visible to ALL admin roles (including trial)
const LEADERSHIP = ["executive", "director"]
const MANAGEMENT_PLUS = ["executive", "director", "operations_manager"]
const STAFF_LEADS = ["executive", "director", "operations_manager", "lead_developer", "lead_moderator"]
const CONTENT_TEAM = ["executive", "director", "content_manager"]
const SUPPORT_TEAM = ["executive", "director", "operations_manager", "support_agent"]

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [] as string[] },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart, roles: [] as string[] },
      { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon, roles: [] as string[] },
      { href: "/admin/reviews", label: "Reviews & Partners", icon: Star, roles: [] as string[] },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileText, roles: CONTENT_TEAM },
    ],
  },
  {
    label: "Communicate",
    items: [
      { href: "/admin/inbox", label: "Inbox", icon: Inbox, roles: SUPPORT_TEAM },
      { href: "/admin/email", label: "Email Center", icon: Mail, roles: MANAGEMENT_PLUS },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, roles: STAFF_LEADS },
      { href: "/admin/settings", label: "Settings", icon: Settings, roles: LEADERSHIP },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }
  const [collapsed, setCollapsed] = useState(false)

  // Fetch unread inbox count
  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/admin/inbox-count")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.count || 0)
        }
      } catch {}
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30_000) // poll every 30s
    return () => clearInterval(interval)
  }, [])

  const renderNavItem = (item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href + "/"))

    const link = (
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
        )}
        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        {!collapsed && <span className="flex-1">{item.label}</span>}
        {!collapsed && item.href === "/admin/inbox" && unreadCount > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {collapsed && item.href === "/admin/inbox" && unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {/* Subtle glow on active */}
        {isActive && !collapsed && (
          <span className="absolute inset-0 rounded-lg bg-primary/5 blur-sm -z-10" />
        )}
      </Link>
    )

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="text-xs font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      )
    }

    return <div key={item.href}>{link}</div>
  }

  const initials = (profile?.display_name || profile?.username || "A").charAt(0).toUpperCase()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm text-foreground transition-all duration-300 sticky top-0",
          collapsed ? "w-[60px]" : "w-[230px]"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-14 items-center border-b border-border/50 px-3",
          collapsed && "justify-center"
        )}>
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <img
                src="/images/mascot/virox-face.png"
                alt="ViroX"
                className="h-7 w-7 rounded-md object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none tracking-tight">VisoryX</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin Panel</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <img
              src="/images/mascot/virox-face.png"
              alt="ViroX"
              className="h-7 w-7 rounded-md object-cover"
            />
          )}
        </div>

        {/* Collapse toggle */}
        <div className={cn("flex px-3 pt-3", collapsed ? "justify-center" : "justify-end")}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {navSections.map((section, idx) => {
            const userRoles = profile?.roles || []
            const visibleItems = section.items.filter(
              item => item.roles.length === 0 || item.roles.some(r => userRoles.includes(r))
            )
            if (visibleItems.length === 0) return null
            return (
            <div key={section.label} className={cn(idx > 0 && "mt-5")}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                  {section.label}
                </p>
              )}
              {collapsed && idx > 0 && (
                <div className="mx-auto mb-2 h-px w-6 bg-border/50" />
              )}
              <div className="space-y-0.5">
                {visibleItems.map(renderNavItem)}
              </div>
            </div>
            )
          })}
        </nav>

        {/* View site link */}
        <div className={cn("px-2 pb-1", collapsed && "flex justify-center")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="text-xs">View Live Site</TooltipContent>
            </Tooltip>
          ) : (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Site
            </a>
          )}
        </div>

        {/* Footer / User */}
        <div className={cn("border-t border-border/50 p-2", collapsed && "flex flex-col items-center gap-2")}>
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
                {/* Avatar ring with gradient */}
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary to-accent opacity-60 blur-[2px]" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-card text-primary text-xs font-bold border border-border/50">
                    {initials}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-medium leading-none">
                    {profile?.display_name || profile?.username}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground truncate capitalize">
                    {profile?.roles?.[0]?.replace(/_/g, " ") || "staff"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground text-xs h-8 px-3"
                onClick={() => handleSignOut()}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary to-accent opacity-40 blur-[2px]" />
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-card text-primary text-xs font-bold border border-border/50">
                      {initials}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="text-xs">
                  {profile?.display_name || profile?.username}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleSignOut()}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="text-xs">Sign Out</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
