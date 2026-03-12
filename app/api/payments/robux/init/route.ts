import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId, amount, robuxAmount } = await request.json()

  // Generate unique verification code
  const verificationCode = nanoid(8).toUpperCase()

  // Store pending payment
  const { error } = await supabase.from("robux_payments").insert({
    order_id: orderId,
    user_id: user.id,
    usd_amount: amount,
    robux_amount: robuxAmount,
    verification_code: verificationCode,
    status: "pending",
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min expiry
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return gamepass URL (this would be your actual Roblox gamepass)
  const gamepassUrl = process.env.ROBUX_GAMEPASS_URL || "https://www.roblox.com/game-pass/123456789"

  return NextResponse.json({
    verificationCode,
    gamepassUrl: `${gamepassUrl}?ref=${verificationCode}`,
    expiresIn: 600,
  })
}
