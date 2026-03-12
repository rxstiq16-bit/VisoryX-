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

    const { milestoneId } = await request.json()

    // Verify order ownership
    const { data: order } = await supabase
      .from("orders")
      .select("*, escrow_milestones(*)")
      .eq("id", id)
      .single()

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Find milestone
    const milestone = order.escrow_milestones?.find((m: { id: string }) => m.id === milestoneId)
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    if (milestone.status !== "in_escrow") {
      return NextResponse.json({ error: "Milestone not eligible for release" }, { status: 400 })
    }

    // Update milestone status
    const { error: updateError } = await supabase
      .from("escrow_milestones")
      .update({
        status: "released",
        released_at: new Date().toISOString(),
      })
      .eq("id", milestoneId)

    if (updateError) throw updateError

    // Check if all milestones are released
    const { data: remainingMilestones } = await supabase
      .from("escrow_milestones")
      .select("*")
      .eq("order_id", id)
      .neq("status", "released")

    if (!remainingMilestones || remainingMilestones.length === 0) {
      // All milestones released, mark escrow as completed
      await supabase
        .from("orders")
        .update({ escrow_status: "completed" })
        .eq("id", id)
    } else {
      await supabase
        .from("orders")
        .update({ escrow_status: "partial_release" })
        .eq("id", id)
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "escrow_release",
      resource_type: "escrow_milestone",
      resource_id: milestoneId,
      details: { order_id: id, amount: milestone.amount },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error releasing escrow:", error)
    return NextResponse.json({ error: "Failed to release escrow" }, { status: 500 })
  }
}
