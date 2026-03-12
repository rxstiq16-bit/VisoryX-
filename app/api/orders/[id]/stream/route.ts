import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Verify user has access to this order
  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, assigned_to")
    .eq("id", orderId)
    .single()

  if (!order || (order.user_id !== user.id && order.assigned_to !== user.id)) {
    return new Response("Forbidden", { status: 403 })
  }

  const encoder = new TextEncoder()
  let isConnectionOpen = true

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected", timestamp: Date.now() })}\n\n`)
      )

      // Set up Supabase real-time subscription
      const channel = supabase
        .channel(`order-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            if (isConnectionOpen) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "status_update",
                    data: payload.new.status,
                    timestamp: Date.now(),
                  })}\n\n`
                )
              )
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "order_messages",
            filter: `order_id=eq.${orderId}`,
          },
          (payload) => {
            if (isConnectionOpen) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "new_message",
                    data: payload.new,
                    timestamp: Date.now(),
                  })}\n\n`
                )
              )
            }
          }
        )
        .subscribe()

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        if (isConnectionOpen) {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } else {
          clearInterval(heartbeat)
        }
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        isConnectionOpen = false
        clearInterval(heartbeat)
        supabase.removeChannel(channel)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
