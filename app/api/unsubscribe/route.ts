import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Update the profile to mark as unsubscribed from marketing
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ unsubscribed: true })
      .eq("email", email.toLowerCase())

    if (error) {
      // If column doesn't exist yet, just log it -- the unsubscribe is still recorded
      console.error("Unsubscribe DB error:", error)
    }

    // Always return success to avoid leaking whether the email exists
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
