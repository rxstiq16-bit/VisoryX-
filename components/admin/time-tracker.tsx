"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, Pause, Square, Clock, Timer, Edit2, Trash2, Calendar, ChevronDown, Package } from "lucide-react"
import { formatDistanceStrict, format, differenceInSeconds, startOfDay, endOfDay } from "date-fns"
import { cn } from "@/lib/utils"

interface TimeEntry {
  id: string
  orderId?: string
  orderNumber?: string
  description: string
  startTime: Date
  endTime?: Date
  duration: number // seconds
  billable: boolean
}

interface ActiveTimer {
  orderId?: string
  orderNumber?: string
  description: string
  startTime: Date
}

interface Order {
  id: string
  orderNumber: string
  title: string
}

interface TimeTrackerProps {
  userId: string
  orders?: Order[]
  onSaveEntry?: (entry: Omit<TimeEntry, "id">) => Promise<void>
  onDeleteEntry?: (entryId: string) => Promise<void>
  className?: string
}

export function TimeTracker({ orders = [], onSaveEntry, onDeleteEntry, className }: TimeTrackerProps) {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<string>("")
  const [description, setDescription] = useState("")
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([])
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false)

  // Update elapsed time every second when timer is running
  useEffect(() => {
    if (!activeTimer) {
      setElapsedTime(0)
      return
    }

    const interval = setInterval(() => {
      setElapsedTime(differenceInSeconds(new Date(), activeTimer.startTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTimer])

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }, [])

  const startTimer = () => {
    const order = orders.find(o => o.id === selectedOrder)
    setActiveTimer({
      orderId: selectedOrder || undefined,
      orderNumber: order?.orderNumber,
      description: description || "Working",
      startTime: new Date(),
    })
  }

  const pauseTimer = () => {
    // For now, stopping and saving
    stopTimer()
  }

  const stopTimer = async () => {
    if (!activeTimer) return

    const entry: Omit<TimeEntry, "id"> = {
      orderId: activeTimer.orderId,
      orderNumber: activeTimer.orderNumber,
      description: activeTimer.description,
      startTime: activeTimer.startTime,
      endTime: new Date(),
      duration: elapsedTime,
      billable: !!activeTimer.orderId,
    }

    await onSaveEntry?.(entry)
    
    // Add to today's entries
    setTodayEntries(prev => [...prev, { ...entry, id: Date.now().toString() }])
    
    setActiveTimer(null)
    setElapsedTime(0)
    setDescription("")
  }

  const totalToday = todayEntries.reduce((sum, entry) => sum + entry.duration, 0)
  const billableToday = todayEntries
    .filter(e => e.billable)
    .reduce((sum, entry) => sum + entry.duration, 0)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Active Timer */}
      <Card className={cn(activeTimer && "border-primary bg-primary/5")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Time Tracker
              </CardTitle>
              <CardDescription>Track time spent on orders</CardDescription>
            </div>
            {activeTimer && (
              <Badge variant="default" className="animate-pulse">
                Recording
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Timer Display */}
          <div className="flex items-center justify-center py-4">
            <div className={cn(
              "text-5xl font-mono font-bold tabular-nums",
              activeTimer ? "text-primary" : "text-muted-foreground"
            )}>
              {formatDuration(elapsedTime)}
            </div>
          </div>

          {/* Timer Controls */}
          {!activeTimer ? (
            <>
              <div className="grid gap-3">
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No order (internal)</SelectItem>
                    {orders.map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{order.orderNumber}</span>
                          <span className="text-muted-foreground">- {order.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="What are you working on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={startTimer}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Timer
                </Button>
                <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Manual Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ManualTimeEntry
                      orders={orders}
                      onSave={async (entry) => {
                        await onSaveEntry?.(entry)
                        setTodayEntries(prev => [...prev, { ...entry, id: Date.now().toString() }])
                        setIsManualEntryOpen(false)
                      }}
                      onCancel={() => setIsManualEntryOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                {activeTimer.orderNumber && (
                  <Badge variant="outline">{activeTimer.orderNumber}</Badge>
                )}
                <span className="text-muted-foreground">{activeTimer.description}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={pauseTimer}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button variant="destructive" className="flex-1" onClick={stopTimer}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Today&apos;s Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-2xl font-bold">{formatDuration(totalToday)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Billable</p>
              <p className="text-2xl font-bold text-green-600">{formatDuration(billableToday)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Entries */}
      {todayEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Time Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1 h-10 rounded-full",
                    entry.billable ? "bg-green-500" : "bg-muted"
                  )} />
                  <div>
                    <div className="flex items-center gap-2">
                      {entry.orderNumber && (
                        <Badge variant="outline" className="text-xs">{entry.orderNumber}</Badge>
                      )}
                      <span className="font-medium text-sm">{entry.description}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(entry.startTime, "HH:mm")} - {entry.endTime ? format(entry.endTime, "HH:mm") : "Now"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{formatDuration(entry.duration)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDeleteEntry?.(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Manual Time Entry Component
interface ManualTimeEntryProps {
  orders: Order[]
  onSave: (entry: Omit<TimeEntry, "id">) => Promise<void>
  onCancel: () => void
}

function ManualTimeEntry({ orders, onSave, onCancel }: ManualTimeEntryProps) {
  const [selectedOrder, setSelectedOrder] = useState("")
  const [description, setDescription] = useState("")
  const [hours, setHours] = useState("0")
  const [minutes, setMinutes] = useState("30")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const duration = parseInt(hours) * 3600 + parseInt(minutes) * 60
    if (duration <= 0) return

    setIsSaving(true)
    const order = orders.find(o => o.id === selectedOrder)
    const now = new Date()
    
    await onSave({
      orderId: selectedOrder || undefined,
      orderNumber: order?.orderNumber,
      description: description || "Manual entry",
      startTime: new Date(now.getTime() - duration * 1000),
      endTime: now,
      duration,
      billable: !!selectedOrder,
    })
    setIsSaving(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Manual Time Entry</DialogTitle>
        <DialogDescription>
          Manually add time spent on a task
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <Select value={selectedOrder} onValueChange={setSelectedOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Select an order (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No order (internal)</SelectItem>
            {orders.map(order => (
              <SelectItem key={order.id} value={order.id}>
                {order.orderNumber} - {order.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Hours</label>
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(13)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>{i}h</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Minutes</label>
            <Select value={minutes} onValueChange={setMinutes}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 15, 30, 45].map(m => (
                  <SelectItem key={m} value={m.toString()}>{m}m</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving || (parseInt(hours) === 0 && parseInt(minutes) === 0)}>
          {isSaving ? "Saving..." : "Add Entry"}
        </Button>
      </DialogFooter>
    </>
  )
}
