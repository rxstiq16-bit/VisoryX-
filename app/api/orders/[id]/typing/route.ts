import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { typing } = await request.json()

  // Get user display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single()

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Someone"

  // Broadcast typing event via Supabase Realtime
  const channel = supabase.channel(`order-${orderId}`)
  
  await channel.send({
    type: "broadcast",
    event: typing ? "typing_start" : "typing_stop",
    payload: { user: displayName, userId: user.id },
  })

  return NextResponse.json({ success: true })
}
