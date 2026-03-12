"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Clock, CheckCircle, AlertCircle, MessageSquare, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"

interface ActiveOrder {
  id: string
  order_number: string
  status: string
  service_name: string
  unread_messages: number
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; message: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", message: "is pending assignment" },
  in_progress: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", message: "is being worked on" },
  review: { icon: AlertCircle, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", message: "is ready for your review" },
  revision: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", message: "revision in progress" },
  completed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", message: "is completed!" },
  delivered: { icon: Package, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", message: "has been delivered" },
}

export function OrderStatusBanner() {
  const { user } = useAuth()
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchActiveOrder = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, status, service_name")
        .eq("user_id", user.id)
        .in("status", ["pending", "in_progress", "review", "revision"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (data) {
        // Count unread messages
        const { count } = await supabase
          .from("order_messages")
          .select("*", { count: "exact", head: true })
          .eq("order_id", data.id)
          .eq("is_read", false)
          .neq("sender_id", user.id)

        setActiveOrder({ ...data, unread_messages: count || 0 })
      }
    }

    fetchActiveOrder()

    // Subscribe to real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel("order-status-banner")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, () => fetchActiveOrder())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  if (!activeOrder || dismissed) return null

  const config = statusConfig[activeOrder.status] || statusConfig.pending
  const Icon = config.icon

  return (
    <div className={cn("relative border-b px-4 py-2", config.bg)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-4 w-4", config.color)} />
          <p className="text-sm">
            <span className="font-medium">Order #{activeOrder.order_number}</span>
            <span className="text-muted-foreground"> ({activeOrder.service_name}) {config.message}</span>
          </p>
          {activeOrder.unread_messages > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              <MessageSquare className="h-3 w-3" />
              {activeOrder.unread_messages} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="h-7">
            <Link href={`/orders/${activeOrder.id}`}>View Order</Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
