'use server'

import { createClient } from '@/lib/supabase/server'

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_ORDER: {
    id: 'first_order',
    name: 'First Steps',
    description: 'Place your first order',
    icon: 'trophy',
    points: 50,
    rarity: 'common',
    criteria: { type: 'orders_count', value: 1 }
  },
  FIVE_ORDERS: {
    id: 'five_orders',
    name: 'Regular Customer',
    description: 'Complete 5 orders',
    icon: 'star',
    points: 100,
    rarity: 'uncommon',
    criteria: { type: 'orders_count', value: 5 }
  },
  TEN_ORDERS: {
    id: 'ten_orders',
    name: 'Loyal Supporter',
    description: 'Complete 10 orders',
    icon: 'award',
    points: 250,
    rarity: 'rare',
    criteria: { type: 'orders_count', value: 10 }
  },
  FIRST_REVIEW: {
    id: 'first_review',
    name: 'Voice Heard',
    description: 'Leave your first review',
    icon: 'message-circle',
    points: 25,
    rarity: 'common',
    criteria: { type: 'reviews_count', value: 1 }
  },
  FIVE_STAR_REVIEW: {
    id: 'five_star_review',
    name: 'Perfect Score',
    description: 'Give a 5-star review',
    icon: 'sparkles',
    points: 50,
    rarity: 'uncommon',
    criteria: { type: 'five_star_review', value: 1 }
  },
  REFERRAL_MASTER: {
    id: 'referral_master',
    name: 'Referral Master',
    description: 'Successfully refer 5 friends',
    icon: 'users',
    points: 500,
    rarity: 'epic',
    criteria: { type: 'referrals_count', value: 5 }
  },
  BIG_SPENDER: {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spend over $500 total',
    icon: 'credit-card',
    points: 300,
    rarity: 'rare',
    criteria: { type: 'total_spent', value: 500 }
  },
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Place an order before 8 AM',
    icon: 'sun',
    points: 25,
    rarity: 'common',
    criteria: { type: 'early_order', value: 8 }
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Place an order after midnight',
    icon: 'moon',
    points: 25,
    rarity: 'common',
    criteria: { type: 'late_order', value: 0 }
  },
  PROFILE_COMPLETE: {
    id: 'profile_complete',
    name: 'Identity Revealed',
    description: 'Complete your profile',
    icon: 'user-check',
    points: 50,
    rarity: 'common',
    criteria: { type: 'profile_complete', value: 1 }
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Connect Discord and Roblox accounts',
    icon: 'link',
    points: 100,
    rarity: 'uncommon',
    criteria: { type: 'integrations_count', value: 2 }
  },
  LOYALTY_SILVER: {
    id: 'loyalty_silver',
    name: 'Silver Status',
    description: 'Reach Silver loyalty tier',
    icon: 'medal',
    points: 200,
    rarity: 'uncommon',
    criteria: { type: 'loyalty_tier', value: 'silver' }
  },
  LOYALTY_GOLD: {
    id: 'loyalty_gold',
    name: 'Gold Status',
    description: 'Reach Gold loyalty tier',
    icon: 'medal',
    points: 500,
    rarity: 'rare',
    criteria: { type: 'loyalty_tier', value: 'gold' }
  },
  LOYALTY_PLATINUM: {
    id: 'loyalty_platinum',
    name: 'Platinum Status',
    description: 'Reach Platinum loyalty tier',
    icon: 'crown',
    points: 1000,
    rarity: 'epic',
    criteria: { type: 'loyalty_tier', value: 'platinum' }
  },
  LOYALTY_DIAMOND: {
    id: 'loyalty_diamond',
    name: 'Diamond Status',
    description: 'Reach Diamond loyalty tier',
    icon: 'gem',
    points: 2500,
    rarity: 'legendary',
    criteria: { type: 'loyalty_tier', value: 'diamond' }
  }
}

// Level thresholds
export const LEVELS = [
  { level: 1, xp: 0, title: 'Newcomer' },
  { level: 2, xp: 100, title: 'Explorer' },
  { level: 3, xp: 250, title: 'Apprentice' },
  { level: 4, xp: 500, title: 'Designer Fan' },
  { level: 5, xp: 1000, title: 'Art Enthusiast' },
  { level: 6, xp: 1750, title: 'Creative Soul' },
  { level: 7, xp: 2750, title: 'Design Lover' },
  { level: 8, xp: 4000, title: 'Art Collector' },
  { level: 9, xp: 5500, title: 'Patron' },
  { level: 10, xp: 7500, title: 'VIP' },
  { level: 11, xp: 10000, title: 'Elite' },
  { level: 12, xp: 13000, title: 'Champion' },
  { level: 13, xp: 17000, title: 'Legend' },
  { level: 14, xp: 22000, title: 'Master' },
  { level: 15, xp: 30000, title: 'Grandmaster' }
]

export async function getUserLevel(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_levels')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user level:', error)
    return null
  }
  
  if (!data) {
    // Create default level entry
    const { data: newLevel, error: createError } = await supabase
      .from('user_levels')
      .insert({ user_id: userId })
      .select()
      .single()
    
    if (createError) {
      console.error('Error creating user level:', createError)
      return null
    }
    
    return newLevel
  }
  
  return data
}

export async function addXP(userId: string, amount: number, reason?: string) {
  const supabase = await createClient()
  
  const level = await getUserLevel(userId)
  if (!level) return null
  
  let newXP = level.xp + amount
  let newTotalXP = level.total_xp + amount
  let newLevel = level.level
  let newTitle = level.title
  let leveledUp = false
  
  // Check for level up
  for (const lvl of LEVELS) {
    if (newTotalXP >= lvl.xp && lvl.level > newLevel) {
      newLevel = lvl.level
      newTitle = lvl.title
      leveledUp = true
    }
  }
  
  // Calculate XP to next level
  const nextLevel = LEVELS.find(l => l.level === newLevel + 1)
  const xpToNextLevel = nextLevel ? nextLevel.xp - newTotalXP : 0
  
  const { data, error } = await supabase
    .from('user_levels')
    .update({
      xp: newXP,
      total_xp: newTotalXP,
      level: newLevel,
      title: newTitle,
      xp_to_next_level: Math.max(0, xpToNextLevel),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Error adding XP:', error)
    return null
  }
  
  // Create notification if leveled up
  if (leveledUp) {
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'level_up',
      title: 'Level Up!',
      message: `Congratulations! You've reached level ${newLevel}: ${newTitle}`,
      icon: 'trending-up'
    })
  }
  
  return { ...data, leveledUp }
}

export async function getUserAchievements(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user achievements:', error)
    return []
  }
  
  return data || []
}

export async function unlockAchievement(userId: string, achievementId: string) {
  const supabase = await createClient()
  
  // Check if already unlocked
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single()
  
  if (existing) return null
  
  // Get achievement details
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', achievementId)
    .single()
  
  if (!achievement) return null
  
  // Unlock the achievement
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId,
      progress: 100,
      unlocked_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error unlocking achievement:', error)
    return null
  }
  
  // Award XP
  if (achievement.points > 0) {
    await addXP(userId, achievement.points, `Achievement: ${achievement.name}`)
  }
  
  // Create notification
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: `You've earned "${achievement.name}": ${achievement.description}`,
    icon: achievement.icon
  })
  
  return data
}

export async function getLeaderboard(
  period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time',
  category: string = 'xp',
  limit: number = 10
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select(`
      *,
      profile:profiles(username, display_name, avatar_url)
    `)
    .eq('period', period)
    .eq('category', category)
    .order('score', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  
  return data || []
}

export async function checkAndUnlockAchievements(userId: string) {
  const supabase = await createClient()
  
  // Get user stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'completed')
  
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
  
  const { count: referralsCount } = await supabase
    .from('referrals')
    .select('id', { count: 'exact' })
    .eq('referrer_id', userId)
    .eq('status', 'rewarded')
  
  const { count: integrationsCount } = await supabase
    .from('user_integrations')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('verified', true)
  
  const { data: loyaltyData } = await supabase
    .from('loyalty_points')
    .select('tier')
    .eq('user_id', userId)
    .single()
  
  // Check each achievement
  const checks = [
    { id: 'first_order', condition: (ordersCount || 0) >= 1 },
    { id: 'five_orders', condition: (ordersCount || 0) >= 5 },
    { id: 'ten_orders', condition: (ordersCount || 0) >= 10 },
    { id: 'first_review', condition: (reviewsCount || 0) >= 1 },
    { id: 'referral_master', condition: (referralsCount || 0) >= 5 },
    { id: 'social_butterfly', condition: (integrationsCount || 0) >= 2 },
    { id: 'loyalty_silver', condition: loyaltyData?.tier === 'silver' || ['gold', 'platinum', 'diamond'].includes(loyaltyData?.tier || '') },
    { id: 'loyalty_gold', condition: loyaltyData?.tier === 'gold' || ['platinum', 'diamond'].includes(loyaltyData?.tier || '') },
    { id: 'loyalty_platinum', condition: loyaltyData?.tier === 'platinum' || loyaltyData?.tier === 'diamond' },
    { id: 'loyalty_diamond', condition: loyaltyData?.tier === 'diamond' },
    { id: 'profile_complete', condition: profile?.avatar_url && profile?.bio && profile?.display_name }
  ]
  
  const unlocked = []
  
  for (const check of checks) {
    if (check.condition) {
      const result = await unlockAchievement(userId, check.id)
      if (result) unlocked.push(check.id)
    }
  }
  
  return unlocked
}
