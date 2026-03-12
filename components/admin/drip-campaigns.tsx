"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Mail, Clock, Users, Play, Pause, Trash2, Edit, ArrowRight, Zap, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailStep {
  id: string
  subject: string
  content: string
  delayDays: number
  sent: number
  opened: number
  clicked: number
}

interface DripCampaign {
  id: string
  name: string
  description: string
  trigger: string
  segment: string
  status: "active" | "paused" | "draft"
  steps: EmailStep[]
  totalEnrolled: number
  completed: number
  createdAt: Date
}

const campaigns: DripCampaign[] = [
  {
    id: "1",
    name: "Welcome Series",
    description: "Onboard new customers with a 5-email welcome sequence",
    trigger: "signup",
    segment: "new_customers",
    status: "active",
    totalEnrolled: 1245,
    completed: 876,
    steps: [
      { id: "1a", subject: "Welcome to VisoryX!", content: "Welcome email...", delayDays: 0, sent: 1245, opened: 987, clicked: 543 },
      { id: "1b", subject: "Getting Started Guide", content: "Guide email...", delayDays: 1, sent: 1198, opened: 754, clicked: 321 },
      { id: "1c", subject: "Your First Order - 10% Off", content: "Discount email...", delayDays: 3, sent: 1054, opened: 632, clicked: 287 },
      { id: "1d", subject: "Meet Our Designers", content: "Team email...", delayDays: 5, sent: 943, opened: 487, clicked: 156 },
      { id: "1e", subject: "Need Help?", content: "Support email...", delayDays: 7, sent: 876, opened: 398, clicked: 89 },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Abandoned Cart Recovery",
    description: "Recover abandoned carts with 3 reminder emails",
    trigger: "cart_abandoned",
    segment: "all",
    status: "active",
    totalEnrolled: 567,
    completed: 234,
    steps: [
      { id: "2a", subject: "You forgot something!", content: "Reminder 1...", delayDays: 0, sent: 567, opened: 432, clicked: 287 },
      { id: "2b", subject: "Your cart is waiting", content: "Reminder 2...", delayDays: 1, sent: 345, opened: 234, clicked: 145 },
      { id: "2c", subject: "Last chance! 5% off", content: "Discount reminder...", delayDays: 3, sent: 234, opened: 156, clicked: 89 },
    ],
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    description: "Win back inactive customers",
    trigger: "inactive_30_days",
    segment: "at_risk",
    status: "paused",
    totalEnrolled: 234,
    completed: 45,
    steps: [
      { id: "3a", subject: "We miss you!", content: "Miss you email...", delayDays: 0, sent: 234, opened: 123, clicked: 56 },
      { id: "3b", subject: "See what's new", content: "Updates email...", delayDays: 7, sent: 178, opened: 89, clicked: 34 },
      { id: "3c", subject: "Special offer just for you", content: "Offer email...", delayDays: 14, sent: 45, opened: 23, clicked: 12 },
    ],
    createdAt: new Date("2024-02-15"),
  },
]

const triggers = [
  { value: "signup", label: "User Signs Up" },
  { value: "first_order", label: "First Order Placed" },
  { value: "order_completed", label: "Order Completed" },
  { value: "cart_abandoned", label: "Cart Abandoned" },
  { value: "inactive_30_days", label: "Inactive 30 Days" },
  { value: "subscription_canceled", label: "Subscription Canceled" },
]

export function DripCampaigns() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "paused": return "bg-yellow-500"
      case "draft": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "active")
  const totalEnrolled = campaigns.reduce((sum, c) => sum + c.totalEnrolled, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Drip Campaigns</h2>
          <p className="text-muted-foreground">Automated email sequences for customer engagement</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Drip Campaign</DialogTitle>
              <DialogDescription>Set up an automated email sequence</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input placeholder="Welcome Series" />
                </div>
                <div className="space-y-2">
                  <Label>Trigger</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggers.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your campaign..." />
              </div>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground text-center">Email steps will be configured after creation</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsCreateOpen(false)}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Zap className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCampaigns.length}</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEnrolled.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.steps.reduce((s, step) => s + step.sent, 0), 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  {campaign.status === "active" ? (
                    <Button variant="ghost" size="icon">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3" />
                  {triggers.find((t) => t.value === campaign.trigger)?.label}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {campaign.totalEnrolled} enrolled
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {campaign.completed} completed
                </Badge>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {campaign.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={cn("p-3 rounded-lg border min-w-[180px]", index === 0 ? "border-primary bg-primary/5" : "")}>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.delayDays === 0 ? "Immediately" : `Day ${step.delayDays}`}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{step.subject}</p>
                      <div className="mt-2 grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">{step.sent}</p>
                          <p>Sent</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{((step.opened / step.sent) * 100).toFixed(0)}%</p>
                          <p>Open</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{((step.clicked / step.sent) * 100).toFixed(0)}%</p>
                          <p>Click</p>
                        </div>
                      </div>
                    </div>
                    {index < campaign.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
