import { createClient } from "@/lib/supabase/server"

// Roblox Open Cloud API configuration
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY!
const ROBLOX_UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID!

export interface RobloxUser {
  id: number
  name: string
  displayName: string
  description?: string
  created: string
  isBanned: boolean
  externalAppDisplayName?: string
}

export interface RobloxThumbnail {
  targetId: number
  state: string
  imageUrl: string
}

export interface RobloxConnection {
  id: string
  user_id: string
  roblox_id: number
  roblox_username: string
  roblox_display_name: string
  roblox_avatar?: string
  is_verified: boolean
  verification_code?: string
  connected_at: string
}

// Get Roblox user by username
export async function getRobloxUserByUsername(username: string): Promise<RobloxUser | null> {
  try {
    const response = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: true,
        }),
      }
    )

    if (!response.ok) return null

    const { data } = await response.json()
    if (!data || data.length === 0) return null

    // Get full user info
    const userId = data[0].id
    return getRobloxUserById(userId)
  } catch (error) {
    console.error("Failed to fetch Roblox user:", error)
    return null
  }
}

// Get Roblox user by ID
export async function getRobloxUserById(userId: number): Promise<RobloxUser | null> {
  try {
    const response = await fetch(`https://users.roblox.com/v1/users/${userId}`)

    if (!response.ok) return null

    return response.json()
  } catch (error) {
    console.error("Failed to fetch Roblox user:", error)
    return null
  }
}

// Get Roblox user avatar
export async function getRobloxAvatar(userId: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`
    )

    if (!response.ok) return null

    const { data } = await response.json()
    if (!data || data.length === 0) return null

    return data[0].imageUrl
  } catch (error) {
    console.error("Failed to fetch Roblox avatar:", error)
    return null
  }
}

// Generate verification code
export function generateVerificationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "VX-"
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Get user's Roblox connection
export async function getRobloxConnection(userId: string): Promise<RobloxConnection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("roblox_connections")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) return null
  return data
}

// Start Roblox verification process
export async function startRobloxVerification(
  userId: string,
  robloxUsername: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  const supabase = await createClient()

  // Find Roblox user
  const robloxUser = await getRobloxUserByUsername(robloxUsername)
  if (!robloxUser) {
    return { success: false, error: "Roblox user not found" }
  }

  if (robloxUser.isBanned) {
    return { success: false, error: "This Roblox account is banned" }
  }

  // Check if already linked to another user
  const { data: existing } = await supabase
    .from("roblox_connections")
    .select("user_id")
    .eq("roblox_id", robloxUser.id)
    .single()

  if (existing && existing.user_id !== userId) {
    return { success: false, error: "This Roblox account is already linked to another user" }
  }

  // Generate verification code
  const code = generateVerificationCode()
  const avatar = await getRobloxAvatar(robloxUser.id)

  // Save pending verification
  const { error } = await supabase.from("roblox_connections").upsert({
    user_id: userId,
    roblox_id: robloxUser.id,
    roblox_username: robloxUser.name,
    roblox_display_name: robloxUser.displayName,
    roblox_avatar: avatar,
    is_verified: false,
    verification_code: code,
    connected_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: "Failed to start verification" }
  }

  return { success: true, code }
}

// Verify Roblox account by checking profile description
export async function verifyRobloxAccount(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get pending verification
  const { data: connection, error } = await supabase
    .from("roblox_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("is_verified", false)
    .single()

  if (error || !connection) {
    return { success: false, error: "No pending verification found" }
  }

  // Fetch current Roblox profile
  const robloxUser = await getRobloxUserById(connection.roblox_id)
  if (!robloxUser) {
    return { success: false, error: "Failed to fetch Roblox profile" }
  }

  // Check if description contains verification code
  if (!robloxUser.description?.includes(connection.verification_code)) {
    return {
      success: false,
      error: "Verification code not found in your Roblox profile description",
    }
  }

  // Mark as verified
  await supabase
    .from("roblox_connections")
    .update({
      is_verified: true,
      verification_code: null,
    })
    .eq("user_id", userId)

  return { success: true }
}

// Unlink Roblox account
export async function unlinkRobloxAccount(userId: string): Promise<{ success: boolean }> {
  const supabase = await createClient()

  await supabase.from("roblox_connections").delete().eq("user_id", userId)

  return { success: true }
}

// Check if user owns a specific Roblox game/asset
export async function checkRobloxOwnership(
  robloxUserId: number,
  assetId: number,
  assetType: "GamePass" | "Badge" | "Asset" = "GamePass"
): Promise<boolean> {
  try {
    let url: string

    switch (assetType) {
      case "GamePass":
        url = `https://inventory.roblox.com/v1/users/${robloxUserId}/items/GamePass/${assetId}`
        break
      case "Badge":
        url = `https://badges.roblox.com/v1/users/${robloxUserId}/badges/${assetId}`
        break
      case "Asset":
        url = `https://inventory.roblox.com/v1/users/${robloxUserId}/items/Asset/${assetId}`
        break
    }

    const response = await fetch(url)

    if (!response.ok) return false

    const data = await response.json()

    // Check if user owns the item
    if (assetType === "Badge") {
      return !!data.id
    }
    return data.data && data.data.length > 0
  } catch (error) {
    console.error("Failed to check Roblox ownership:", error)
    return false
  }
}

// Get Roblox games created by user
export async function getRobloxGames(robloxUserId: number): Promise<Array<{
  id: number
  name: string
  description: string
  playing: number
  visits: number
}>> {
  try {
    const response = await fetch(
      `https://games.roblox.com/v2/users/${robloxUserId}/games?accessFilter=2&limit=50&sortOrder=Asc`
    )

    if (!response.ok) return []

    const { data } = await response.json()
    return data || []
  } catch (error) {
    console.error("Failed to fetch Roblox games:", error)
    return []
  }
}

// Get universe details (for game-specific integrations)
export async function getRobloxUniverseDetails(universeId: number): Promise<{
  id: number
  name: string
  description: string
  playing: number
  visits: number
  favoritedCount: number
} | null> {
  try {
    const response = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`
    )

    if (!response.ok) return null

    const { data } = await response.json()
    return data?.[0] || null
  } catch (error) {
    console.error("Failed to fetch universe details:", error)
    return null
  }
}
