"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Trophy, Medal, Award, TrendingUp, Star, Crown } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string
  avatarUrl?: string
  points: number
  ordersCompleted: number
  memberSince: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  isCurrentUser?: boolean
}

const TIER_COLORS = {
  bronze: "text-orange-600 bg-orange-500/10",
  silver: "text-slate-400 bg-slate-400/10",
  gold: "text-amber-500 bg-amber-500/10",
  platinum: "text-violet-400 bg-violet-400/10",
}

const TIER_LABELS = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
}

// Mock data
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: "1", username: "designking", displayName: "Design King", points: 15420, ordersCompleted: 87, memberSince: "2023-01-15", tier: "platinum" },
  { rank: 2, userId: "2", username: "creativepro", displayName: "Creative Pro", points: 12850, ordersCompleted: 72, memberSince: "2023-02-20", tier: "platinum" },
  { rank: 3, userId: "3", username: "artmaster", displayName: "Art Master", points: 11200, ordersCompleted: 65, memberSince: "2023-03-10", tier: "gold" },
  { rank: 4, userId: "4", username: "pixelperfect", displayName: "Pixel Perfect", points: 9875, ordersCompleted: 58, memberSince: "2023-04-05", tier: "gold" },
  { rank: 5, userId: "5", username: "brandbuilder", displayName: "Brand Builder", points: 8420, ordersCompleted: 49, memberSince: "2023-05-12", tier: "gold" },
  { rank: 6, userId: "6", username: "logolegend", displayName: "Logo Legend", points: 7650, ordersCompleted: 44, memberSince: "2023-06-18", tier: "silver" },
  { rank: 7, userId: "7", username: "visualvibe", displayName: "Visual Vibe", points: 6890, ordersCompleted: 40, memberSince: "2023-07-22", tier: "silver" },
  { rank: 8, userId: "8", username: "you", displayName: "You", points: 1250, ordersCompleted: 7, memberSince: "2024-01-01", tier: "bronze", isCurrentUser: true },
  { rank: 9, userId: "9", username: "newbie123", displayName: "Newbie", points: 980, ordersCompleted: 5, memberSince: "2024-02-15", tier: "bronze" },
  { rank: 10, userId: "10", username: "starter", displayName: "Starter", points: 450, ordersCompleted: 3, memberSince: "2024-03-01", tier: "bronze" },
]

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-amber-500" />
    case 2:
      return <Medal className="h-5 w-5 text-slate-400" />
    case 3:
      return <Award className="h-5 w-5 text-orange-600" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }
}

export function Leaderboard() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("monthly")
  const currentUserEntry = MOCK_LEADERBOARD.find(e => e.isCurrentUser)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top customers by loyalty points</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <Avatar className="h-14 w-14 border-2 border-slate-400">
              <AvatarImage src={MOCK_LEADERBOARD[1].avatarUrl} />
              <AvatarFallback className="bg-slate-400/10 text-slate-400">
                {MOCK_LEADERBOARD[1].displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex h-16 w-20 items-end justify-center rounded-t-lg bg-slate-400/20 mt-2">
              <Medal className="h-6 w-6 text-slate-400 mb-2" />
            </div>
            <p className="text-sm font-medium mt-2">{MOCK_LEADERBOARD[1].displayName}</p>
            <p className="text-xs text-muted-foreground">{MOCK_LEADERBOARD[1].points.toLocaleString()} pts</p>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16 border-2 border-amber-500 ring-2 ring-amber-500/20">
              <AvatarImage src={MOCK_LEADERBOARD[0].avatarUrl} />
              <AvatarFallback className="bg-amber-500/10 text-amber-500">
                {MOCK_LEADERBOARD[0].displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex h-24 w-24 items-end justify-center rounded-t-lg bg-amber-500/20 mt-2">
              <Crown className="h-8 w-8 text-amber-500 mb-2" />
            </div>
            <p className="font-semibold mt-2">{MOCK_LEADERBOARD[0].displayName}</p>
            <p className="text-sm text-muted-foreground">{MOCK_LEADERBOARD[0].points.toLocaleString()} pts</p>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <Avatar className="h-14 w-14 border-2 border-orange-600">
              <AvatarImage src={MOCK_LEADERBOARD[2].avatarUrl} />
              <AvatarFallback className="bg-orange-500/10 text-orange-600">
                {MOCK_LEADERBOARD[2].displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex h-12 w-20 items-end justify-center rounded-t-lg bg-orange-500/20 mt-2">
              <Award className="h-5 w-5 text-orange-600 mb-2" />
            </div>
            <p className="text-sm font-medium mt-2">{MOCK_LEADERBOARD[2].displayName}</p>
            <p className="text-xs text-muted-foreground">{MOCK_LEADERBOARD[2].points.toLocaleString()} pts</p>
          </div>
        </div>

        {/* Full List */}
        <div className="space-y-2">
          {MOCK_LEADERBOARD.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-4 rounded-lg p-3 transition-colors",
                entry.isCurrentUser 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-secondary/50"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatarUrl} />
                <AvatarFallback className={TIER_COLORS[entry.tier]}>
                  {entry.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">
                    {entry.displayName}
                    {entry.isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                  </p>
                  <Badge variant="outline" className={cn("text-xs", TIER_COLORS[entry.tier])}>
                    {TIER_LABELS[entry.tier]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  @{entry.username} - {entry.ordersCompleted} orders
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{entry.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Position (if not in top 10) */}
        {currentUserEntry && currentUserEntry.rank > 10 && (
          <>
            <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Your Position</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-primary/10 border border-primary/20 p-3">
              <div className="flex h-8 w-8 items-center justify-center">
                <span className="text-sm font-bold">#{currentUserEntry.rank}</span>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {currentUserEntry.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{currentUserEntry.displayName} (You)</p>
                <p className="text-xs text-muted-foreground">{currentUserEntry.ordersCompleted} orders</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{currentUserEntry.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
