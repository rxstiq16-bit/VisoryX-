import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const offset = (page - 1) * limit

  let query = supabase
    .from("community_posts")
    .select(`
      *,
      author:profiles(id, full_name, avatar_url, username),
      likes:community_likes(count),
      comments:community_comments(count)
    `, { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data: posts, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, category, images, tags } = body

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: user.id,
      title,
      content,
      category,
      images: images || [],
      tags: tags || [],
      status: "published",
    })
    .select(`
      *,
      author:profiles(id, full_name, avatar_url, username)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ post })
}
