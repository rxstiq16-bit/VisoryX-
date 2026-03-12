import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reason } = await request.json()

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a detailed reason" }, { status: 400 })
    }

    // Verify order
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user is involved in the order
    if (order.user_id !== user.id && order.assigned_designer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create dispute
    const { data: dispute, error: disputeError } = await supabase
      .from("disputes")
      .insert({
        order_id: id,
        filed_by: user.id,
        reason,
        status: "open",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (disputeError) throw disputeError

    // Update order escrow status
    await supabase
      .from("orders")
      .update({ escrow_status: "disputed" })
      .eq("id", id)

    // Create audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "escrow_dispute_filed",
      resource_type: "dispute",
      resource_id: dispute.id,
      details: { order_id: id, reason: reason.substring(0, 200) },
    })

    // Notify admin
    await supabase.from("notifications").insert({
      user_id: null, // Admin notification
      type: "dispute_filed",
      title: "New Dispute Filed",
      message: `A dispute has been filed for order #${id.slice(0, 8)}`,
      data: { order_id: id, dispute_id: dispute.id },
    })

    return NextResponse.json({ success: true, disputeId: dispute.id })
  } catch (error) {
    console.error("Error filing dispute:", error)
    return NextResponse.json({ error: "Failed to file dispute" }, { status: 500 })
  }
}
