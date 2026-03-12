import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  try {
    const { id: orderId, messageId } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update message read status
    const { error } = await supabase
      .from("order_messages")
      .update({ 
        read_at: new Date().toISOString(),
        read_by: user.id 
      })
      .eq("id", messageId)
      .eq("order_id", orderId)
      .is("read_at", null)

    if (error) {
      console.error("Failed to mark message as read:", error)
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json({ success: true, readAt: new Date().toISOString() })
  } catch (error) {
    console.error("Read receipt error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
