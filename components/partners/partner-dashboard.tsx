"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  DollarSign, Users, TrendingUp, Link2, Copy, Check, 
  ArrowUpRight, Calendar, Download, Star
} from "lucide-react"

interface PartnerStats {
  totalEarnings: number
  pendingPayout: number
  totalReferrals: number
  conversionRate: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  commissionRate: number
}

interface Referral {
  id: string
  customerName: string
  date: Date
  orderValue: number
  commission: number
  status: "pending" | "paid" | "cancelled"
}

export function PartnerDashboard() {
  const [copied, setCopied] = useState(false)
  
  const stats: PartnerStats = {
    totalEarnings: 2450,
    pendingPayout: 380,
    totalReferrals: 47,
    conversionRate: 12.5,
    tier: "gold",
    commissionRate: 15,
  }

  const referrals: Referral[] = [
    {
      id: "1",
      customerName: "John D.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderValue: 150,
      commission: 22.50,
      status: "pending",
    },
    {
      id: "2",
      customerName: "Sarah M.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      orderValue: 85,
      commission: 12.75,
      status: "paid",
    },
    {
      id: "3",
      customerName: "Mike R.",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      orderValue: 200,
      commission: 30,
      status: "paid",
    },
  ]

  const referralLink = "https://visoryx.design/ref/partner123"

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTierColor = (tier: PartnerStats["tier"]) => {
    switch (tier) {
      case "bronze": return "bg-orange-500/10 text-orange-500"
      case "silver": return "bg-slate-400/10 text-slate-400"
      case "gold": return "bg-yellow-500/10 text-yellow-500"
      case "platinum": return "bg-purple-500/10 text-purple-500"
    }
  }

  const tierProgress = {
    bronze: { min: 0, max: 1000, next: "silver" },
    silver: { min: 1000, max: 5000, next: "gold" },
    gold: { min: 5000, max: 15000, next: "platinum" },
    platinum: { min: 15000, max: Infinity, next: null },
  }

  const currentTier = tierProgress[stats.tier]
  const progressToNext = currentTier.next 
    ? ((stats.totalEarnings - currentTier.min) / (currentTier.max - currentTier.min)) * 100
    : 100

  return (
    <div className="space-y-6">
      {/* Partner Tier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Partner Dashboard
                <Badge className={getTierColor(stats.tier)}>
                  <Star className="mr-1 h-3 w-3" />
                  {stats.tier.charAt(0).toUpperCase() + stats.tier.slice(1)} Partner
                </Badge>
              </CardTitle>
              <CardDescription>
                {stats.commissionRate}% commission on all referral sales
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        {currentTier.next && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {currentTier.next}</span>
                <span>${stats.totalEarnings} / ${currentTier.max}</span>
              </div>
              <Progress value={progressToNext} />
              <p className="text-xs text-muted-foreground">
                Earn ${currentTier.max - stats.totalEarnings} more to unlock {currentTier.next} tier (20% commission)
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingPayout}</div>
            <p className="text-xs text-muted-foreground">Next payout: Mar 1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">Customers referred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Click to purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link to earn {stats.commissionRate}% on every sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono" />
            <Button onClick={copyLink} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Track your referral activity and commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{referral.customerName}</span>
                    <Badge 
                      variant={referral.status === "paid" ? "default" : "secondary"}
                    >
                      {referral.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Order value: ${referral.orderValue} - {referral.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-500">
                    +${referral.commission.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
