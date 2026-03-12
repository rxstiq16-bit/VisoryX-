"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  author_name: string
  tags: string[]
  published_at: string
  created_at: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function estimateReadTime(excerpt: string | null) {
  const words = (excerpt || "").split(/\s+/).length
  return Math.max(2, Math.ceil(words / 50)) // rough estimate
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { ref, isInView } = useInView()

  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient()
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, author_name, tags, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
      if (data) setPosts(data)
      setLoading(false)
    }
    loadPosts()
  }, [])

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))]
  const filtered = selectedTag
    ? posts.filter((p) => p.tags?.includes(selectedTag))
    : posts

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section ref={ref} className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className={cn(isInView && "animate-reveal-up")}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Blog
              </span>
              <h1
                className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Insights & Updates
              </h1>
              <p className="mt-5 max-w-lg text-muted-foreground leading-relaxed">
                Design tips, industry insights, behind-the-scenes looks at our work, and updates from the VisoryX team.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-32 lg:pb-44">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Tag filter */}
            {allTags.length > 0 && (
              <div className="mb-10 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                    !selectedTag
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-border/50 bg-card p-6">
                    <div className="h-48 rounded-xl bg-muted/50 mb-5" />
                    <div className="h-4 w-2/3 rounded bg-muted/50 mb-3" />
                    <div className="h-3 w-full rounded bg-muted/30 mb-2" />
                    <div className="h-3 w-4/5 rounded bg-muted/30" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Tag className="h-7 w-7 text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {selectedTag
                    ? `No posts tagged with "${selectedTag}". Try another filter.`
                    : "We're working on our first blog posts. Check back soon!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={cn(
                      "group rounded-2xl border border-border/50 bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                      isInView && "animate-reveal-up"
                    )}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {post.cover_image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      {post.tags?.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-balance">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {estimateReadTime(post.excerpt)} min read
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
