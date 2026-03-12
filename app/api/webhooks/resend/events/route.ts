import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Resend webhook for email events: opened, clicked, bounced, complained, delivered
// Subscribe at Resend Dashboard > Webhooks > Add Endpoint
// URL: https://visoryx.design/api/webhooks/resend/events
// Events: email.opened, email.clicked, email.bounced, email.delivered, email.complained
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { type, data } = payload

    if (!type || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Map Resend event types to our status
    const eventMap: Record<string, string> = {
      "email.sent": "sent",
      "email.delivered": "delivered",
      "email.opened": "opened",
      "email.clicked": "clicked",
      "email.bounced": "bounced",
      "email.complained": "complained",
    }

    const eventType = eventMap[type]
    if (!eventType) {
      return NextResponse.json({ received: true }) // Ignore unknown events
    }

    // Store the event
    await supabaseAdmin.from("email_events").insert({
      resend_email_id: data.email_id || data.id || null,
      event_type: eventType,
      recipient_email: data.to?.[0] || data.email || null,
      subject: data.subject || null,
      metadata: {
        type,
        created_at: data.created_at,
        link: data.click?.link || null,
        user_agent: data.click?.userAgent || data.open?.userAgent || null,
        ip_address: data.click?.ipAddress || data.open?.ipAddress || null,
      },
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Email event webhook error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
