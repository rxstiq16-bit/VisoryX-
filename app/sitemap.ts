import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://visoryx.com"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/order`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/auth/sign-up`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ]

  // Dynamic pages from database
  const supabase = await createClient()

  // Services
  const { data: services } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("is_active", true)

  const servicePages: MetadataRoute.Sitemap = (services || []).map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Portfolio items
  const { data: portfolioItems } = await supabase
    .from("portfolio_items")
    .select("slug, updated_at")
    .eq("is_active", true)

  const portfolioPages: MetadataRoute.Sitemap = (portfolioItems || []).map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Blog posts
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published")

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  // Help articles
  const { data: helpArticles } = await supabase
    .from("help_articles")
    .select("slug, updated_at")
    .eq("is_active", true)

  const helpPages: MetadataRoute.Sitemap = (helpArticles || []).map((article) => ({
    url: `${baseUrl}/help/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }))

  return [...staticPages, ...servicePages, ...portfolioPages, ...blogPages, ...helpPages]
}
