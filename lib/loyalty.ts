import { createClient } from "@/lib/supabase/server"

export interface LoyaltyTier {
  name: string
  minPoints: number
  maxPoints: number
  color: string
  multiplier: number
  benefits: string[]
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    maxPoints: 999,
    color: "#CD7F32",
    multiplier: 1,
    benefits: ["1 point per $1 spent", "Birthday bonus"],
  },
  {
    name: "Silver",
    minPoints: 1000,
    maxPoints: 4999,
    color: "#C0C0C0",
    multiplier: 1.25,
    benefits: ["1.25x points multiplier", "Early access to sales", "Free rush delivery once/month"],
  },
  {
    name: "Gold",
    minPoints: 5000,
    maxPoints: 14999,
    color: "#FFD700",
    multiplier: 1.5,
    benefits: ["1.5x points multiplier", "Priority support", "Exclusive designer access", "10% off all orders"],
  },
  {
    name: "Platinum",
    minPoints: 15000,
    maxPoints: Infinity,
    color: "#E5E4E2",
    multiplier: 2,
    benefits: ["2x points multiplier", "Dedicated account manager", "Free unlimited revisions", "20% off all orders"],
  },
]

export function getTierFromPoints(points: number): LoyaltyTier {
  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
    if (points >= LOYALTY_TIERS[i].minPoints) {
      return LOYALTY_TIERS[i]
    }
  }
  return LOYALTY_TIERS[0]
}

export function getNextTier(currentPoints: number): LoyaltyTier | null {
  const currentTier = getTierFromPoints(currentPoints)
  const currentIndex = LOYALTY_TIERS.findIndex((t) => t.name === currentTier.name)
  if (currentIndex < LOYALTY_TIERS.length - 1) {
    return LOYALTY_TIERS[currentIndex + 1]
  }
  return null
}

export function calculatePointsToNextTier(currentPoints: number): number {
  const nextTier = getNextTier(currentPoints)
  if (!nextTier) return 0
  return nextTier.minPoints - currentPoints
}

export function calculatePointsFromOrder(orderTotal: number, multiplier: number = 1): number {
  return Math.floor(orderTotal * multiplier)
}

export async function getLoyaltyStats(userId: string) {
  const supabase = await createClient()

  const { data: loyalty, error } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !loyalty) {
    return {
      totalPoints: 0,
      availablePoints: 0,
      lifetimePoints: 0,
      tier: LOYALTY_TIERS[0],
      nextTier: LOYALTY_TIERS[1],
      pointsToNextTier: LOYALTY_TIERS[1].minPoints,
      tierProgress: 0,
    }
  }

  const tier = getTierFromPoints(loyalty.lifetime_points)
  const nextTier = getNextTier(loyalty.lifetime_points)
  const pointsToNextTier = calculatePointsToNextTier(loyalty.lifetime_points)

  // Calculate progress percentage to next tier
  let tierProgress = 100
  if (nextTier) {
    const tierRange = nextTier.minPoints - tier.minPoints
    const pointsInTier = loyalty.lifetime_points - tier.minPoints
    tierProgress = Math.min(100, Math.round((pointsInTier / tierRange) * 100))
  }

  return {
    totalPoints: loyalty.total_points,
    availablePoints: loyalty.available_points,
    lifetimePoints: loyalty.lifetime_points,
    tier,
    nextTier,
    pointsToNextTier,
    tierProgress,
  }
}

export async function addLoyaltyPoints(
  userId: string,
  points: number,
  source: string,
  referenceId?: string,
  description?: string
) {
  const supabase = await createClient()

  // Get current loyalty record or create one
  const { data: existing } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (existing) {
    // Update existing record
    await supabase
      .from("loyalty_points")
      .update({
        total_points: existing.total_points + points,
        available_points: existing.available_points + points,
        lifetime_points: existing.lifetime_points + points,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
  } else {
    // Create new record
    await supabase.from("loyalty_points").insert({
      user_id: userId,
      total_points: points,
      available_points: points,
      lifetime_points: points,
      tier: "bronze",
    })
  }

  // Record transaction
  await supabase.from("loyalty_transactions").insert({
    user_id: userId,
    points,
    type: "earn",
    source,
    reference_id: referenceId,
    description: description || `Earned ${points} points`,
  })

  return { success: true }
}

export async function redeemLoyaltyPoints(
  userId: string,
  points: number,
  redemptionType: string,
  description?: string
) {
  const supabase = await createClient()

  const { data: loyalty, error } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !loyalty || loyalty.available_points < points) {
    return { success: false, error: "Insufficient points" }
  }

  // Update points
  await supabase
    .from("loyalty_points")
    .update({
      available_points: loyalty.available_points - points,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  // Record transaction
  await supabase.from("loyalty_transactions").insert({
    user_id: userId,
    points: -points,
    type: "redeem",
    source: redemptionType,
    description: description || `Redeemed ${points} points`,
  })

  return { success: true }
}

export async function getLoyaltyTransactions(userId: string, limit: number = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("loyalty_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  return data || []
}
