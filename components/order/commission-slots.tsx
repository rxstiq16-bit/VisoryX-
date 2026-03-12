"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Clock, Users, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface SlotStatus {
  totalSlots: number
  usedSlots: number
  availableSlots: number
  queuePosition: number | null
  estimatedWait: string | null
}

export function CommissionSlots({ className }: { className?: string }) {
  const [status, setStatus] = useState<SlotStatus>({
    totalSlots: 10,
    usedSlots: 7,
    availableSlots: 3,
    queuePosition: null,
    estimatedWait: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlotStatus = async () => {
      const supabase = createClient()
      
      // Get active orders count
      const { count: activeOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "in_progress", "review", "revision"])

      // Get total capacity from settings or use default
      const totalCapacity = 10
      const used = activeOrders || 0
      
      setStatus({
        totalSlots: totalCapacity,
        usedSlots: Math.min(used, totalCapacity),
        availableSlots: Math.max(totalCapacity - used, 0),
        queuePosition: used > totalCapacity ? used - totalCapacity + 1 : null,
        estimatedWait: used > totalCapacity ? `${Math.ceil((used - totalCapacity) * 2)} days` : null,
      })
      setLoading(false)
    }

    fetchSlotStatus()
    const interval = setInterval(fetchSlotStatus, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const percentUsed = (status.usedSlots / status.totalSlots) * 100
  const isHighDemand = percentUsed >= 80
  const isSoldOut = status.availableSlots === 0

  if (loading) {
    return <Card className={cn("animate-pulse", className)}><CardContent className="h-32" /></Card>
  }

  return (
    <Card className={cn(isSoldOut ? "border-orange-500/50" : isHighDemand ? "border-yellow-500/50" : "", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" />
            Commission Slots
          </CardTitle>
          {isSoldOut ? (
            <Badge variant="destructive">Sold Out</Badge>
          ) : isHighDemand ? (
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">High Demand</Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">Available</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{status.usedSlots} of {status.totalSlots} slots filled</span>
            <span className={cn("font-medium", isSoldOut ? "text-orange-500" : isHighDemand ? "text-yellow-500" : "text-green-500")}>
              {status.availableSlots} available
            </span>
          </div>
          <Progress value={percentUsed} className={cn("h-2", isSoldOut ? "[&>div]:bg-orange-500" : isHighDemand ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500")} />
        </div>

        {isSoldOut ? (
          <div className="flex items-start gap-3 rounded-lg bg-orange-500/10 p-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">All slots are currently filled</p>
              <p className="text-sm text-muted-foreground">Join the waitlist to be notified when a slot opens up.</p>
              {status.queuePosition && (
                <p className="mt-1 text-sm">
                  <span className="font-medium">Queue position: #{status.queuePosition}</span>
                  {status.estimatedWait && <span className="text-muted-foreground"> • Est. wait: {status.estimatedWait}</span>}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">In Queue</p>
                <p className="font-medium">{status.usedSlots} orders</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Avg. Turnaround</p>
                <p className="font-medium">2-3 days</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
