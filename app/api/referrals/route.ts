import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get user's profile for referral code
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("referral_code")
    .eq("id", user.id)
    .single()

  // Get referrals made by user
  const { data: referrals } = await supabase
    .from("referrals")
    .select(`
      id,
      status,
      reward_amount,
      created_at,
      converted_at,
      referred:referred_id (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalReferrals = referrals?.length || 0
  const convertedReferrals = referrals?.filter(r => r.status === "converted").length || 0
  const pendingReferrals = referrals?.filter(r => r.status === "pending").length || 0
  const totalEarnings = referrals
    ?.filter(r => r.status === "converted")
    .reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0

  // Determine tier
  let tier = "bronze"
  let commissionRate = 5
  if (convertedReferrals >= 50) {
    tier = "diamond"
    commissionRate = 20
  } else if (convertedReferrals >= 25) {
    tier = "platinum"
    commissionRate = 15
  } else if (convertedReferrals >= 10) {
    tier = "gold"
    commissionRate = 12
  } else if (convertedReferrals >= 3) {
    tier = "silver"
    commissionRate = 8
  }

  const referralCode = profile?.referral_code || `REF${user.id.slice(0, 8).toUpperCase()}`
  const referralLink = `https://visoryx.design?ref=${referralCode}`

  return NextResponse.json({
    referralCode,
    referralLink,
    stats: {
      total: totalReferrals,
      converted: convertedReferrals,
      pending: pendingReferrals,
      totalEarnings,
    },
    tier: {
      current: tier,
      commissionRate,
    },
    referrals: referrals || [],
  })
}
