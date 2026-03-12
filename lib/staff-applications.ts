'use server'

import { createClient } from '@/lib/supabase/server'

export interface StaffApplication {
  id: string
  user_id?: string
  name: string
  email: string
  position: 'designer' | 'moderator' | 'support' | 'marketing'
  portfolio_url?: string
  resume_url?: string
  experience_years: number
  skills: string[]
  availability: 'full_time' | 'part_time' | 'freelance'
  timezone: string
  rate_expectation?: number
  cover_letter?: string
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected'
  reviewer_id?: string
  reviewer_notes?: string
  interview_date?: string
  created_at: string
  updated_at: string
}

// Submit staff application
export async function submitStaffApplication(
  application: Omit<StaffApplication, 'id' | 'status' | 'reviewer_id' | 'reviewer_notes' | 'created_at' | 'updated_at'>
): Promise<StaffApplication> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check for existing application
  const { data: existing } = await supabase
    .from('staff_applications')
    .select('id')
    .eq('email', application.email)
    .in('status', ['pending', 'reviewing', 'interview'])
    .single()
  
  if (existing) {
    throw new Error('You already have an active application')
  }
  
  const { data, error } = await supabase
    .from('staff_applications')
    .insert({
      ...application,
      user_id: user?.id,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get all applications (admin)
export async function getStaffApplications(
  status?: StaffApplication['status'],
  position?: StaffApplication['position']
): Promise<StaffApplication[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('staff_applications')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (position) {
    query = query.eq('position', position)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

// Get single application
export async function getStaffApplication(id: string): Promise<StaffApplication | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('staff_applications')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

// Update application status (admin)
export async function updateApplicationStatus(
  applicationId: string,
  status: StaffApplication['status'],
  notes?: string
): Promise<StaffApplication> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('staff_applications')
    .update({
      status,
      reviewer_id: user.id,
      reviewer_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single()
  
  if (error) throw error
  
  // TODO: Send email notification to applicant
  
  return data
}

// Schedule interview
export async function scheduleInterview(
  applicationId: string,
  interviewDate: string
): Promise<StaffApplication> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('staff_applications')
    .update({
      status: 'interview',
      interview_date: interviewDate,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get application statistics
export async function getApplicationStats(): Promise<{
  total: number
  pending: number
  reviewing: number
  interview: number
  accepted: number
  rejected: number
  byPosition: { position: string; count: number }[]
}> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('staff_applications')
    .select('status, position')
  
  if (error) throw error
  
  const applications = data || []
  
  const byPosition = new Map<string, number>()
  applications.forEach(a => {
    byPosition.set(a.position, (byPosition.get(a.position) || 0) + 1)
  })
  
  return {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    byPosition: Array.from(byPosition.entries()).map(([position, count]) => ({ position, count }))
  }
}

// Check user's application status
export async function checkMyApplicationStatus(): Promise<StaffApplication | null> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null
  
  const { data, error } = await supabase
    .from('staff_applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) return null
  return data
}
