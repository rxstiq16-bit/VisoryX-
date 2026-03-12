'use server'

import { createClient } from '@/lib/supabase/server'

export interface WaitlistEntry {
  id: string
  user_id?: string
  email: string
  name?: string
  service_id?: string
  service_name?: string
  priority: number
  position: number
  status: 'waiting' | 'notified' | 'converted' | 'expired'
  notified_at?: string
  converted_at?: string
  expires_at?: string
  metadata?: Record<string, any>
  created_at: string
}

// Join waitlist for a service
export async function joinWaitlist(
  email: string,
  serviceId?: string,
  serviceName?: string,
  name?: string
): Promise<WaitlistEntry> {
  const supabase = await createClient()
  
  // Get current user if authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if already on waitlist
  const { data: existing } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', email)
    .eq('service_id', serviceId || '')
    .eq('status', 'waiting')
    .single()
  
  if (existing) {
    throw new Error('Already on waitlist')
  }
  
  // Get current position count
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('service_id', serviceId || '')
    .eq('status', 'waiting')
  
  const position = (count || 0) + 1
  
  const { data, error } = await supabase
    .from('waitlist')
    .insert({
      user_id: user?.id,
      email,
      name,
      service_id: serviceId,
      service_name: serviceName,
      priority: 0,
      position,
      status: 'waiting'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get waitlist position
export async function getWaitlistPosition(email: string, serviceId?: string): Promise<number | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('waitlist')
    .select('position')
    .eq('email', email)
    .eq('service_id', serviceId || '')
    .eq('status', 'waiting')
    .single()
  
  if (error || !data) return null
  return data.position
}

// Leave waitlist
export async function leaveWaitlist(email: string, serviceId?: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('waitlist')
    .update({ status: 'expired' })
    .eq('email', email)
    .eq('service_id', serviceId || '')
    .eq('status', 'waiting')
  
  if (error) throw error
  
  // Recalculate positions for remaining entries
  await recalculatePositions(serviceId)
}

// Recalculate positions after someone leaves
async function recalculatePositions(serviceId?: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: entries } = await supabase
    .from('waitlist')
    .select('id')
    .eq('service_id', serviceId || '')
    .eq('status', 'waiting')
    .order('created_at', { ascending: true })
  
  if (!entries) return
  
  for (let i = 0; i < entries.length; i++) {
    await supabase
      .from('waitlist')
      .update({ position: i + 1 })
      .eq('id', entries[i].id)
  }
}

// Admin: Notify next person on waitlist
export async function notifyNextOnWaitlist(serviceId?: string): Promise<WaitlistEntry | null> {
  const supabase = await createClient()
  
  const { data: next, error } = await supabase
    .from('waitlist')
    .select('*')
    .eq('service_id', serviceId || '')
    .eq('status', 'waiting')
    .order('priority', { ascending: false })
    .order('position', { ascending: true })
    .limit(1)
    .single()
  
  if (error || !next) return null
  
  // Update status
  const { data: updated } = await supabase
    .from('waitlist')
    .update({
      status: 'notified',
      notified_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
    })
    .eq('id', next.id)
    .select()
    .single()
  
  await recalculatePositions(serviceId)
  
  return updated
}

// Get waitlist stats
export async function getWaitlistStats(serviceId?: string): Promise<{
  total: number
  waiting: number
  notified: number
  converted: number
  expired: number
  avgWaitTime: number
}> {
  const supabase = await createClient()
  
  const baseQuery = serviceId 
    ? supabase.from('waitlist').select('*').eq('service_id', serviceId)
    : supabase.from('waitlist').select('*')
  
  const { data, error } = await baseQuery
  
  if (error || !data) {
    return { total: 0, waiting: 0, notified: 0, converted: 0, expired: 0, avgWaitTime: 0 }
  }
  
  const waiting = data.filter(e => e.status === 'waiting').length
  const notified = data.filter(e => e.status === 'notified').length
  const converted = data.filter(e => e.status === 'converted').length
  const expired = data.filter(e => e.status === 'expired').length
  
  // Calculate average wait time for converted entries
  const convertedEntries = data.filter(e => e.status === 'converted' && e.converted_at)
  const avgWaitTime = convertedEntries.length > 0
    ? convertedEntries.reduce((acc, e) => {
        const created = new Date(e.created_at).getTime()
        const converted = new Date(e.converted_at).getTime()
        return acc + (converted - created)
      }, 0) / convertedEntries.length / (1000 * 60 * 60 * 24) // days
    : 0
  
  return {
    total: data.length,
    waiting,
    notified,
    converted,
    expired,
    avgWaitTime: Math.round(avgWaitTime * 10) / 10
  }
}

// Get user's waitlist entries
export async function getUserWaitlistEntries(): Promise<WaitlistEntry[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return []
  
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}
