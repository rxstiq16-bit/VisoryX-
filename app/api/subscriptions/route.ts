import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ subscriptions })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { plan_id, billing_cycle } = body

  // Define subscription plans
  const plans = {
    starter: { name: "Starter Retainer", hours: 10, price_monthly: 299, price_yearly: 2990 },
    professional: { name: "Professional Retainer", hours: 25, price_monthly: 699, price_yearly: 6990 },
    enterprise: { name: "Enterprise Retainer", hours: 50, price_monthly: 1299, price_yearly: 12990 },
  }

  const plan = plans[plan_id as keyof typeof plans]
  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const price = billing_cycle === "yearly" ? plan.price_yearly : plan.price_monthly
  const nextBillingDate = new Date()
  nextBillingDate.setMonth(nextBillingDate.getMonth() + (billing_cycle === "yearly" ? 12 : 1))

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan_id,
      plan_name: plan.name,
      hours_included: plan.hours,
      hours_used: 0,
      billing_cycle,
      price,
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: nextBillingDate.toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ subscription })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { subscription_id, action } = body

  if (action === "cancel") {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ 
        status: "cancelled",
        cancelled_at: new Date().toISOString() 
      })
      .eq("id", subscription_id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscription: data })
  }

  if (action === "pause") {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ 
        status: "paused",
        paused_at: new Date().toISOString() 
      })
      .eq("id", subscription_id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscription: data })
  }

  if (action === "resume") {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ 
        status: "active",
        paused_at: null 
      })
      .eq("id", subscription_id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscription: data })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
