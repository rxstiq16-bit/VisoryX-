import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const { keyId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const { data: apiKey } = await supabase
      .from("api_keys")
      .select("*")
      .eq("id", keyId)
      .eq("user_id", user.id)
      .single()

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    // Soft delete by marking as inactive
    const { error } = await supabase
      .from("api_keys")
      .update({ 
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", keyId)

    if (error) throw error

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "api_key_deleted",
      resource_type: "api_key",
      resource_id: keyId,
      details: { name: apiKey.name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
