import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .single()

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({ message: "Already subscribed" }, { status: 200 })
      }
      // Reactivate subscription
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", resubscribed_at: new Date().toISOString() })
        .eq("id", existing.id)
    } else {
      // Create new subscription
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: email.toLowerCase(),
        status: "active",
        source: "website",
      })

      if (error) {
        console.error("Newsletter subscription error:", error)
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
      }
    }

    // TODO: Send confirmation email

    return NextResponse.json({ success: true, message: "Subscribed successfully" })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
