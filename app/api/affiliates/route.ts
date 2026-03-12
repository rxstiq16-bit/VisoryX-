import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get affiliate data
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!affiliate) {
    return NextResponse.json({ error: "Not an affiliate" }, { status: 404 })
  }

  // Get referral stats
  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id)

  const { data: conversions } = await supabase
    .from("orders")
    .select("id, total, created_at")
    .eq("referral_code", affiliate.code)
    .eq("payment_status", "paid")

  // Calculate stats
  const totalClicks = affiliate.clicks || 0
  const totalSignups = referrals?.length || 0
  const totalSales = conversions?.length || 0
  const totalEarnings = conversions?.reduce((sum, order) => {
    const commission = (affiliate.commission_rate || 0.1) * order.total
    return sum + commission
  }, 0) || 0

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("affiliate_events")
    .select("*")
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return NextResponse.json({
    affiliate,
    stats: {
      clicks: totalClicks,
      signups: totalSignups,
      sales: totalSales,
      earnings: totalEarnings,
      pendingPayout: affiliate.pending_payout || 0,
      lifetimeEarnings: affiliate.lifetime_earnings || 0,
    },
    recentActivity: recentActivity || [],
    tier: calculateTier(totalSales),
  })
}

function calculateTier(sales: number) {
  if (sales >= 50) return { name: "Elite", commission: 0.20 }
  if (sales >= 10) return { name: "Partner", commission: 0.15 }
  return { name: "Starter", commission: 0.10 }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if already an affiliate
    const { data: existing } = await supabase
      .from("affiliates")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Already an affiliate" }, { status: 400 })
    }

    // Generate unique affiliate code
    const code = `VX${user.id.substring(0, 4).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create affiliate record
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .insert({
        user_id: user.id,
        code,
        commission_rate: 0.10, // Start at 10%
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ affiliate })
  } catch (error) {
    console.error("Error creating affiliate:", error)
    return NextResponse.json({ error: "Failed to create affiliate account" }, { status: 500 })
  }
}
