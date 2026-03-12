"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  ShoppingBag,
  MessageSquare,
  User,
  LayoutGrid,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  badge?: number
  matchPaths?: string[]
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Home",
    matchPaths: ["/"],
  },
  {
    href: "/services",
    icon: LayoutGrid,
    label: "Services",
    matchPaths: ["/services", "/order"],
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingBag,
    label: "Orders",
    matchPaths: ["/dashboard/orders"],
  },
  {
    href: "/dashboard/messages",
    icon: MessageSquare,
    label: "Messages",
    matchPaths: ["/dashboard/messages"],
  },
  {
    href: "/dashboard",
    icon: User,
    label: "Profile",
    matchPaths: ["/dashboard", "/dashboard/settings"],
  },
]

interface MobileNavProps {
  unreadMessages?: number
  className?: string
}

export function MobileNav({ unreadMessages = 0, className }: MobileNavProps) {
  const pathname = usePathname()

  const isActive = (item: NavItem) => {
    if (item.matchPaths) {
      return item.matchPaths.some((path) => {
        if (path === "/") return pathname === "/"
        return pathname.startsWith(path)
      })
    }
    return pathname === item.href
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden",
        "pb-safe", // Safe area for iOS
        className
      )}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          const badge = item.label === "Messages" ? unreadMessages : item.badge

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full relative",
                "transition-colors duration-200",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
                {badge && badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {badge > 99 ? "99+" : badge}
                  </Badge>
                )}
              </div>
              <span className={cn("text-[10px]", active && "font-medium")}>
                {item.label}
              </span>

              {/* Active Indicator */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
