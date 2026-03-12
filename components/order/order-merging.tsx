"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Merge, ArrowRight, Package, Clock, DollarSign, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  orderNumber: string
  title: string
  status: string
  service: string
  price: number
  estimatedDelivery: string
  designerId?: string
}

interface OrderMergingProps {
  orders: Order[]
  onMerge: (orderIds: string[]) => Promise<void>
  className?: string
}

export function OrderMerging({ orders, onMerge, className }: OrderMergingProps) {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const eligibleOrders = orders.filter(o => 
    o.status === "pending" || o.status === "in_queue"
  )

  const toggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const selectedOrdersList = eligibleOrders.filter(o => selectedOrders.has(o.id))
  
  const getTotalPrice = () => selectedOrdersList.reduce((acc, o) => acc + o.price, 0)
  
  const getDiscount = () => {
    if (selectedOrdersList.length >= 4) return 0.15
    if (selectedOrdersList.length >= 3) return 0.10
    if (selectedOrdersList.length >= 2) return 0.05
    return 0
  }

  const getDiscountedPrice = () => {
    const total = getTotalPrice()
    return total - (total * getDiscount())
  }

  const canMerge = selectedOrders.size >= 2

  const handleMerge = async () => {
    if (!canMerge) return
    setIsLoading(true)
    try {
      await onMerge(Array.from(selectedOrders))
      setShowDialog(false)
      setSelectedOrders(new Set())
    } finally {
      setIsLoading(false)
    }
  }

  if (eligibleOrders.length < 2) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Merge className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium">No Orders to Merge</p>
          <p className="text-sm text-muted-foreground">
            You need at least 2 pending orders to use this feature
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Merge className="h-5 w-5" />
          Merge Orders
        </CardTitle>
        <CardDescription>
          Combine multiple orders for bulk discounts and streamlined delivery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Merge 2+ orders for 5% off, 3+ for 10% off, or 4+ for 15% off!
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          {eligibleOrders.map((order) => (
            <div
              key={order.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                selectedOrders.has(order.id) && "border-primary bg-primary/5"
              )}
            >
              <Checkbox
                checked={selectedOrders.has(order.id)}
                onCheckedChange={() => toggleOrder(order.id)}
              />
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{order.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {order.orderNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{order.service}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {order.estimatedDelivery}
                  </span>
                </div>
              </div>
              <p className="font-medium">${order.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {selectedOrders.size >= 2 && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal ({selectedOrders.size} orders)</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            {getDiscount() > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Bundle Discount ({(getDiscount() * 100).toFixed(0)}%)</span>
                <span>-${(getTotalPrice() * getDiscount()).toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between font-medium border-t pt-2">
              <span>Total</span>
              <span>${getDiscountedPrice().toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" disabled={!canMerge}>
              <Merge className="h-4 w-4" />
              Merge {selectedOrders.size} Orders
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Order Merge</DialogTitle>
              <DialogDescription>
                This will combine {selectedOrders.size} orders into a single order.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {selectedOrdersList.map((o) => (
                      <Badge key={o.id} variant="outline">{o.orderNumber}</Badge>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <Badge className="bg-primary">NEW-MERGED</Badge>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Orders Combined</span>
                  <span>{selectedOrders.size}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>You Save</span>
                  <span>${(getTotalPrice() * getDiscount()).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>New Total</span>
                  <span>${getDiscountedPrice().toFixed(2)}</span>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Merged orders will be assigned to a single designer for consistent quality and faster delivery.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleMerge} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Merging...
                  </>
                ) : (
                  <>
                    <Merge className="h-4 w-4" />
                    Confirm Merge
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
