"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, TrendingUp, TrendingDown, Users, Eye, ShoppingCart, CreditCard, CheckCircle } from "lucide-react"
import { useState } from "react"

interface FunnelStage {
  name: string
  icon: React.ElementType
  count: number
  rate: number
  change: number
  color: string
}

const funnelData: FunnelStage[] = [
  { name: "Visitors", icon: Eye, count: 12847, rate: 100, change: 12.5, color: "bg-blue-500" },
  { name: "Sign Ups", icon: Users, count: 2156, rate: 16.8, change: 8.2, color: "bg-purple-500" },
  { name: "Add to Cart", icon: ShoppingCart, count: 1432, rate: 66.4, change: -2.1, color: "bg-pink-500" },
  { name: "Checkout Started", icon: CreditCard, count: 876, rate: 61.2, change: 5.7, color: "bg-orange-500" },
  { name: "Order Completed", icon: CheckCircle, count: 623, rate: 71.1, change: 3.4, color: "bg-green-500" },
]

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
]

export function ConversionFunnel() {
  const [timeRange, setTimeRange] = useState("30d")
  const overallConversion = ((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Track user journey from visit to purchase</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {overallConversion}% overall conversion
            </Badge>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelData.map((stage, index) => {
            const Icon = stage.icon
            const widthPercent = (stage.count / funnelData[0].count) * 100
            const isLast = index === funnelData.length - 1

            return (
              <div key={stage.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stage.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{stage.name}</p>
                      <p className="text-sm text-muted-foreground">{stage.count.toLocaleString()} users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {index > 0 && (
                      <Badge variant="secondary">{stage.rate}% from previous</Badge>
                    )}
                    <div className={`flex items-center gap-1 text-sm ${stage.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {stage.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(stage.change)}%
                    </div>
                  </div>
                </div>
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 ${stage.color} transition-all duration-500`} style={{ width: `${widthPercent}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">{widthPercent.toFixed(1)}%</span>
                  </div>
                </div>
                {!isLast && (
                  <div className="flex justify-center py-2">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ArrowDown className="h-4 w-4" />
                      <span className="text-xs">{(100 - funnelData[index + 1].rate).toFixed(1)}% drop-off</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${(funnelData[4].count * 127).toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${((funnelData[4].count * 127) / funnelData[0].count).toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Revenue per Visitor</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${(funnelData[4].count * 127 / funnelData[4].count).toFixed(0)}</div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
