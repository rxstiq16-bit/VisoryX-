import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  // Count active orders (in progress)
  const { count: activeOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .in("status", ["pending", "confirmed", "in_progress", "review"])

  // Define total slots available
  const totalSlots = 15
  const usedSlots = activeOrders || 0
  const availableSlots = Math.max(0, totalSlots - usedSlots)

  // Get estimated wait time based on queue
  let estimatedWait = "1-2 days"
  if (availableSlots === 0) {
    estimatedWait = "5-7 days"
  } else if (availableSlots <= 3) {
    estimatedWait = "3-4 days"
  } else if (availableSlots <= 5) {
    estimatedWait = "2-3 days"
  }

  // Get queue position for waitlist
  const { count: waitlistCount } = await supabase
    .from("waitlists")
    .select("*", { count: "exact", head: true })
    .eq("status", "waiting")

  return NextResponse.json({
    totalSlots,
    usedSlots,
    availableSlots,
    estimatedWait,
    waitlistCount: waitlistCount || 0,
    acceptingOrders: availableSlots > 0,
    rushAvailable: availableSlots >= 3,
  })
}
