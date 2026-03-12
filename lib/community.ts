'use server'

import { createClient } from '@/lib/supabase/server'

export interface ForumPost {
  id: string
  user_id: string
  author_name: string
  author_avatar?: string
  category: 'general' | 'showcase' | 'help' | 'feedback' | 'announcements'
  title: string
  content: string
  tags: string[]
  is_pinned: boolean
  is_locked: boolean
  views: number
  likes: number
  reply_count: number
  last_reply_at?: string
  created_at: string
  updated_at: string
}

export interface ForumReply {
  id: string
  post_id: string
  user_id: string
  author_name: string
  author_avatar?: string
  content: string
  likes: number
  is_solution: boolean
  parent_reply_id?: string
  created_at: string
  updated_at: string
}

// Get forum posts
export async function getForumPosts(
  category?: ForumPost['category'],
  page: number = 1,
  limit: number = 20
): Promise<{ posts: ForumPost[]; total: number }> {
  const supabase = await createClient()
  
  let query = supabase
    .from('forum_posts')
    .select('*', { count: 'exact' })
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, count, error } = await query
  
  if (error) throw error
  return { posts: data || [], total: count || 0 }
}

// Get single post with replies
export async function getForumPost(postId: string): Promise<{
  post: ForumPost
  replies: ForumReply[]
} | null> {
  const supabase = await createClient()
  
  // Increment view count
  await supabase.rpc('increment_post_views', { post_id: postId })
  
  const [postResult, repliesResult] = await Promise.all([
    supabase.from('forum_posts').select('*').eq('id', postId).single(),
    supabase.from('forum_replies').select('*').eq('post_id', postId).order('created_at', { ascending: true })
  ])
  
  if (postResult.error) return null
  
  return {
    post: postResult.data,
    replies: repliesResult.data || []
  }
}

// Create forum post
export async function createForumPost(
  title: string,
  content: string,
  category: ForumPost['category'],
  tags: string[] = []
): Promise<ForumPost> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single()
  
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      user_id: user.id,
      author_name: profile?.display_name || user.email?.split('@')[0] || 'Anonymous',
      author_avatar: profile?.avatar_url,
      category,
      title,
      content,
      tags,
      views: 0,
      likes: 0,
      reply_count: 0
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Create reply
export async function createForumReply(
  postId: string,
  content: string,
  parentReplyId?: string
): Promise<ForumReply> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single()
  
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({
      post_id: postId,
      user_id: user.id,
      author_name: profile?.display_name || user.email?.split('@')[0] || 'Anonymous',
      author_avatar: profile?.avatar_url,
      content,
      likes: 0,
      parent_reply_id: parentReplyId
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Update reply count
  await supabase.rpc('increment_reply_count', { post_id: postId })
  
  return data
}

// Like post
export async function likePost(postId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  // Check if already liked
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()
  
  if (existing) {
    // Unlike
    await supabase.from('post_likes').delete().eq('id', existing.id)
    await supabase.rpc('decrement_post_likes', { post_id: postId })
  } else {
    // Like
    await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    await supabase.rpc('increment_post_likes', { post_id: postId })
  }
}

// Mark reply as solution
export async function markAsSolution(postId: string, replyId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  // Check if user is post author
  const { data: post } = await supabase
    .from('forum_posts')
    .select('user_id')
    .eq('id', postId)
    .single()
  
  if (post?.user_id !== user.id) {
    throw new Error('Only post author can mark solution')
  }
  
  // Unmark any existing solutions
  await supabase
    .from('forum_replies')
    .update({ is_solution: false })
    .eq('post_id', postId)
  
  // Mark new solution
  await supabase
    .from('forum_replies')
    .update({ is_solution: true })
    .eq('id', replyId)
}

// Search posts
export async function searchPosts(query: string): Promise<ForumPost[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (error) throw error
  return data || []
}

// Get trending posts
export async function getTrendingPosts(limit: number = 5): Promise<ForumPost[]> {
  const supabase = await createClient()
  
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .gte('created_at', weekAgo.toISOString())
    .order('views', { ascending: false })
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}
