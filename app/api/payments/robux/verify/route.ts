import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Verification code required" }, { status: 400 })
  }

  // Check payment status
  const { data: payment, error } = await supabase
    .from("robux_payments")
    .select("*")
    .eq("verification_code", code)
    .single()

  if (error || !payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }

  // Check if expired
  if (new Date(payment.expires_at) < new Date()) {
    await supabase
      .from("robux_payments")
      .update({ status: "expired" })
      .eq("id", payment.id)

    return NextResponse.json({ status: "expired" })
  }

  // In production, you would check with Roblox API for gamepass purchase
  // For now, we return the current status
  return NextResponse.json({
    status: payment.status,
    amount: payment.robux_amount,
  })
}

export async function POST(request: NextRequest) {
  // This endpoint would be called by a Roblox webhook or verification service
  const supabase = await createClient()
  const { verificationCode, robloxUsername, transactionId } = await request.json()

  // Verify the payment
  const { data: payment, error } = await supabase
    .from("robux_payments")
    .select("*")
    .eq("verification_code", verificationCode)
    .eq("status", "pending")
    .single()

  if (error || !payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }

  // Check if expired
  if (new Date(payment.expires_at) < new Date()) {
    return NextResponse.json({ error: "Payment expired" }, { status: 400 })
  }

  // Mark payment as completed
  await supabase
    .from("robux_payments")
    .update({
      status: "completed",
      roblox_username: robloxUsername,
      roblox_transaction_id: transactionId,
      verified_at: new Date().toISOString(),
    })
    .eq("id", payment.id)

  // Update order status
  await supabase
    .from("orders")
    .update({
      status: "confirmed",
      payment_status: "paid",
      payment_method: "robux",
    })
    .eq("id", payment.order_id)

  // Create notification
  await supabase.from("notifications").insert({
    user_id: payment.user_id,
    type: "payment_received",
    title: "Robux Payment Verified",
    body: `Your payment of R$ ${payment.robux_amount} has been verified.`,
    metadata: { orderId: payment.order_id },
  })

  return NextResponse.json({ success: true })
}
