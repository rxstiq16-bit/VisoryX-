"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Copy,
  Eye
} from "lucide-react"
import { toast } from "sonner"

interface Webhook {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  createdAt: Date
  lastTriggered?: Date
  successRate: number
}

const AVAILABLE_EVENTS = [
  { id: "order.created", label: "Order Created", description: "When a new order is placed" },
  { id: "order.updated", label: "Order Updated", description: "When an order status changes" },
  { id: "order.completed", label: "Order Completed", description: "When an order is marked complete" },
  { id: "order.cancelled", label: "Order Cancelled", description: "When an order is cancelled" },
  { id: "payment.received", label: "Payment Received", description: "When a payment is confirmed" },
  { id: "payment.refunded", label: "Payment Refunded", description: "When a refund is processed" },
  { id: "message.received", label: "Message Received", description: "When a new message is sent" },
  { id: "file.uploaded", label: "File Uploaded", description: "When a file is uploaded to an order" },
  { id: "review.submitted", label: "Review Submitted", description: "When a customer leaves a review" },
]

export function DeveloperWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "wh_1",
      url: "https://example.com/webhooks/visoryx",
      events: ["order.created", "order.completed"],
      secret: "whsec_abc123xyz",
      active: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      successRate: 98.5,
    },
  ])
  const [isCreating, setIsCreating] = useState(false)
  const [newUrl, setNewUrl] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showSecret, setShowSecret] = useState<string | null>(null)

  const handleCreate = () => {
    if (!newUrl || selectedEvents.length === 0) {
      toast.error("Please enter a URL and select at least one event")
      return
    }

    const newWebhook: Webhook = {
      id: `wh_${Date.now()}`,
      url: newUrl,
      events: selectedEvents,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      active: true,
      createdAt: new Date(),
      successRate: 100,
    }

    setWebhooks([...webhooks, newWebhook])
    setNewUrl("")
    setSelectedEvents([])
    setIsCreating(false)
    toast.success("Webhook created successfully")
  }

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id))
    toast.success("Webhook deleted")
  }

  const handleToggle = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ))
  }

  const handleTest = (webhook: Webhook) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: "Sending test event...",
        success: "Test event sent successfully",
        error: "Failed to send test event",
      }
    )
  }

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    toast.success("Secret copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>
              Receive HTTP callbacks when events occur in your account
            </CardDescription>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Webhook</DialogTitle>
                <DialogDescription>
                  Configure a new webhook endpoint to receive events
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Endpoint URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/webhooks"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Events to Subscribe</Label>
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-3">
                    {AVAILABLE_EVENTS.map((event) => (
                      <div key={event.id} className="flex items-start gap-3">
                        <Checkbox
                          id={event.id}
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEvents([...selectedEvents, event.id])
                            } else {
                              setSelectedEvents(selectedEvents.filter(e => e !== event.id))
                            }
                          }}
                        />
                        <div className="grid gap-0.5">
                          <Label htmlFor={event.id} className="text-sm font-medium">
                            {event.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Webhook</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No webhooks configured. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm">{webhook.url}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => window.open(webhook.url, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Secret:</span>
                        {showSecret === webhook.id ? (
                          <code className="text-xs">{webhook.secret}</code>
                        ) : (
                          <code className="text-xs">whsec_••••••••</code>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => setShowSecret(showSecret === webhook.id ? null : webhook.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copySecret(webhook.secret)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 2).map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {webhook.successRate >= 95 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{webhook.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={webhook.active}
                        onCheckedChange={() => handleToggle(webhook.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTest(webhook)}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Test
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Payload Example</CardTitle>
          <CardDescription>
            All webhook payloads follow this structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`{
  "id": "evt_abc123",
  "type": "order.created",
  "created": 1709251200,
  "data": {
    "object": {
      "id": "ord_xyz789",
      "status": "pending",
      "total": 4999,
      "currency": "usd",
      // ... additional fields
    }
  }
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
