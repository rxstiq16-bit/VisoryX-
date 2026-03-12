import { createClient } from "@/lib/supabase/server"

export type Service = {
  id: string
  slug: string
  name: string
  short_description: string | null
  description: string | null
  category: string
  subcategory: string | null
  base_price: number
  price_unit: string
  turnaround_days: number
  rush_available: boolean
  rush_multiplier: number
  features: string[]
  deliverables: string[]
  is_popular: boolean
  is_featured: boolean
  is_active: boolean
  sort_order: number
}

export type ServiceTier = {
  id: string
  service_id: string
  name: string
  description: string | null
  price: number
  features: string[]
  turnaround_days: number | null
  revisions: number
  is_popular: boolean
  sort_order: number
}

export type ServiceAddon = {
  id: string
  service_id: string
  name: string
  description: string | null
  price: number
  is_default: boolean
  is_active: boolean
}

export type ServiceWithDetails = Service & {
  tiers: ServiceTier[]
  addons: ServiceAddon[]
}

// Categories for grouping services
export const SERVICE_CATEGORIES = [
  { id: "branding", name: "Branding & Identity", description: "Logos, brand kits & visual identity" },
  { id: "community", name: "Community & Discord", description: "Server setups, bots & community assets" },
  { id: "gaming", name: "Gaming & Creator Packs", description: "Liveries, overlays, thumbnails & esports graphics" },
  { id: "business", name: "Business & Startup Kits", description: "Pitch decks, business cards & professional graphics" },
  { id: "marketing", name: "Marketing & Social Media", description: "Social posts, ads, banners & promo graphics" },
  { id: "bundles", name: "Bundle Packages", description: "Save with our curated service bundles" },
]

// Server-side: Fetch all active services
export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  
  if (error) {
    console.error("Error fetching services:", error)
    return []
  }
  
  return data.map(service => ({
    ...service,
    features: Array.isArray(service.features) ? service.features : JSON.parse(service.features || "[]"),
    deliverables: Array.isArray(service.deliverables) ? service.deliverables : JSON.parse(service.deliverables || "[]"),
  }))
}

// Server-side: Fetch a single service with tiers and addons
export async function getServiceBySlug(slug: string): Promise<ServiceWithDetails | null> {
  const supabase = await createClient()
  
  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()
  
  if (error || !service) {
    console.error("Error fetching service:", error)
    return null
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
  
  return {
    ...service,
    features: Array.isArray(service.features) ? service.features : JSON.parse(service.features || "[]"),
    deliverables: Array.isArray(service.deliverables) ? service.deliverables : JSON.parse(service.deliverables || "[]"),
    tiers: (tiers || []).map(tier => ({
      ...tier,
      features: Array.isArray(tier.features) ? tier.features : JSON.parse(tier.features || "[]"),
    })),
    addons: addons || [],
  }
}

// Server-side: Fetch services by category
export async function getServicesByCategory(category: string): Promise<Service[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  
  if (error) {
    console.error("Error fetching services by category:", error)
    return []
  }
  
  return data.map(service => ({
    ...service,
    features: Array.isArray(service.features) ? service.features : JSON.parse(service.features || "[]"),
    deliverables: Array.isArray(service.deliverables) ? service.deliverables : JSON.parse(service.deliverables || "[]"),
  }))
}

// Server-side: Fetch featured services
export async function getFeaturedServices(): Promise<Service[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(6)
  
  if (error) {
    console.error("Error fetching featured services:", error)
    return []
  }
  
  return data.map(service => ({
    ...service,
    features: Array.isArray(service.features) ? service.features : JSON.parse(service.features || "[]"),
    deliverables: Array.isArray(service.deliverables) ? service.deliverables : JSON.parse(service.deliverables || "[]"),
  }))
}

// Format price for display (handles both cents and dollars)
export function formatServicePrice(price: number): string {
  // If price is in cents (> 100), convert to dollars
  const dollars = price > 100 ? price / 100 : price
  return `$${dollars.toFixed(2)}`
}

// Estimate Robux equivalent (1 USD = 80 Robux approx)
export function estimateRobux(priceUSD: number): number {
  return Math.round(priceUSD * 80)
}

export function formatRobux(amount: number): string {
  return `${amount.toLocaleString()} R$`
}
