"use client"

import { useState, useEffect } from 'react'
import { Gift, Star, Trophy, Zap, ChevronRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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

interface LoyaltyTier {
  name: string
  minPoints: number
  maxPoints: number
  color: string
  bgColor: string
  benefits: string[]
  icon: React.ElementType
}

const TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    benefits: ['5% off all orders', 'Early access to sales'],
    icon: Star
  },
  {
    name: 'Silver',
    minPoints: 500,
    maxPoints: 1499,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    benefits: ['10% off all orders', 'Priority support', 'Free revisions +1'],
    icon: Zap
  },
  {
    name: 'Gold',
    minPoints: 1500,
    maxPoints: 4999,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    benefits: ['15% off all orders', 'Priority queue', 'Free rush delivery', 'Dedicated designer'],
    icon: Trophy
  },
  {
    name: 'Platinum',
    minPoints: 5000,
    maxPoints: Infinity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    benefits: ['20% off all orders', 'VIP support', 'Unlimited revisions', 'Custom services', 'Early feature access'],
    icon: Sparkles
  }
]

interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  type: 'discount' | 'service' | 'perk'
  available: boolean
}

const REWARDS: Reward[] = [
  { id: '1', name: '10% Off Next Order', description: 'Get 10% discount on your next order', pointsCost: 100, type: 'discount', available: true },
  { id: '2', name: '25% Off Next Order', description: 'Get 25% discount on your next order', pointsCost: 200, type: 'discount', available: true },
  { id: '3', name: 'Free Rush Delivery', description: 'Skip the queue on any order', pointsCost: 150, type: 'perk', available: true },
  { id: '4', name: 'Extra Revision', description: 'Get +2 extra revisions on any order', pointsCost: 75, type: 'perk', available: true },
  { id: '5', name: 'Free Logo Design', description: 'Redeem for a free logo design', pointsCost: 500, type: 'service', available: true },
  { id: '6', name: 'Free Banner Design', description: 'Redeem for a free banner design', pointsCost: 300, type: 'service', available: true },
]

interface PointsHistory {
  id: string
  type: 'earned' | 'redeemed'
  amount: number
  description: string
  date: string
}

export function LoyaltyCard() {
  const [points, setPoints] = useState(0)
  const [lifetimePoints, setLifetimePoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<PointsHistory[]>([])
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null)

  useEffect(() => {
    fetchLoyaltyData()
  }, [])

  const fetchLoyaltyData = async () => {
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

    // Fetch loyalty points
    const { data: loyaltyData } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (loyaltyData) {
      setPoints(loyaltyData.current_points || 0)
      setLifetimePoints(loyaltyData.lifetime_points || 0)
    }

    // Fetch points history
    const { data: historyData } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (historyData) {
      setHistory(historyData.map(h => ({
        id: h.id,
        type: h.points > 0 ? 'earned' : 'redeemed',
        amount: Math.abs(h.points),
        description: h.description,
        date: h.created_at
      })))
    }

    setIsLoading(false)
  }

  const getCurrentTier = (): LoyaltyTier => {
    return TIERS.find(tier => lifetimePoints >= tier.minPoints && lifetimePoints <= tier.maxPoints) || TIERS[0]
  }

  const getNextTier = (): LoyaltyTier | null => {
    const currentIndex = TIERS.findIndex(tier => lifetimePoints >= tier.minPoints && lifetimePoints <= tier.maxPoints)
    return currentIndex < TIERS.length - 1 ? TIERS[currentIndex + 1] : null
  }

  const getProgressToNextTier = (): number => {
    const currentTier = getCurrentTier()
    const nextTier = getNextTier()
    
    if (!nextTier) return 100
    
    const pointsInTier = lifetimePoints - currentTier.minPoints
    const pointsNeeded = nextTier.minPoints - currentTier.minPoints
    
    return Math.min(100, (pointsInTier / pointsNeeded) * 100)
  }

  const handleRedeem = async (reward: Reward) => {
    if (points < reward.pointsCost) return
    
    setIsRedeeming(reward.id)
    
    const supabase = createClient()
    if (!supabase) {
      setIsRedeeming(null)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsRedeeming(null)
      return
    }

    // Deduct points
    const { error } = await supabase
      .from('loyalty_points')
      .update({ current_points: points - reward.pointsCost })
      .eq('user_id', user.id)

    if (!error) {
      // Add transaction record
      await supabase.from('loyalty_transactions').insert({
        user_id: user.id,
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.name}`,
        reward_id: reward.id
      })

      setPoints(prev => prev - reward.pointsCost)
      
      // Add to history
      setHistory(prev => [{
        id: Date.now().toString(),
        type: 'redeemed',
        amount: reward.pointsCost,
        description: `Redeemed: ${reward.name}`,
        date: new Date().toISOString()
      }, ...prev])
    }

    setIsRedeeming(null)
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const TierIcon = currentTier.icon

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Loyalty Rewards
            </CardTitle>
            <CardDescription>Earn points with every order</CardDescription>
          </div>
          <Badge className={cn(currentTier.bgColor, currentTier.color, "border-0")}>
            <TierIcon className="mr-1 h-3 w-3" />
            {currentTier.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Points Display */}
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-3xl font-bold">{points.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Lifetime Points</p>
            <p className="text-lg font-semibold text-muted-foreground">{lifetimePoints.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={currentTier.color}>{currentTier.name}</span>
              <span className={nextTier.color}>{nextTier.name}</span>
            </div>
            <Progress value={getProgressToNextTier()} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">
              {(nextTier.minPoints - lifetimePoints).toLocaleString()} points to {nextTier.name}
            </p>
          </div>
        )}

        {/* Current Tier Benefits */}
        <div>
          <p className="mb-2 text-sm font-medium">Your {currentTier.name} Benefits</p>
          <ul className="space-y-1">
            {currentTier.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-3 w-3 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Rewards Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Gift className="mr-2 h-4 w-4" />
              Redeem Points
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Redeem Your Points</DialogTitle>
              <DialogDescription>
                You have <span className="font-semibold text-foreground">{points.toLocaleString()}</span> points available
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="rewards">
              <TabsList className="w-full">
                <TabsTrigger value="rewards" className="flex-1">Rewards</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                <TabsTrigger value="tiers" className="flex-1">Tiers</TabsTrigger>
              </TabsList>

              <TabsContent value="rewards" className="space-y-3 mt-4">
                {REWARDS.map((reward) => (
                  <div
                    key={reward.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-4",
                      points < reward.pointsCost && "opacity-50"
                    )}
                  >
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={points < reward.pointsCost || isRedeeming === reward.id}
                      onClick={() => handleRedeem(reward)}
                    >
                      {isRedeeming === reward.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>{reward.pointsCost} pts</>
                      )}
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {history.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No points history yet</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={cn(
                          "font-semibold",
                          item.type === 'earned' ? "text-green-600" : "text-red-600"
                        )}>
                          {item.type === 'earned' ? '+' : '-'}{item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tiers" className="mt-4 space-y-3">
                {TIERS.map((tier) => {
                  const Icon = tier.icon
                  const isCurrent = tier.name === currentTier.name
                  return (
                    <div
                      key={tier.name}
                      className={cn(
                        "rounded-lg border p-4",
                        isCurrent && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("rounded-full p-1.5", tier.bgColor)}>
                          <Icon className={cn("h-4 w-4", tier.color)} />
                        </div>
                        <span className={cn("font-semibold", tier.color)}>{tier.name}</span>
                        {isCurrent && <Badge variant="secondary" className="ml-auto">Current</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {tier.maxPoints === Infinity 
                          ? `${tier.minPoints.toLocaleString()}+ lifetime points`
                          : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()} lifetime points`
                        }
                      </p>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Star className="h-2.5 w-2.5 text-primary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
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
