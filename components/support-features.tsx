"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Check,
  RefreshCw,
  Clock,
  Star,
  ThumbsUp,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SatisfactionGuarantee() {
  const guarantees = [
    {
      icon: RefreshCw,
      title: "Unlimited Revisions",
      description:
        "Not satisfied with your design? Request as many revisions as needed until it's perfect.",
      highlight: true,
    },
    {
      icon: Clock,
      title: "24-48 Hour Turnaround",
      description:
        "Most orders are completed within 24-48 hours. Rush orders available for urgent needs.",
    },
    {
      icon: Shield,
      title: "100% Money Back",
      description:
        "If you're not completely satisfied, we'll refund your order - no questions asked.",
      highlight: true,
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description:
        "Chat directly with your designer throughout the process for seamless collaboration.",
    },
  ]

  const stats = [
    { value: "4.9/5", label: "Average Rating", icon: Star },
    { value: "98%", label: "Satisfaction Rate", icon: ThumbsUp },
    { value: "5,000+", label: "Happy Customers", icon: Check },
  ]

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Shield className="h-7 w-7 text-emerald-500" />
        </div>
        <CardTitle className="text-xl">100% Satisfaction Guarantee</CardTitle>
        <CardDescription className="max-w-md mx-auto">
          We're committed to delivering designs you'll love. Your satisfaction is our top
          priority.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-1">
                <stat.icon className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Guarantees */}
        <div className="grid gap-3 sm:grid-cols-2">
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.title}
              className={cn(
                "flex gap-3 p-3 rounded-lg border transition-colors",
                guarantee.highlight && "border-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  guarantee.highlight
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <guarantee.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{guarantee.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {guarantee.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            <Shield className="h-3.5 w-3.5" />
            Secure Payments
          </Badge>
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            <Check className="h-3.5 w-3.5" />
            Verified Designers
          </Badge>
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            <Star className="h-3.5 w-3.5" />
            Top Rated
          </Badge>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground mb-3">
            Have questions about our guarantee?
          </p>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
