"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Scissors, Merge, ArrowRight, Package, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  total: number
  status: string
}

interface OrderSplittingProps {
  order: Order
  onSplit?: (originalOrderId: string, newOrders: { items: string[] }[]) => void
  className?: string
}

export function OrderSplitting({ order, onSplit, className }: OrderSplittingProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSplitting, setIsSplitting] = useState(false)

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const canSplit = selectedItems.size > 0 && selectedItems.size < order.items.length

  const selectedTotal = order.items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const remainingTotal = order.total - selectedTotal

  const handleSplit = async () => {
    if (!canSplit) return
    setIsSplitting(true)
    
    try {
      const selectedItemIds = Array.from(selectedItems)
      const remainingItemIds = order.items
        .filter(item => !selectedItems.has(item.id))
        .map(item => item.id)
      
      await onSplit?.(order.id, [
        { items: remainingItemIds },
        { items: selectedItemIds }
      ])
      
      setIsDialogOpen(false)
      setSelectedItems(new Set())
    } finally {
      setIsSplitting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Scissors className="mr-2 h-4 w-4" />
          Split Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Split Order {order.orderNumber}</DialogTitle>
          <DialogDescription>
            Select items to move to a new order. The remaining items will stay in the original order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Original Order */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Original Order</CardTitle>
                <CardDescription className="text-xs">Items staying here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.items
                  .filter(item => !selectedItems.has(item.id))
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>${remainingTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* New Order */}
            <Card className={cn(selectedItems.size === 0 && "opacity-50")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">New Order</CardTitle>
                <CardDescription className="text-xs">Items moving here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedItems.size === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Select items below to create a new order
                  </p>
                ) : (
                  <>
                    {order.items
                      .filter(item => selectedItems.has(item.id))
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>${selectedTotal.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Item Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Select Items to Split</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                    selectedItems.has(item.id) 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => handleItemToggle(item.id)}
                >
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => handleItemToggle(item.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={selectedItems.has(item.id) ? "default" : "outline"}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {!canSplit && selectedItems.size > 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>You must leave at least one item in the original order</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSplit} disabled={!canSplit || isSplitting}>
            {isSplitting ? "Splitting..." : "Split Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Order Merging Component
interface OrderMergingProps {
  orders: Order[]
  onMerge?: (orderIds: string[]) => void
  className?: string
}

export function OrderMerging({ orders, onMerge, className }: OrderMergingProps) {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMerging, setIsMerging] = useState(false)

  const handleOrderToggle = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const canMerge = selectedOrders.size >= 2

  const mergedTotal = orders
    .filter(order => selectedOrders.has(order.id))
    .reduce((sum, order) => sum + order.total, 0)

  const mergedItemCount = orders
    .filter(order => selectedOrders.has(order.id))
    .reduce((sum, order) => sum + order.items.length, 0)

  const handleMerge = async () => {
    if (!canMerge) return
    setIsMerging(true)
    
    try {
      await onMerge?.(Array.from(selectedOrders))
      setIsDialogOpen(false)
      setSelectedOrders(new Set())
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Merge className="mr-2 h-4 w-4" />
          Merge Orders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Merge Orders</DialogTitle>
          <DialogDescription>
            Select two or more orders to combine into a single order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {orders.map(order => (
            <div
              key={order.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer",
                selectedOrders.has(order.id) 
                  ? "border-primary bg-primary/5" 
                  : "hover:bg-muted/50"
              )}
              onClick={() => handleOrderToggle(order.id)}
            >
              <Checkbox
                checked={selectedOrders.has(order.id)}
                onCheckedChange={() => handleOrderToggle(order.id)}
              />
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} items
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total.toFixed(2)}</p>
                <Badge variant="outline" className="text-xs">{order.status}</Badge>
              </div>
            </div>
          ))}

          {canMerge && (
            <Card className="bg-primary/5 border-primary">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-primary mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Merged Order Preview</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Items</span>
                  <span>{mergedItemCount}</span>
                </div>
                <div className="flex justify-between font-medium mt-1">
                  <span>Combined Total</span>
                  <span>${mergedTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={!canMerge || isMerging}>
            {isMerging ? "Merging..." : `Merge ${selectedOrders.size} Orders`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
