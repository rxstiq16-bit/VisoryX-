"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MessageSquare, Clock, CheckCircle, XCircle, Scale, DollarSign, FileText, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Dispute {
  id: string
  orderId: string
  orderTitle: string
  customer: { name: string; email: string; avatar?: string }
  designer: { name: string; email: string; avatar?: string }
  reason: string
  description: string
  status: "open" | "investigating" | "resolved" | "escalated"
  priority: "low" | "medium" | "high"
  createdAt: Date
  resolution?: {
    type: "full_refund" | "partial_refund" | "revision" | "no_action"
    amount?: number
    notes: string
    resolvedBy: string
    resolvedAt: Date
  }
  messages: Array<{
    id: string
    sender: string
    role: "customer" | "designer" | "admin"
    message: string
    timestamp: Date
  }>
}

const sampleDisputes: Dispute[] = [
  {
    id: "DSP-001",
    orderId: "ORD-2847",
    orderTitle: "Police Department Livery Pack",
    customer: { name: "Alex Johnson", email: "alex@example.com" },
    designer: { name: "Sarah Chen", email: "sarah@visoryx.com" },
    reason: "quality",
    description: "The delivered liveries don't match the reference images I provided. Colors are off and some decals are missing.",
    status: "investigating",
    priority: "high",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    messages: [
      { id: "1", sender: "Alex Johnson", role: "customer", message: "The colors on the hood are completely wrong. I asked for navy blue, not royal blue.", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: "2", sender: "Sarah Chen", role: "designer", message: "I apologize for the confusion. I can definitely adjust the colors. Would you be able to share the exact color codes you need?", timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) },
      { id: "3", sender: "Admin", role: "admin", message: "I've reviewed the original brief and the customer did specify navy blue (#001f3f). Let's get this corrected ASAP.", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "DSP-002",
    orderId: "ORD-2832",
    orderTitle: "Discord Server Branding",
    customer: { name: "Mike Wilson", email: "mike@example.com" },
    designer: { name: "James Lee", email: "james@visoryx.com" },
    reason: "delivery",
    description: "Order was marked as delivered but I never received the files. Designer is not responding to messages.",
    status: "open",
    priority: "high",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messages: [],
  },
]

const reasons = [
  { value: "quality", label: "Quality Issues" },
  { value: "delivery", label: "Delivery Problems" },
  { value: "communication", label: "Communication Issues" },
  { value: "scope", label: "Scope Disagreement" },
  { value: "refund", label: "Refund Request" },
  { value: "other", label: "Other" },
]

const resolutionTypes = [
  { value: "full_refund", label: "Full Refund", icon: DollarSign },
  { value: "partial_refund", label: "Partial Refund", icon: DollarSign },
  { value: "revision", label: "Free Revision", icon: FileText },
  { value: "no_action", label: "No Action Required", icon: XCircle },
]

export function DisputeResolution() {
  const [disputes] = useState<Dispute[]>(sampleDisputes)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isResolving, setIsResolving] = useState(false)
  const [resolution, setResolution] = useState({ type: "", amount: "", notes: "" })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-500"
      case "investigating": return "bg-blue-500"
      case "resolved": return "bg-green-500"
      case "escalated": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500"
      case "medium": return "text-yellow-500"
      case "low": return "text-green-500"
      default: return "text-gray-500"
    }
  }

  const openDisputes = disputes.filter((d) => d.status !== "resolved")
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dispute Resolution</h2>
          <p className="text-muted-foreground">Manage and resolve customer disputes</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            {openDisputes.length} Open
          </Badge>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {resolvedDisputes.length} Resolved
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open" className="gap-1">
            Open Disputes
            <Badge variant="secondary" className="ml-1">{openDisputes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openDisputes.map((dispute) => (
            <Card key={dispute.id} className={cn("cursor-pointer transition-colors hover:border-primary", selectedDispute?.id === dispute.id && "border-primary")}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{dispute.id}</CardTitle>
                      <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                      <AlertTriangle className={cn("h-4 w-4", getPriorityColor(dispute.priority))} />
                    </div>
                    <CardDescription>Order: {dispute.orderId} - {dispute.orderTitle}</CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(dispute.createdAt, { addSuffix: true })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={dispute.customer.avatar} />
                      <AvatarFallback>{dispute.customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{dispute.customer.name}</p>
                      <p className="text-xs text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={dispute.designer.avatar} />
                      <AvatarFallback>{dispute.designer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{dispute.designer.name}</p>
                      <p className="text-xs text-muted-foreground">Designer</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Badge variant="outline" className="mb-2">{reasons.find((r) => r.value === dispute.reason)?.label}</Badge>
                  <p className="text-sm text-muted-foreground">{dispute.description}</p>
                </div>

                {dispute.messages.length > 0 && (
                  <div className="space-y-2 border-t pt-4">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {dispute.messages.length} messages
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {dispute.messages.map((msg) => (
                        <div key={msg.id} className={cn("p-3 rounded-lg text-sm", msg.role === "admin" ? "bg-primary/10 border border-primary/20" : "bg-muted")}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{msg.sender}</span>
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(msg.timestamp, { addSuffix: true })}</span>
                          </div>
                          <p className="text-muted-foreground">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                <div className="flex-1 flex gap-2">
                  <Textarea placeholder="Add a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="min-h-[40px] resize-none" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <Dialog open={isResolving} onOpenChange={setIsResolving}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Resolve</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Resolve Dispute</DialogTitle>
                      <DialogDescription>Choose a resolution for dispute {dispute.id}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Resolution Type</Label>
                        <Select value={resolution.type} onValueChange={(v) => setResolution({ ...resolution, type: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select resolution" />
                          </SelectTrigger>
                          <SelectContent>
                            {resolutionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {(resolution.type === "full_refund" || resolution.type === "partial_refund") && (
                        <div className="space-y-2">
                          <Label>Refund Amount ($)</Label>
                          <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={resolution.amount} onChange={(e) => setResolution({ ...resolution, amount: e.target.value })} />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Resolution Notes</Label>
                        <Textarea value={resolution.notes} onChange={(e) => setResolution({ ...resolution, notes: e.target.value })} placeholder="Explain the resolution..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsResolving(false)}>Cancel</Button>
                      <Button onClick={() => setIsResolving(false)}>Confirm Resolution</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved">
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>No resolved disputes to show</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
