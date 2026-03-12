import { createClient } from "@/lib/supabase/server"

// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + "/api/auth/discord/callback"
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
  flags?: number
  premium_type?: number
}

export interface DiscordConnection {
  id: string
  user_id: string
  discord_id: string
  discord_username: string
  discord_avatar?: string
  discord_email?: string
  access_token: string
  refresh_token: string
  token_expires_at: string
  is_verified: boolean
  connected_at: string
}

// Generate OAuth2 URL for Discord login
export function getDiscordOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email guilds",
    state,
  })

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

// Exchange authorization code for tokens
export async function exchangeDiscordCode(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}> {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to exchange Discord code")
  }

  return response.json()
}

// Refresh Discord access token
export async function refreshDiscordToken(refreshToken: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh Discord token")
  }

  return response.json()
}

// Get Discord user info
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Discord user")
  }

  return response.json()
}

// Get user's Discord connection
export async function getDiscordConnection(userId: string): Promise<DiscordConnection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("discord_connections")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) return null
  return data
}

// Link Discord account to user
export async function linkDiscordAccount(
  userId: string,
  discordUser: DiscordUser,
  tokens: { access_token: string; refresh_token: string; expires_in: number }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Check if Discord account is already linked to another user
  const { data: existing } = await supabase
    .from("discord_connections")
    .select("user_id")
    .eq("discord_id", discordUser.id)
    .single()

  if (existing && existing.user_id !== userId) {
    return { success: false, error: "This Discord account is already linked to another user" }
  }

  // Upsert connection
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  const { error } = await supabase.from("discord_connections").upsert({
    user_id: userId,
    discord_id: discordUser.id,
    discord_username: `${discordUser.username}#${discordUser.discriminator}`,
    discord_avatar: discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : null,
    discord_email: discordUser.email,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: expiresAt,
    is_verified: true,
    connected_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: "Failed to link Discord account" }
  }

  return { success: true }
}

// Unlink Discord account
export async function unlinkDiscordAccount(userId: string): Promise<{ success: boolean }> {
  const supabase = await createClient()

  await supabase.from("discord_connections").delete().eq("user_id", userId)

  return { success: true }
}

// Send notification via Discord DM (requires bot)
export async function sendDiscordDM(
  discordUserId: string,
  message: {
    content?: string
    embeds?: Array<{
      title?: string
      description?: string
      color?: number
      fields?: Array<{ name: string; value: string; inline?: boolean }>
      footer?: { text: string }
      timestamp?: string
    }>
  }
): Promise<{ success: boolean }> {
  try {
    // Create DM channel
    const channelResponse = await fetch("https://discord.com/api/users/@me/channels", {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: discordUserId }),
    })

    if (!channelResponse.ok) {
      console.error("Failed to create DM channel")
      return { success: false }
    }

    const channel = await channelResponse.json()

    // Send message
    const messageResponse = await fetch(`https://discord.com/api/channels/${channel.id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    return { success: messageResponse.ok }
  } catch (error) {
    console.error("Failed to send Discord DM:", error)
    return { success: false }
  }
}

// Send notification via webhook
export async function sendDiscordWebhook(
  content: string,
  embeds?: Array<{
    title?: string
    description?: string
    color?: number
    fields?: Array<{ name: string; value: string; inline?: boolean }>
    thumbnail?: { url: string }
    footer?: { text: string; icon_url?: string }
    timestamp?: string
  }>
): Promise<{ success: boolean }> {
  if (!DISCORD_WEBHOOK_URL) return { success: false }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        embeds,
        username: "VisoryX",
        avatar_url: "https://visoryx.com/logo.png",
      }),
    })

    return { success: response.ok }
  } catch (error) {
    console.error("Failed to send Discord webhook:", error)
    return { success: false }
  }
}

// Notification templates
export function createOrderNotificationEmbed(order: {
  id: string
  service_name: string
  status: string
  total: number
}) {
  const statusColors: Record<string, number> = {
    pending: 0xffa500, // Orange
    in_progress: 0x3498db, // Blue
    review: 0x9b59b6, // Purple
    completed: 0x2ecc71, // Green
    cancelled: 0xe74c3c, // Red
  }

  return {
    title: `Order Update: ${order.service_name}`,
    description: `Your order status has been updated to **${order.status.replace("_", " ").toUpperCase()}**`,
    color: statusColors[order.status] || 0x7289da,
    fields: [
      { name: "Order ID", value: order.id.substring(0, 8), inline: true },
      { name: "Total", value: `$${order.total.toFixed(2)}`, inline: true },
    ],
    footer: { text: "VisoryX Design Studio" },
    timestamp: new Date().toISOString(),
  }
}

export function createMessageNotificationEmbed(message: {
  sender_name: string
  order_id: string
  preview: string
}) {
  return {
    title: "New Message",
    description: `**${message.sender_name}** sent you a message`,
    color: 0x7289da,
    fields: [
      { name: "Message", value: message.preview.substring(0, 200) + (message.preview.length > 200 ? "..." : "") },
      { name: "Order", value: message.order_id.substring(0, 8), inline: true },
    ],
    footer: { text: "Reply on VisoryX" },
    timestamp: new Date().toISOString(),
  }
}
