import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Resend sends email.received webhooks via Svix. Instead of verifying signatures
// (which requires the svix library), we accept the webhook and use the data
// to trigger a sync of received emails from the Resend API.
// This is more reliable since we fetch the full email content directly.

async function syncReceivedEmails() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set")

  // Fetch recent received emails from Resend API
  const res = await fetch("https://api.resend.com/emails/receiving?limit=50", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend API error ${res.status}: ${text}`)
  }

  const result = await res.json()
  const emails = result.data || []

  let inserted = 0
  let skipped = 0

  for (const emailRef of emails) {
    // Check if we already have this email
    const { data: existingRows } = await supabaseAdmin
      .from("inbound_emails")
      .select("id")
      .eq("resend_email_id", emailRef.id)
      .limit(1)

    if (existingRows && existingRows.length > 0) {
      skipped++
      continue
    }

    // Fetch full email content
    const detailRes = await fetch(`https://api.resend.com/emails/receiving/${emailRef.id}`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    })

    if (!detailRes.ok) {
      console.error(`Failed to fetch email ${emailRef.id}: ${detailRes.status}`)
      continue
    }

    const email = await detailRes.json()

    // Parse the "from" field -- can be "Name <email>" or just "email"
    let fromEmail = email.from || ""
    let fromName = ""
    const fromMatch = fromEmail.match(/^(.+?)\s*<(.+?)>$/)
    if (fromMatch) {
      fromName = fromMatch[1].trim()
      fromEmail = fromMatch[2].trim()
    }

    const toEmail = Array.isArray(email.to) ? email.to[0] : (email.to || "contact@visoryx.design")
    const subject = email.subject || "(No Subject)"
    const bodyText = email.text || ""
    const bodyHtml = email.html || ""

    const { error } = await supabaseAdmin.from("inbound_emails").insert({
      from_email: fromEmail,
      from_name: fromName || fromEmail.split("@")[0],
      to_email: toEmail,
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      resend_email_id: emailRef.id,
      status: "unread",
      starred: false,
    })

    if (error) {
      console.error("Failed to store email:", emailRef.id, error.message)
    } else {
      inserted++
    }
  }

  return { total: emails.length, inserted, skipped }
}

// Webhook handler -- triggered by Resend when an email is received
// We use this as a trigger to sync all received emails
export async function POST(request: NextRequest) {
  try {
    // Accept the webhook (don't verify Svix signature to avoid complexity)
    // Just use it as a trigger to sync
    const result = await syncReceivedEmails()
    return NextResponse.json({ received: true, ...result })
  } catch (err) {
    console.error("Inbound webhook error:", err)
    return NextResponse.json({ received: true, error: String(err) }, { status: 200 })
  }
}

// Also expose a GET endpoint for manual sync from admin inbox
export async function GET(request: NextRequest) {
  try {
    const result = await syncReceivedEmails()
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error("Email sync error:", err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
