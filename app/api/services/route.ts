import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")
  const slug = searchParams.get("slug")
  
  const supabase = await createClient()
  
  // Fetch single service by slug
  if (slug) {
    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
    
    if (error || !service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    
    // Fetch tiers
    const { data: tiers } = await supabase
      .from("service_tiers")
      .select("*")
      .eq("service_id", service.id)
      .order("sort_order", { ascending: true })
    
    // Fetch addons
    const { data: addons } = await supabase
      .from("service_addons")
      .select("*")
      .eq("service_id", service.id)
      .eq("is_active", true)
    
    return NextResponse.json({
      ...service,
      features: parseJsonField(service.features),
      deliverables: parseJsonField(service.deliverables),
      tiers: (tiers || []).map(tier => ({
        ...tier,
        features: parseJsonField(tier.features),
      })),
      addons: addons || [],
    })
  }
  
  // Build query
  let query = supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
  
  if (category) {
    query = query.eq("category", category)
  }
  
  if (featured === "true") {
    query = query.eq("is_featured", true)
  }
  
  query = query.order("sort_order", { ascending: true })
  
  const { data, error } = await query
  
  if (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
  
  const services = data.map(service => ({
    ...service,
    features: parseJsonField(service.features),
    deliverables: parseJsonField(service.deliverables),
  }))
  
  return NextResponse.json(services)
}

function parseJsonField(field: unknown): string[] {
  if (Array.isArray(field)) return field
  if (typeof field === "string") {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return []
}
