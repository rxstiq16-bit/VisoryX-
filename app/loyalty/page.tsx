"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoyaltyCard } from "@/components/loyalty-card"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Star, Crown, Zap, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const tiers = [
  { name: "Bronze", minPoints: 0, color: "bg-amber-700", perks: ["Standard support", "Basic rewards"] },
  { name: "Silver", minPoints: 500, color: "bg-slate-400", perks: ["Priority support", "5% discount", "Early access"] },
  { name: "Gold", minPoints: 1500, color: "bg-yellow-500", perks: ["Premium support", "10% discount", "Free rush delivery"] },
  { name: "Platinum", minPoints: 5000, color: "bg-purple-500", perks: ["VIP support", "15% discount", "Dedicated manager", "Exclusive events"] },
]

export default function LoyaltyPage() {
  const { user } = useAuth()
  const { data, isLoading } = useSWR(user ? "/api/loyalty" : null, fetcher)

  const currentTierIndex = tiers.findIndex(t => t.name.toLowerCase() === data?.tier?.current) || 0
  const currentTier = tiers[currentTierIndex]
  const nextTier = tiers[currentTierIndex + 1]

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background pt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Loyalty Rewards</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Earn points with every order and action. Redeem for discounts, free services, and exclusive perks.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!user ? (
              <Card className="mx-auto max-w-md text-center">
                <CardHeader>
                  <CardTitle>Join the Rewards Program</CardTitle>
                  <CardDescription>
                    Sign in to start earning points and unlocking exclusive rewards.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Points Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Your Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-5xl font-bold">{data?.points?.current?.toLocaleString() || 0}</span>
                        <span className="text-muted-foreground">available points</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Total Earned</p>
                          <p className="text-2xl font-semibold">{data?.points?.totalEarned?.toLocaleString() || 0}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Total Redeemed</p>
                          <p className="text-2xl font-semibold">{data?.points?.totalRedeemed?.toLocaleString() || 0}</p>
                        </div>
                      </div>

                      {nextTier && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{currentTier?.name}</span>
                            <span>{data?.tier?.pointsToNext?.toLocaleString()} points to {nextTier.name}</span>
                          </div>
                          <Progress value={data?.tier?.progress || 0} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="rewards">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
                      <TabsTrigger value="history">Point History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rewards" className="mt-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {data?.rewards?.map((reward: {
                          id: string
                          name: string
                          description: string
                          points_cost: number
                          reward_type: string
                        }) => (
                          <Card key={reward.id}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{reward.name}</CardTitle>
                                <Badge variant="secondary">{reward.points_cost} pts</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                              <Button 
                                size="sm" 
                                className="w-full"
                                disabled={(data?.points?.current || 0) < reward.points_cost}
                              >
                                Redeem
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="history" className="mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          {data?.transactions?.length > 0 ? (
                            <div className="space-y-4">
                              {data.transactions.map((tx: {
                                id: string
                                type: string
                                points: number
                                description: string
                                created_at: string
                              }) => (
                                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                  <div>
                                    <p className="font-medium">{tx.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <span className={tx.points > 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                                    {tx.points > 0 ? "+" : ""}{tx.points}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground py-8">
                              No transactions yet. Start earning points!
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <LoyaltyCard />

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ways to Earn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { action: "Place an order", points: "1 pt / $1 spent" },
                        { action: "Leave a review", points: "+50 pts" },
                        { action: "Refer a friend", points: "+200 pts" },
                        { action: "Complete survey", points: "+25 pts" },
                        { action: "Birthday bonus", points: "+100 pts" },
                      ].map((item) => (
                        <div key={item.action} className="flex justify-between text-sm">
                          <span>{item.action}</span>
                          <span className="text-primary font-medium">{item.points}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Tiers */}
        <section className="border-t border-border bg-card/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">Membership Tiers</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {tiers.map((tier, index) => (
                <Card key={tier.name} className={data?.tier?.current === tier.name.toLowerCase() ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <div className={`h-3 w-full rounded-full mb-4 ${tier.color}`} />
                    <CardTitle className="flex items-center gap-2">
                      {tier.name}
                      {data?.tier?.current === tier.name.toLowerCase() && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {tier.minPoints === 0 ? "Starting tier" : `${tier.minPoints.toLocaleString()}+ points`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
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
      </main>
      <Footer />
    </div>
  )
}
