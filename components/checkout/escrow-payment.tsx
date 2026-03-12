"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle, Loader2, Lock, Unlock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface EscrowPaymentProps {
  orderId: string
  amount: number
  milestones?: {
    id: string
    title: string
    amount: number
    status: "pending" | "in_escrow" | "released" | "refunded"
    completedAt?: string
  }[]
  status: "pending" | "funded" | "partial_release" | "completed" | "disputed" | "refunded"
  className?: string
}

export function EscrowPayment({ 
  orderId, 
  amount, 
  milestones = [],
  status,
  className 
}: EscrowPaymentProps) {
  const [isReleasing, setIsReleasing] = useState(false)
  const [isDisputing, setIsDisputing] = useState(false)
  const [disputeReason, setDisputeReason] = useState("")
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)

  const releasedAmount = milestones
    .filter(m => m.status === "released")
    .reduce((sum, m) => sum + m.amount, 0)
  
  const inEscrowAmount = milestones
    .filter(m => m.status === "in_escrow")
    .reduce((sum, m) => sum + m.amount, 0)

  const releaseProgress = (releasedAmount / amount) * 100

  const handleReleaseMilestone = async (milestoneId: string) => {
    setIsReleasing(true)
    setSelectedMilestone(milestoneId)
    try {
      await fetch(`/api/orders/${orderId}/escrow/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId }),
      })
      // Refresh data
    } catch (error) {
      console.error("Failed to release escrow:", error)
    } finally {
      setIsReleasing(false)
      setSelectedMilestone(null)
    }
  }

  const handleDispute = async () => {
    setIsDisputing(true)
    try {
      await fetch(`/api/orders/${orderId}/escrow/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: disputeReason }),
      })
    } catch (error) {
      console.error("Failed to file dispute:", error)
    } finally {
      setIsDisputing(false)
    }
  }

  const statusConfig = {
    pending: { label: "Awaiting Payment", color: "bg-yellow-500/10 text-yellow-600", icon: Clock },
    funded: { label: "Funds in Escrow", color: "bg-blue-500/10 text-blue-600", icon: Lock },
    partial_release: { label: "Partial Release", color: "bg-purple-500/10 text-purple-600", icon: Unlock },
    completed: { label: "Completed", color: "bg-green-500/10 text-green-600", icon: CheckCircle },
    disputed: { label: "Under Dispute", color: "bg-red-500/10 text-red-600", icon: AlertTriangle },
    refunded: { label: "Refunded", color: "bg-gray-500/10 text-gray-600", icon: XCircle },
  }

  const StatusIcon = statusConfig[status].icon

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Escrow Payment</CardTitle>
              <CardDescription>Secure milestone-based payments</CardDescription>
            </div>
          </div>
          <Badge className={cn("gap-1", statusConfig[status].color)}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border bg-blue-500/5 p-4 text-center">
            <p className="text-sm text-muted-foreground">In Escrow</p>
            <p className="text-2xl font-bold text-blue-600">${inEscrowAmount.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border bg-green-500/5 p-4 text-center">
            <p className="text-sm text-muted-foreground">Released</p>
            <p className="text-2xl font-bold text-green-600">${releasedAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Release Progress</span>
            <span className="font-medium">{releaseProgress.toFixed(0)}%</span>
          </div>
          <Progress value={releaseProgress} className="h-2" />
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Payment Milestones</h4>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4 transition-colors",
                    milestone.status === "in_escrow" && "border-blue-500/50 bg-blue-500/5",
                    milestone.status === "released" && "border-green-500/50 bg-green-500/5",
                    milestone.status === "refunded" && "border-gray-500/50 bg-gray-500/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      milestone.status === "pending" && "bg-yellow-500/10",
                      milestone.status === "in_escrow" && "bg-blue-500/10",
                      milestone.status === "released" && "bg-green-500/10",
                      milestone.status === "refunded" && "bg-gray-500/10"
                    )}>
                      {milestone.status === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                      {milestone.status === "in_escrow" && <Lock className="h-4 w-4 text-blue-600" />}
                      {milestone.status === "released" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {milestone.status === "refunded" && <XCircle className="h-4 w-4 text-gray-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${milestone.amount.toFixed(2)}
                        {milestone.completedAt && ` - Released ${new Date(milestone.completedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  {milestone.status === "in_escrow" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Unlock className="h-3 w-3" />
                          Release
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Release Milestone Payment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to release ${milestone.amount.toFixed(2)} for "{milestone.title}"? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReleaseMilestone(milestone.id)}
                            disabled={isReleasing && selectedMilestone === milestone.id}
                          >
                            {isReleasing && selectedMilestone === milestone.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Releasing...
                              </>
                            ) : (
                              "Release Payment"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                <AlertTriangle className="h-3 w-3" />
                File Dispute
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>File a Payment Dispute</DialogTitle>
                <DialogDescription>
                  Please describe the issue with your order. Our team will review and mediate.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Describe the issue in detail..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
              />
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleDispute}
                  disabled={isDisputing || !disputeReason.trim()}
                >
                  {isDisputing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Dispute"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            Protected by VisoryX Buyer Protection
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Escrow status widget for order cards
export function EscrowBadge({ 
  status, 
  amount 
}: { 
  status: "pending" | "funded" | "partial_release" | "completed" | "disputed" | "refunded"
  amount: number 
}) {
  const config = {
    pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" },
    funded: { label: "In Escrow", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    partial_release: { label: "Partial", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
    completed: { label: "Released", color: "bg-green-500/10 text-green-600 border-green-500/30" },
    disputed: { label: "Disputed", color: "bg-red-500/10 text-red-600 border-red-500/30" },
    refunded: { label: "Refunded", color: "bg-gray-500/10 text-gray-600 border-gray-500/30" },
  }

  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", config[status].color)}>
      <DollarSign className="h-3 w-3" />
      ${amount.toFixed(0)} - {config[status].label}
    </Badge>
  )
}
