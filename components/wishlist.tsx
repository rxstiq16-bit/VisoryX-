"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, ShoppingCart, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"

interface WishlistItem {
  id: string
  serviceId: string
  serviceName: string
  servicePrice: number
  addedAt: Date
}

// Context for wishlist state
import { createContext, useContext } from "react"

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (serviceId: string, serviceName: string, servicePrice: number) => void
  removeItem: (serviceId: string) => void
  isInWishlist: (serviceId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    // Load from localStorage or database
    const stored = localStorage.getItem("wishlist")
    if (stored) setItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (serviceId: string, serviceName: string, servicePrice: number) => {
    if (items.some((i) => i.serviceId === serviceId)) return
    setItems((prev) => [...prev, { id: Date.now().toString(), serviceId, serviceName, servicePrice, addedAt: new Date() }])
  }

  const removeItem = (serviceId: string) => {
    setItems((prev) => prev.filter((i) => i.serviceId !== serviceId))
  }

  const isInWishlist = (serviceId: string) => items.some((i) => i.serviceId === serviceId)

  const clearWishlist = () => setItems([])

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

interface WishlistButtonProps {
  serviceId: string
  serviceName: string
  servicePrice: number
  variant?: "icon" | "button"
  className?: string
}

export function WishlistButton({ serviceId, serviceName, servicePrice, variant = "icon", className }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(serviceId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeItem(serviceId)
    } else {
      addItem(serviceId, serviceName, servicePrice)
    }
  }

  if (variant === "button") {
    return (
      <Button variant={inWishlist ? "default" : "outline"} onClick={handleClick} className={className}>
        <Heart className={cn("mr-2 h-4 w-4", inWishlist && "fill-current")} />
        {inWishlist ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleClick} className={cn("h-8 w-8", className)}>
            <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { WishlistDrawer as Wishlist }

export function WishlistDrawer() {
  const { items, removeItem, clearWishlist } = useWishlist()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Wishlist ({items.length})
            {items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearWishlist}>Clear all</Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">Your wishlist is empty</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/services">Browse services</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.serviceName}</p>
                  <p className="text-sm text-muted-foreground">${item.servicePrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm">
                    <Link href={`/order?product=${item.serviceId}`}>
                      <ShoppingCart className="mr-1 h-3 w-3" />
                      Order
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.serviceId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
