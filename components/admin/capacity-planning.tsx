"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Package, AlertTriangle, CheckCircle, Clock, TrendingUp, Minus, Plus } from "lucide-react"
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, isToday, isPast } from "date-fns"
import { cn } from "@/lib/utils"

interface Designer {
  id: string
  name: string
  avatar?: string
  maxCapacity: number // max orders per day
  currentLoad: number // current orders assigned
  skills: string[]
  availability: {
    date: Date
    available: boolean
    capacity: number
    assigned: number
  }[]
}

interface PendingOrder {
  id: string
  orderNumber: string
  title: string
  category: string
  estimatedHours: number
  dueDate: Date
  priority: "low" | "normal" | "high" | "urgent"
  assignedTo?: string
}

interface CapacityPlanningProps {
  designers: Designer[]
  pendingOrders: PendingOrder[]
  onAssign?: (orderId: string, designerId: string) => void
  onAdjustCapacity?: (designerId: string, date: Date, capacity: number) => void
  className?: string
}

export function CapacityPlanning({
  designers,
  pendingOrders,
  onAssign,
  onAdjustCapacity,
  className
}: CapacityPlanningProps) {
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week
  const [selectedDesigner, setSelectedDesigner] = useState<string>("")
  const [viewMode, setViewMode] = useState<"overview" | "assign">("overview")

  const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), selectedWeek * 7)
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6)
  })

  const totalCapacity = designers.reduce((sum, d) => sum + d.maxCapacity, 0)
  const totalLoad = designers.reduce((sum, d) => sum + d.currentLoad, 0)
  const utilizationRate = totalCapacity > 0 ? (totalLoad / totalCapacity) * 100 : 0

  const unassignedOrders = pendingOrders.filter(o => !o.assignedTo)
  const urgentOrders = unassignedOrders.filter(o => o.priority === "urgent" || o.priority === "high")

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Capacity Planning
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage team workload and order assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("overview")}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === "assign" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("assign")}
          >
            Assign Orders
          </Button>
        </div>
      </div>

      {/* Capacity Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Team Size
            </div>
            <p className="text-2xl font-bold mt-1">{designers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Utilization
            </div>
            <p className="text-2xl font-bold mt-1">{utilizationRate.toFixed(0)}%</p>
            <Progress value={utilizationRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              Unassigned
            </div>
            <p className="text-2xl font-bold mt-1">{unassignedOrders.length}</p>
          </CardContent>
        </Card>
        <Card className={cn(urgentOrders.length > 0 && "border-amber-200 bg-amber-50")}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              Urgent
            </div>
            <p className="text-2xl font-bold mt-1 text-amber-700">{urgentOrders.length}</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === "overview" ? (
        <>
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(s => s - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(0)}
                disabled={selectedWeek === 0}
              >
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(s => s + 1)}
              >
                Next
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </p>
          </div>

          {/* Weekly Calendar Grid */}
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-sm p-2 w-48">Designer</th>
                    {weekDays.map(day => (
                      <th
                        key={day.toISOString()}
                        className={cn(
                          "text-center font-medium text-sm p-2",
                          isToday(day) && "bg-primary/5"
                        )}
                      >
                        <p>{format(day, "EEE")}</p>
                        <p className="text-muted-foreground">{format(day, "d")}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {designers.map(designer => (
                    <tr key={designer.id} className="border-t">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={designer.avatar} />
                            <AvatarFallback>{designer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{designer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {designer.currentLoad}/{designer.maxCapacity} today
                            </p>
                          </div>
                        </div>
                      </td>
                      {weekDays.map(day => {
                        const dayData = designer.availability.find(a => isSameDay(a.date, day))
                        const assigned = dayData?.assigned || 0
                        const capacity = dayData?.capacity || designer.maxCapacity
                        const available = dayData?.available !== false
                        const loadPercent = capacity > 0 ? (assigned / capacity) * 100 : 0

                        return (
                          <td
                            key={day.toISOString()}
                            className={cn(
                              "text-center p-2",
                              isToday(day) && "bg-primary/5",
                              isPast(day) && !isToday(day) && "opacity-50"
                            )}
                          >
                            {!available ? (
                              <Badge variant="outline" className="text-xs">Off</Badge>
                            ) : (
                              <div className="space-y-1">
                                <div className={cn(
                                  "text-sm font-medium",
                                  loadPercent >= 100 && "text-red-500",
                                  loadPercent >= 80 && loadPercent < 100 && "text-amber-500"
                                )}>
                                  {assigned}/{capacity}
                                </div>
                                <Progress
                                  value={Math.min(loadPercent, 100)}
                                  className={cn(
                                    "h-1.5",
                                    loadPercent >= 100 && "[&>div]:bg-red-500",
                                    loadPercent >= 80 && loadPercent < 100 && "[&>div]:bg-amber-500"
                                  )}
                                />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Order Assignment View */}
          <div className="grid grid-cols-3 gap-6">
            {/* Unassigned Orders */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Unassigned Orders ({unassignedOrders.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unassignedOrders.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    All orders are assigned
                  </div>
                ) : (
                  unassignedOrders.map(order => (
                    <div
                      key={order.id}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg border",
                        order.priority === "urgent" && "border-red-200 bg-red-50",
                        order.priority === "high" && "border-amber-200 bg-amber-50"
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{order.orderNumber}</Badge>
                          {order.priority === "urgent" && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                          {order.priority === "high" && (
                            <Badge className="bg-amber-500">High</Badge>
                          )}
                        </div>
                        <p className="font-medium mt-1">{order.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.category} - {order.estimatedHours}h - Due {format(order.dueDate, "MMM d")}
                        </p>
                      </div>
                      <Select onValueChange={(designerId) => onAssign?.(order.id, designerId)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {designers.map(d => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Designer Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Designer Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {designers.map(designer => {
                  const loadPercent = (designer.currentLoad / designer.maxCapacity) * 100
                  return (
                    <div key={designer.id} className="p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={designer.avatar} />
                          <AvatarFallback>{designer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{designer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {designer.currentLoad}/{designer.maxCapacity} orders
                          </p>
                        </div>
                        <Badge
                          variant={loadPercent >= 100 ? "destructive" : loadPercent >= 80 ? "secondary" : "outline"}
                        >
                          {loadPercent >= 100 ? "Full" : loadPercent >= 80 ? "Busy" : "Available"}
                        </Badge>
                      </div>
                      <Progress
                        value={Math.min(loadPercent, 100)}
                        className={cn(
                          "mt-2 h-1.5",
                          loadPercent >= 100 && "[&>div]:bg-red-500",
                          loadPercent >= 80 && loadPercent < 100 && "[&>div]:bg-amber-500"
                        )}
                      />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {designer.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
