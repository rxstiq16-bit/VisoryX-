import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    // Find the gift card
    const { data: giftCard, error: findError } = await supabase
      .from("gift_cards")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("status", "active")
      .single()

    if (findError || !giftCard) {
      return NextResponse.json({ error: "Invalid or already redeemed gift card" }, { status: 400 })
    }

    if (giftCard.balance <= 0) {
      return NextResponse.json({ error: "Gift card has no remaining balance" }, { status: 400 })
    }

    // Update gift card to mark as redeemed
    const { error: updateError } = await supabase
      .from("gift_cards")
      .update({
        redeemed_by: user.id,
        redeemed_at: new Date().toISOString(),
        status: "redeemed",
      })
      .eq("id", giftCard.id)

    if (updateError) throw updateError

    // Add credit to user's account
    const { data: profile } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", user.id)
      .single()

    const currentBalance = profile?.credit_balance || 0
    const newBalance = currentBalance + giftCard.balance

    await supabase
      .from("profiles")
      .update({ credit_balance: newBalance })
      .eq("id", user.id)

    // Create transaction record
    await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "gift_card_redemption",
        amount: giftCard.balance,
        description: `Redeemed gift card ${code}`,
        metadata: { gift_card_id: giftCard.id },
      })

    return NextResponse.json({
      success: true,
      amount: giftCard.balance,
      newBalance,
      message: `Successfully added $${giftCard.balance.toFixed(2)} to your account!`,
    })
  } catch (error) {
    console.error("Error redeeming gift card:", error)
    return NextResponse.json({ error: "Failed to redeem gift card" }, { status: 500 })
  }
}
