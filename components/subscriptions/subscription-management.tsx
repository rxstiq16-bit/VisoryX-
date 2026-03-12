"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, Calendar, Package, Zap, Check, X, AlertTriangle, 
  RefreshCw, Clock, ChevronRight, Sparkles 
} from "lucide-react"

interface Subscription {
  id: string
  plan: "starter" | "professional" | "enterprise"
  status: "active" | "paused" | "cancelled" | "past_due"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  usage: {
    designs: { used: number; limit: number }
    revisions: { used: number; limit: number }
    storage: { used: number; limit: number }
  }
  price: number
  interval: "monthly" | "yearly"
}

const plans = {
  starter: {
    name: "Starter",
    price: { monthly: 29, yearly: 290 },
    features: ["5 designs/month", "2 revisions each", "5GB storage", "Email support"],
    limits: { designs: 5, revisions: 2, storage: 5 },
  },
  professional: {
    name: "Professional", 
    price: { monthly: 79, yearly: 790 },
    features: ["15 designs/month", "Unlimited revisions", "25GB storage", "Priority support", "Rush delivery"],
    limits: { designs: 15, revisions: -1, storage: 25 },
    popular: true,
  },
  enterprise: {
    name: "Enterprise",
    price: { monthly: 199, yearly: 1990 },
    features: ["Unlimited designs", "Unlimited revisions", "100GB storage", "Dedicated designer", "24/7 support"],
    limits: { designs: -1, revisions: -1, storage: 100 },
  },
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription>({
    id: "sub_123",
    plan: "professional",
    status: "active",
    currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
    usage: {
      designs: { used: 8, limit: 15 },
      revisions: { used: 12, limit: -1 },
      storage: { used: 18, limit: 25 },
    },
    price: 79,
    interval: "monthly",
  })

  const currentPlan = plans[subscription.plan]
  const daysLeft = Math.ceil((subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500"
      case "paused": return "bg-yellow-500/10 text-yellow-500"
      case "cancelled": return "bg-red-500/10 text-red-500"
      case "past_due": return "bg-orange-500/10 text-orange-500"
    }
  }

  const pauseSubscription = () => {
    setSubscription({ ...subscription, status: "paused" })
  }

  const resumeSubscription = () => {
    setSubscription({ ...subscription, status: "active" })
  }

  const cancelSubscription = () => {
    setSubscription({ ...subscription, cancelAtPeriodEnd: true })
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentPlan.name} Plan
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status.replace("_", " ")}
                </Badge>
              </CardTitle>
              <CardDescription>
                ${subscription.price}/{subscription.interval} - Renews on{" "}
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{daysLeft}</div>
              <div className="text-sm text-muted-foreground">days left</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Usage This Period</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Designs</span>
                <span>
                  {subscription.usage.designs.used} / {subscription.usage.designs.limit === -1 ? "∞" : subscription.usage.designs.limit}
                </span>
              </div>
              <Progress 
                value={subscription.usage.designs.limit === -1 ? 0 : (subscription.usage.designs.used / subscription.usage.designs.limit) * 100} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage</span>
                <span>{subscription.usage.storage.used}GB / {subscription.usage.storage.limit}GB</span>
              </div>
              <Progress value={(subscription.usage.storage.used / subscription.usage.storage.limit) * 100} />
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Your subscription will be cancelled on {subscription.currentPeriodEnd.toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {subscription.status === "active" ? (
            <>
              <Button variant="outline" onClick={pauseSubscription}>
                <Clock className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button variant="outline" onClick={cancelSubscription} className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : subscription.status === "paused" ? (
            <Button onClick={resumeSubscription}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resume Subscription
            </Button>
          ) : null}
          <Button className="ml-auto">
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(plans).map(([key, plan]) => (
              <Card key={key} className={`relative ${plan.popular ? "border-primary" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.price.monthly}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={key === subscription.plan ? "outline" : "default"}
                    disabled={key === subscription.plan}
                  >
                    {key === subscription.plan ? "Current Plan" : "Switch to " + plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: "Feb 1, 2024", amount: 79, status: "Paid" },
              { date: "Jan 1, 2024", amount: 79, status: "Paid" },
              { date: "Dec 1, 2023", amount: 79, status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{invoice.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">${invoice.amount}</span>
                  <Badge variant="secondary">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
