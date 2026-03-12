"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Search, ArrowRight, FileQuestion, History, TrendingUp } from "lucide-react"

interface PageSuggestion {
  title: string
  href: string
  description: string
  relevance: number
}

const allPages: PageSuggestion[] = [
  { title: "Home", href: "/", description: "Return to the main page", relevance: 0 },
  { title: "Portfolio", href: "/portfolio", description: "View our design work", relevance: 0 },
  { title: "Pricing", href: "/pricing", description: "See our service prices", relevance: 0 },
  { title: "Order", href: "/order", description: "Place a new order", relevance: 0 },
  { title: "Dashboard", href: "/dashboard", description: "Your account dashboard", relevance: 0 },
  { title: "Help Center", href: "/help", description: "Get help and support", relevance: 0 },
  { title: "Contact", href: "/contact", description: "Get in touch with us", relevance: 0 },
  { title: "About", href: "/about", description: "Learn about VisoryX", relevance: 0 },
  { title: "Blog", href: "/blog", description: "Read our latest articles", relevance: 0 },
  { title: "Services - Roblox", href: "/services/roblox", description: "Roblox design services", relevance: 0 },
  { title: "Services - Discord", href: "/services/discord", description: "Discord branding services", relevance: 0 },
  { title: "Case Studies", href: "/case-studies", description: "See our success stories", relevance: 0 },
  { title: "Tools", href: "/tools", description: "Free design tools", relevance: 0 },
  { title: "Designers", href: "/designers", description: "Meet our design team", relevance: 0 },
]

function calculateRelevance(page: PageSuggestion, path: string): number {
  const pathParts = path.toLowerCase().split("/").filter(Boolean)
  const pageParts = page.href.toLowerCase().split("/").filter(Boolean)
  const titleLower = page.title.toLowerCase()
  
  let score = 0
  
  // Check for matching path segments
  pathParts.forEach(part => {
    if (pageParts.some(p => p.includes(part) || part.includes(p))) {
      score += 30
    }
    if (titleLower.includes(part)) {
      score += 20
    }
    if (page.description.toLowerCase().includes(part)) {
      score += 10
    }
  })
  
  return score
}

export function Smart404({ attemptedPath }: { attemptedPath: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PageSuggestion[]>([])
  const [recentPages, setRecentPages] = useState<string[]>([])

  useEffect(() => {
    // Calculate relevance scores
    const scored = allPages.map(page => ({
      ...page,
      relevance: calculateRelevance(page, attemptedPath)
    }))
    
    // Sort by relevance and take top 5
    const sorted = scored.sort((a, b) => b.relevance - a.relevance).slice(0, 5)
    setSuggestions(sorted)

    // Get recent pages from localStorage
    if (typeof window !== "undefined") {
      const recent = JSON.parse(localStorage.getItem("recentPages") || "[]")
      setRecentPages(recent.slice(0, 3))
    }
  }, [attemptedPath])

  const filteredPages = searchQuery
    ? allPages.filter(
        page =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const popularPages = [
    { title: "Portfolio", href: "/portfolio" },
    { title: "Pricing", href: "/pricing" },
    { title: "Order Now", href: "/order" },
  ]

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The page <code className="rounded bg-muted px-2 py-1">{attemptedPath}</code> doesn't exist.
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for a page..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        
        {filteredPages.length > 0 && (
          <Card className="absolute mt-2 w-full z-10">
            <CardContent className="p-2">
              {filteredPages.slice(0, 5).map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-muted"
                >
                  <div>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-muted-foreground">{page.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.some(s => s.relevance > 0) && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Search className="h-5 w-5" />
            Did you mean?
          </h2>
          <div className="space-y-2">
            {suggestions.filter(s => s.relevance > 0).map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
              >
                <div>
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm text-muted-foreground">{page.description}</div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Pages */}
      {recentPages.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5" />
            Recently Visited
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentPages.map((href) => (
              <Link key={href} href={href}>
                <Button variant="outline" size="sm">{href}</Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Pages */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5" />
          Popular Pages
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularPages.map((page) => (
            <Link key={page.href} href={page.href}>
              <Button variant="secondary">{page.title}</Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Go Home */}
      <div className="mt-12 text-center">
        <Link href="/">
          <Button size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
