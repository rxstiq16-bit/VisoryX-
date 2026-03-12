"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarClock, Clock, Calendar as CalendarIcon, Repeat, AlertCircle, CheckCircle } from "lucide-react"
import { format, addDays, addWeeks, addMonths, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"

interface ScheduledOrderProps {
  onSchedule?: (data: {
    startDate: Date
    recurring: boolean
    frequency?: "weekly" | "monthly" | "quarterly"
    notes?: string
  }) => void
  className?: string
}

export function ScheduledOrder({ onSchedule, className }: ScheduledOrderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "quarterly">("monthly")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = startOfDay(new Date())
  const canSchedule = startDate && !isBefore(startDate, today)

  const getNextOccurrences = () => {
    if (!startDate || !isRecurring) return []
    const occurrences: Date[] = []
    let current = startDate
    
    for (let i = 0; i < 3; i++) {
      switch (frequency) {
        case "weekly":
          current = addWeeks(current, 1)
          break
        case "monthly":
          current = addMonths(current, 1)
          break
        case "quarterly":
          current = addMonths(current, 3)
          break
      }
      occurrences.push(current)
    }
    return occurrences
  }

  const handleSchedule = async () => {
    if (!canSchedule) return
    setIsSubmitting(true)
    
    try {
      await onSchedule?.({
        startDate: startDate!,
        recurring: isRecurring,
        frequency: isRecurring ? frequency : undefined,
        notes: notes || undefined
      })
      setIsDialogOpen(false)
      setStartDate(undefined)
      setIsRecurring(false)
      setNotes("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Future Order</DialogTitle>
          <DialogDescription>
            Set when this order should start. Great for planned projects or recurring needs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => isBefore(date, today)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {startDate && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStartDate(addDays(today, 1))}
                >
                  Tomorrow
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStartDate(addWeeks(today, 1))}
                >
                  Next Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStartDate(addMonths(today, 1))}
                >
                  Next Month
                </Button>
              </div>
            )}
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="recurring">Recurring Order</Label>
              <p className="text-xs text-muted-foreground">
                Automatically create new orders on a schedule
              </p>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {/* Frequency Selection */}
          {isRecurring && (
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>

              {/* Preview Next Occurrences */}
              {startDate && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Repeat className="h-4 w-4" />
                      Upcoming Orders
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="default" className="text-xs">First</Badge>
                        <span>{format(startDate, "PPP")}</span>
                      </div>
                      {getNextOccurrences().map((date, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">Then</Badge>
                          <span>{format(date, "PPP")}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any special instructions for this scheduled order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={!canSchedule || isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Order Pause/Hold Component
interface OrderPauseProps {
  orderId: string
  isPaused: boolean
  pausedUntil?: Date
  pauseReason?: string
  onPause?: (orderId: string, until?: Date, reason?: string) => void
  onResume?: (orderId: string) => void
  className?: string
}

export function OrderPause({
  orderId,
  isPaused,
  pausedUntil,
  pauseReason,
  onPause,
  onResume,
  className
}: OrderPauseProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pauseDate, setPauseDate] = useState<Date | undefined>(undefined)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePause = async () => {
    setIsSubmitting(true)
    try {
      await onPause?.(orderId, pauseDate, reason || undefined)
      setIsDialogOpen(false)
      setPauseDate(undefined)
      setReason("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResume = async () => {
    setIsSubmitting(true)
    try {
      await onResume?.(orderId)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPaused) {
    return (
      <Card className={cn("border-amber-200 bg-amber-50", className)}>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">Order Paused</p>
              {pausedUntil && (
                <p className="text-sm text-amber-700">
                  Until {format(pausedUntil, "PPP")}
                </p>
              )}
              {pauseReason && (
                <p className="text-sm text-amber-600 mt-1">{pauseReason}</p>
              )}
            </div>
            <Button size="sm" onClick={handleResume} disabled={isSubmitting}>
              {isSubmitting ? "Resuming..." : "Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Clock className="mr-2 h-4 w-4" />
          Pause Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause Order</DialogTitle>
          <DialogDescription>
            Temporarily pause this order. Work will stop until resumed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Resume Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !pauseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pauseDate ? format(pauseDate, "PPP") : "Auto-resume on date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pauseDate}
                  onSelect={setPauseDate}
                  disabled={(date) => isBefore(date, new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Why is this order being paused?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handlePause} disabled={isSubmitting}>
            {isSubmitting ? "Pausing..." : "Pause Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
