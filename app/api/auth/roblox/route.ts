import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  startRobloxVerification,
  verifyRobloxAccount,
  unlinkRobloxAccount,
} from "@/lib/integrations/roblox"

// Start verification
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { username, action } = body

  if (action === "verify") {
    // Verify the account
    const result = await verifyRobloxAccount(user.id)
    return NextResponse.json(result)
  }

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  const result = await startRobloxVerification(user.id, username)
  return NextResponse.json(result)
}

// Unlink account
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const result = await unlinkRobloxAccount(user.id)
  return NextResponse.json(result)
}
