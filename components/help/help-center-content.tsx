'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  Rocket,
  ShoppingCart,
  CreditCard,
  RefreshCw,
  User,
  Gift,
  Link2,
  HelpCircle,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react'

const CATEGORIES = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using VisoryX',
    icon: Rocket,
    articleCount: 8
  },
  {
    slug: 'placing-orders',
    name: 'Placing Orders',
    description: 'How to order design services',
    icon: ShoppingCart,
    articleCount: 12
  },
  {
    slug: 'payments-billing',
    name: 'Payments & Billing',
    description: 'Payment methods, invoices, and refunds',
    icon: CreditCard,
    articleCount: 10
  },
  {
    slug: 'revisions-feedback',
    name: 'Revisions & Feedback',
    description: 'How to request changes to your designs',
    icon: RefreshCw,
    articleCount: 6
  },
  {
    slug: 'account-profile',
    name: 'Account & Profile',
    description: 'Managing your VisoryX account',
    icon: User,
    articleCount: 9
  },
  {
    slug: 'loyalty-rewards',
    name: 'Loyalty & Rewards',
    description: 'Earn points and unlock benefits',
    icon: Gift,
    articleCount: 7
  },
  {
    slug: 'integrations',
    name: 'Integrations',
    description: 'Connect Discord, Roblox, and more',
    icon: Link2,
    articleCount: 5
  },
  {
    slug: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: HelpCircle,
    articleCount: 11
  }
]

const POPULAR_ARTICLES = [
  {
    title: 'How to place your first order',
    slug: 'how-to-place-first-order',
    category: 'Getting Started',
    views: 2543
  },
  {
    title: 'Understanding turnaround times',
    slug: 'understanding-turnaround-times',
    category: 'Placing Orders',
    views: 1892
  },
  {
    title: 'How to request revisions',
    slug: 'how-to-request-revisions',
    category: 'Revisions & Feedback',
    views: 1654
  },
  {
    title: 'Payment methods accepted',
    slug: 'payment-methods-accepted',
    category: 'Payments & Billing',
    views: 1432
  },
  {
    title: 'How to connect your Discord account',
    slug: 'connect-discord-account',
    category: 'Integrations',
    views: 1287
  },
  {
    title: 'Earning and redeeming loyalty points',
    slug: 'loyalty-points-guide',
    category: 'Loyalty & Rewards',
    views: 1156
  }
]

export function HelpCenterContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof POPULAR_ARTICLES>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true)
      // Simulate search - in production this would call the API
      const results = POPULAR_ARTICLES.filter(
        article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(results)
      setIsSearching(false)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            Help Center
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            How can we help you?
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Search our knowledge base or browse categories to find answers
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-xl border-primary/20 bg-background pl-12 pr-4 text-lg shadow-lg focus-visible:ring-primary"
            />

            {/* Search Results Dropdown */}
            {searchQuery.length > 2 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border bg-background p-2 shadow-xl">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/help/article/${article.slug}`}
                        className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-medium text-foreground">{article.title}</p>
                          <p className="text-sm text-muted-foreground">{article.category}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No articles found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 text-2xl font-bold text-foreground">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.slug} href={`/help/category/${category.slug}`}>
                <Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.articleCount} articles
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Popular Articles</h2>
          <Button variant="ghost" asChild>
            <Link href="/help/all-articles">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ARTICLES.map((article) => (
            <Link key={article.slug} href={`/help/article/${article.slug}`}>
              <Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {article.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <MessageCircle className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-foreground">
                Can't find what you're looking for?
              </h3>
              <p className="text-muted-foreground">
                Our support team is here to help. Create a ticket or chat with us directly.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/tickets/new">Create a Ticket</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://discord.gg/visoryx" target="_blank">
                  Join Discord
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
