import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ items: [], total: 0 })
  }

  const { data: cart } = await supabase
    .from("carts")
    .select(`
      id,
      items,
      promo_code,
      created_at,
      updated_at
    `)
    .eq("user_id", user.id)
    .single()

  if (!cart) {
    return NextResponse.json({ items: [], total: 0 })
  }

  return NextResponse.json({
    id: cart.id,
    items: cart.items || [],
    promoCode: cart.promo_code,
    total: (cart.items || []).reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + (item.price * item.quantity), 0
    ),
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { serviceId, tierId, addons, quantity = 1 } = await request.json()

  // Get service details
  const { data: service } = await supabase
    .from("services")
    .select("id, slug, name, base_price")
    .eq("id", serviceId)
    .single()

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  // Get tier if specified
  let tierPrice = service.base_price
  let tierName = "Standard"
  if (tierId) {
    const { data: tier } = await supabase
      .from("service_tiers")
      .select("name, price")
      .eq("id", tierId)
      .single()
    if (tier) {
      tierPrice = tier.price
      tierName = tier.name
    }
  }

  // Get addons
  let addonsTotal = 0
  const addonDetails: { id: string; name: string; price: number }[] = []
  if (addons?.length) {
    const { data: addonData } = await supabase
      .from("service_addons")
      .select("id, name, price")
      .in("id", addons)
    
    addonData?.forEach(addon => {
      addonsTotal += addon.price
      addonDetails.push(addon)
    })
  }

  const itemPrice = tierPrice + addonsTotal

  const cartItem = {
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.name,
    tierId,
    tierName,
    addons: addonDetails,
    price: itemPrice,
    quantity,
  }

  // Get or create cart
  const { data: existingCart } = await supabase
    .from("carts")
    .select("id, items")
    .eq("user_id", user.id)
    .single()

  if (existingCart) {
    const items = existingCart.items || []
    items.push(cartItem)
    
    await supabase
      .from("carts")
      .update({ items, updated_at: new Date().toISOString() })
      .eq("id", existingCart.id)
  } else {
    await supabase
      .from("carts")
      .insert({
        user_id: user.id,
        items: [cartItem],
      })
  }

  return NextResponse.json({ success: true, item: cartItem })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const index = searchParams.get("index")

  if (index === null) {
    // Clear entire cart
    await supabase
      .from("carts")
      .update({ items: [], updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
  } else {
    // Remove specific item
    const { data: cart } = await supabase
      .from("carts")
      .select("items")
      .eq("user_id", user.id)
      .single()

    if (cart) {
      const items = cart.items || []
      items.splice(parseInt(index), 1)
      
      await supabase
        .from("carts")
        .update({ items, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
    }
  }

  return NextResponse.json({ success: true })
}
