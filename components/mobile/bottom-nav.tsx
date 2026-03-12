"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, MessageSquare, User, Menu, Search, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  authRequired?: boolean
}

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/services", label: "Services", icon: ShoppingBag },
    { href: "/orders", label: "Orders", icon: Package, authRequired: true },
    { href: "/messages", label: "Messages", icon: MessageSquare, badge: 3, authRequired: true },
    { href: user ? "/dashboard" : "/auth/login", label: user ? "Account" : "Login", icon: User },
  ]

  // Filter out auth-required items if not logged in
  const visibleItems = navItems.filter((item) => !item.authRequired || user)

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex items-center justify-around py-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center p-0 text-[10px]"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={cn(
                  "transition-all",
                  isActive && "font-medium"
                )}
              >
                {item.label}
              </span>
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Safe area padding for notched devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
