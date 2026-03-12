"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Crown,
  Star,
  Gift,
  Trophy,
  ChevronRight,
  Sparkles,
  Clock,
  ShoppingBag,
  Percent,
  Target,
  Medal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Customer Tier Card
export function CustomerTierCard() {
  const [tier, setTier] = useState({
    name: "Gold",
    color: "from-amber-500 to-yellow-400",
    points: 2450,
    nextTier: "Platinum",
    pointsToNext: 550,
    benefits: [
      "10% discount on all orders",
      "Priority support",
      "Early access to new services",
      "Free revision rounds +1",
    ],
  })

  const progress = (tier.points / (tier.points + tier.pointsToNext)) * 100

  return (
    <Card className="overflow-hidden">
      <div className={cn("h-2 bg-gradient-to-r", tier.color)} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center",
                tier.color
              )}
            >
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{tier.name} Member</CardTitle>
              <CardDescription className="text-xs">
                {tier.points.toLocaleString()} loyalty points
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {tier.pointsToNext} to {tier.nextTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress to {tier.nextTier}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Your Benefits
          </p>
          <div className="grid gap-2">
            {tier.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <Gift className="h-4 w-4 mr-2" />
          View Rewards Catalog
        </Button>
      </CardContent>
    </Card>
  )
}

// Customer Milestones
export function CustomerMilestones() {
  const milestones = [
    {
      id: 1,
      title: "First Order",
      description: "Complete your first design order",
      icon: ShoppingBag,
      completed: true,
      reward: "Welcome Badge",
    },
    {
      id: 2,
      title: "Loyal Customer",
      description: "Place 5 orders",
      icon: Trophy,
      completed: true,
      reward: "5% Discount Code",
      progress: { current: 5, total: 5 },
    },
    {
      id: 3,
      title: "Big Spender",
      description: "Spend $500 total",
      icon: Star,
      completed: false,
      reward: "Gold Status",
      progress: { current: 320, total: 500 },
    },
    {
      id: 4,
      title: "Review Champion",
      description: "Leave 10 reviews",
      icon: Medal,
      completed: false,
      reward: "Exclusive Badge",
      progress: { current: 4, total: 10 },
    },
    {
      id: 5,
      title: "Referral Master",
      description: "Refer 5 friends",
      icon: Target,
      completed: false,
      reward: "Free Design",
      progress: { current: 2, total: 5 },
    },
  ]

  const completedCount = milestones.filter((m) => m.completed).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">Milestones</CardTitle>
          </div>
          <Badge variant="secondary">
            {completedCount}/{milestones.length} Complete
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Earn rewards by reaching milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-1 p-4 pt-0">
            {milestones.map((milestone) => {
              const progressPercent = milestone.progress
                ? (milestone.progress.current / milestone.progress.total) * 100
                : 0

              return (
                <div
                  key={milestone.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    milestone.completed
                      ? "bg-green-500/5 border-green-500/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      milestone.completed
                        ? "bg-green-500/10 text-green-500"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <milestone.icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{milestone.title}</span>
                      {milestone.completed && (
                        <Badge variant="default" className="text-[10px] bg-green-500">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>

                    {!milestone.completed && milestone.progress && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Progress value={progressPercent} className="h-1 flex-1" />
                        <span className="text-[10px] text-muted-foreground">
                          {milestone.progress.current}/{milestone.progress.total}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <Badge variant="secondary" className="text-[10px]">
                      <Gift className="h-2.5 w-2.5 mr-1" />
                      {milestone.reward}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Recently Viewed Component
export function RecentlyViewed() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Logo Design",
      image: "/portfolio/logo-1.jpg",
      price: 30,
      viewedAt: "2 hours ago",
    },
    {
      id: 2,
      name: "Discord Banner Pack",
      image: "/portfolio/banner-1.jpg",
      price: 25,
      viewedAt: "Yesterday",
    },
    {
      id: 3,
      name: "Gaming Team Logo",
      image: "/portfolio/team-1.jpg",
      price: 45,
      viewedAt: "2 days ago",
    },
    {
      id: 4,
      name: "Social Media Kit",
      image: "/portfolio/social-1.jpg",
      price: 35,
      viewedAt: "3 days ago",
    },
  ])

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium">No recent views</p>
          <p className="text-xs text-muted-foreground">
            Services you view will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Recently Viewed</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
            <Link href="/services">
              View All
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <ScrollArea className="w-full">
          <div className="flex gap-3 px-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/services/${item.id}`}
                className="shrink-0 w-32 group"
              >
                <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-2">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                </div>
                <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                  {item.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-semibold">${item.price}</span>
                  <span className="text-[10px] text-muted-foreground">{item.viewedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
