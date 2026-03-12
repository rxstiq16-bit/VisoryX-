'use server'

import { createClient } from '@/lib/supabase/server'

export interface TimeEntry {
  id: string
  user_id: string
  order_id?: string
  task_type: 'design' | 'revision' | 'communication' | 'admin' | 'other'
  description?: string
  started_at: string
  ended_at?: string
  duration_minutes?: number
  is_billable: boolean
  hourly_rate?: number
  created_at: string
}

export interface TimeStats {
  totalHours: number
  billableHours: number
  nonBillableHours: number
  byTaskType: { type: string; hours: number }[]
  byDay: { date: string; hours: number }[]
  earnings: number
}

// Start time tracking
export async function startTimeEntry(
  taskType: TimeEntry['task_type'],
  orderId?: string,
  description?: string
): Promise<TimeEntry> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  // End any existing active entries
  await supabase
    .from('time_entries')
    .update({
      ended_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .is('ended_at', null)
  
  const { data, error } = await supabase
    .from('time_entries')
    .insert({
      user_id: user.id,
      order_id: orderId,
      task_type: taskType,
      description,
      started_at: new Date().toISOString(),
      is_billable: taskType !== 'admin'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Stop time tracking
export async function stopTimeEntry(entryId: string): Promise<TimeEntry> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data: entry } = await supabase
    .from('time_entries')
    .select('started_at')
    .eq('id', entryId)
    .eq('user_id', user.id)
    .single()
  
  if (!entry) throw new Error('Entry not found')
  
  const startTime = new Date(entry.started_at).getTime()
  const endTime = Date.now()
  const durationMinutes = Math.round((endTime - startTime) / 60000)
  
  const { data, error } = await supabase
    .from('time_entries')
    .update({
      ended_at: new Date().toISOString(),
      duration_minutes: durationMinutes
    })
    .eq('id', entryId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get active time entry
export async function getActiveTimeEntry(): Promise<TimeEntry | null> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null
  
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) return null
  return data
}

// Get time entries for a period
export async function getTimeEntries(
  startDate: string,
  endDate: string,
  userId?: string
): Promise<TimeEntry[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  let query = supabase
    .from('time_entries')
    .select('*')
    .gte('started_at', startDate)
    .lte('started_at', endDate)
    .order('started_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  } else {
    query = query.eq('user_id', user.id)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

// Get time stats
export async function getTimeStats(
  startDate: string,
  endDate: string,
  userId?: string
): Promise<TimeStats> {
  const entries = await getTimeEntries(startDate, endDate, userId)
  
  const totalMinutes = entries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0)
  const billableMinutes = entries
    .filter(e => e.is_billable)
    .reduce((sum, e) => sum + (e.duration_minutes || 0), 0)
  
  // Group by task type
  const byTaskTypeMap = new Map<string, number>()
  entries.forEach(e => {
    const current = byTaskTypeMap.get(e.task_type) || 0
    byTaskTypeMap.set(e.task_type, current + (e.duration_minutes || 0))
  })
  
  const byTaskType = Array.from(byTaskTypeMap.entries())
    .map(([type, minutes]) => ({ type, hours: Math.round(minutes / 60 * 10) / 10 }))
  
  // Group by day
  const byDayMap = new Map<string, number>()
  entries.forEach(e => {
    const date = e.started_at.split('T')[0]
    const current = byDayMap.get(date) || 0
    byDayMap.set(date, current + (e.duration_minutes || 0))
  })
  
  const byDay = Array.from(byDayMap.entries())
    .map(([date, minutes]) => ({ date, hours: Math.round(minutes / 60 * 10) / 10 }))
    .sort((a, b) => a.date.localeCompare(b.date))
  
  // Calculate earnings
  const earnings = entries
    .filter(e => e.is_billable && e.hourly_rate)
    .reduce((sum, e) => sum + ((e.duration_minutes || 0) / 60) * (e.hourly_rate || 0), 0)
  
  return {
    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
    billableHours: Math.round(billableMinutes / 60 * 10) / 10,
    nonBillableHours: Math.round((totalMinutes - billableMinutes) / 60 * 10) / 10,
    byTaskType,
    byDay,
    earnings: Math.round(earnings * 100) / 100
  }
}

// Manual time entry
export async function addManualTimeEntry(
  taskType: TimeEntry['task_type'],
  startedAt: string,
  durationMinutes: number,
  orderId?: string,
  description?: string,
  isBillable: boolean = true
): Promise<TimeEntry> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const startTime = new Date(startedAt)
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000)
  
  const { data, error } = await supabase
    .from('time_entries')
    .insert({
      user_id: user.id,
      order_id: orderId,
      task_type: taskType,
      description,
      started_at: startTime.toISOString(),
      ended_at: endTime.toISOString(),
      duration_minutes: durationMinutes,
      is_billable: isBillable
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete time entry
export async function deleteTimeEntry(entryId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id)
  
  if (error) throw error
}
