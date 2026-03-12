"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Home, 
  Search, 
  ArrowLeft, 
  FileQuestion, 
  Sparkles,
  ShoppingBag,
  Palette,
  BookOpen,
  Users,
  HelpCircle
} from "lucide-react"

interface SuggestedPage {
  title: string
  description: string
  href: string
  icon: React.ElementType
  relevanceScore: number
}

const allPages: SuggestedPage[] = [
  { title: "Home", description: "Return to the homepage", href: "/", icon: Home, relevanceScore: 0 },
  { title: "Services", description: "Browse our design services", href: "/services", icon: Palette, relevanceScore: 0 },
  { title: "Portfolio", description: "View our work", href: "/portfolio", icon: Sparkles, relevanceScore: 0 },
  { title: "Shop", description: "Browse premade designs", href: "/shop", icon: ShoppingBag, relevanceScore: 0 },
  { title: "Blog", description: "Read our latest articles", href: "/blog", icon: BookOpen, relevanceScore: 0 },
  { title: "About Us", description: "Learn about VisoryX", href: "/about", icon: Users, relevanceScore: 0 },
  { title: "Contact", description: "Get in touch", href: "/contact", icon: HelpCircle, relevanceScore: 0 },
  { title: "FAQ", description: "Frequently asked questions", href: "/faq", icon: HelpCircle, relevanceScore: 0 },
  { title: "Pricing", description: "View our pricing", href: "/pricing", icon: ShoppingBag, relevanceScore: 0 },
  { title: "ERLC Liveries", description: "Emergency vehicle designs", href: "/services/erlc-liveries", icon: Palette, relevanceScore: 0 },
  { title: "Logo Design", description: "Custom logo services", href: "/services/logo-design", icon: Palette, relevanceScore: 0 },
  { title: "Discord Branding", description: "Discord server branding", href: "/services/discord-branding", icon: Palette, relevanceScore: 0 },
]

function calculateRelevance(page: SuggestedPage, pathname: string): number {
  const pathParts = pathname.toLowerCase().split("/").filter(Boolean)
  const pageHrefParts = page.href.toLowerCase().split("/").filter(Boolean)
  const pageTitle = page.title.toLowerCase()
  const pageDescription = page.description.toLowerCase()

  let score = 0

  // Check for matching path segments
  for (const part of pathParts) {
    if (pageHrefParts.some(p => p.includes(part) || part.includes(p))) {
      score += 30
    }
    if (pageTitle.includes(part)) {
      score += 20
    }
    if (pageDescription.includes(part)) {
      score += 10
    }
  }

  // Boost popular pages slightly
  if (["services", "portfolio", "shop"].includes(pageHrefParts[0])) {
    score += 5
  }

  return score
}

export function Smart404() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SuggestedPage[]>([])

  useEffect(() => {
    // Calculate relevance scores based on the attempted URL
    const scored = allPages
      .map(page => ({
        ...page,
        relevanceScore: calculateRelevance(page, pathname),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)

    setSuggestions(scored)
  }, [pathname])

  const filteredPages = searchQuery
    ? allPages.filter(
        page =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestions

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-bold leading-none text-muted-foreground/20">
            404
          </h1>
          <FileQuestion className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-primary" />
        </div>

        <h2 className="mb-2 text-2xl font-bold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          We couldn't find <code className="rounded bg-muted px-2 py-1">{pathname}</code>
        </p>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for a page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            {searchQuery ? "Search Results" : "Did you mean?"}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredPages.slice(0, 6).map((page) => {
              const Icon = page.icon
              return (
                <Link key={page.href} href={page.href}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {page.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Report */}
        <p className="mt-8 text-sm text-muted-foreground">
          Think this is a mistake?{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
            Let us know
          </Link>
        </p>
      </div>
    </div>
  )
}
