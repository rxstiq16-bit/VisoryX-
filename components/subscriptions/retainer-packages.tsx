"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Sparkles, Clock, Zap, Shield, HeadphonesIcon } from "lucide-react"

const retainerPackages = [
  {
    id: "basic",
    name: "Basic Retainer",
    description: "Perfect for small projects and ongoing support",
    monthlyHours: 10,
    price: { monthly: 199, yearly: 1990 },
    features: [
      "10 hours/month design time",
      "48hr response time",
      "2 active projects",
      "Email support",
      "Rollover up to 5 hours",
    ],
    savings: 0,
  },
  {
    id: "growth",
    name: "Growth Retainer",
    description: "Ideal for growing businesses with regular design needs",
    monthlyHours: 25,
    price: { monthly: 449, yearly: 4490 },
    features: [
      "25 hours/month design time",
      "24hr response time",
      "5 active projects",
      "Priority support",
      "Rollover up to 10 hours",
      "Rush delivery included",
    ],
    popular: true,
    savings: 15,
  },
  {
    id: "enterprise",
    name: "Enterprise Retainer",
    description: "Full-service design partnership for large organizations",
    monthlyHours: 50,
    price: { monthly: 799, yearly: 7990 },
    features: [
      "50 hours/month design time",
      "Same-day response",
      "Unlimited active projects",
      "Dedicated designer",
      "24/7 support",
      "Unlimited rollover",
      "Strategy sessions",
      "Brand guidelines",
    ],
    savings: 25,
  },
]

export function RetainerPackages() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Monthly Retainer Packages</h2>
        <p className="mt-2 text-muted-foreground">
          Lock in dedicated design hours at discounted rates
        </p>
        
        {/* Billing Toggle */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className={billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}>
            Monthly
          </span>
          <Switch
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <span className={billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}>
            Yearly
            <Badge className="ml-2 bg-green-500/10 text-green-500">Save 17%</Badge>
          </span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {retainerPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative flex flex-col ${pkg.popular ? "border-primary shadow-lg" : ""}`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Sparkles className="mr-1 h-3 w-3" />
                Most Popular
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ${billingCycle === "monthly" ? pkg.price.monthly : Math.round(pkg.price.yearly / 12)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-sm text-muted-foreground">
                    Billed annually (${pkg.price.yearly}/year)
                  </p>
                )}
                {pkg.savings > 0 && (
                  <Badge variant="secondary" className="mt-2">
                    Save {pkg.savings}% vs hourly rate
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">{pkg.monthlyHours} hours/month</div>
                  <div className="text-xs text-muted-foreground">
                    ${(pkg.price.monthly / pkg.monthlyHours).toFixed(0)}/hour effective rate
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose a Retainer?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Priority Access</h4>
                <p className="text-sm text-muted-foreground">
                  Skip the queue and get faster turnaround on all projects
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Locked-in Rates</h4>
                <p className="text-sm text-muted-foreground">
                  Protect against price increases for the duration of your retainer
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <HeadphonesIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Dedicated Support</h4>
                <p className="text-sm text-muted-foreground">
                  Work with the same designer who knows your brand
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
