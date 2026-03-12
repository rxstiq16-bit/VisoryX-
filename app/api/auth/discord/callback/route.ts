import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  exchangeDiscordCode,
  getDiscordUser,
  linkDiscordAccount,
} from "@/lib/integrations/discord"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  // Handle errors
  if (error) {
    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?error=discord_${error}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?error=missing_code`
    )
  }

  try {
    // Get current user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        `${baseUrl}/auth/login?redirect=/dashboard/settings&error=not_authenticated`
      )
    }

    // Verify state matches (CSRF protection)
    const expectedState = `visoryx_discord_${user.id.substring(0, 8)}`
    if (state !== expectedState) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard/settings?error=invalid_state`
      )
    }

    // Exchange code for tokens
    const tokens = await exchangeDiscordCode(code)

    // Get Discord user info
    const discordUser = await getDiscordUser(tokens.access_token)

    // Link Discord account
    const result = await linkDiscordAccount(user.id, discordUser, tokens)

    if (!result.success) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard/settings?error=${encodeURIComponent(result.error || "link_failed")}`
      )
    }

    // Success!
    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?success=discord_linked`
    )
  } catch (error) {
    console.error("Discord OAuth error:", error)
    return NextResponse.redirect(
      `${baseUrl}/dashboard/settings?error=discord_oauth_failed`
    )
  }
}
