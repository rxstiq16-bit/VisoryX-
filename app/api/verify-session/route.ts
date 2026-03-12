import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email || session.customer_email || null,
      amount_total: session.amount_total,
      product_name: session.metadata?.product_name || null,
    })
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 })
  }
}
