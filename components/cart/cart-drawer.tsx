"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Cart,
  CartItem,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from "@/lib/cart"

interface CartDrawerProps {
  className?: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function CartDrawer({ className }: CartDrawerProps) {
  const router = useRouter()
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, discount: 0, total: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  useEffect(() => {
    setCart(getCart())

    const handleCartUpdate = (e: CustomEvent<Cart>) => {
      setCart(e.detail)
    }

    window.addEventListener("cart-updated", handleCartUpdate as EventListener)
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate as EventListener)
    }
  }, [])

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return

    const newQuantity = item.quantity + delta
    if (newQuantity < 1) {
      removeFromCart(itemId)
    } else {
      updateCartItem(itemId, { quantity: newQuantity })
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)
    setPromoError("")

    const result = await applyPromoCode(promoCode)

    if (!result.success) {
      setPromoError(result.error || "Failed to apply promo code")
    } else {
      setPromoCode("")
    }

    setIsApplyingPromo(false)
  }

  const handleRemovePromo = () => {
    removePromoCode()
    setPromoError("")
  }

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  const handleClearCart = () => {
    clearCart()
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Your Cart ({itemCount})</span>
            {cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Browse our services and add items to get started
              </p>
            </div>
            <Button onClick={() => { setIsOpen(false); router.push("/services"); }}>
              Browse Services
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.service_name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.service_type}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {item.notes}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-2">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Promo Code */}
            <div className="py-4 space-y-3">
              {cart.discountCode ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{cart.discountCode}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePromo}
                    className="h-6 text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoCode.trim()}
                  >
                    {isApplyingPromo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
              {promoError && (
                <p className="text-sm text-destructive">{promoError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-green-500">
                  <span>Discount</span>
                  <span>-{formatCurrency(cart.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <SheetFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
