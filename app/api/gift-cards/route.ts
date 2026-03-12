import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get user's gift cards (both purchased and received)
  const { data: purchased } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("purchaser_id", user.id)
    .order("created_at", { ascending: false })

  const { data: received } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("recipient_email", user.email)
    .order("created_at", { ascending: false })

  return NextResponse.json({
    purchased: purchased || [],
    received: received || [],
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { amount, design, recipientEmail, recipientName, senderName, message, deliveryDate } = body

    // Validate amount
    if (!amount || amount < 10 || amount > 500) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Generate unique code
    const code = `GC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const { data: giftCard, error } = await supabase
      .from("gift_cards")
      .insert({
        code,
        amount,
        balance: amount,
        design,
        purchaser_id: user.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        sender_name: senderName,
        message,
        delivery_date: deliveryDate || null,
        status: deliveryDate ? "scheduled" : "active",
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Create Stripe payment intent and process payment
    // TODO: Send email to recipient if not scheduled

    return NextResponse.json({ giftCard })
  } catch (error) {
    console.error("Error creating gift card:", error)
    return NextResponse.json({ error: "Failed to create gift card" }, { status: 500 })
  }
}
