import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import { sendEmailNotification } from "@/lib/email-notifications"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object

        // Find order by tracking_number stored in metadata, or by matching amount + recent pending
        const customerEmail = session.customer_details?.email || session.customer_email
        const amountPaid = session.amount_total ? session.amount_total / 100 : null

        if (customerEmail && amountPaid) {
          // Find the most recent pending order for this email and amount
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("customer_email", customerEmail)
            .eq("price", amountPaid)
            .eq("paid", false)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          if (order) {
            await supabaseAdmin
              .from("orders")
              .update({
                paid: true,
                payment_method: "stripe",
                payment_date: new Date().toISOString(),
                status: "confirmed",
                updated_at: new Date().toISOString(),
              })
              .eq("id", order.id)

            // Add a payment note
            await supabaseAdmin.from("order_notes").insert({
              order_id: order.id,
              user_id: "system",
              user_name: "Stripe",
              note_type: "payment",
              content: `Payment of $${amountPaid.toFixed(2)} received via Stripe (Session: ${session.id})`,
              is_internal: false,
            })

            // Add status history
            await supabaseAdmin.from("order_status_history").insert({
              order_id: order.id,
              previous_status: "pending",
              new_status: "confirmed",
              changed_by: "system",
              changed_by_name: "Stripe Webhook",
              reason: "Payment confirmed via Stripe Checkout",
            })

            // Notify admin of new paid order
            try {
              const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "contact@visoryx.design"
              const serviceName = session.metadata?.service_name || session.line_items?.data?.[0]?.description || "Design Service"

              await sendEmailNotification("admin_new_order", {
                to: adminEmail,
                data: {
                  orderId: order.id.slice(0, 8).toUpperCase(),
                  customerName: session.customer_details?.name || "Customer",
                  customerEmail: customerEmail || "",
                  serviceName,
                  amount: amountPaid.toFixed(2),
                },
                fromName: "VisoryX System",
                fromEmail: "noreply@visoryx.design",
              })
            } catch (emailErr) {
              console.error("Failed to send admin notification:", emailErr)
            }
          }
        }
        break
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object
        console.error("Payment failed:", intent.id, intent.last_payment_error?.message)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Webhook error:", message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }
}
