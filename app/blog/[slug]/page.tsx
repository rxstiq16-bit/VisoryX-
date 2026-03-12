"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect, use } from "react"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author_name: string
  author_avatar: string | null
  tags: string[]
  published_at: string
  created_at: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function estimateReadTime(content: string) {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      const supabase = createClient()
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .eq("status", "published")
        .single()
      setPost(data)
      setLoading(false)
    }
    loadPost()
  }, [resolvedParams.slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-24 rounded bg-muted/50" />
              <div className="h-8 w-3/4 rounded bg-muted/50" />
              <div className="h-64 rounded-2xl bg-muted/30" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-muted/30" />
                <div className="h-3 w-5/6 rounded bg-muted/30" />
                <div className="h-3 w-4/5 rounded bg-muted/30" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">
              This blog post doesn't exist or has been removed.
            </p>
            <Button asChild variant="outline">
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Header */}
        <section className="relative pt-32 pb-8 lg:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_60%)]" />
          <div className="mx-auto max-w-3xl px-6 lg:px-8 relative">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>

            {post.tags?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h1
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {estimateReadTime(post.content)} min read
              </span>
            </div>
          </div>
        </section>

        {/* Cover image */}
        {post.cover_image && (
          <div className="mx-auto max-w-4xl px-6 lg:px-8 py-6">
            <div className="overflow-hidden rounded-2xl border border-border/50">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <section className="pb-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <article
              className="prose prose-invert prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
            />

            {/* Divider + CTA */}
            <div className="mt-16 border-t border-border/50 pt-10">
              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <h3 className="text-lg font-bold mb-2">Need design work?</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  VisoryX delivers premium branding, liveries, and marketing designs.
                </p>
                <div className="flex justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link href="/portfolio">View Portfolio</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/order">Start Order</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
