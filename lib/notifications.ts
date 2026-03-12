import { createClient } from '@/lib/supabase/client'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
  metadata: Record<string, unknown> | null
}

export type NotificationType = 
  | 'order_status'
  | 'order_message'
  | 'order_assigned'
  | 'order_delivered'
  | 'payment_received'
  | 'revision_requested'
  | 'review_request'
  | 'loyalty_points'
  | 'referral_reward'
  | 'promo_code'
  | 'system'

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  order_status: 'package',
  order_message: 'message-circle',
  order_assigned: 'user-check',
  order_delivered: 'check-circle',
  payment_received: 'credit-card',
  revision_requested: 'edit',
  review_request: 'star',
  loyalty_points: 'gift',
  referral_reward: 'users',
  promo_code: 'tag',
  system: 'bell'
}

// Fetch notifications for the current user
export async function getNotifications(options?: {
  limit?: number
  offset?: number
  unreadOnly?: boolean
}): Promise<Notification[]> {
  const supabase = createClient()
  if (!supabase) return []
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (options?.unreadOnly) {
    query = query.eq('read', false)
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
  
  return data || []
}

// Get unread notification count
export async function getUnreadCount(): Promise<number> {
  const supabase = createClient()
  if (!supabase) return 0
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0
  
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)
  
  if (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
  
  return count || 0
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  
  if (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
  
  return true
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)
  
  if (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
  
  return true
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
  
  if (error) {
    console.error('Error deleting notification:', error)
    return false
  }
  
  return true
}

// Create a notification (typically called from server-side or admin)
export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<Notification | null> {
  const supabase = createClient()
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      ...notification,
      read: false
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating notification:', error)
    return null
  }
  
  return data
}

// Subscribe to real-time notifications
export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: Notification) => void
): () => void {
  const supabase = createClient()
  if (!supabase) return () => {}
  
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        onNotification(payload.new as Notification)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}

// Get notification preferences
export async function getNotificationPreferences(): Promise<Record<string, boolean>> {
  const supabase = createClient()
  if (!supabase) return {}
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('notification_preferences')
    .eq('id', user.id)
    .single()
  
  if (error || !data) {
    return {
      email_order_updates: true,
      email_marketing: false,
      push_order_updates: true,
      push_messages: true
    }
  }
  
  return data.notification_preferences || {}
}

// Update notification preferences
export async function updateNotificationPreferences(
  preferences: Record<string, boolean>
): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { error } = await supabase
    .from('user_profiles')
    .update({ notification_preferences: preferences })
    .eq('id', user.id)
  
  if (error) {
    console.error('Error updating notification preferences:', error)
    return false
  }
  
  return true
}
