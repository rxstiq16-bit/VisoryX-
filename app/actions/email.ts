"use server"

import { sendEmailNotification, type EmailTemplate } from "@/lib/email-notifications"

// ============= APPLICATION EMAILS =============

export async function sendApplicationReceivedEmail(
  email: string,
  applicantName: string,
  role: string
) {
  return sendEmailNotification("application_received", {
    to: email,
    data: { applicantName, role },
  })
}

export async function sendApplicationDecisionEmail(
  email: string,
  applicantName: string,
  role: string,
  accepted: boolean,
  adminNotes?: string
) {
  const template = accepted ? "application_accepted" : "application_rejected"
  return sendEmailNotification(template, {
    to: email,
    data: {
      applicantName,
      role,
      adminNotes: adminNotes ? `Note from our team: ${adminNotes}` : "",
    },
  })
}

// ============= MANUAL SEND EMAILS =============

export async function sendManualPaymentReceipt(
  email: string,
  customerName: string,
  orderId: string,
  serviceName: string,
  amount: string,
  paymentMethod: string,
  fromName?: string,
  fromEmail?: string
) {
  return sendEmailNotification("payment_receipt", {
    to: email,
    data: {
      customerName,
      orderId,
      serviceName,
      amount,
      paymentMethod,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    },
    fromName,
    fromEmail,
  })
}

export async function sendManualReviewRequest(
  email: string,
  customerName: string,
  orderId: string,
  fromName?: string,
  fromEmail?: string
) {
  return sendEmailNotification("review_request", {
    to: email,
    data: {
      customerName,
      orderId,
      daysAgo: "a few",
    },
    fromName,
    fromEmail,
  })
}

export async function sendManualPasswordReset(
  email: string,
  customerName: string,
  resetLink: string
) {
  return sendEmailNotification("password_reset", {
    to: email,
    data: {
      customerName,
      resetLink,
    },
  })
}

export async function sendNewsletterEmail(
  emails: string[],
  subject: string,
  content: string,
  fromName?: string,
  fromEmail?: string
) {
  const results = await Promise.allSettled(
    emails.map((email) =>
      sendEmailNotification("newsletter", {
        to: email,
        data: { subject, content, email },
        fromName,
        fromEmail,
      })
    )
  )

  const succeeded = results.filter((r) => r.status === "fulfilled" && r.value).length
  const failed = results.length - succeeded
  return { succeeded, failed, total: results.length }
}

// ============= PLAIN REPLY =============

export async function sendPlainReply(
  to: string,
  subject: string,
  body: string,
  fromName?: string,
  fromEmail?: string,
) {
  "use server"
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set")
    return false
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName || "VisoryX"} <${fromEmail || "contact@visoryx.design"}>`,
        to: [to],
        subject,
        text: body,
      }),
    })
    return res.ok
  } catch (err) {
    console.error("Failed to send reply:", err)
    return false
  }
}

// ============= GENERIC MANUAL SEND =============

export async function sendCustomEmail(
  email: string,
  template: EmailTemplate,
  data: Record<string, string | number>,
  fromName?: string,
  fromEmail?: string,
) {
  return sendEmailNotification(template, {
    to: email,
    data,
    fromName,
    fromEmail,
  })
}
