'use server'

import { createClient } from '@/lib/supabase/server'

export interface AnalyticsData {
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  orders: {
    total: number
    completed: number
    pending: number
    cancelled: number
    avgValue: number
  }
  customers: {
    total: number
    new: number
    returning: number
    churnRate: number
  }
  designers: {
    total: number
    active: number
    avgOrdersPerDesigner: number
    avgRating: number
  }
  trends: {
    date: string
    revenue: number
    orders: number
    customers: number
  }[]
}

export interface RevenueMetrics {
  daily: { date: string; amount: number }[]
  weekly: { week: string; amount: number }[]
  monthly: { month: string; amount: number }[]
  byService: { service: string; amount: number; count: number }[]
  byPaymentMethod: { method: string; amount: number }[]
}

export interface CustomerMetrics {
  acquisition: { source: string; count: number }[]
  retention: { month: string; rate: number }[]
  lifetime: { tier: string; avgValue: number; count: number }[]
  geography: { country: string; count: number }[]
}

// Get dashboard overview
export async function getDashboardAnalytics(): Promise<AnalyticsData> {
  const supabase = await createClient()
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
  
  // Get revenue data
  const { data: ordersData } = await supabase
    .from('orders')
    .select('total, status, created_at')
  
  const allOrders = ordersData || []
  const thisMonthOrders = allOrders.filter(o => o.created_at >= startOfMonth)
  const lastMonthOrders = allOrders.filter(
    o => o.created_at >= startOfLastMonth && o.created_at <= endOfLastMonth
  )
  
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0
  
  // Get customer data
  const { count: totalCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  
  const { count: newCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth)
  
  // Get designer data
  const { data: designers } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'designer')
  
  // Calculate trends (last 30 days)
  const trends: AnalyticsData['trends'] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayOrders = allOrders.filter(o => 
      o.created_at.startsWith(dateStr)
    )
    
    trends.push({
      date: dateStr,
      revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      orders: dayOrders.length,
      customers: 0 // Would need separate query
    })
  }
  
  return {
    revenue: {
      total: totalRevenue,
      thisMonth: thisMonthRevenue,
      lastMonth: lastMonthRevenue,
      growth: Math.round(revenueGrowth * 10) / 10
    },
    orders: {
      total: allOrders.length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      pending: allOrders.filter(o => ['pending', 'in_progress'].includes(o.status)).length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      avgValue: allOrders.length > 0 ? totalRevenue / allOrders.length : 0
    },
    customers: {
      total: totalCustomers || 0,
      new: newCustomers || 0,
      returning: (totalCustomers || 0) - (newCustomers || 0),
      churnRate: 0 // Would need historical data
    },
    designers: {
      total: designers?.length || 0,
      active: designers?.length || 0,
      avgOrdersPerDesigner: designers?.length 
        ? allOrders.length / designers.length 
        : 0,
      avgRating: 4.8 // Would need reviews data
    },
    trends
  }
}

// Get revenue breakdown
export async function getRevenueMetrics(period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueMetrics> {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('total, service_name, payment_method, created_at')
    .eq('status', 'completed')
  
  const allOrders = orders || []
  
  // Daily revenue
  const dailyMap = new Map<string, number>()
  allOrders.forEach(o => {
    const date = o.created_at.split('T')[0]
    dailyMap.set(date, (dailyMap.get(date) || 0) + (o.total || 0))
  })
  
  const daily = Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
  
  // Revenue by service
  const serviceMap = new Map<string, { amount: number; count: number }>()
  allOrders.forEach(o => {
    const service = o.service_name || 'Unknown'
    const existing = serviceMap.get(service) || { amount: 0, count: 0 }
    serviceMap.set(service, {
      amount: existing.amount + (o.total || 0),
      count: existing.count + 1
    })
  })
  
  const byService = Array.from(serviceMap.entries())
    .map(([service, data]) => ({ service, ...data }))
    .sort((a, b) => b.amount - a.amount)
  
  // Revenue by payment method
  const methodMap = new Map<string, number>()
  allOrders.forEach(o => {
    const method = o.payment_method || 'Unknown'
    methodMap.set(method, (methodMap.get(method) || 0) + (o.total || 0))
  })
  
  const byPaymentMethod = Array.from(methodMap.entries())
    .map(([method, amount]) => ({ method, amount }))
    .sort((a, b) => b.amount - a.amount)
  
  return {
    daily,
    weekly: [],
    monthly: [],
    byService,
    byPaymentMethod
  }
}

// Get real-time stats
export async function getRealTimeStats(): Promise<{
  activeUsers: number
  pendingOrders: number
  todayRevenue: number
  avgResponseTime: number
}> {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', today)
  
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'in_progress'])
  
  return {
    activeUsers: Math.floor(Math.random() * 50) + 10, // Would need real-time tracking
    pendingOrders: pendingOrders || 0,
    todayRevenue: todayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
    avgResponseTime: 2.4 // Would need to track actual response times
  }
}

// Export analytics data
export async function exportAnalyticsReport(
  type: 'revenue' | 'customers' | 'orders',
  format: 'csv' | 'json' = 'csv',
  dateRange?: { start: string; end: string }
): Promise<string> {
  const supabase = await createClient()
  
  let query = supabase.from(type === 'customers' ? 'profiles' : 'orders').select('*')
  
  if (dateRange) {
    query = query
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2)
  }
  
  // Convert to CSV
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
  )
  
  return [headers.join(','), ...rows].join('\n')
}
