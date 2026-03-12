import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Delete profile first
    await supabaseAdmin.from("profiles").delete().eq("id", userId)

    // Delete auth user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Delete user error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
