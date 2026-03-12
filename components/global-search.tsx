"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Package, 
  FileText, 
  Image, 
  HelpCircle, 
  Settings, 
  User, 
  CreditCard,
  Users,
  LayoutDashboard,
  MessageCircle,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'order' | 'portfolio' | 'blog' | 'help' | 'page'
  title: string
  description?: string
  href: string
  icon: React.ElementType
  meta?: string
}

const QUICK_LINKS: SearchResult[] = [
  { id: 'dashboard', type: 'page', title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'orders', type: 'page', title: 'My Orders', href: '/dashboard/orders', icon: Package },
  { id: 'new-order', type: 'page', title: 'Place New Order', href: '/order', icon: FileText },
  { id: 'portfolio', type: 'page', title: 'Portfolio', href: '/portfolio', icon: Image },
  { id: 'services', type: 'page', title: 'Services', href: '/services', icon: Star },
  { id: 'support', type: 'page', title: 'Support', href: '/support', icon: MessageCircle },
  { id: 'settings', type: 'page', title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { id: 'profile', type: 'page', title: 'Profile', href: '/dashboard/profile', icon: User },
]

const HELP_ARTICLES: SearchResult[] = [
  { id: 'help-1', type: 'help', title: 'How to place an order', href: '/help/ordering', icon: HelpCircle, description: 'Step-by-step guide' },
  { id: 'help-2', type: 'help', title: 'Payment methods', href: '/help/payments', icon: CreditCard, description: 'Accepted payment options' },
  { id: 'help-3', type: 'help', title: 'Revision policy', href: '/help/revisions', icon: Clock, description: 'How revisions work' },
  { id: 'help-4', type: 'help', title: 'Refund policy', href: '/help/refunds', icon: FileText, description: 'Our refund guidelines' },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<NodeJS.Timeout>()

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('visoryx-recent-searches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const searchOrders = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    const supabase = createClient()
    if (!supabase) return []

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: orders } = await supabase
      .from('orders')
      .select('id, customer_name, service_type, status, created_at')
      .or(`customer_name.ilike.%${searchQuery}%,service_type.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`)
      .limit(5)

    return (orders || []).map(order => ({
      id: order.id,
      type: 'order' as const,
      title: `Order #${order.id.slice(0, 8).toUpperCase()}`,
      description: order.service_type,
      href: `/dashboard/orders/${order.id}`,
      icon: Package,
      meta: order.status
    }))
  }, [])

  const searchPortfolio = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    const supabase = createClient()
    if (!supabase) return []

    const { data: items } = await supabase
      .from('portfolio_items')
      .select('id, title, category')
      .or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
      .limit(5)

    return (items || []).map(item => ({
      id: item.id,
      type: 'portfolio' as const,
      title: item.title,
      description: item.category,
      href: `/portfolio/${item.id}`,
      icon: Image
    }))
  }, [])

  const searchBlog = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    const supabase = createClient()
    if (!supabase) return []

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, slug')
      .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
      .eq('published', true)
      .limit(5)

    return (posts || []).map(post => ({
      id: post.id,
      type: 'blog' as const,
      title: post.title,
      description: post.excerpt,
      href: `/blog/${post.slug}`,
      icon: FileText
    }))
  }, [])

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      // Search in parallel
      const [orders, portfolio, blog] = await Promise.all([
        searchOrders(searchQuery),
        searchPortfolio(searchQuery),
        searchBlog(searchQuery)
      ])

      // Filter quick links and help articles
      const filteredQuickLinks = QUICK_LINKS.filter(
        link => link.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      const filteredHelp = HELP_ARTICLES.filter(
        article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setResults([
        ...orders,
        ...portfolio,
        ...blog,
        ...filteredQuickLinks.map(l => ({ ...l, type: 'page' as const })),
        ...filteredHelp
      ])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [searchOrders, searchPortfolio, searchBlog])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, handleSearch])

  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    const newRecent = [result, ...recentSearches.filter(r => r.id !== result.id)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem('visoryx-recent-searches', JSON.stringify(newRecent))

    // Navigate
    setOpen(false)
    setQuery('')
    router.push(result.href)
  }

  const groupedResults = {
    orders: results.filter(r => r.type === 'order'),
    portfolio: results.filter(r => r.type === 'portfolio'),
    blog: results.filter(r => r.type === 'blog'),
    pages: results.filter(r => r.type === 'page'),
    help: results.filter(r => r.type === 'help'),
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search orders, portfolio, help..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoading && !query && recentSearches.length > 0 && (
            <CommandGroup heading="Recent">
              {recentSearches.map((result) => (
                <CommandItem
                  key={`recent-${result.id}`}
                  value={result.title}
                  onSelect={() => handleSelect(result)}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{result.title}</span>
                  {result.description && (
                    <span className="ml-2 text-muted-foreground">{result.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isLoading && !query && (
            <>
              <CommandGroup heading="Quick Links">
                {QUICK_LINKS.slice(0, 6).map((link) => (
                  <CommandItem
                    key={link.id}
                    value={link.title}
                    onSelect={() => handleSelect(link)}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    <span>{link.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Help & Support">
                {HELP_ARTICLES.slice(0, 3).map((article) => (
                  <CommandItem
                    key={article.id}
                    value={article.title}
                    onSelect={() => handleSelect(article)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>{article.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {!isLoading && query && results.length === 0 && (
            <CommandEmpty>
              <div className="flex flex-col items-center py-6">
                <Search className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No results found for &quot;{query}&quot;</p>
              </div>
            </CommandEmpty>
          )}

          {!isLoading && query && groupedResults.orders.length > 0 && (
            <CommandGroup heading="Orders">
              {groupedResults.orders.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description}`}
                  onSelect={() => handleSelect(result)}
                >
                  <Package className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <span>{result.title}</span>
                      {result.description && (
                        <span className="ml-2 text-muted-foreground">{result.description}</span>
                      )}
                    </div>
                    {result.meta && (
                      <span className="text-xs capitalize text-muted-foreground">{result.meta}</span>
                    )}
                  </div>
                  <ArrowRight className="ml-2 h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isLoading && query && groupedResults.portfolio.length > 0 && (
            <CommandGroup heading="Portfolio">
              {groupedResults.portfolio.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description}`}
                  onSelect={() => handleSelect(result)}
                >
                  <Image className="mr-2 h-4 w-4" />
                  <span>{result.title}</span>
                  {result.description && (
                    <span className="ml-2 text-muted-foreground">{result.description}</span>
                  )}
                  <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isLoading && query && groupedResults.blog.length > 0 && (
            <CommandGroup heading="Blog">
              {groupedResults.blog.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description}`}
                  onSelect={() => handleSelect(result)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{result.title}</span>
                  <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isLoading && query && groupedResults.pages.length > 0 && (
            <CommandGroup heading="Pages">
              {groupedResults.pages.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.title}
                  onSelect={() => handleSelect(result)}
                >
                  <result.icon className="mr-2 h-4 w-4" />
                  <span>{result.title}</span>
                  <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isLoading && query && groupedResults.help.length > 0 && (
            <CommandGroup heading="Help Articles">
              {groupedResults.help.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description}`}
                  onSelect={() => handleSelect(result)}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <div>
                    <span>{result.title}</span>
                    {result.description && (
                      <span className="ml-2 text-muted-foreground text-xs">{result.description}</span>
                    )}
                  </div>
                  <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
