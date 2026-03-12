"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Link2, Unlink, ArrowRight, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  orderNumber: string
  title: string
  status: "pending" | "in_progress" | "review" | "completed" | "cancelled"
  estimatedCompletion?: Date
}

interface Dependency {
  id: string
  dependsOn: Order
  dependencyType: "blocks" | "soft"
  createdAt: Date
}

interface OrderDependenciesProps {
  order: Order
  availableOrders: Order[]
  dependencies: Dependency[]
  onAddDependency?: (orderId: string, dependsOnId: string, type: "blocks" | "soft") => void
  onRemoveDependency?: (dependencyId: string) => void
  className?: string
}

export function OrderDependencies({
  order,
  availableOrders,
  dependencies,
  onAddDependency,
  onRemoveDependency,
  className
}: OrderDependenciesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string>("")
  const [dependencyType, setDependencyType] = useState<"blocks" | "soft">("blocks")
  const [isAdding, setIsAdding] = useState(false)

  const existingDependencyIds = dependencies.map(d => d.dependsOn.id)
  const availableToLink = availableOrders.filter(
    o => o.id !== order.id && !existingDependencyIds.includes(o.id)
  )

  const handleAddDependency = async () => {
    if (!selectedOrder) return
    setIsAdding(true)
    try {
      await onAddDependency?.(order.id, selectedOrder, dependencyType)
      setSelectedOrder("")
      setIsDialogOpen(false)
    } finally {
      setIsAdding(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in_progress":
      case "review":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusLabel = (status: Order["status"]) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  const blockedBy = dependencies.filter(d => d.dependencyType === "blocks" && d.dependsOn.status !== "completed")
  const isBlocked = blockedBy.length > 0

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
            <CardDescription className="text-xs">
              Orders that must complete before this one can start
            </CardDescription>
          </div>
          {isBlocked && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Blocked
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {dependencies.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No dependencies. This order can start immediately.
          </p>
        ) : (
          <div className="space-y-3">
            {dependencies.map(dep => (
              <div
                key={dep.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  dep.dependencyType === "blocks" && dep.dependsOn.status !== "completed"
                    ? "border-amber-200 bg-amber-50"
                    : "border-border"
                )}
              >
                {getStatusIcon(dep.dependsOn.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{dep.dependsOn.orderNumber}</p>
                  <p className="text-xs text-muted-foreground truncate">{dep.dependsOn.title}</p>
                </div>
                <Badge variant={dep.dependencyType === "blocks" ? "default" : "secondary"}>
                  {dep.dependencyType === "blocks" ? "Blocking" : "Soft"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRemoveDependency?.(dep.id)}
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Link2 className="mr-2 h-4 w-4" />
              Add Dependency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Dependency</DialogTitle>
              <DialogDescription>
                Select an order that must complete before {order.orderNumber} can start.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Depends On</label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToLink.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No orders available to link
                      </div>
                    ) : (
                      availableToLink.map(o => (
                        <SelectItem key={o.id} value={o.id}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(o.status)}
                            <span>{o.orderNumber}</span>
                            <span className="text-muted-foreground">- {o.title}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dependency Type</label>
                <Select value={dependencyType} onValueChange={(v) => setDependencyType(v as "blocks" | "soft")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blocks">
                      <div>
                        <p className="font-medium">Blocking</p>
                        <p className="text-xs text-muted-foreground">Must complete before this order can start</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="soft">
                      <div>
                        <p className="font-medium">Soft</p>
                        <p className="text-xs text-muted-foreground">Recommended to complete first, but not required</p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedOrder && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {availableToLink.find(o => o.id === selectedOrder)?.orderNumber}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{order.orderNumber}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {dependencyType === "blocks" 
                        ? "This order will be blocked until the dependency completes"
                        : "This order can start but completion is recommended first"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDependency} disabled={!selectedOrder || isAdding}>
                {isAdding ? "Adding..." : "Add Dependency"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
