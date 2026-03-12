"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, Sparkles, Star, Flame, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

type BadgeType = "popular" | "trending" | "new" | "hot" | "bestseller" | "featured"

interface PopularServiceBadgeProps {
  type?: BadgeType
  orderCount?: number
  className?: string
}

const badgeConfig: Record<BadgeType, { icon: React.ElementType; label: string; color: string; tooltip: string }> = {
  popular: {
    icon: TrendingUp,
    label: "Popular",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tooltip: "Frequently ordered by customers",
  },
  trending: {
    icon: TrendingUp,
    label: "Trending",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    tooltip: "Rising in popularity this week",
  },
  new: {
    icon: Sparkles,
    label: "New",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    tooltip: "Recently added service",
  },
  hot: {
    icon: Flame,
    label: "Hot",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    tooltip: "High demand right now",
  },
  bestseller: {
    icon: Star,
    label: "Bestseller",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    tooltip: "One of our top-selling services",
  },
  featured: {
    icon: Crown,
    label: "Featured",
    color: "bg-primary/10 text-primary border-primary/20",
    tooltip: "Staff-recommended service",
  },
}

export function PopularServiceBadge({ type = "popular", orderCount, className }: PopularServiceBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={cn("flex items-center gap-1", config.color, className)}>
            <Icon className="h-3 w-3" />
            {config.label}
            {orderCount && <span className="ml-1 text-xs opacity-70">({orderCount}+)</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Compact version for cards
export function ServiceBadges({ badges, className }: { badges: BadgeType[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges.map((type) => (
        <PopularServiceBadge key={type} type={type} />
      ))}
    </div>
  )
}
