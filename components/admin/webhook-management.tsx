"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Webhook, Plus, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Send, Eye } from "lucide-react"
import { format } from "date-fns"

interface WebhookEndpoint {
  id: string
  url: string
  description: string
  events: string[]
  secret: string
  isActive: boolean
  createdAt: Date
  lastTriggered?: Date
  successRate: number
}

interface WebhookLog {
  id: string
  webhookId: string
  event: string
  timestamp: Date
  status: "success" | "failed" | "pending"
  responseCode?: number
  responseTime?: number
  payload: object
  response?: string
}

const eventTypes = [
  { id: "order.created", label: "Order Created", description: "When a new order is placed" },
  { id: "order.updated", label: "Order Updated", description: "When an order status changes" },
  { id: "order.completed", label: "Order Completed", description: "When an order is delivered" },
  { id: "payment.received", label: "Payment Received", description: "When payment is confirmed" },
  { id: "payment.refunded", label: "Payment Refunded", description: "When a refund is processed" },
  { id: "user.registered", label: "User Registered", description: "When a new user signs up" },
  { id: "file.uploaded", label: "File Uploaded", description: "When a file is uploaded" },
  { id: "review.submitted", label: "Review Submitted", description: "When a review is posted" },
]

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: "1",
    url: "https://api.example.com/webhooks/visoryx",
    description: "Main integration endpoint",
    events: ["order.created", "order.completed", "payment.received"],
    secret: "whsec_abc123...",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 3600000),
    successRate: 98.5,
  },
  {
    id: "2",
    url: "https://discord.com/api/webhooks/123456/abcdef",
    description: "Discord notifications",
    events: ["order.created", "review.submitted"],
    secret: "whsec_xyz789...",
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 86400000),
    successRate: 100,
  },
]

const mockLogs: WebhookLog[] = [
  {
    id: "1",
    webhookId: "1",
    event: "order.created",
    timestamp: new Date(Date.now() - 3600000),
    status: "success",
    responseCode: 200,
    responseTime: 245,
    payload: { orderId: "ORD-2024-001", amount: 299 },
    response: '{"received": true}',
  },
  {
    id: "2",
    webhookId: "1",
    event: "payment.received",
    timestamp: new Date(Date.now() - 7200000),
    status: "failed",
    responseCode: 500,
    responseTime: 5000,
    payload: { orderId: "ORD-2024-001", amount: 299 },
    response: "Internal Server Error",
  },
]

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks)
  const [logs] = useState<WebhookLog[]>(mockLogs)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null)

  // New webhook form
  const [newUrl, setNewUrl] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newEvents, setNewEvents] = useState<string[]>([])

  const toggleEvent = (eventId: string) => {
    setNewEvents(prev =>
      prev.includes(eventId) ? prev.filter(e => e !== eventId) : [...prev, eventId]
    )
  }

  const createWebhook = () => {
    const webhook: WebhookEndpoint = {
      id: Date.now().toString(),
      url: newUrl,
      description: newDescription,
      events: newEvents,
      secret: "whsec_" + Math.random().toString(36).substring(2, 15),
      isActive: true,
      createdAt: new Date(),
      successRate: 100,
    }
    setWebhooks(prev => [...prev, webhook])
    setCreateDialogOpen(false)
    setNewUrl("")
    setNewDescription("")
    setNewEvents([])
  }

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id))
  }

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w =>
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ))
  }

  const testWebhook = async (webhook: WebhookEndpoint) => {
    // Simulate test
    console.log("Testing webhook:", webhook.url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <CardDescription>
              Configure webhook endpoints to receive real-time event notifications
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Endpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Webhook Endpoint</DialogTitle>
                <DialogDescription>
                  Configure a new endpoint to receive event notifications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Endpoint URL</Label>
                  <Input
                    placeholder="https://your-server.com/webhook"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    placeholder="e.g., Discord notifications"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Events to Subscribe</Label>
                  <ScrollArea className="h-[200px] border rounded-lg p-2">
                    {eventTypes.map(event => (
                      <label
                        key={event.id}
                        className="flex items-start gap-3 p-2 rounded cursor-pointer hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={newEvents.includes(event.id)}
                          onCheckedChange={() => toggleEvent(event.id)}
                        />
                        <div>
                          <p className="font-medium text-sm">{event.label}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </label>
                    ))}
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createWebhook} disabled={!newUrl || newEvents.length === 0}>
                  Create Endpoint
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoints">
          <TabsList>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-medium">{webhook.url}</code>
                      <Switch
                        checked={webhook.isActive}
                        onCheckedChange={() => toggleWebhook(webhook.id)}
                      />
                    </div>
                    {webhook.description && (
                      <p className="text-sm text-muted-foreground">{webhook.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => testWebhook(webhook)}>
                      <Send className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map(event => (
                    <Badge key={event} variant="secondary" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {webhook.successRate}% success rate
                  </span>
                  {webhook.lastTriggered && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last triggered {format(webhook.lastTriggered, "MMM d, HH:mm")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="logs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline">{log.event}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {webhooks.find(w => w.id === log.webhookId)?.url.slice(0, 30)}...
                    </TableCell>
                    <TableCell>
                      {log.status === "success" ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {log.responseCode}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          {log.responseCode || "Failed"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{log.responseTime}ms</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(log.timestamp, "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Webhook Delivery Details</DialogTitle>
                          </DialogHeader>
                          {selectedLog && (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-muted-foreground">Request Payload</Label>
                                <pre className="mt-1 bg-muted p-3 rounded text-xs overflow-auto">
                                  {JSON.stringify(selectedLog.payload, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Response</Label>
                                <pre className="mt-1 bg-muted p-3 rounded text-xs overflow-auto">
                                  {selectedLog.response}
                                </pre>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
