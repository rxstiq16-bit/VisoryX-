import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: partner, error } = await supabase
    .from("partners")
    .select(`
      *,
      commissions:partner_commissions(*)
    `)
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ partner })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { company_name, website, description, social_links } = body

  // Check if already a partner
  const { data: existing } = await supabase
    .from("partners")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Already a partner" }, { status: 400 })
  }

  // Generate unique referral code
  const referralCode = `VX-${user.id.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

  const { data: partner, error } = await supabase
    .from("partners")
    .insert({
      user_id: user.id,
      company_name,
      website,
      description,
      social_links: social_links || {},
      referral_code: referralCode,
      commission_rate: 10, // Default 10%
      status: "pending",
      tier: "bronze",
      total_referrals: 0,
      total_earnings: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ partner })
}
