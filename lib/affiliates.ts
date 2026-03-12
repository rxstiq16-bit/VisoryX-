'use server'

import { createClient } from '@/lib/supabase/server'

export interface Affiliate {
  id: string
  user_id: string
  affiliate_code: string
  company_name?: string
  website?: string
  commission_rate: number
  total_earnings: number
  pending_payout: number
  paid_out: number
  total_clicks: number
  total_conversions: number
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'terminated'
  payout_method?: 'paypal' | 'stripe' | 'bank'
  payout_details?: Record<string, unknown>
  approved_at?: string
  created_at: string
}

export interface AffiliateConversion {
  id: string
  affiliate_id: string
  order_id: string
  order_total: number
  commission: number
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  paid_at?: string
  created_at: string
}

export async function getAffiliateByUserId(userId: string): Promise<Affiliate | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching affiliate:', error)
    return null
  }
  
  return data
}

export async function getAffiliateByCode(code: string): Promise<Affiliate | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('affiliates')
    .select('*')
    .eq('affiliate_code', code.toUpperCase())
    .eq('status', 'active')
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function applyForAffiliate(
  userId: string,
  details: {
    companyName?: string
    website?: string
    payoutMethod: 'paypal' | 'stripe' | 'bank'
    payoutDetails: Record<string, unknown>
  }
): Promise<{ success: boolean; affiliate?: Affiliate; error?: string }> {
  const supabase = await createClient()
  
  // Check if already an affiliate
  const existing = await getAffiliateByUserId(userId)
  if (existing) {
    return { success: false, error: 'You are already an affiliate' }
  }
  
  // Generate unique affiliate code
  const code = generateAffiliateCode()
  
  const { data, error } = await supabase
    .from('affiliates')
    .insert({
      user_id: userId,
      affiliate_code: code,
      company_name: details.companyName,
      website: details.website,
      payout_method: details.payoutMethod,
      payout_details: details.payoutDetails,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating affiliate:', error)
    return { success: false, error: 'Failed to create affiliate application' }
  }
  
  return { success: true, affiliate: data }
}

export async function trackAffiliateClick(
  affiliateCode: string,
  ipHash: string,
  userAgent?: string,
  referrer?: string,
  landingPage?: string
): Promise<boolean> {
  const supabase = await createClient()
  
  const affiliate = await getAffiliateByCode(affiliateCode)
  if (!affiliate) return false
  
  // Record the click
  const { error: clickError } = await supabase
    .from('affiliate_clicks')
    .insert({
      affiliate_id: affiliate.id,
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer: referrer,
      landing_page: landingPage
    })
  
  if (clickError) {
    console.error('Error tracking click:', clickError)
    return false
  }
  
  // Update total clicks
  await supabase
    .from('affiliates')
    .update({ total_clicks: affiliate.total_clicks + 1 })
    .eq('id', affiliate.id)
  
  return true
}

export async function createAffiliateConversion(
  affiliateId: string,
  orderId: string,
  orderTotal: number
): Promise<AffiliateConversion | null> {
  const supabase = await createClient()
  
  // Get affiliate commission rate
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('commission_rate, total_conversions')
    .eq('id', affiliateId)
    .single()
  
  if (!affiliate) return null
  
  const commission = orderTotal * affiliate.commission_rate
  
  const { data, error } = await supabase
    .from('affiliate_conversions')
    .insert({
      affiliate_id: affiliateId,
      order_id: orderId,
      order_total: orderTotal,
      commission: commission,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating conversion:', error)
    return null
  }
  
  // Update affiliate stats
  await supabase
    .from('affiliates')
    .update({
      total_conversions: affiliate.total_conversions + 1,
      pending_payout: supabase.rpc('increment', { row_id: affiliateId, amount: commission })
    })
    .eq('id', affiliateId)
  
  return data
}

export async function getAffiliateStats(affiliateId: string) {
  const supabase = await createClient()
  
  // Get basic stats
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('id', affiliateId)
    .single()
  
  if (!affiliate) return null
  
  // Get recent conversions
  const { data: conversions } = await supabase
    .from('affiliate_conversions')
    .select('*')
    .eq('affiliate_id', affiliateId)
    .order('created_at', { ascending: false })
    .limit(10)
  
  // Get click stats for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { count: recentClicks } = await supabase
    .from('affiliate_clicks')
    .select('id', { count: 'exact' })
    .eq('affiliate_id', affiliateId)
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  // Calculate conversion rate
  const conversionRate = affiliate.total_clicks > 0
    ? (affiliate.total_conversions / affiliate.total_clicks) * 100
    : 0
  
  return {
    ...affiliate,
    recentConversions: conversions || [],
    recentClicks: recentClicks || 0,
    conversionRate: conversionRate.toFixed(2)
  }
}

export async function getAffiliateConversions(
  affiliateId: string,
  status?: string,
  limit: number = 50
): Promise<AffiliateConversion[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('affiliate_conversions')
    .select('*')
    .eq('affiliate_id', affiliateId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching conversions:', error)
    return []
  }
  
  return data || []
}

export async function approveAffiliate(affiliateId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('affiliates')
    .update({
      status: 'active',
      approved_at: new Date().toISOString()
    })
    .eq('id', affiliateId)
  
  if (error) {
    console.error('Error approving affiliate:', error)
    return false
  }
  
  return true
}

export async function processAffiliatePayout(affiliateId: string, amount: number): Promise<boolean> {
  const supabase = await createClient()
  
  // Get current affiliate data
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('pending_payout, paid_out')
    .eq('id', affiliateId)
    .single()
  
  if (!affiliate || affiliate.pending_payout < amount) {
    return false
  }
  
  // Update affiliate payouts
  const { error } = await supabase
    .from('affiliates')
    .update({
      pending_payout: affiliate.pending_payout - amount,
      paid_out: affiliate.paid_out + amount
    })
    .eq('id', affiliateId)
  
  if (error) {
    console.error('Error processing payout:', error)
    return false
  }
  
  // Mark conversions as paid
  await supabase
    .from('affiliate_conversions')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString()
    })
    .eq('affiliate_id', affiliateId)
    .eq('status', 'approved')
  
  return true
}

function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'VX'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
