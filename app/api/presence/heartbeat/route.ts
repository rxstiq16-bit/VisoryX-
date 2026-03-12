import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { channelId, status, currentPage } = body

    // Update presence in database
    const { error } = await supabase
      .from("presence")
      .upsert({
        user_id: user.id,
        channel_id: channelId,
        status,
        current_page: currentPage,
        last_seen: new Date().toISOString(),
      }, {
        onConflict: "user_id,channel_id",
      })

    if (error) {
      console.error("[Presence] Heartbeat error:", error)
      return NextResponse.json({ error: "Failed to update presence" }, { status: 500 })
    }

    // Clean up stale presence entries (older than 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
    await supabase
      .from("presence")
      .delete()
      .lt("last_seen", twoMinutesAgo)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Presence] Heartbeat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
