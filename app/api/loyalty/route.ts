import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get user's loyalty points
  const { data: loyaltyPoints } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Get recent transactions
  const { data: transactions } = await supabase
    .from("loyalty_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get available rewards
  const { data: rewards } = await supabase
    .from("loyalty_rewards")
    .select("*")
    .eq("is_active", true)
    .order("points_cost", { ascending: true })

  // Calculate tier
  const totalPoints = loyaltyPoints?.total_earned || 0
  let tier = "bronze"
  let tierProgress = 0
  let nextTier = "silver"
  let pointsToNextTier = 500

  if (totalPoints >= 5000) {
    tier = "platinum"
    tierProgress = 100
    nextTier = "platinum"
    pointsToNextTier = 0
  } else if (totalPoints >= 1500) {
    tier = "gold"
    tierProgress = ((totalPoints - 1500) / 3500) * 100
    nextTier = "platinum"
    pointsToNextTier = 5000 - totalPoints
  } else if (totalPoints >= 500) {
    tier = "silver"
    tierProgress = ((totalPoints - 500) / 1000) * 100
    nextTier = "gold"
    pointsToNextTier = 1500 - totalPoints
  } else {
    tierProgress = (totalPoints / 500) * 100
    pointsToNextTier = 500 - totalPoints
  }

  return NextResponse.json({
    points: {
      current: loyaltyPoints?.current_balance || 0,
      totalEarned: loyaltyPoints?.total_earned || 0,
      totalRedeemed: loyaltyPoints?.total_redeemed || 0,
    },
    tier: {
      current: tier,
      progress: Math.round(tierProgress),
      next: nextTier,
      pointsToNext: pointsToNextTier,
    },
    transactions: transactions || [],
    rewards: rewards || [],
  })
}
