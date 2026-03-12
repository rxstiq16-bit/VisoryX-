"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ReferralCard } from "@/components/referral-card"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Copy, CheckCircle, DollarSign, TrendingUp, Share2, Twitter, Facebook, Mail } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ReferralsPage() {
  const { user } = useAuth()
  const { data, isLoading } = useSWR(user ? "/api/referrals" : null, fetcher)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(data?.referralLink || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent("Check out VisoryX for amazing design services! Use my referral link to get started:")
    const url = encodeURIComponent(data?.referralLink || "")
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank")
  }

  const shareToFacebook = () => {
    const url = encodeURIComponent(data?.referralLink || "")
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
  }

  const shareByEmail = () => {
    const subject = encodeURIComponent("Check out VisoryX!")
    const body = encodeURIComponent(`I've been using VisoryX for design services and I think you'd love it too!\n\nSign up using my referral link: ${data?.referralLink}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background pt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Refer & Earn</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Invite friends to VisoryX and earn rewards. They get a discount, you earn commission on every order.
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
                  <CardTitle>Start Referring</CardTitle>
                  <CardDescription>
                    Sign in to get your unique referral link and start earning.
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
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Referral Link */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Referral Link</CardTitle>
                      <CardDescription>Share this link with friends to earn rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-4">
                        <Input 
                          value={data?.referralLink || ""} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button onClick={copyLink} variant="outline">
                          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={shareToTwitter}>
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareToFacebook}>
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareByEmail}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <div className="grid gap-4 sm:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Total Referrals</span>
                        </div>
                        <p className="text-3xl font-bold">{data?.stats?.total || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Converted</span>
                        </div>
                        <p className="text-3xl font-bold">{data?.stats?.converted || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">Pending</span>
                        </div>
                        <p className="text-3xl font-bold">{data?.stats?.pending || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">Earned</span>
                        </div>
                        <p className="text-3xl font-bold">${data?.stats?.totalEarnings || 0}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Referrals */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data?.referrals?.length > 0 ? (
                        <div className="space-y-4">
                          {data.referrals.map((referral: {
                            id: string
                            status: string
                            reward_amount: number
                            created_at: string
                            referred: { display_name: string } | null
                          }) => (
                            <div key={referral.id} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {referral.referred?.display_name?.[0] || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{referral.referred?.display_name || "Anonymous"}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={referral.status === "converted" ? "default" : "secondary"}>
                                  {referral.status}
                                </Badge>
                                {referral.status === "converted" && (
                                  <p className="text-sm text-green-500 mt-1">+${referral.reward_amount}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No referrals yet. Share your link to start earning!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <ReferralCard />

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Commission Tiers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { tier: "Bronze", referrals: "0+", rate: "5%" },
                        { tier: "Silver", referrals: "3+", rate: "8%" },
                        { tier: "Gold", referrals: "10+", rate: "12%" },
                        { tier: "Platinum", referrals: "25+", rate: "15%" },
                        { tier: "Diamond", referrals: "50+", rate: "20%" },
                      ].map((item) => (
                        <div key={item.tier} className="flex justify-between text-sm">
                          <span className={data?.tier?.current === item.tier.toLowerCase() ? "font-semibold text-primary" : ""}>
                            {item.tier} ({item.referrals})
                          </span>
                          <span className="font-medium">{item.rate}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How it Works */}
        <section className="border-t border-border bg-card/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-2">1</div>
                  <CardTitle className="text-lg">Share Your Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Copy your unique referral link and share it with friends, on social media, or anywhere else.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-2">2</div>
                  <CardTitle className="text-lg">Friends Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When someone signs up using your link, they get 15% off their first order automatically.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-2">3</div>
                  <CardTitle className="text-lg">Earn Commission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You earn a commission on every order they place. The more referrals, the higher your rate!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
