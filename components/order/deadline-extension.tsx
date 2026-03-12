"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Calendar, AlertTriangle, CheckCircle, XCircle, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, differenceInHours } from "date-fns"

interface DeadlineExtensionProps {
  orderId: string
  currentDeadline: Date
  extensions?: {
    id: string
    requestedDays: number
    reason: string
    status: "pending" | "approved" | "rejected"
    requestedAt: string
    reviewedAt?: string
    reviewedBy?: string
    reviewNote?: string
  }[]
  canRequest: boolean
  className?: string
}

export function DeadlineExtension({
  orderId,
  currentDeadline,
  extensions = [],
  canRequest,
  className,
}: DeadlineExtensionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDays, setSelectedDays] = useState("3")
  const [reason, setReason] = useState("")

  const hoursRemaining = differenceInHours(currentDeadline, new Date())
  const isUrgent = hoursRemaining < 24 && hoursRemaining > 0
  const isOverdue = hoursRemaining <= 0

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await fetch(`/api/orders/${orderId}/deadline/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: parseInt(selectedDays),
          reason,
        }),
      })
      setIsOpen(false)
      setReason("")
      setSelectedDays("3")
    } catch (error) {
      console.error("Failed to request extension:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const pendingExtension = extensions.find(e => e.status === "pending")

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Deadline</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              isOverdue && "border-red-500/50 bg-red-500/10 text-red-600",
              isUrgent && !isOverdue && "border-yellow-500/50 bg-yellow-500/10 text-yellow-600",
              !isUrgent && !isOverdue && "border-green-500/50 bg-green-500/10 text-green-600"
            )}
          >
            {isOverdue ? "Overdue" : isUrgent ? "Due Soon" : "On Track"}
          </Badge>
        </div>
        <CardDescription>
          {format(currentDeadline, "EEEE, MMMM d, yyyy 'at' h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Remaining */}
        <div className={cn(
          "rounded-lg border p-4",
          isOverdue && "border-red-500/30 bg-red-500/5",
          isUrgent && !isOverdue && "border-yellow-500/30 bg-yellow-500/5"
        )}>
          <div className="flex items-center gap-2">
            {isOverdue ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <Calendar className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-medium">
              {isOverdue 
                ? `Overdue by ${Math.abs(hoursRemaining)} hours`
                : `${hoursRemaining} hours remaining`
              }
            </span>
          </div>
        </div>

        {/* Pending Extension */}
        {pendingExtension && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Extension Requested</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {pendingExtension.requestedDays} day extension requested on{" "}
              {format(new Date(pendingExtension.requestedAt), "MMM d")}
            </p>
            <p className="mt-2 text-sm">Awaiting review...</p>
          </div>
        )}

        {/* Extension History */}
        {extensions.filter(e => e.status !== "pending").length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Extension History</h4>
            {extensions
              .filter(e => e.status !== "pending")
              .map((ext) => (
                <div
                  key={ext.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-sm",
                    ext.status === "approved" && "border-green-500/30 bg-green-500/5",
                    ext.status === "rejected" && "border-red-500/30 bg-red-500/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {ext.status === "approved" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>
                      {ext.requestedDays} day{ext.requestedDays > 1 ? "s" : ""} - {ext.status}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(ext.requestedAt), "MMM d")}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Request Extension Button */}
        {canRequest && !pendingExtension && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Request Deadline Extension
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Deadline Extension</DialogTitle>
                <DialogDescription>
                  Need more time? Request an extension and we will review it promptly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>How many extra days do you need?</Label>
                  <RadioGroup value={selectedDays} onValueChange={setSelectedDays}>
                    <div className="grid grid-cols-4 gap-2">
                      {["1", "2", "3", "5", "7", "10", "14", "30"].map((days) => (
                        <div key={days}>
                          <RadioGroupItem
                            value={days}
                            id={`days-${days}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`days-${days}`}
                            className={cn(
                              "flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-center transition-colors",
                              "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                            )}
                          >
                            {days}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    New deadline would be:{" "}
                    <span className="font-medium">
                      {format(addDays(currentDeadline, parseInt(selectedDays)), "MMM d, yyyy")}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for extension</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please explain why you need more time..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !reason.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
