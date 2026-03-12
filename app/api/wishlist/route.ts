import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      id,
      service_id,
      created_at,
      services (
        id,
        slug,
        name,
        short_description,
        category,
        base_price,
        is_active
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { serviceId } = await request.json()

  if (!serviceId) {
    return NextResponse.json({ error: "Service ID required" }, { status: 400 })
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("service_id", serviceId)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Already in wishlist" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("wishlists")
    .insert({
      user_id: user.id,
      service_id: serviceId,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get("serviceId")

  if (!serviceId) {
    return NextResponse.json({ error: "Service ID required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("service_id", serviceId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
