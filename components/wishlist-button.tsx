"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface WishlistButtonProps {
  serviceId: string
  serviceName: string
  variant?: "icon" | "button"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function WishlistButton({
  serviceId,
  serviceName,
  variant = "icon",
  size = "default",
  className,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("service_id", serviceId)
        .single()

      setIsWishlisted(!!data)
    }

    checkWishlist()
  }, [serviceId, supabase])

  const toggleWishlist = async () => {
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save items to your wishlist",
          variant: "destructive",
        })
        return
      }

      if (isWishlisted) {
        // Remove from wishlist
        await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("service_id", serviceId)

        setIsWishlisted(false)
        toast({
          title: "Removed from wishlist",
          description: `${serviceName} has been removed from your wishlist`,
        })
      } else {
        // Add to wishlist
        await supabase.from("wishlists").insert({
          user_id: user.id,
          service_id: serviceId,
        })

        setIsWishlisted(true)
        toast({
          title: "Added to wishlist",
          description: `${serviceName} has been saved to your wishlist`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "button") {
    return (
      <Button
        variant={isWishlisted ? "secondary" : "outline"}
        size={size}
        onClick={toggleWishlist}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Heart
            className={cn(
              "h-4 w-4 mr-2",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
        )}
        {isWishlisted ? "Saved" : "Save"}
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleWishlist}
            disabled={isLoading}
            className={cn(
              "h-9 w-9 rounded-full",
              isWishlisted && "text-red-500 hover:text-red-600",
              className
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Heart
                className={cn("h-5 w-5", isWishlisted && "fill-current")}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
