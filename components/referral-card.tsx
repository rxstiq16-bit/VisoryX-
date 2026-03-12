"use client"

import { useState, useEffect } from 'react'
import { Users, Copy, Check, Gift, Share2, Twitter, Facebook, Mail, ChevronRight, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarnings: number
  availableCredits: number
}

interface Referral {
  id: string
  referredEmail: string
  status: 'pending' | 'signed_up' | 'ordered' | 'completed'
  rewardAmount: number
  createdAt: string
  completedAt?: string
}

const REFERRAL_TIERS = [
  { referrals: 1, reward: 10, description: 'Get $10 credit' },
  { referrals: 5, reward: 75, description: 'Get $75 credit (bonus!)' },
  { referrals: 10, reward: 175, description: 'Get $175 credit (double bonus!)' },
  { referrals: 25, reward: 500, description: 'Get $500 credit + VIP status' },
]

export function ReferralCard() {
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    availableCredits: 0
  })
  const [referrals, setReferrals] = useState<Referral[]>([])

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    const supabase = createClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return
    }

    // Fetch or create referral code
    let { data: codeData } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!codeData) {
      // Create a new referral code
      const newCode = `VX${user.id.slice(0, 6).toUpperCase()}`
      const { data: newCodeData } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code: newCode,
          reward_amount: 10
        })
        .select()
        .single()
      
      codeData = newCodeData
    }

    if (codeData) {
      setReferralCode(codeData.code)
      setReferralLink(`${window.location.origin}/signup?ref=${codeData.code}`)
      setStats({
        totalReferrals: codeData.total_referrals || 0,
        successfulReferrals: codeData.successful_referrals || 0,
        pendingReferrals: codeData.pending_referrals || 0,
        totalEarnings: codeData.total_earnings || 0,
        availableCredits: codeData.available_credits || 0
      })
    }

    // Fetch referral history
    const { data: referralData } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (referralData) {
      setReferrals(referralData.map(r => ({
        id: r.id,
        referredEmail: r.referred_email,
        status: r.status,
        rewardAmount: r.reward_amount,
        createdAt: r.created_at,
        completedAt: r.completed_at
      })))
    }

    setIsLoading(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareVia = (platform: 'twitter' | 'facebook' | 'email') => {
    const message = `Get amazing designs from VisoryX! Use my referral code ${referralCode} for $10 off your first order.`
    const url = referralLink

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
      email: `mailto:?subject=${encodeURIComponent('Get $10 off at VisoryX!')}&body=${encodeURIComponent(`${message}\n\n${url}`)}`
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'signed_up': return 'bg-blue-100 text-blue-800'
      case 'ordered': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Referral['status']) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'signed_up': return 'Signed Up'
      case 'ordered': return 'Ordered'
      case 'completed': return 'Completed'
      default: return status
    }
  }

  const getNextMilestone = () => {
    const milestone = REFERRAL_TIERS.find(t => t.referrals > stats.successfulReferrals)
    return milestone || null
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  const nextMilestone = getNextMilestone()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Refer & Earn
            </CardTitle>
            <CardDescription>Earn $10 for every friend who orders</CardDescription>
          </div>
          {stats.availableCredits > 0 && (
            <Badge variant="secondary" className="text-green-600">
              ${stats.availableCredits} available
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(referralLink)}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Referral Code */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Your Code</p>
            <p className="font-mono text-lg font-bold">{referralCode}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(referralCode)}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Quick Share */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => shareVia('twitter')}
          >
            <Twitter className="mr-1.5 h-4 w-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => shareVia('facebook')}
          >
            <Facebook className="mr-1.5 h-4 w-4" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => shareVia('email')}
          >
            <Mail className="mr-1.5 h-4 w-4" />
            Email
          </Button>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.successfulReferrals}</p>
            <p className="text-xs text-muted-foreground">Successful</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.pendingReferrals}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${stats.totalEarnings}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Gift className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium">{nextMilestone.referrals - stats.successfulReferrals}</span> more referrals to unlock{' '}
                <span className="font-semibold text-primary">{nextMilestone.description}</span>
              </span>
            </div>
          </div>
        )}

        {/* Full Details Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              View Details & History
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Referral Program</DialogTitle>
              <DialogDescription>
                Share VisoryX and earn rewards
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="how">
              <TabsList className="w-full">
                <TabsTrigger value="how" className="flex-1">How It Works</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                <TabsTrigger value="rewards" className="flex-1">Rewards</TabsTrigger>
              </TabsList>

              <TabsContent value="how" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Share your link</p>
                      <p className="text-sm text-muted-foreground">Send your unique referral link to friends</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <p className="font-medium">They sign up & order</p>
                      <p className="text-sm text-muted-foreground">Your friend gets $10 off their first order</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <p className="font-medium">You get rewarded</p>
                      <p className="text-sm text-muted-foreground">Earn $10 credit when their order completes</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium mb-2">Terms</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Referral credit is applied after the referred order is completed</li>
                    <li>• Credits can be used on any future order</li>
                    <li>• No limit on the number of referrals</li>
                    <li>• Self-referrals are not allowed</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {referrals.length === 0 ? (
                  <div className="py-8 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No referrals yet</p>
                    <p className="text-sm text-muted-foreground">Share your link to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="text-sm font-medium">{referral.referredEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("border-0", getStatusColor(referral.status))}>
                            {getStatusLabel(referral.status)}
                          </Badge>
                          {referral.status === 'completed' && (
                            <span className="text-sm font-semibold text-green-600">
                              +${referral.rewardAmount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rewards" className="mt-4 space-y-3">
                {REFERRAL_TIERS.map((tier, index) => {
                  const isCompleted = stats.successfulReferrals >= tier.referrals
                  const isCurrent = index === 0 
                    ? stats.successfulReferrals < tier.referrals
                    : stats.successfulReferrals >= REFERRAL_TIERS[index - 1].referrals && stats.successfulReferrals < tier.referrals
                  
                  return (
                    <div
                      key={tier.referrals}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-4",
                        isCompleted && "border-green-500 bg-green-50",
                        isCurrent && "border-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          isCompleted ? "bg-green-500" : isCurrent ? "bg-primary" : "bg-muted"
                        )}>
                          {isCompleted ? (
                            <Check className="h-5 w-5 text-white" />
                          ) : (
                            <span className={cn(
                              "font-bold",
                              isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                            )}>
                              {tier.referrals}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tier.referrals} Referrals</p>
                          <p className="text-sm text-muted-foreground">{tier.description}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-lg font-bold",
                        isCompleted ? "text-green-600" : "text-muted-foreground"
                      )}>
                        ${tier.reward}
                      </span>
                    </div>
                  )
                })}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
