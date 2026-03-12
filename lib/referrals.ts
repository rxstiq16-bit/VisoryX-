import { createClient } from "@/lib/supabase/server"
import { addLoyaltyPoints } from "./loyalty"

export interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  completedReferrals: number
  totalEarnings: number
  referralCode: string
  referralLink: string
}

export interface ReferralTier {
  name: string
  minReferrals: number
  rewardPerReferral: number
  bonusReward: number
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { name: "Starter", minReferrals: 0, rewardPerReferral: 500, bonusReward: 0 },
  { name: "Advocate", minReferrals: 5, rewardPerReferral: 750, bonusReward: 1000 },
  { name: "Champion", minReferrals: 15, rewardPerReferral: 1000, bonusReward: 2500 },
  { name: "Ambassador", minReferrals: 50, rewardPerReferral: 1500, bonusReward: 5000 },
]

export function getReferralTier(totalReferrals: number): ReferralTier {
  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (totalReferrals >= REFERRAL_TIERS[i].minReferrals) {
      return REFERRAL_TIERS[i]
    }
  }
  return REFERRAL_TIERS[0]
}

export function generateReferralCode(userId: string): string {
  const prefix = "VX"
  const userPart = userId.substring(0, 6).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${userPart}${randomPart}`
}

export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const supabase = await createClient()

  // Get or create referral record
  let { data: referral, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", userId)
    .single()

  if (error || !referral) {
    // Create referral record for this user
    const code = generateReferralCode(userId)
    const { data: newReferral } = await supabase
      .from("referrals")
      .insert({
        referrer_id: userId,
        referral_code: code,
        total_referrals: 0,
        successful_referrals: 0,
        total_earnings: 0,
      })
      .select()
      .single()

    referral = newReferral || {
      referral_code: code,
      total_referrals: 0,
      successful_referrals: 0,
      total_earnings: 0,
    }
  }

  // Get pending referrals count
  const { count: pendingCount } = await supabase
    .from("referral_uses")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", userId)
    .eq("status", "pending")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://visoryx.com"

  return {
    totalReferrals: referral.total_referrals,
    pendingReferrals: pendingCount || 0,
    completedReferrals: referral.successful_referrals,
    totalEarnings: referral.total_earnings,
    referralCode: referral.referral_code,
    referralLink: `${baseUrl}/signup?ref=${referral.referral_code}`,
  }
}

export async function validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("referrals")
    .select("referrer_id")
    .eq("referral_code", code.toUpperCase())
    .single()

  if (error || !data) {
    return { valid: false }
  }

  return { valid: true, referrerId: data.referrer_id }
}

export async function trackReferralSignup(referralCode: string, newUserId: string) {
  const supabase = await createClient()

  const { valid, referrerId } = await validateReferralCode(referralCode)
  if (!valid || !referrerId) return { success: false }

  // Don't allow self-referral
  if (referrerId === newUserId) return { success: false, error: "Cannot refer yourself" }

  // Create referral use record
  await supabase.from("referral_uses").insert({
    referrer_id: referrerId,
    referred_id: newUserId,
    referral_code: referralCode.toUpperCase(),
    status: "pending",
  })

  // Update referrer's total count
  await supabase.rpc("increment_referral_count", { user_id: referrerId })

  return { success: true }
}

export async function completeReferral(referredUserId: string) {
  const supabase = await createClient()

  // Find the pending referral
  const { data: referralUse, error } = await supabase
    .from("referral_uses")
    .select("*, referrals!inner(referrer_id)")
    .eq("referred_id", referredUserId)
    .eq("status", "pending")
    .single()

  if (error || !referralUse) return { success: false }

  const referrerId = referralUse.referrer_id

  // Get current referral stats to determine tier
  const stats = await getReferralStats(referrerId)
  const tier = getReferralTier(stats.completedReferrals + 1)

  // Mark referral as complete
  await supabase
    .from("referral_uses")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      reward_amount: tier.rewardPerReferral,
    })
    .eq("id", referralUse.id)

  // Update referrer's stats
  await supabase
    .from("referrals")
    .update({
      successful_referrals: stats.completedReferrals + 1,
      total_earnings: stats.totalEarnings + tier.rewardPerReferral,
    })
    .eq("referrer_id", referrerId)

  // Award points to referrer
  await addLoyaltyPoints(
    referrerId,
    tier.rewardPerReferral,
    "referral",
    referredUserId,
    `Referral bonus for inviting a friend`
  )

  // Award bonus points to referred user
  await addLoyaltyPoints(
    referredUserId,
    250, // Welcome bonus for using referral
    "referral_bonus",
    referrerId,
    "Welcome bonus for joining via referral"
  )

  // Check for tier bonus
  const newTier = getReferralTier(stats.completedReferrals + 1)
  const previousTier = getReferralTier(stats.completedReferrals)
  if (newTier.name !== previousTier.name && newTier.bonusReward > 0) {
    await addLoyaltyPoints(
      referrerId,
      newTier.bonusReward,
      "referral_tier_bonus",
      undefined,
      `Reached ${newTier.name} referral tier!`
    )
  }

  return { success: true }
}

export async function getReferralHistory(userId: string, limit: number = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("referral_uses")
    .select(`
      *,
      referred:profiles!referred_id(display_name, avatar_url)
    `)
    .eq("referrer_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  return data || []
}
