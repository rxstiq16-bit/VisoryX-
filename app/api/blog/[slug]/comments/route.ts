import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .single()

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const { data: comments } = await supabase
    .from("blog_comments")
    .select(`
      id,
      content,
      created_at,
      updated_at,
      likes,
      parent_id,
      author:profiles!blog_comments_user_id_fkey(id, full_name, avatar_url)
    `)
    .eq("post_id", post.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true })

  // Get current user's likes
  const { data: { user } } = await supabase.auth.getUser()
  let userLikes: string[] = []
  
  if (user) {
    const { data: likes } = await supabase
      .from("blog_comment_likes")
      .select("comment_id")
      .eq("user_id", user.id)
    userLikes = likes?.map(l => l.comment_id) || []
  }

  // Build nested comment structure
  const commentMap = new Map()
  const rootComments: any[] = []

  comments?.forEach(comment => {
    const formatted = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      likes: comment.likes || 0,
      liked: userLikes.includes(comment.id),
      isEdited: comment.updated_at !== comment.created_at,
      author: {
        id: comment.author?.id,
        name: comment.author?.full_name || "Anonymous",
        avatar: comment.author?.avatar_url,
      },
      replies: [],
    }
    commentMap.set(comment.id, formatted)

    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies.push(formatted)
      }
    } else {
      rootComments.push(formatted)
    }
  })

  return NextResponse.json({ comments: rootComments })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content, parentId } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content required" }, { status: 400 })
  }

  const { data: post } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .single()

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const { data: comment, error } = await supabase
    .from("blog_comments")
    .insert({
      post_id: post.id,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
      status: "approved", // Or "pending" for moderation
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comment })
}
