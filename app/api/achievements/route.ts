import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get all achievements
  const { data: allAchievements, error: achievementsError } = await supabase
    .from("achievements")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (achievementsError) {
    return NextResponse.json({ error: achievementsError.message }, { status: 500 })
  }

  // Get user's unlocked achievements
  const { data: userAchievements, error: userError } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", user.id)

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || [])

  const achievements = allAchievements?.map(achievement => ({
    ...achievement,
    unlocked: unlockedIds.has(achievement.id),
    unlocked_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at,
  })) || []

  // Calculate stats
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + (a.points || 0), 0)

  const totalXP = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + (a.xp_reward || 0), 0)

  return NextResponse.json({
    achievements,
    stats: {
      total: achievements.length,
      unlocked: achievements.filter(a => a.unlocked).length,
      totalPoints,
      totalXP,
    },
  })
}
