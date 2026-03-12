"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown,
  Medal,
  Flame,
  Heart,
  ShoppingBag,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Lock
} from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "orders" | "engagement" | "loyalty" | "social" | "special"
  points: number
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  star: Star,
  award: Award,
  target: Target,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  flame: Flame,
  heart: Heart,
  bag: ShoppingBag,
  message: MessageSquare,
  users: Users,
  calendar: Calendar,
  trending: TrendingUp,
}

const CATEGORY_LABELS: Record<string, string> = {
  orders: "Orders",
  engagement: "Engagement",
  loyalty: "Loyalty",
  social: "Social",
  special: "Special",
}

// Mock achievements data
const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "1", name: "First Order", description: "Place your first order", icon: "bag", category: "orders", points: 50, unlocked: true, unlockedAt: "2024-01-15" },
  { id: "2", name: "Repeat Customer", description: "Complete 5 orders", icon: "star", category: "orders", points: 100, unlocked: true, unlockedAt: "2024-02-20" },
  { id: "3", name: "Power Buyer", description: "Complete 10 orders", icon: "zap", category: "orders", points: 200, unlocked: false, progress: 7, maxProgress: 10 },
  { id: "4", name: "VIP Status", description: "Complete 25 orders", icon: "crown", category: "orders", points: 500, unlocked: false, progress: 7, maxProgress: 25 },
  { id: "5", name: "First Review", description: "Leave your first review", icon: "message", category: "engagement", points: 25, unlocked: true, unlockedAt: "2024-01-20" },
  { id: "6", name: "Reviewer", description: "Leave 5 reviews", icon: "star", category: "engagement", points: 75, unlocked: false, progress: 2, maxProgress: 5 },
  { id: "7", name: "Loyal Member", description: "Be a member for 3 months", icon: "calendar", category: "loyalty", points: 100, unlocked: true, unlockedAt: "2024-04-01" },
  { id: "8", name: "Point Collector", description: "Earn 1,000 loyalty points", icon: "trophy", category: "loyalty", points: 150, unlocked: true, unlockedAt: "2024-03-15" },
  { id: "9", name: "First Referral", description: "Refer your first friend", icon: "users", category: "social", points: 100, unlocked: false, progress: 0, maxProgress: 1 },
  { id: "10", name: "Influencer", description: "Refer 5 friends", icon: "trending", category: "social", points: 300, unlocked: false, progress: 0, maxProgress: 5 },
  { id: "11", name: "Early Bird", description: "Join during beta", icon: "flame", category: "special", points: 250, unlocked: true, unlockedAt: "2024-01-01" },
  { id: "12", name: "Big Spender", description: "Spend $500 total", icon: "award", category: "special", points: 500, unlocked: false, progress: 245, maxProgress: 500 },
]

export function AchievementsDisplay() {
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const categories = ["all", ...Object.keys(CATEGORY_LABELS)]

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unlockedCount}/{totalCount}</p>
                <p className="text-xs text-muted-foreground">Achievements Unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Achievement Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Target className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round((unlockedCount / totalCount) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Achievements Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => {
          const IconComponent = ACHIEVEMENT_ICONS[achievement.icon] || Trophy
          
          return (
            <Card 
              key={achievement.id}
              className={cn(
                "transition-all",
                achievement.unlocked 
                  ? "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" 
                  : "opacity-75"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                    achievement.unlocked 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {achievement.unlocked ? (
                      <IconComponent className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{achievement.name}</h3>
                      <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                        +{achievement.points}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                    
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1.5" />
                      </div>
                    )}
                    
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
