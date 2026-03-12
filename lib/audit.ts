'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export interface AuditLog {
  id: string
  user_id?: string
  user_email?: string
  action: string
  resource_type: string
  resource_id?: string
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'login' 
  | 'logout' 
  | 'export' 
  | 'import'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'unassign'
  | 'complete'
  | 'cancel'
  | 'refund'
  | 'send'
  | 'upload'
  | 'download'
  | 'connect'
  | 'disconnect'

export type ResourceType = 
  | 'order'
  | 'user'
  | 'profile'
  | 'review'
  | 'application'
  | 'ticket'
  | 'invoice'
  | 'payment'
  | 'subscription'
  | 'promo_code'
  | 'gift_card'
  | 'referral'
  | 'affiliate'
  | 'integration'
  | 'file'
  | 'message'
  | 'notification'
  | 'setting'
  | 'blog_post'
  | 'help_article'

export async function logAudit(
  action: AuditAction,
  resourceType: ResourceType,
  resourceId?: string,
  options?: {
    userId?: string
    userEmail?: string
    oldValues?: Record<string, unknown>
    newValues?: Record<string, unknown>
    metadata?: Record<string, unknown>
  }
): Promise<void> {
  const supabase = await createClient()
  
  // Get request headers for IP and user agent
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                    headersList.get('x-real-ip') || 
                    'unknown'
  const userAgent = headersList.get('user-agent') || undefined
  
  // Get current user if not provided
  let userId = options?.userId
  let userEmail = options?.userEmail
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id
    userEmail = user?.email
  }
  
  const { error } = await supabase.from('audit_logs').insert({
    user_id: userId,
    user_email: userEmail,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    old_values: options?.oldValues,
    new_values: options?.newValues,
    ip_address: ipAddress,
    user_agent: userAgent,
    metadata: options?.metadata
  })
  
  if (error) {
    console.error('Error creating audit log:', error)
  }
}

export async function getAuditLogs(
  filters?: {
    userId?: string
    resourceType?: ResourceType
    resourceId?: string
    action?: AuditAction
    startDate?: string
    endDate?: string
  },
  limit: number = 100,
  offset: number = 0
): Promise<{ logs: AuditLog[]; total: number }> {
  const supabase = await createClient()
  
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId)
  }
  
  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType)
  }
  
  if (filters?.resourceId) {
    query = query.eq('resource_id', filters.resourceId)
  }
  
  if (filters?.action) {
    query = query.eq('action', filters.action)
  }
  
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate)
  }
  
  const { data, error, count } = await query
  
  if (error) {
    console.error('Error fetching audit logs:', error)
    return { logs: [], total: 0 }
  }
  
  return { logs: data || [], total: count || 0 }
}

export async function getResourceAuditHistory(
  resourceType: ResourceType,
  resourceId: string
): Promise<AuditLog[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching resource audit history:', error)
    return []
  }
  
  return data || []
}

export async function getUserAuditHistory(userId: string, limit: number = 50): Promise<AuditLog[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching user audit history:', error)
    return []
  }
  
  return data || []
}

export async function getRecentActivity(limit: number = 20): Promise<AuditLog[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
  
  return data || []
}

export async function getAuditStats(days: number = 30): Promise<{
  totalActions: number
  byAction: Record<string, number>
  byResourceType: Record<string, number>
  topUsers: { user_id: string; user_email: string; count: number }[]
}> {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('action, resource_type, user_id, user_email')
    .gte('created_at', startDate.toISOString())
  
  if (error || !data) {
    return {
      totalActions: 0,
      byAction: {},
      byResourceType: {},
      topUsers: []
    }
  }
  
  const byAction: Record<string, number> = {}
  const byResourceType: Record<string, number> = {}
  const userCounts: Record<string, { email: string; count: number }> = {}
  
  for (const log of data) {
    // Count by action
    byAction[log.action] = (byAction[log.action] || 0) + 1
    
    // Count by resource type
    byResourceType[log.resource_type] = (byResourceType[log.resource_type] || 0) + 1
    
    // Count by user
    if (log.user_id) {
      if (!userCounts[log.user_id]) {
        userCounts[log.user_id] = { email: log.user_email || 'Unknown', count: 0 }
      }
      userCounts[log.user_id].count++
    }
  }
  
  // Get top 10 users
  const topUsers = Object.entries(userCounts)
    .map(([user_id, { email, count }]) => ({ user_id, user_email: email, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  
  return {
    totalActions: data.length,
    byAction,
    byResourceType,
    topUsers
  }
}

// Convenience functions for common audit actions
export const auditOrder = {
  created: (orderId: string, details?: Record<string, unknown>) => 
    logAudit('create', 'order', orderId, { newValues: details }),
  updated: (orderId: string, oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>) =>
    logAudit('update', 'order', orderId, { oldValues, newValues }),
  completed: (orderId: string) =>
    logAudit('complete', 'order', orderId),
  cancelled: (orderId: string, reason?: string) =>
    logAudit('cancel', 'order', orderId, { metadata: { reason } }),
  assigned: (orderId: string, designerId: string) =>
    logAudit('assign', 'order', orderId, { newValues: { designer_id: designerId } })
}

export const auditUser = {
  login: (userId: string, email: string) =>
    logAudit('login', 'user', userId, { userId, userEmail: email }),
  logout: (userId: string, email: string) =>
    logAudit('logout', 'user', userId, { userId, userEmail: email }),
  profileUpdated: (userId: string, oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>) =>
    logAudit('update', 'profile', userId, { oldValues, newValues })
}

export const auditPayment = {
  created: (paymentId: string, details?: Record<string, unknown>) =>
    logAudit('create', 'payment', paymentId, { newValues: details }),
  refunded: (paymentId: string, amount: number, reason?: string) =>
    logAudit('refund', 'payment', paymentId, { metadata: { amount, reason } })
}
