"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pause, Play, Clock, AlertTriangle, Calendar, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderPauseProps {
  orderId: string
  currentStatus: "active" | "paused" | "on_hold"
  pausedAt?: string
  pauseReason?: string
  estimatedResume?: string
  onPause: (reason: string, duration?: number) => Promise<void>
  onResume: () => Promise<void>
  className?: string
}

const pauseReasons = [
  { value: "client_request", label: "Client requested pause" },
  { value: "waiting_feedback", label: "Waiting for client feedback" },
  { value: "waiting_assets", label: "Waiting for assets/files" },
  { value: "designer_unavailable", label: "Designer temporarily unavailable" },
  { value: "payment_issue", label: "Payment issue" },
  { value: "scope_change", label: "Scope change discussion" },
  { value: "other", label: "Other reason" },
]

const pauseDurations = [
  { value: "1", label: "1 day" },
  { value: "3", label: "3 days" },
  { value: "7", label: "1 week" },
  { value: "14", label: "2 weeks" },
  { value: "30", label: "1 month" },
  { value: "0", label: "Indefinite" },
]

export function OrderPause({
  orderId,
  currentStatus,
  pausedAt,
  pauseReason,
  estimatedResume,
  onPause,
  onResume,
  className,
}: OrderPauseProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [duration, setDuration] = useState("7")

  const isPaused = currentStatus === "paused" || currentStatus === "on_hold"

  const handlePause = async () => {
    setIsLoading(true)
    try {
      const finalReason = reason === "other" ? customReason : pauseReasons.find(r => r.value === reason)?.label || reason
      await onPause(finalReason, parseInt(duration) || undefined)
      setShowPauseDialog(false)
      setReason("")
      setCustomReason("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResume = async () => {
    setIsLoading(true)
    try {
      await onResume()
      setShowResumeDialog(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getPausedDuration = () => {
    if (!pausedAt) return null
    const pausedDate = new Date(pausedAt)
    const now = new Date()
    const diffMs = now.getTime() - pausedDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""}, ${diffHours} hour${diffHours > 1 ? "s" : ""}`
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`
  }

  if (isPaused) {
    return (
      <Card className={cn("border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pause className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Order Paused</CardTitle>
            </div>
            <Badge variant="outline" className="border-amber-300 bg-amber-100 text-amber-700">
              {currentStatus === "on_hold" ? "On Hold" : "Paused"}
            </Badge>
          </div>
          <CardDescription>
            This order has been paused and is not currently in progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Paused Duration</p>
                <p className="text-sm text-muted-foreground">{getPausedDuration()}</p>
              </div>
            </div>
            {estimatedResume && (
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Estimated Resume</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(estimatedResume).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {pauseReason && (
            <div className="rounded-lg bg-background p-3">
              <p className="text-sm font-medium">Reason</p>
              <p className="text-sm text-muted-foreground">{pauseReason}</p>
            </div>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              While paused, the deadline timer is stopped. Your original turnaround time will resume when the order is unpaused.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2">
                <Play className="h-4 w-4" />
                Resume Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resume Order</DialogTitle>
                <DialogDescription>
                  Are you sure you want to resume this order? The deadline timer will start again.
                </DialogDescription>
              </DialogHeader>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  This order was paused for {getPausedDuration()}. Your remaining turnaround time will resume from where it left off.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResumeDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleResume} disabled={isLoading}>
                  {isLoading ? "Resuming..." : "Resume Order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <Pause className="h-4 w-4" />
          Pause Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pause Order</DialogTitle>
          <DialogDescription>
            Pausing will stop the deadline timer until you resume the order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason for pausing</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {pauseReasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === "other" && (
            <div className="space-y-2">
              <Label>Please specify</Label>
              <Textarea
                placeholder="Enter reason for pausing..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Expected pause duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pauseDurations.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert variant="destructive" className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 [&>svg]:text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Pausing an order too frequently may affect your priority in the queue when resuming.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPauseDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePause}
            disabled={isLoading || !reason || (reason === "other" && !customReason)}
          >
            {isLoading ? "Pausing..." : "Pause Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
