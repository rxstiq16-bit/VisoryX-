"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Clock, Package, Star, Target, Award, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface DesignerStats {
  id: string
  name: string
  avatar?: string
  role: string
  ordersCompleted: number
  ordersInProgress: number
  averageRating: number
  totalReviews: number
  onTimeDelivery: number // percentage
  averageTurnaround: number // hours
  revenue: number
  hoursLogged: number
  efficiency: number // percentage
  trend: "up" | "down" | "stable"
}

interface StaffPerformanceProps {
  designers: DesignerStats[]
  period?: "week" | "month" | "quarter" | "year"
  onPeriodChange?: (period: "week" | "month" | "quarter" | "year") => void
  className?: string
}

export function StaffPerformance({ designers, period = "month", onPeriodChange, className }: StaffPerformanceProps) {
  const sortedByOrders = [...designers].sort((a, b) => b.ordersCompleted - a.ordersCompleted)
  const sortedByRating = [...designers].sort((a, b) => b.averageRating - a.averageRating)
  const sortedByRevenue = [...designers].sort((a, b) => b.revenue - a.revenue)

  const teamAverages = {
    rating: designers.reduce((sum, d) => sum + d.averageRating, 0) / designers.length || 0,
    onTimeDelivery: designers.reduce((sum, d) => sum + d.onTimeDelivery, 0) / designers.length || 0,
    turnaround: designers.reduce((sum, d) => sum + d.averageTurnaround, 0) / designers.length || 0,
    efficiency: designers.reduce((sum, d) => sum + d.efficiency, 0) / designers.length || 0,
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staff Performance
        </h2>
        <Select value={period} onValueChange={(v) => onPeriodChange?.(v as typeof period)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              Avg Rating
            </div>
            <p className="text-2xl font-bold mt-1">{teamAverages.rating.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              On-Time
            </div>
            <p className="text-2xl font-bold mt-1">{teamAverages.onTimeDelivery.toFixed(0)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Avg Turnaround
            </div>
            <p className="text-2xl font-bold mt-1">{teamAverages.turnaround.toFixed(0)}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              Efficiency
            </div>
            <p className="text-2xl font-bold mt-1">{teamAverages.efficiency.toFixed(0)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboards */}
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">By Orders</TabsTrigger>
          <TabsTrigger value="rating">By Rating</TabsTrigger>
          <TabsTrigger value="revenue">By Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {sortedByOrders.map((designer, index) => (
                  <DesignerRow key={designer.id} designer={designer} rank={index + 1} metric="orders" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rating" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {sortedByRating.map((designer, index) => (
                  <DesignerRow key={designer.id} designer={designer} rank={index + 1} metric="rating" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {sortedByRevenue.map((designer, index) => (
                  <DesignerRow key={designer.id} designer={designer} rank={index + 1} metric="revenue" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Performance Cards */}
      <div className="grid grid-cols-2 gap-4">
        {designers.map(designer => (
          <DesignerDetailCard key={designer.id} designer={designer} />
        ))}
      </div>
    </div>
  )
}

interface DesignerRowProps {
  designer: DesignerStats
  rank: number
  metric: "orders" | "rating" | "revenue"
}

function DesignerRow({ designer, rank, metric }: DesignerRowProps) {
  const getRankBadge = () => {
    if (rank === 1) return <Badge className="bg-yellow-500">1st</Badge>
    if (rank === 2) return <Badge className="bg-gray-400">2nd</Badge>
    if (rank === 3) return <Badge className="bg-amber-600">3rd</Badge>
    return <Badge variant="outline">{rank}th</Badge>
  }

  const getValue = () => {
    switch (metric) {
      case "orders":
        return `${designer.ordersCompleted} orders`
      case "rating":
        return `${designer.averageRating.toFixed(1)} stars`
      case "revenue":
        return `$${designer.revenue.toLocaleString()}`
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-12">{getRankBadge()}</div>
      <Avatar className="h-10 w-10">
        <AvatarImage src={designer.avatar} alt={designer.name} />
        <AvatarFallback>{designer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{designer.name}</p>
        <p className="text-sm text-muted-foreground">{designer.role}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">{getValue()}</p>
        <div className="flex items-center justify-end gap-1 text-xs">
          {designer.trend === "up" && (
            <>
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Improving</span>
            </>
          )}
          {designer.trend === "down" && (
            <>
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">Declining</span>
            </>
          )}
          {designer.trend === "stable" && (
            <span className="text-muted-foreground">Stable</span>
          )}
        </div>
      </div>
    </div>
  )
}

function DesignerDetailCard({ designer }: { designer: DesignerStats }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={designer.avatar} alt={designer.name} />
            <AvatarFallback>{designer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{designer.name}</CardTitle>
            <CardDescription>{designer.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Orders</p>
            <p className="font-bold">{designer.ordersCompleted} completed</p>
            <p className="text-xs text-muted-foreground">{designer.ordersInProgress} in progress</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rating</p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{designer.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({designer.totalReviews})</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">On-Time Delivery</span>
            <span className="font-medium">{designer.onTimeDelivery}%</span>
          </div>
          <Progress value={designer.onTimeDelivery} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Efficiency</span>
            <span className="font-medium">{designer.efficiency}%</span>
          </div>
          <Progress value={designer.efficiency} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
          <div>
            <p className="text-muted-foreground">Hours Logged</p>
            <p className="font-bold">{designer.hoursLogged}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Revenue</p>
            <p className="font-bold text-green-600">${designer.revenue.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
