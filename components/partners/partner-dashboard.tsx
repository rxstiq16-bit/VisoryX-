"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  DollarSign, Users, TrendingUp, Link2, Copy, Check, 
  ArrowUpRight, Calendar, Download, Star
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

interface PartnerData {
  id: string
  referral_code: string
  commission_rate: number
  total_referrals: number
  total_earnings: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  status: string
}

interface Commission {
  id: string
  order_id: string
  amount: number
  status: "pending" | "approved" | "paid" | "rejected"
  created_at: string
  orders?: {
    customer_name?: string
    total?: number
  }
}

export function PartnerDashboard() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [partner, setPartner] = useState<PartnerData | null>(null)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const { user } = useAuth()
  const supabase = createClient()
  
  useEffect(() => {
    async function fetchPartnerData() {
      if (!user) return
      
      try {
        // Fetch partner data
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (partnerError && partnerError.code !== 'PGRST116') {
          console.error('Error fetching partner:', partnerError)
        }
        
        if (partnerData) {
          setPartner(partnerData)
          
          // Fetch commissions
          const { data: commissionsData, error: commissionsError } = await supabase
            .from('partner_commissions')
            .select(`
              *,
              orders:order_id (
                customer_name,
                total
              )
            `)
            .eq('partner_id', partnerData.id)
            .order('created_at', { ascending: false })
            .limit(10)
          
          if (commissionsError) {
            console.error('Error fetching commissions:', commissionsError)
          } else {
            setCommissions(commissionsData || [])
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPartnerData()
  }, [user, supabase])
  
  const stats = {
    totalEarnings: partner?.total_earnings || 0,
    pendingPayout: commissions.filter(c => c.status === 'pending' || c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
    totalReferrals: partner?.total_referrals || 0,
    conversionRate: partner?.total_referrals ? Math.round((commissions.length / partner.total_referrals) * 100 * 10) / 10 : 0,
    tier: partner?.tier || "bronze",
    commissionRate: partner?.commission_rate || 10,
  }

  const referralLink = `https://visoryx.design/ref/${partner?.referral_code || 'loading'}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTierColor = (tier: "bronze" | "silver" | "gold" | "platinum") => {
    switch (tier) {
      case "bronze": return "bg-orange-500/10 text-orange-500"
      case "silver": return "bg-slate-400/10 text-slate-400"
      case "gold": return "bg-yellow-500/10 text-yellow-500"
      case "platinum": return "bg-purple-500/10 text-purple-500"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!partner) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not a Partner Yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Apply to become a VisoryX partner and earn commissions on referrals.
          </p>
          <Button>Apply Now</Button>
        </CardContent>
      </Card>
    )
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

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
          <CardDescription>Track your referral activity and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <DollarSign className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No commissions yet. Share your referral link to start earning!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {commissions.map((commission) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{commission.orders?.customer_name || 'Customer'}</span>
                      <Badge 
                        variant={commission.status === "paid" ? "default" : "secondary"}
                        className={
                          commission.status === "paid" ? "bg-green-500/10 text-green-500" :
                          commission.status === "approved" ? "bg-blue-500/10 text-blue-500" :
                          commission.status === "rejected" ? "bg-red-500/10 text-red-500" :
                          ""
                        }
                      >
                        {commission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order value: ${commission.orders?.total || 0} - {new Date(commission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-500">
                      +${(commission.amount / 100).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Commission</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
