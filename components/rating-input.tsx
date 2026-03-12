"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface RatingInputProps {
  value: number
  onChange: (rating: number) => void
  max?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  showValue?: boolean
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  size = "md",
  readOnly = false,
  showValue = false,
  className,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue ?? value

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={cn(
            "transition-transform",
            !readOnly && "hover:scale-110 cursor-pointer",
            readOnly && "cursor-default"
          )}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-muted-foreground"
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Display-only rating with partial stars
interface RatingDisplayProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  reviewCount?: number
  className?: string
}

export function RatingDisplay({
  value,
  max = 5,
  size = "md",
  showValue = true,
  reviewCount,
  className,
}: RatingDisplayProps) {
  const fullStars = Math.floor(value)
  const partialFill = (value - fullStars) * 100
  const emptyStars = max - Math.ceil(value)

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
        />
      ))}
      
      {/* Partial star */}
      {partialFill > 0 && partialFill < 100 && (
        <div className="relative">
          <Star className={cn(sizeClasses[size], "text-muted-foreground")} />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${partialFill}%` }}
          >
            <Star className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")} />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeClasses[size], "text-muted-foreground")}
        />
      ))}
      
      {showValue && (
        <span className="ml-1 text-sm font-medium">{value.toFixed(1)}</span>
      )}
      
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}

// Emoji rating scale
interface EmojiRatingProps {
  value: number | null
  onChange: (rating: number) => void
  className?: string
}

const emojis = [
  { value: 1, emoji: "😡", label: "Very Unhappy" },
  { value: 2, emoji: "😕", label: "Unhappy" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😄", label: "Very Happy" },
]

export function EmojiRating({ value, onChange, className }: EmojiRatingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {emojis.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "text-3xl transition-all hover:scale-125 p-1 rounded",
            value === item.value
              ? "scale-125 bg-primary/10"
              : "grayscale hover:grayscale-0"
          )}
          title={item.label}
        >
          {item.emoji}
        </button>
      ))}
    </div>
  )
}
