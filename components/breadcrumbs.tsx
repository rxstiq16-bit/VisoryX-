"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

const pathLabels: Record<string, string> = {
  services: "Services",
  portfolio: "Portfolio",
  blog: "Blog",
  help: "Help Center",
  dashboard: "Dashboard",
  orders: "Orders",
  settings: "Settings",
  admin: "Admin",
  order: "Order",
  pricing: "Pricing",
  about: "About",
  contact: "Contact",
  auth: "Authentication",
  referrals: "Referrals",
  notifications: "Notifications",
  profile: "Profile",
  security: "Security",
  billing: "Billing",
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from path if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const segments = pathname.split("/").filter(Boolean)
    const crumbs: BreadcrumbItem[] = []
    let path = ""

    segments.forEach((segment) => {
      path += `/${segment}`
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
      crumbs.push({ label, href: path })
    })

    return crumbs
  })()

  if (breadcrumbItems.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center gap-1.5">
        {showHome && (
          <>
            <li>
              <Link
                href="/"
                className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          </>
        )}
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            {index === breadcrumbItems.length - 1 ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Structured data for SEO
export function BreadcrumbsSchema({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://visoryx.com"

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${baseUrl}${item.href}`,
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
