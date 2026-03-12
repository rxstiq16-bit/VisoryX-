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

    const { days, reason } = await request.json()

    if (!days || days < 1 || days > 30) {
      return NextResponse.json({ error: "Invalid extension duration" }, { status: 400 })
    }

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a reason" }, { status: 400 })
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

    // Check if user is involved
    if (order.user_id !== user.id && order.assigned_designer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check for pending requests
    const { data: pendingRequests } = await supabase
      .from("deadline_extensions")
      .select("*")
      .eq("order_id", id)
      .eq("status", "pending")

    if (pendingRequests && pendingRequests.length > 0) {
      return NextResponse.json({ error: "A pending extension request already exists" }, { status: 400 })
    }

    // Create extension request
    const { data: extension, error: extError } = await supabase
      .from("deadline_extensions")
      .insert({
        order_id: id,
        requested_by: user.id,
        requested_days: days,
        reason,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (extError) throw extError

    // Create notification for admin/designer
    const notifyUserId = order.user_id === user.id 
      ? order.assigned_designer_id 
      : order.user_id

    if (notifyUserId) {
      await supabase.from("notifications").insert({
        user_id: notifyUserId,
        type: "deadline_extension_requested",
        title: "Deadline Extension Requested",
        message: `A ${days}-day extension has been requested for order #${id.slice(0, 8)}`,
        data: { order_id: id, extension_id: extension.id },
      })
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "deadline_extension_requested",
      resource_type: "deadline_extension",
      resource_id: extension.id,
      details: { order_id: id, days, reason: reason.substring(0, 200) },
    })

    return NextResponse.json({ success: true, extensionId: extension.id })
  } catch (error) {
    console.error("Error requesting extension:", error)
    return NextResponse.json({ error: "Failed to request extension" }, { status: 500 })
  }
}

// Admin approval endpoint
export async function PATCH(
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

    // Check if admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !["admin", "designer"].includes(profile.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { extensionId, approved, note } = await request.json()

    // Update extension
    const { data: extension, error: updateError } = await supabase
      .from("deadline_extensions")
      .update({
        status: approved ? "approved" : "rejected",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_note: note,
      })
      .eq("id", extensionId)
      .select()
      .single()

    if (updateError) throw updateError

    // If approved, update order deadline
    if (approved) {
      const { data: order } = await supabase
        .from("orders")
        .select("deadline")
        .eq("id", id)
        .single()

      if (order) {
        const currentDeadline = new Date(order.deadline)
        const newDeadline = new Date(currentDeadline)
        newDeadline.setDate(newDeadline.getDate() + extension.requested_days)

        await supabase
          .from("orders")
          .update({ deadline: newDeadline.toISOString() })
          .eq("id", id)
      }
    }

    // Notify requester
    await supabase.from("notifications").insert({
      user_id: extension.requested_by,
      type: "deadline_extension_reviewed",
      title: approved ? "Extension Approved" : "Extension Rejected",
      message: approved 
        ? `Your ${extension.requested_days}-day extension has been approved`
        : `Your extension request has been rejected`,
      data: { order_id: id, extension_id: extensionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reviewing extension:", error)
    return NextResponse.json({ error: "Failed to review extension" }, { status: 500 })
  }
}
