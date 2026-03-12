"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Clock, ChevronRight, Loader2, CheckCircle } from "lucide-react"
import { formatDistanceToNow, addDays, isPast, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface OrderDeadline {
  id: string
  customer_name: string
  service_type: string
  created_at: string
  deadline: string
  status: string
  priority: "overdue" | "today" | "urgent" | "normal"
}

export function DeadlineWarnings() {
  const supabase = createClient()
  const [orders, setOrders] = useState<OrderDeadline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, customer_name, service_type, created_at, deadline, status")
        .in("status", ["pending", "in_progress", "review"])
        .not("deadline", "is", null)
        .order("deadline", { ascending: true })
        .limit(20)

      if (data) {
        const withPriority = data.map((order) => {
          const deadline = new Date(order.deadline)
          let priority: OrderDeadline["priority"] = "normal"

          if (isPast(deadline)) {
            priority = "overdue"
          } else if (isToday(deadline)) {
            priority = "today"
          } else if (deadline <= addDays(new Date(), 2)) {
            priority = "urgent"
          }

          return { ...order, priority }
        })

        // Sort: overdue first, then today, urgent, normal
        const sorted = withPriority.sort((a, b) => {
          const priorityOrder = { overdue: 0, today: 1, urgent: 2, normal: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })

        setOrders(sorted)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [supabase])

  const overdueCount = orders.filter((o) => o.priority === "overdue").length
  const todayCount = orders.filter((o) => o.priority === "today").length
  const urgentCount = orders.filter((o) => o.priority === "urgent").length

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs text-muted-foreground">No urgent deadlines</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">Deadline Warnings</CardTitle>
          </div>
          <div className="flex gap-1">
            {overdueCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {overdueCount} overdue
              </Badge>
            )}
            {todayCount > 0 && (
              <Badge className="text-[10px] bg-amber-500">
                {todayCount} today
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-xs">
          Orders approaching or past their deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px]">
          <div className="space-y-1 p-4 pt-0">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  "hover:bg-muted/50",
                  order.priority === "overdue" && "bg-red-500/5 border border-red-500/20",
                  order.priority === "today" && "bg-amber-500/5 border border-amber-500/20",
                  order.priority === "urgent" && "bg-orange-500/5 border border-orange-500/20"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {order.service_type}
                    </span>
                    <Badge
                      variant={
                        order.priority === "overdue"
                          ? "destructive"
                          : order.priority === "today"
                          ? "default"
                          : "secondary"
                      }
                      className="text-[10px] shrink-0"
                    >
                      {order.priority === "overdue"
                        ? "OVERDUE"
                        : order.priority === "today"
                        ? "DUE TODAY"
                        : order.priority === "urgent"
                        ? "2 DAYS"
                        : "UPCOMING"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {order.customer_name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
