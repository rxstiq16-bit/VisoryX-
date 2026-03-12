'use server'

import { createClient } from '@/lib/supabase/server'

export interface Survey {
  id: string
  user_id: string
  order_id?: string
  type: 'nps' | 'csat' | 'feedback' | 'exit' | 'onboarding'
  score?: number
  responses: Record<string, any>
  completed_at?: string
  created_at: string
}

export interface SurveyQuestion {
  id: string
  survey_type: string
  question: string
  type: 'rating' | 'text' | 'select' | 'multiselect'
  options?: string[]
  required: boolean
  order: number
}

// Get survey questions by type
export async function getSurveyQuestions(type: string): Promise<SurveyQuestion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('survey_questions')
    .select('*')
    .eq('survey_type', type)
    .order('order', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Submit survey response
export async function submitSurvey(
  type: Survey['type'],
  responses: Record<string, any>,
  orderId?: string,
  score?: number
): Promise<Survey> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('surveys')
    .insert({
      user_id: user.id,
      order_id: orderId,
      type,
      score,
      responses,
      completed_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Award loyalty points for completing survey
  if (type === 'nps' || type === 'csat') {
    await supabase.rpc('add_loyalty_points', {
      p_user_id: user.id,
      p_points: 25,
      p_source: 'survey',
      p_description: `Completed ${type.toUpperCase()} survey`
    })
  }
  
  return data
}

// Get NPS score for dashboard
export async function getNPSScore(): Promise<{
  score: number
  promoters: number
  passives: number
  detractors: number
  total: number
}> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('surveys')
    .select('score')
    .eq('type', 'nps')
    .not('score', 'is', null)
  
  if (error) throw error
  
  const scores = data?.map(s => s.score) || []
  const promoters = scores.filter(s => s >= 9).length
  const passives = scores.filter(s => s >= 7 && s < 9).length
  const detractors = scores.filter(s => s < 7).length
  const total = scores.length
  
  const npsScore = total > 0 
    ? Math.round(((promoters - detractors) / total) * 100)
    : 0
  
  return { score: npsScore, promoters, passives, detractors, total }
}

// Get CSAT score
export async function getCSATScore(): Promise<{
  score: number
  satisfied: number
  neutral: number
  dissatisfied: number
  total: number
}> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('surveys')
    .select('score')
    .eq('type', 'csat')
    .not('score', 'is', null)
  
  if (error) throw error
  
  const scores = data?.map(s => s.score) || []
  const satisfied = scores.filter(s => s >= 4).length
  const neutral = scores.filter(s => s === 3).length
  const dissatisfied = scores.filter(s => s < 3).length
  const total = scores.length
  
  const csatScore = total > 0 
    ? Math.round((satisfied / total) * 100)
    : 0
  
  return { score: csatScore, satisfied, neutral, dissatisfied, total }
}

// Get user's survey history
export async function getUserSurveys(): Promise<Survey[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Check if user needs to complete a survey
export async function checkPendingSurvey(orderId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return false
  
  const { data, error } = await supabase
    .from('surveys')
    .select('id')
    .eq('user_id', user.id)
    .eq('order_id', orderId)
    .eq('type', 'csat')
    .single()
  
  // If no survey exists, one is pending
  return !data && !error
}
