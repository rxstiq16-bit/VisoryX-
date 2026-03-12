"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Package,
  Clock,
  ChevronRight,
  Loader2,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Designer {
  id: string
  name: string
  avatar_url?: string
  role: string
  active_orders: number
  completed_today: number
  capacity: number
  avg_rating: number
  status: "available" | "busy" | "offline"
}

export function DesignerQueue() {
  const supabase = createClient()
  const [designers, setDesigners] = useState<Designer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDesigners = async () => {
      // Get staff members with designer role
      const { data: staff } = await supabase
        .from("staff_members")
        .select("id, user_id, role, status")
        .in("role", ["designer", "senior_designer", "lead_designer"])
        .eq("status", "active")

      if (!staff || staff.length === 0) {
        setLoading(false)
        return
      }

      // Get profiles for these staff
      const userIds = staff.map((s) => s.user_id)
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds)

      // Get active order counts per designer
      const { data: assignments } = await supabase
        .from("designer_assignments")
        .select("designer_id, order_id")
        .in("designer_id", userIds)
        .eq("status", "active")

      // Map data together
      const designerData: Designer[] = staff.map((s) => {
        const profile = profiles?.find((p) => p.id === s.user_id)
        const activeOrders = assignments?.filter((a) => a.designer_id === s.user_id).length || 0
        const capacity = s.role === "lead_designer" ? 8 : s.role === "senior_designer" ? 6 : 4

        return {
          id: s.user_id,
          name: profile?.display_name || "Designer",
          avatar_url: profile?.avatar_url,
          role: s.role,
          active_orders: activeOrders,
          completed_today: Math.floor(Math.random() * 5), // TODO: Calculate from actual data
          capacity,
          avg_rating: 4.5 + Math.random() * 0.5, // TODO: Calculate from actual reviews
          status: activeOrders >= capacity ? "busy" : activeOrders > 0 ? "available" : "available",
        }
      })

      // Sort by availability
      const sorted = designerData.sort((a, b) => {
        const aLoad = a.active_orders / a.capacity
        const bLoad = b.active_orders / b.capacity
        return aLoad - bLoad
      })

      setDesigners(sorted)
      setLoading(false)
    }

    fetchDesigners()
  }, [supabase])

  const availableCount = designers.filter((d) => d.status === "available").length
  const totalActive = designers.reduce((sum, d) => sum + d.active_orders, 0)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (designers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium">No designers found</p>
          <p className="text-xs text-muted-foreground">Add staff members with designer roles</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Designer Queue</CardTitle>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              {availableCount} available
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {totalActive} active
            </span>
          </div>
        </div>
        <CardDescription className="text-xs">
          Current workload and availability
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="space-y-2 p-4 pt-0">
            {designers.map((designer) => {
              const loadPercent = (designer.active_orders / designer.capacity) * 100

              return (
                <div
                  key={designer.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    "hover:bg-muted/50",
                    loadPercent >= 100 && "border-amber-500/30 bg-amber-500/5"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={designer.avatar_url} />
                      <AvatarFallback>
                        {designer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                        designer.status === "available" && "bg-green-500",
                        designer.status === "busy" && "bg-amber-500",
                        designer.status === "offline" && "bg-gray-400"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{designer.name}</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {designer.role.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1">
                        <Progress value={loadPercent} className="h-1.5" />
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {designer.active_orders}/{designer.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">
                        {designer.completed_today} today
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-amber-500">
                        {designer.avg_rating.toFixed(1)}
                      </span>
                      <svg
                        className="h-3 w-3 fill-amber-500 text-amber-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
