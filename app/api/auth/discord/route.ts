import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getDiscordOAuthUrl, unlinkDiscordAccount } from "@/lib/integrations/discord"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Generate state for CSRF protection
  const state = `visoryx_discord_${user.id.substring(0, 8)}`

  // Generate OAuth URL
  const authUrl = getDiscordOAuthUrl(state)

  return NextResponse.redirect(authUrl)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const result = await unlinkDiscordAccount(user.id)

  return NextResponse.json(result)
}
