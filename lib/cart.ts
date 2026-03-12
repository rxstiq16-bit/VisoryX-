import { createClient } from "@/lib/supabase/client"

export interface CartItem {
  id: string
  service_id: string
  service_name: string
  service_type: string
  price: number
  quantity: number
  options?: Record<string, unknown>
  notes?: string
  added_at: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  discountCode?: string
  total: number
}

const CART_STORAGE_KEY = "visoryx_cart"

// Client-side cart management (localStorage + Supabase sync)
export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], subtotal: 0, discount: 0, total: 0 }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to parse cart:", e)
  }

  return { items: [], subtotal: 0, discount: 0, total: 0 }
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }))
  } catch (e) {
    console.error("Failed to save cart:", e)
  }
}

export function calculateCartTotals(items: CartItem[], discountPercent: number = 0): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * (discountPercent / 100)
  const total = subtotal - discount

  return {
    items,
    subtotal,
    discount,
    total,
  }
}

export function addToCart(item: Omit<CartItem, "id" | "added_at">): Cart {
  const cart = getCart()

  // Check if item already exists (same service and options)
  const existingIndex = cart.items.findIndex(
    (i) =>
      i.service_id === item.service_id &&
      JSON.stringify(i.options) === JSON.stringify(item.options)
  )

  let newItems: CartItem[]

  if (existingIndex >= 0) {
    // Update quantity
    newItems = cart.items.map((i, idx) =>
      idx === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i
    )
  } else {
    // Add new item
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      added_at: new Date().toISOString(),
    }
    newItems = [...cart.items, newItem]
  }

  const newCart = calculateCartTotals(newItems, cart.discount ? (cart.discount / cart.subtotal) * 100 : 0)
  newCart.discountCode = cart.discountCode
  saveCart(newCart)

  return newCart
}

export function updateCartItem(itemId: string, updates: Partial<CartItem>): Cart {
  const cart = getCart()

  const newItems = cart.items.map((item) =>
    item.id === itemId ? { ...item, ...updates } : item
  )

  const newCart = calculateCartTotals(newItems, cart.discount ? (cart.discount / cart.subtotal) * 100 : 0)
  newCart.discountCode = cart.discountCode
  saveCart(newCart)

  return newCart
}

export function removeFromCart(itemId: string): Cart {
  const cart = getCart()
  const newItems = cart.items.filter((item) => item.id !== itemId)

  const newCart = calculateCartTotals(newItems, cart.discount ? (cart.discount / cart.subtotal) * 100 : 0)
  newCart.discountCode = cart.discountCode
  saveCart(newCart)

  return newCart
}

export function clearCart(): void {
  saveCart({ items: [], subtotal: 0, discount: 0, total: 0 })
}

export async function applyPromoCode(code: string): Promise<{ success: boolean; discount?: number; error?: string }> {
  const supabase = createClient()
  const cart = getCart()

  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single()

  if (error || !promo) {
    return { success: false, error: "Invalid promo code" }
  }

  // Check validity dates
  const now = new Date()
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    return { success: false, error: "Promo code is not yet active" }
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    return { success: false, error: "Promo code has expired" }
  }

  // Check usage limits
  if (promo.max_uses && promo.current_uses >= promo.max_uses) {
    return { success: false, error: "Promo code has reached its usage limit" }
  }

  // Check minimum order
  if (promo.min_order_amount && cart.subtotal < promo.min_order_amount) {
    return {
      success: false,
      error: `Minimum order of $${promo.min_order_amount} required`,
    }
  }

  // Calculate discount
  let discountAmount = 0
  if (promo.discount_type === "percentage") {
    discountAmount = cart.subtotal * (promo.discount_value / 100)
    if (promo.max_discount_amount) {
      discountAmount = Math.min(discountAmount, promo.max_discount_amount)
    }
  } else {
    discountAmount = promo.discount_value
  }

  // Update cart with discount
  const newCart: Cart = {
    ...cart,
    discount: discountAmount,
    discountCode: code.toUpperCase(),
    total: cart.subtotal - discountAmount,
  }
  saveCart(newCart)

  return { success: true, discount: discountAmount }
}

export function removePromoCode(): Cart {
  const cart = getCart()
  const newCart: Cart = {
    ...cart,
    discount: 0,
    discountCode: undefined,
    total: cart.subtotal,
  }
  saveCart(newCart)
  return newCart
}

// Sync cart to database for logged-in users
export async function syncCartToServer(userId: string): Promise<void> {
  const supabase = createClient()
  const cart = getCart()

  await supabase.from("carts").upsert({
    user_id: userId,
    items: cart.items,
    discount_code: cart.discountCode,
    updated_at: new Date().toISOString(),
  })
}

// Load cart from server for logged-in users
export async function loadCartFromServer(userId: string): Promise<Cart> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return getCart() // Return local cart if no server cart
  }

  const cart = calculateCartTotals(data.items || [])
  cart.discountCode = data.discount_code

  // If there's a discount code, recalculate with it
  if (cart.discountCode) {
    await applyPromoCode(cart.discountCode)
    return getCart()
  }

  saveCart(cart)
  return cart
}
