'use server'

import { createClient } from '@/lib/supabase/server'

export interface ChatSession {
  id: string
  visitor_id: string
  user_id?: string
  agent_id?: string
  status: 'waiting' | 'active' | 'closed' | 'missed'
  department?: string
  subject?: string
  rating?: number
  feedback?: string
  started_at: string
  ended_at?: string
  metadata?: Record<string, any>
}

export interface ChatMessage {
  id: string
  session_id: string
  sender_type: 'visitor' | 'agent' | 'bot'
  sender_id?: string
  sender_name?: string
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  attachment_url?: string
  read_at?: string
  created_at: string
}

// Start new chat session
export async function startChatSession(
  visitorId: string,
  department?: string,
  subject?: string,
  metadata?: Record<string, any>
): Promise<ChatSession> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      visitor_id: visitorId,
      user_id: user?.id,
      department,
      subject,
      status: 'waiting',
      started_at: new Date().toISOString(),
      metadata
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Send welcome message
  await sendChatMessage(data.id, 'bot', 'Hi! Welcome to VisoryX support. An agent will be with you shortly.', 'system')
  
  return data
}

// Send chat message
export async function sendChatMessage(
  sessionId: string,
  senderType: ChatMessage['sender_type'],
  content: string,
  type: ChatMessage['type'] = 'text',
  attachmentUrl?: string
): Promise<ChatMessage> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      sender_type: senderType,
      sender_id: user?.id,
      sender_name: user?.email?.split('@')[0] || 'Visitor',
      content,
      type,
      attachment_url: attachmentUrl
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get chat messages
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Get active chat sessions (for agents)
export async function getActiveChatSessions(): Promise<ChatSession[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .in('status', ['waiting', 'active'])
    .order('started_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Agent claims a chat session
export async function claimChatSession(sessionId: string): Promise<ChatSession> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .update({
      agent_id: user.id,
      status: 'active'
    })
    .eq('id', sessionId)
    .eq('status', 'waiting')
    .select()
    .single()
  
  if (error) throw error
  
  await sendChatMessage(sessionId, 'system', 'An agent has joined the chat.', 'system')
  
  return data
}

// End chat session
export async function endChatSession(
  sessionId: string,
  rating?: number,
  feedback?: string
): Promise<ChatSession> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .update({
      status: 'closed',
      ended_at: new Date().toISOString(),
      rating,
      feedback
    })
    .eq('id', sessionId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get chat statistics
export async function getChatStats(): Promise<{
  total: number
  waiting: number
  active: number
  avgResponseTime: number
  avgRating: number
}> {
  const supabase = await createClient()
  
  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('status, rating, started_at, ended_at')
  
  if (error) throw error
  
  const allSessions = sessions || []
  const waiting = allSessions.filter(s => s.status === 'waiting').length
  const active = allSessions.filter(s => s.status === 'active').length
  
  const ratedSessions = allSessions.filter(s => s.rating)
  const avgRating = ratedSessions.length > 0
    ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length
    : 0
  
  return {
    total: allSessions.length,
    waiting,
    active,
    avgResponseTime: 2.5, // Would need actual timestamps
    avgRating: Math.round(avgRating * 10) / 10
  }
}

// Mark messages as read
export async function markMessagesAsRead(sessionId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('chat_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('session_id', sessionId)
    .is('read_at', null)
  
  if (error) throw error
}

// Get visitor's active session
export async function getVisitorSession(visitorId: string): Promise<ChatSession | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('visitor_id', visitorId)
    .in('status', ['waiting', 'active'])
    .order('started_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) return null
  return data
}
