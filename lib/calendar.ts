'use server'

import { createClient } from '@/lib/supabase/server'

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  description?: string
  type: 'deadline' | 'meeting' | 'reminder' | 'availability' | 'holiday'
  start_time: string
  end_time?: string
  all_day: boolean
  order_id?: string
  attendees?: string[]
  location?: string
  color?: string
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    interval: number
    until?: string
  }
  reminders?: { minutes_before: number; type: 'email' | 'push' }[]
  created_at: string
}

export interface Availability {
  id: string
  user_id: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string // HH:mm format
  end_time: string
  is_available: boolean
}

// Get events for a date range
export async function getCalendarEvents(
  startDate: string,
  endDate: string,
  userId?: string
): Promise<CalendarEvent[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  let query = supabase
    .from('calendar_events')
    .select('*')
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: true })
  
  if (userId) {
    query = query.eq('user_id', userId)
  } else {
    query = query.eq('user_id', user.id)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

// Create calendar event
export async function createCalendarEvent(
  event: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at'>
): Promise<CalendarEvent> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      ...event,
      user_id: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update calendar event
export async function updateCalendarEvent(
  eventId: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', eventId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete calendar event
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', user.id)
  
  if (error) throw error
}

// Get user availability
export async function getUserAvailability(userId?: string): Promise<Availability[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('user_id', userId || user.id)
    .order('day_of_week', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Set user availability
export async function setUserAvailability(
  availability: Omit<Availability, 'id' | 'user_id'>[]
): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  // Delete existing availability
  await supabase
    .from('availability')
    .delete()
    .eq('user_id', user.id)
  
  // Insert new availability
  const { error } = await supabase
    .from('availability')
    .insert(availability.map(a => ({ ...a, user_id: user.id })))
  
  if (error) throw error
}

// Get order deadlines as calendar events
export async function getOrderDeadlines(
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, deadline, service_name, status, customer_name')
    .gte('deadline', startDate)
    .lte('deadline', endDate)
    .not('status', 'eq', 'completed')
    .not('status', 'eq', 'cancelled')
  
  if (error) throw error
  
  return (orders || []).map(order => ({
    id: `deadline-${order.id}`,
    user_id: user.id,
    title: `Deadline: ${order.service_name}`,
    description: `Order for ${order.customer_name}`,
    type: 'deadline' as const,
    start_time: order.deadline,
    all_day: true,
    order_id: order.id,
    color: '#ef4444',
    created_at: new Date().toISOString()
  }))
}

// Check if time slot is available
export async function isTimeSlotAvailable(
  userId: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const supabase = await createClient()
  
  // Check for conflicting events
  const { data: events } = await supabase
    .from('calendar_events')
    .select('id')
    .eq('user_id', userId)
    .or(`start_time.lt.${endTime},end_time.gt.${startTime}`)
  
  if (events && events.length > 0) return false
  
  // Check availability schedule
  const date = new Date(startTime)
  const dayOfWeek = date.getDay()
  const timeStr = date.toTimeString().slice(0, 5)
  
  const { data: availability } = await supabase
    .from('availability')
    .select('*')
    .eq('user_id', userId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true)
    .lte('start_time', timeStr)
    .gte('end_time', timeStr)
  
  return (availability?.length || 0) > 0
}

// Get upcoming events
export async function getUpcomingEvents(limit: number = 5): Promise<CalendarEvent[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return []
  
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(limit)
  
  if (error) return []
  return data || []
}
