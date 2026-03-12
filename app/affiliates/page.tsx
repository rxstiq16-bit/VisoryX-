"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Link as LinkIcon,
  Copy,
  Check,
  ArrowRight,
  Gift,
  Wallet,
  BarChart3,
  Clock,
  Target,
  Zap,
  Award
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Starter",
    commission: "10%",
    requirements: "0 referrals",
    perks: ["10% commission", "Monthly payouts", "Basic analytics", "Standard support"],
    color: "border-muted",
  },
  {
    name: "Partner",
    commission: "15%",
    requirements: "10+ referrals",
    perks: ["15% commission", "Bi-weekly payouts", "Advanced analytics", "Priority support", "Custom promo codes"],
    color: "border-blue-500",
    popular: true,
  },
  {
    name: "Elite",
    commission: "20%",
    requirements: "50+ referrals",
    perks: ["20% commission", "Weekly payouts", "Real-time analytics", "Dedicated manager", "Custom landing page", "Exclusive offers"],
    color: "border-primary",
  },
]

const benefits = [
  { icon: DollarSign, title: "Competitive Commission", description: "Earn up to 20% on every sale you refer" },
  { icon: Clock, title: "30-Day Cookie", description: "Credit for referrals for 30 days after click" },
  { icon: Gift, title: "Bonus Rewards", description: "Earn bonuses for hitting milestones" },
  { icon: Wallet, title: "Easy Payouts", description: "PayPal, Stripe, or account credit" },
  { icon: BarChart3, title: "Real-Time Tracking", description: "See clicks, conversions, and earnings live" },
  { icon: Target, title: "Marketing Assets", description: "Banners, copy, and promotional materials" },
]

export default function AffiliatesPage() {
  const [copied, setCopied] = useState(false)
  const affiliateLink = "https://visoryx.com/?ref=YOURCODE"

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <TrendingUp className="mr-1.5 h-3 w-3" />
                Affiliate Program
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Earn Money Sharing <span className="text-primary">VisoryX</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Join our affiliate program and earn up to 20% commission on every sale you refer. Share with your community and get paid.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/register?affiliate=true">
                    Join Now - It's Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="container mt-16">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Total Earned by Affiliates", value: "$50,000+" },
                { label: "Active Affiliates", value: "500+" },
                { label: "Average Commission", value: "$12.50" },
                { label: "Payout Rate", value: "100%" },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Why Become an Affiliate?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title}>
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <h2 className="mb-4 text-center text-3xl font-bold">Commission Tiers</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              The more you refer, the more you earn. Unlock higher commission rates as you grow.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {tiers.map((tier) => (
                <Card key={tier.name} className={cn("relative", tier.color, tier.popular && "shadow-lg")}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary">{tier.commission}</div>
                    <CardDescription>{tier.requirements}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { step: 1, title: "Sign Up", description: "Create your free affiliate account in seconds" },
                { step: 2, title: "Share", description: "Share your unique link with your audience" },
                { step: 3, title: "Earn", description: "Get paid for every sale you refer" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Dashboard */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <h2 className="mb-4 text-center text-3xl font-bold">Your Affiliate Dashboard</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Track your performance with our powerful dashboard (preview below)
            </p>
            <Card className="mx-auto max-w-4xl">
              <CardContent className="p-6">
                {/* Quick Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { label: "Clicks", value: "1,234", icon: LinkIcon },
                    { label: "Signups", value: "89", icon: Users },
                    { label: "Sales", value: "34", icon: DollarSign },
                    { label: "Earnings", value: "$425.00", icon: Wallet },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border bg-background p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <stat.icon className="h-4 w-4" />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <div className="mt-1 text-2xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Affiliate Link */}
                <div className="rounded-lg border bg-background p-4">
                  <Label className="mb-2 block text-sm font-medium">Your Affiliate Link</Label>
                  <div className="flex gap-2">
                    <Input value={affiliateLink} readOnly className="font-mono text-sm" />
                    <Button variant="outline" onClick={copyLink}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Next Tier Progress */}
                <div className="mt-6 rounded-lg border bg-background p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Progress to Partner Tier</span>
                    <span className="text-sm text-muted-foreground">34/50 referrals</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    16 more referrals to unlock 15% commission!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-12 text-center">
                <Zap className="mx-auto mb-4 h-12 w-12" />
                <h2 className="mb-4 text-3xl font-bold">Ready to Start Earning?</h2>
                <p className="mx-auto mb-8 max-w-xl opacity-90">
                  Join hundreds of affiliates who are already earning passive income by sharing VisoryX.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register?affiliate=true">
                    Join the Affiliate Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
