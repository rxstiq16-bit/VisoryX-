'use server'

import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price_monthly: number
  price_yearly?: number
  features: string[]
  included_orders: number
  priority_support: boolean
  dedicated_designer: boolean
  discount_percent: number
  is_active: boolean
  stripe_price_id_monthly?: string
  stripe_price_id_yearly?: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  stripe_subscription_id?: string
  status: 'active' | 'past_due' | 'canceled' | 'paused' | 'trialing'
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  canceled_at?: string
  trial_end?: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    price_monthly: 19.99,
    price_yearly: 199.99,
    features: [
      '3 design requests per month',
      'Standard turnaround (3-5 days)',
      'Email support',
      '10% discount on additional orders',
      'Access to design library'
    ],
    included_orders: 3,
    priority_support: false,
    dedicated_designer: false,
    discount_percent: 10,
    is_active: true
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses and creators',
    price_monthly: 49.99,
    price_yearly: 499.99,
    features: [
      '10 design requests per month',
      'Priority turnaround (1-2 days)',
      'Priority chat support',
      '20% discount on additional orders',
      'Access to premium templates',
      'Source files included',
      'Unlimited revisions'
    ],
    included_orders: 10,
    priority_support: true,
    dedicated_designer: false,
    discount_percent: 20,
    is_active: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and high-volume needs',
    price_monthly: 149.99,
    price_yearly: 1499.99,
    features: [
      'Unlimited design requests',
      'Same-day turnaround available',
      'Dedicated account manager',
      'Dedicated designer assigned',
      '30% discount on rush orders',
      'White-label deliverables',
      'API access',
      'Custom integrations',
      'Team management'
    ],
    included_orders: -1, // Unlimited
    priority_support: true,
    dedicated_designer: true,
    discount_percent: 30,
    is_active: true
  }
]

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })
  
  if (error || !data || data.length === 0) {
    // Return default plans if none in database
    return SUBSCRIPTION_PLANS
  }
  
  return data
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function createSubscriptionCheckout(
  userId: string,
  planId: string,
  billingPeriod: 'monthly' | 'yearly',
  successUrl: string,
  cancelUrl: string
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient()
  
  // Get user
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (!profile) {
    return { error: 'User not found' }
  }
  
  // Get plan
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  if (!plan) {
    return { error: 'Plan not found' }
  }
  
  // Get or create Stripe customer
  let customerId = profile.stripe_customer_id
  
  if (!customerId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const customer = await stripe.customers.create({
      email: user?.email,
      name: profile.display_name || profile.username,
      metadata: { user_id: userId }
    })
    
    customerId = customer.id
    
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId)
  }
  
  // Create Stripe checkout session
  const priceId = billingPeriod === 'yearly' 
    ? plan.stripe_price_id_yearly 
    : plan.stripe_price_id_monthly
  
  // If no Stripe price ID, create a checkout with price data
  const lineItems = priceId 
    ? [{ price: priceId, quantity: 1 }]
    : [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${plan.name} Plan (${billingPeriod})`,
            description: plan.description
          },
          unit_amount: Math.round((billingPeriod === 'yearly' ? plan.price_yearly || plan.price_monthly * 10 : plan.price_monthly) * 100),
          recurring: {
            interval: billingPeriod === 'yearly' ? 'year' : 'month'
          }
        },
        quantity: 1
      }]
  
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        plan_id: planId,
        billing_period: billingPeriod
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId
        }
      }
    })
    
    return { url: session.url! }
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return { error: 'Failed to create checkout session' }
  }
}

export async function cancelSubscription(
  userId: string,
  cancelImmediately: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const subscription = await getUserSubscription(userId)
  if (!subscription || !subscription.stripe_subscription_id) {
    return { success: false, error: 'No active subscription found' }
  }
  
  try {
    if (cancelImmediately) {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
      
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('id', subscription.id)
    } else {
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true
      })
      
      await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('id', subscription.id)
    }
    
    return { success: true }
  } catch (err) {
    console.error('Error canceling subscription:', err)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}

export async function pauseSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const subscription = await getUserSubscription(userId)
  if (!subscription || !subscription.stripe_subscription_id) {
    return { success: false, error: 'No active subscription found' }
  }
  
  try {
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      pause_collection: { behavior: 'void' }
    })
    
    await supabase
      .from('subscriptions')
      .update({ status: 'paused' })
      .eq('id', subscription.id)
    
    return { success: true }
  } catch (err) {
    console.error('Error pausing subscription:', err)
    return { success: false, error: 'Failed to pause subscription' }
  }
}

export async function resumeSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const subscription = await getUserSubscription(userId)
  if (!subscription || !subscription.stripe_subscription_id) {
    return { success: false, error: 'No subscription found' }
  }
  
  try {
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      pause_collection: ''
    })
    
    await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('id', subscription.id)
    
    return { success: true }
  } catch (err) {
    console.error('Error resuming subscription:', err)
    return { success: false, error: 'Failed to resume subscription' }
  }
}

export async function getSubscriptionUsage(userId: string): Promise<{
  ordersUsed: number
  ordersIncluded: number
  periodStart: string
  periodEnd: string
} | null> {
  const supabase = await createClient()
  
  const subscription = await getUserSubscription(userId)
  if (!subscription) return null
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan_id)
  if (!plan) return null
  
  // Count orders in current period
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', subscription.current_period_start)
    .lte('created_at', subscription.current_period_end)
  
  return {
    ordersUsed: count || 0,
    ordersIncluded: plan.included_orders,
    periodStart: subscription.current_period_start || new Date().toISOString(),
    periodEnd: subscription.current_period_end || new Date().toISOString()
  }
}

export async function checkSubscriptionAccess(
  userId: string,
  feature: 'priority_support' | 'dedicated_designer' | 'unlimited_revisions' | 'source_files'
): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  if (!subscription || subscription.status !== 'active') return false
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan_id)
  if (!plan) return false
  
  switch (feature) {
    case 'priority_support':
      return plan.priority_support
    case 'dedicated_designer':
      return plan.dedicated_designer
    case 'unlimited_revisions':
      return plan.id === 'professional' || plan.id === 'enterprise'
    case 'source_files':
      return plan.id === 'professional' || plan.id === 'enterprise'
    default:
      return false
  }
}
