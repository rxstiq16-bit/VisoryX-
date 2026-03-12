"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket,
  Calendar,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Pause,
  Play,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: "monthly" | "yearly"
  features: string[]
  designHours: number
  revisions: number | "unlimited"
  prioritySupport: boolean
  popular?: boolean
}

const plans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter Retainer",
    description: "Perfect for small projects",
    price: 99,
    interval: "monthly",
    features: [
      "5 design hours/month",
      "2 active projects",
      "48-hour turnaround",
      "Email support",
    ],
    designHours: 5,
    revisions: 2,
    prioritySupport: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses",
    price: 249,
    interval: "monthly",
    features: [
      "15 design hours/month",
      "5 active projects",
      "24-hour turnaround",
      "Priority support",
      "Source files included",
    ],
    designHours: 15,
    revisions: 5,
    prioritySupport: true,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Unlimited design power",
    price: 499,
    interval: "monthly",
    features: [
      "40 design hours/month",
      "Unlimited projects",
      "Same-day turnaround",
      "Dedicated designer",
      "All source files",
      "Brand guidelines",
    ],
    designHours: 40,
    revisions: "unlimited",
    prioritySupport: true,
  },
]

interface UserSubscription {
  planId: string
  status: "active" | "paused" | "cancelled" | "past_due"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  hoursUsed: number
  hoursTotal: number
  cancelAtPeriodEnd: boolean
}

export { SubscriptionPlans as SubscriptionManager }

export function SubscriptionPlans() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label className={cn(billingInterval === "monthly" && "font-semibold")}>Monthly</Label>
        <Switch
          checked={billingInterval === "yearly"}
          onCheckedChange={(checked) => setBillingInterval(checked ? "yearly" : "monthly")}
        />
        <Label className={cn(billingInterval === "yearly" && "font-semibold")}>
          Yearly
          <Badge className="ml-2 bg-green-500/10 text-green-500">Save 20%</Badge>
        </Label>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price = billingInterval === "yearly" ? plan.price * 0.8 : plan.price
          const Icon = plan.id === "starter" ? Zap : plan.id === "professional" ? Crown : Rocket

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative",
                plan.popular && "border-primary shadow-lg shadow-primary/10"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "rounded-lg p-2",
                    plan.popular ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-4xl font-bold">${price.toFixed(0)}</span>
                  <span className="text-muted-foreground">/{billingInterval === "yearly" ? "mo" : "month"}</span>
                  {billingInterval === "yearly" && (
                    <p className="text-sm text-muted-foreground">Billed annually</p>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function CurrentSubscription({ subscription }: { subscription: UserSubscription }) {
  const plan = plans.find((p) => p.id === subscription.planId)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  if (!plan) return null

  const hoursPercent = (subscription.hoursUsed / subscription.hoursTotal) * 100
  const daysLeft = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {plan.name}
              <Badge
                variant={subscription.status === "active" ? "default" : "destructive"}
              >
                {subscription.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {daysLeft} days remaining in current period
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${plan.price}/mo</p>
            <p className="text-sm text-muted-foreground">
              Renews {subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hours Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Design Hours Used</span>
            <span className="font-medium">
              {subscription.hoursUsed} / {subscription.hoursTotal} hours
            </span>
          </div>
          <Progress value={hoursPercent} />
          {hoursPercent > 80 && (
            <p className="flex items-center gap-1 text-xs text-amber-500">
              <AlertTriangle className="h-3 w-3" />
              You're running low on hours. Consider upgrading.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Change Plan
          </Button>
          <Button variant="outline" className="flex-1">
            <CreditCard className="mr-2 h-4 w-4" />
            Update Payment
          </Button>
          {subscription.status === "active" ? (
            <Button variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">
              Your subscription will be cancelled on{" "}
              {subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
            <Button variant="link" className="h-auto p-0 text-destructive">
              Undo cancellation
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              <X className="mr-2 h-4 w-4" />
              Cancel Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription?</DialogTitle>
              <DialogDescription>
                Your subscription will remain active until the end of your billing period.
                You won't be charged again.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Subscription
              </Button>
              <Button variant="destructive">
                Yes, Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
