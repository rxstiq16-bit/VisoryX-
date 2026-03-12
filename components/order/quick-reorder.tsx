"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { RefreshCw, ArrowRight, Loader2, Package, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface PastOrder {
  id: string
  service_type: string
  service_name?: string
  status: string
  total_price: number
  created_at: string
  requirements?: Record<string, unknown>
}

export function QuickReorder() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [orders, setOrders] = useState<PastOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<PastOrder | null>(null)
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, service_type, service_name, status, total_price, created_at, requirements")
        .eq("user_id", user.id)
        .eq("status", "delivered")
        .order("created_at", { ascending: false })
        .limit(10)

      if (data) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [user, supabase])

  const handleReorder = async () => {
    if (!selectedOrder || !user) return

    setReordering(true)

    try {
      // Create a new order based on the previous one
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          service_type: selectedOrder.service_type,
          service_name: selectedOrder.service_name,
          requirements: selectedOrder.requirements,
          total_price: selectedOrder.total_price,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Reorder created! Complete payment to proceed.")
      setSelectedOrder(null)
      router.push(`/checkout?order=${newOrder.id}`)
    } catch (error) {
      toast.error("Failed to create reorder")
    } finally {
      setReordering(false)
    }
  }

  if (!user) return null
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) return null

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Quick Reorder</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => router.push("/dashboard/orders")}>
              View All
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Reorder from your recently completed orders
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "flex-shrink-0 w-[200px] rounded-lg border bg-card p-3 text-left transition-all",
                    "hover:border-primary/50 hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-[10px]">
                      ${(order.total_price / 100).toFixed(2)}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm truncate mb-1">
                    {order.service_name || order.service_type}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </div>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reorder Confirmation</DialogTitle>
            <DialogDescription>
              Create a new order with the same specifications as your previous order.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    {selectedOrder.service_name || selectedOrder.service_type}
                  </h4>
                  <Badge>${(selectedOrder.total_price / 100).toFixed(2)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Original order from{" "}
                  {formatDistanceToNow(new Date(selectedOrder.created_at), { addSuffix: true })}
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>A new order will be created with the same:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Service type and options</li>
                  <li>Project requirements</li>
                  <li>Pricing</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleReorder} disabled={reordering} className="gap-2">
              {reordering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Continue to Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
