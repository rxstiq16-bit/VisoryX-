import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://visoryx.design"

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, published_at, author:profiles!blog_posts_author_id_fkey(full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50)

  const rssItems = posts?.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <author>${post.author?.full_name || "VisoryX Team"}</author>
    </item>
  `).join("") || ""

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>VisoryX Design Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Design tips, tutorials, and news from the VisoryX team</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>VisoryX Design Blog</title>
      <link>${siteUrl}/blog</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
