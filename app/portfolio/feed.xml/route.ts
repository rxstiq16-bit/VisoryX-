import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://visoryx.design"

  const { data: projects } = await supabase
    .from("portfolio_items")
    .select("id, title, slug, description, thumbnail_url, category, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50)

  const rssItems = projects?.map(project => `
    <item>
      <title><![CDATA[${project.title}]]></title>
      <link>${siteUrl}/portfolio/${project.slug}</link>
      <guid isPermaLink="true">${siteUrl}/portfolio/${project.slug}</guid>
      <description><![CDATA[${project.description || ""}]]></description>
      <category>${project.category}</category>
      <pubDate>${new Date(project.created_at).toUTCString()}</pubDate>
      ${project.thumbnail_url ? `<enclosure url="${project.thumbnail_url}" type="image/jpeg" />` : ""}
    </item>
  `).join("") || ""

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>VisoryX Design Portfolio</title>
    <link>${siteUrl}/portfolio</link>
    <description>Latest design work from the VisoryX team - Roblox GFX, Discord branding, logos, and more</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/portfolio/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>VisoryX Design Portfolio</title>
      <link>${siteUrl}/portfolio</link>
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
