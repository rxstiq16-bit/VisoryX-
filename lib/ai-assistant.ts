'use server'

import { createClient } from '@/lib/supabase/server'

export interface AIConversation {
  id: string
  user_id: string
  title: string
  messages: AIMessage[]
  context?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    suggestions?: string[]
    actions?: { label: string; action: string }[]
  }
}

// AI response templates for common queries
const AI_RESPONSES: Record<string, { response: string; suggestions?: string[] }> = {
  pricing: {
    response: "Our pricing varies by service type. Here's a quick overview:\n\n• **Logos**: Starting at $25\n• **Banners**: Starting at $15\n• **GFX Renders**: Starting at $35\n• **Thumbnails**: Starting at $10\n• **Full Branding Packages**: Starting at $100\n\nWould you like me to help you find the perfect service for your needs?",
    suggestions: ['View all services', 'Get a custom quote', 'Compare packages']
  },
  turnaround: {
    response: "Our standard turnaround times are:\n\n• **Rush (24-48 hours)**: +50% fee\n• **Standard (3-5 days)**: No extra fee\n• **Economy (7-10 days)**: 10% discount\n\nThe exact time depends on the complexity of your project. Would you like to know more about our rush services?",
    suggestions: ['Rush order info', 'Check current queue', 'Start an order']
  },
  revisions: {
    response: "All our services include free revisions:\n\n• **Basic Tier**: 1 revision included\n• **Standard Tier**: 2 revisions included\n• **Premium Tier**: Unlimited revisions\n\nAdditional revisions beyond your tier allowance are available for a small fee.",
    suggestions: ['View service tiers', 'Request a revision', 'Contact support']
  },
  refund: {
    response: "Our refund policy is customer-friendly:\n\n• **Before work starts**: Full refund\n• **During production**: Partial refund based on progress\n• **After delivery**: Case-by-case basis\n\nIf you're not satisfied with your order, please contact our support team and we'll work to make it right!",
    suggestions: ['Contact support', 'View order status', 'Request revision instead']
  },
  default: {
    response: "I'm here to help! I can assist you with:\n\n• Service information and pricing\n• Order status and tracking\n• Account and billing questions\n• Technical support\n• Getting started tips\n\nWhat would you like to know more about?",
    suggestions: ['Browse services', 'Check order status', 'Contact human support']
  }
}

// Get AI response based on user message
export async function getAIResponse(
  message: string,
  conversationHistory: AIMessage[] = [],
  context?: Record<string, any>
): Promise<AIMessage> {
  const lowerMessage = message.toLowerCase()
  
  // Simple keyword matching for demo (would be replaced with actual AI)
  let responseData = AI_RESPONSES.default
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    responseData = AI_RESPONSES.pricing
  } else if (lowerMessage.includes('turnaround') || lowerMessage.includes('how long') || lowerMessage.includes('time')) {
    responseData = AI_RESPONSES.turnaround
  } else if (lowerMessage.includes('revision') || lowerMessage.includes('change') || lowerMessage.includes('edit')) {
    responseData = AI_RESPONSES.revisions
  } else if (lowerMessage.includes('refund') || lowerMessage.includes('money back') || lowerMessage.includes('cancel')) {
    responseData = AI_RESPONSES.refund
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    responseData = {
      response: "Hello! Welcome to VisoryX. I'm your AI assistant and I'm here to help you with any questions about our design services. How can I assist you today?",
      suggestions: ['Browse services', 'Get pricing info', 'Track my order']
    }
  } else if (lowerMessage.includes('order') && lowerMessage.includes('status')) {
    responseData = {
      response: "To check your order status, you can:\n\n1. Go to your Dashboard and click on 'Orders'\n2. Use the order ID from your confirmation email\n3. Contact support with your order details\n\nWould you like me to help you navigate to your orders?",
      suggestions: ['Go to dashboard', 'Contact support', 'View order history']
    }
  } else if (lowerMessage.includes('thank')) {
    responseData = {
      response: "You're welcome! Is there anything else I can help you with today?",
      suggestions: ['No, that\'s all', 'I have another question', 'Contact human support']
    }
  }
  
  return {
    role: 'assistant',
    content: responseData.response,
    timestamp: new Date().toISOString(),
    metadata: {
      suggestions: responseData.suggestions
    }
  }
}

// Save conversation
export async function saveConversation(
  title: string,
  messages: AIMessage[]
): Promise<AIConversation> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: user.id,
      title,
      messages
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get user conversations
export async function getUserConversations(): Promise<AIConversation[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return []
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
  
  if (error) return []
  return data || []
}

// Get conversation by ID
export async function getConversation(id: string): Promise<AIConversation | null> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  
  if (error) return null
  return data
}

// Delete conversation
export async function deleteConversation(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('ai_conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
}

// Update conversation
export async function updateConversation(
  id: string,
  messages: AIMessage[]
): Promise<AIConversation> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .update({
      messages,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}
