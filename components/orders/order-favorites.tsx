"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderFavoritesProps {
  orderId: string
  isFavorite: boolean
  onToggle?: (isFavorite: boolean) => void
  size?: "sm" | "default" | "lg"
}

export function OrderFavoriteButton({ orderId, isFavorite: initialFavorite, onToggle, size = "default" }: OrderFavoritesProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !isFavorite }),
      })
      if (res.ok) {
        setIsFavorite(!isFavorite)
        onToggle?.(!isFavorite)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-9 w-9",
    lg: "h-10 w-10",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(sizeClasses[size], "relative")}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Star
        className={cn(
          iconSizes[size],
          "transition-all",
          isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        )}
      />
      <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  )
}
