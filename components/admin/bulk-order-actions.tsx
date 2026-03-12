"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserPlus,
  Clock,
  Loader2,
  Send,
  Trash2,
} from "lucide-react"

interface BulkOrderActionsProps {
  selectedIds: string[]
  onComplete?: () => void
}

export function BulkOrderActions({ selectedIds, onComplete }: BulkOrderActionsProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)

  const count = selectedIds.length

  const handleBulkAction = async (action: string, data: Record<string, unknown>) => {
    if (count === 0) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update(data)
        .in("id", selectedIds)

      if (error) throw error

      toast.success(`${count} order(s) updated successfully`)
      onComplete?.()
    } catch (error) {
      toast.error("Failed to update orders")
    } finally {
      setLoading(false)
      setConfirmAction(null)
    }
  }

  const handleMarkDelivered = () => handleBulkAction("delivered", { status: "delivered" })
  const handleMarkInProgress = () => handleBulkAction("in_progress", { status: "in_progress" })
  const handleMarkCancelled = () => handleBulkAction("cancelled", { status: "cancelled" })

  if (count === 0) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            Bulk Actions ({count})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setConfirmAction("in_progress")}>
            <Clock className="h-4 w-4 mr-2" />
            Mark In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmAction("delivered")}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Delivered
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setConfirmAction("notify")}>
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmAction("assign")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Designer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmAction("cancelled")}
            className="text-destructive focus:text-destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Orders
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              This will affect {count} selected order(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction === "delivered") handleMarkDelivered()
                else if (confirmAction === "in_progress") handleMarkInProgress()
                else if (confirmAction === "cancelled") handleMarkCancelled()
                else toast.info("Feature coming soon")
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
