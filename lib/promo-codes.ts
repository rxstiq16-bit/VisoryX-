import { createClient } from "@/lib/supabase/server"

export interface PromoCode {
  id: string
  code: string
  description?: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  max_discount_amount?: number
  min_order_amount?: number
  max_uses?: number
  current_uses: number
  max_uses_per_user?: number
  valid_from?: string
  valid_until?: string
  is_active: boolean
  service_ids?: string[]
  user_ids?: string[]
  created_at: string
}

export interface PromoCodeValidation {
  valid: boolean
  error?: string
  promo?: PromoCode
  discount?: number
}

// Validate a promo code
export async function validatePromoCode(
  code: string,
  userId?: string,
  orderTotal?: number,
  serviceId?: string
): Promise<PromoCodeValidation> {
  const supabase = await createClient()

  // Fetch the promo code
  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .single()

  if (error || !promo) {
    return { valid: false, error: "Invalid promo code" }
  }

  // Check if active
  if (!promo.is_active) {
    return { valid: false, error: "This promo code is no longer active" }
  }

  // Check validity dates
  const now = new Date()
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    return { valid: false, error: "This promo code is not yet active" }
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    return { valid: false, error: "This promo code has expired" }
  }

  // Check max uses
  if (promo.max_uses && promo.current_uses >= promo.max_uses) {
    return { valid: false, error: "This promo code has reached its usage limit" }
  }

  // Check user-specific restrictions
  if (promo.user_ids && promo.user_ids.length > 0) {
    if (!userId || !promo.user_ids.includes(userId)) {
      return { valid: false, error: "This promo code is not valid for your account" }
    }
  }

  // Check per-user usage limit
  if (userId && promo.max_uses_per_user) {
    const { count } = await supabase
      .from("promo_code_uses")
      .select("*", { count: "exact", head: true })
      .eq("promo_code_id", promo.id)
      .eq("user_id", userId)

    if (count && count >= promo.max_uses_per_user) {
      return { valid: false, error: "You have already used this promo code the maximum number of times" }
    }
  }

  // Check service restrictions
  if (promo.service_ids && promo.service_ids.length > 0) {
    if (!serviceId || !promo.service_ids.includes(serviceId)) {
      return { valid: false, error: "This promo code is not valid for this service" }
    }
  }

  // Check minimum order amount
  if (promo.min_order_amount && orderTotal && orderTotal < promo.min_order_amount) {
    return {
      valid: false,
      error: `Minimum order of $${promo.min_order_amount.toFixed(2)} required`,
    }
  }

  // Calculate discount
  let discount = 0
  if (orderTotal) {
    if (promo.discount_type === "percentage") {
      discount = orderTotal * (promo.discount_value / 100)
      if (promo.max_discount_amount) {
        discount = Math.min(discount, promo.max_discount_amount)
      }
    } else {
      discount = promo.discount_value
    }
    discount = Math.min(discount, orderTotal) // Can't discount more than order total
  }

  return { valid: true, promo, discount }
}

// Use a promo code (call this when an order is placed)
export async function usePromoCode(
  promoCodeId: string,
  userId: string,
  orderId: string,
  discountAmount: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Record the usage
  const { error: useError } = await supabase.from("promo_code_uses").insert({
    promo_code_id: promoCodeId,
    user_id: userId,
    order_id: orderId,
    discount_amount: discountAmount,
  })

  if (useError) {
    return { success: false, error: "Failed to apply promo code" }
  }

  // Increment the usage count
  const { error: updateError } = await supabase.rpc("increment_promo_code_uses", {
    code_id: promoCodeId,
  })

  if (updateError) {
    console.error("Failed to increment promo code uses:", updateError)
  }

  return { success: true }
}

// Create a new promo code (admin only)
export async function createPromoCode(data: {
  code: string
  description?: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  max_discount_amount?: number
  min_order_amount?: number
  max_uses?: number
  max_uses_per_user?: number
  valid_from?: string
  valid_until?: string
  service_ids?: string[]
  user_ids?: string[]
}): Promise<{ success: boolean; promo?: PromoCode; error?: string }> {
  const supabase = await createClient()

  // Check if code already exists
  const { data: existing } = await supabase
    .from("promo_codes")
    .select("id")
    .eq("code", data.code.toUpperCase())
    .single()

  if (existing) {
    return { success: false, error: "A promo code with this code already exists" }
  }

  const { data: promo, error } = await supabase
    .from("promo_codes")
    .insert({
      ...data,
      code: data.code.toUpperCase(),
      current_uses: 0,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: "Failed to create promo code" }
  }

  return { success: true, promo }
}

// Deactivate a promo code (admin only)
export async function deactivatePromoCode(promoCodeId: string): Promise<{ success: boolean }> {
  const supabase = await createClient()

  await supabase
    .from("promo_codes")
    .update({ is_active: false })
    .eq("id", promoCodeId)

  return { success: true }
}

// Get all promo codes (admin only)
export async function getPromoCodes(includeInactive: boolean = false): Promise<PromoCode[]> {
  const supabase = await createClient()

  let query = supabase.from("promo_codes").select("*").order("created_at", { ascending: false })

  if (!includeInactive) {
    query = query.eq("is_active", true)
  }

  const { data } = await query

  return data || []
}

// Get promo code usage stats
export async function getPromoCodeStats(promoCodeId: string): Promise<{
  totalUses: number
  totalDiscount: number
  uniqueUsers: number
}> {
  const supabase = await createClient()

  const { data, count } = await supabase
    .from("promo_code_uses")
    .select("user_id, discount_amount", { count: "exact" })
    .eq("promo_code_id", promoCodeId)

  const totalUses = count || 0
  const totalDiscount = data?.reduce((sum, use) => sum + (use.discount_amount || 0), 0) || 0
  const uniqueUsers = new Set(data?.map((use) => use.user_id) || []).size

  return { totalUses, totalDiscount, uniqueUsers }
}
