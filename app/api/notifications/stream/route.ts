import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const encoder = new TextEncoder()
  let isConnectionOpen = true

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected", timestamp: Date.now() })}\n\n`)
      )

      // Set up Supabase real-time subscription for notifications
      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (isConnectionOpen) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "notification",
                    data: {
                      id: payload.new.id,
                      title: payload.new.title,
                      body: payload.new.body,
                      type: payload.new.type,
                      metadata: payload.new.metadata,
                    },
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
