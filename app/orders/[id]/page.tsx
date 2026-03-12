"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  Clock,
  Package,
  MessageSquare,
  History,
  Loader2,
  Send,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  RotateCcw,
  Download,
  FileIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  getOrder,
  getOrderNotes,
  getOrderStatusHistory,
  addOrderNote,
  ORDER_STATUSES,
  type Order,
  type OrderNote,
  type OrderStatusHistory,
} from "@/lib/orders"

function getStatusBadge(status: string) {
  const statusInfo = ORDER_STATUSES.find((s) => s.value === status)
  if (!statusInfo) return <Badge variant="outline">{status}</Badge>

  const colorMap: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    review: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
    revision: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    completed: "bg-green-500/10 text-green-500 border-green-500/30",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
    on_hold: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    test: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  }

  return (
    <Badge variant="outline" className={colorMap[status] || ""}>
      {statusInfo.label}
    </Badge>
  )
}

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "in_progress",
  "review",
  "completed",
  "delivered",
]

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus)
  const isCancelled = currentStatus === "cancelled"
  const isOnHold = currentStatus === "on_hold"

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <span className="text-sm font-medium text-red-500">
          This order has been cancelled.
        </span>
      </div>
    )
  }

  if (isOnHold) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-gray-500/30 bg-gray-500/5 p-4">
        <Clock className="h-5 w-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-400">
          This order is currently on hold.
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, index) => {
        const stepInfo = ORDER_STATUSES.find((s) => s.value === step)
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground/50"
                } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs text-center leading-tight ${
                  isCompleted
                    ? "font-medium text-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {stepInfo?.label}
              </span>
            </div>
            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`mx-1 h-0.5 w-full flex-1 ${
                  index < currentIndex ? "bg-primary" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { user, isLoading: authLoading } = useAuth()

  const [order, setOrder] = useState<Order | null>(null)
  const [notes, setNotes] = useState<OrderNote[]>([])
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [deliverables, setDeliverables] = useState<{ id: string; file_name: string; file_url: string; file_size: number; created_at: string }[]>([])

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true)
      const [orderData, notesData, historyData] = await Promise.all([
        getOrder(resolvedParams.id),
        getOrderNotes(resolvedParams.id, false),
        getOrderStatusHistory(resolvedParams.id),
      ])
  setOrder(orderData)
  setNotes(notesData)
  setStatusHistory(historyData)
  // Load deliverables from order_files table
  const supabase = createClient()
  const { data: files } = await supabase
    .from("order_files")
    .select("id, file_name, file_url, file_size, created_at")
    .eq("order_id", resolvedParams.id)
    .eq("is_deliverable", true)
    .order("created_at", { ascending: false })
  if (files) setDeliverables(files)
  setIsLoading(false)
  }
  loadOrder()
  }, [resolvedParams.id])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !order) return
    setIsSending(true)
    const note = await addOrderNote({
      order_id: order.id,
      user_id: user.id,
      user_name: user.user_metadata?.display_name || user.email || "Customer",
      note_type: "note",
      content: newMessage.trim(),
      is_internal: false,
    })
    if (note) {
      setNotes((prev) => [note, ...prev])
      setNewMessage("")
    }
    setIsSending(false)
  }

  if (authLoading || isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto flex items-center justify-center py-32 px-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto flex flex-col items-center justify-center py-32 px-4 gap-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Order Not Found</h1>
            <p className="text-muted-foreground">
              This order does not exist or you do not have permission to view it.
            </p>
            <Button asChild variant="outline">
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
          {/* Back button + header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon">
                <Link href="/orders">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-balance">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              {order.paid ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                  Paid
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                  Unpaid
                </Badge>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Order Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline currentStatus={order.status} />
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="gap-1.5">
                <Package className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-1.5 relative">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Files</span>
                {deliverables.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {deliverables.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Service</span>
                      <p className="text-sm font-medium">{order.service_type}</p>
                    </div>
                    {order.description && (
                      <div>
                        <span className="text-xs text-muted-foreground">Description</span>
                        <p className="text-sm whitespace-pre-wrap">{order.description}</p>
                      </div>
                    )}
                    {order.tracking_number && (
                      <div>
                        <span className="text-xs text-muted-foreground">Tracking Number</span>
                        <p className="text-sm font-mono">{order.tracking_number}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <p className="text-lg font-semibold">
                        {order.price ? `$${order.price.toFixed(2)}` : "Quote pending"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Status</span>
                      <p className="text-sm">
                        {order.paid ? "Payment received" : "Awaiting payment"}
                      </p>
                    </div>
                    {order.payment_method && (
                      <div>
                        <span className="text-xs text-muted-foreground">Method</span>
                        <p className="text-sm capitalize">{order.payment_method}</p>
                      </div>
                    )}
                    {order.payment_date && (
                      <div>
                        <span className="text-xs text-muted-foreground">Paid on</span>
                        <p className="text-sm">
                          {format(new Date(order.payment_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Created</span>
                      <p className="text-sm">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                    </div>
                    {order.estimated_completion && (
                      <div>
                        <span className="text-xs text-muted-foreground">Estimated Completion</span>
                        <p className="text-sm">
                          {format(new Date(order.estimated_completion), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                    {order.actual_completion && (
                      <div>
                        <span className="text-xs text-muted-foreground">Completed</span>
                        <p className="text-sm">
                          {format(new Date(order.actual_completion), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                  {order.assigned_to_name && (
                    <div>
                      <span className="text-xs text-muted-foreground">Assigned Designer</span>
                      <p className="text-sm font-medium">{order.assigned_to_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <CardDescription>
                    Communicate with the VisoryX team about your order.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Message input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type a message about your order..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[80px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                      size="icon"
                      className="shrink-0 self-end"
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Messages list */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {notes.filter((n) => n.note_type !== "system").length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No messages yet. Send a message to get started.
                      </p>
                    ) : (
                      notes
                        .filter((n) => n.note_type !== "system")
                        .map((note) => (
                          <div
                            key={note.id}
                            className="flex flex-col gap-1 rounded-lg border bg-card p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">
                                {note.user_name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {format(new Date(note.created_at), "MMM d, h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              {note.note_type === "status_change" && (
                                <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                              )}
                              {note.note_type === "payment" && (
                                <DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
                              )}
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {note.content}
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Delivered Files</CardTitle>
                  <CardDescription>
                    Download your completed design files below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deliverables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FileIcon className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">No files yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your designer will upload completed files here when ready.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {deliverables.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileIcon className="h-5 w-5 text-primary/60 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{file.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.file_size < 1024 * 1024
                                  ? `${(file.file_size / 1024).toFixed(1)} KB`
                                  : `${(file.file_size / (1024 * 1024)).toFixed(1)} MB`}
                                {" "}&middot;{" "}
                                {format(new Date(file.created_at), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild className="gap-1.5 shrink-0">
                            <a href={file.file_url} target="_blank" rel="noreferrer" download>
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Status History</CardTitle>
                  <CardDescription>
                    Track every status change for this order.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statusHistory.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No status changes recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {statusHistory.map((entry, i) => (
                        <div key={entry.id} className="relative flex gap-4">
                          {i < statusHistory.length - 1 && (
                            <div className="absolute left-[11px] top-7 h-full w-px bg-border" />
                          )}
                          <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              {entry.previous_status && getStatusBadge(entry.previous_status)}
                              <span className="text-xs text-muted-foreground">to</span>
                              {getStatusBadge(entry.new_status)}
                            </div>
                            {entry.reason && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {entry.reason}
                              </p>
                            )}
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {entry.changed_by_name} --{" "}
                              {format(new Date(entry.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
