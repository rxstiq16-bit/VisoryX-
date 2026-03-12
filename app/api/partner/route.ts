import { NextResponse } from "next/server"
import { createOrder } from "@/lib/orders"

// Partner API - provides read-only access to VisoryX services, pricing, and order status
// Partners authenticate with an API key in the x-api-key header

const VALID_API_KEYS = new Set([
  process.env.PARTNER_API_KEY,
].filter(Boolean))

function authenticate(req: Request): boolean {
  const key = req.headers.get("x-api-key")
  return !!key && VALID_API_KEYS.has(key)
}

// GET /api/partner - List services & pricing
export async function GET(req: Request) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized. Provide a valid x-api-key header." }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get("resource") || "services"

  if (resource === "services") {
    return NextResponse.json({
      success: true,
      data: {
        categories: [
          {
            name: "Branding & Identity",
            services: [
              { id: "logo-design", name: "Logo Design", priceUSD: 3.13, priceRobux: 250, deliveryDays: "3-5" },
              { id: "logo-variations", name: "Logo + Variations", priceUSD: 5.00, priceRobux: 400, deliveryDays: "3-5" },
              { id: "full-brand-kit", name: "Full Brand Kit", priceUSD: 7.50, priceRobux: 600, deliveryDays: "5-7" },
              { id: "brand-refresh", name: "Brand Refresh", priceUSD: 5.00, priceRobux: 400, deliveryDays: "3-5" },
              { id: "icon-emblem", name: "Icon / Emblem Design", priceUSD: 1.88, priceRobux: 150, deliveryDays: "2-3" },
            ]
          },
          {
            name: "Gaming & Creator (ERLC)",
            services: [
              { id: "livery-leo", name: "Single Livery (LEO)", priceUSD: 1.88, priceRobux: 150, deliveryDays: "2-3" },
              { id: "livery-fd", name: "Single Livery (FD)", priceUSD: 1.75, priceRobux: 140, deliveryDays: "2-3" },
              { id: "livery-civ", name: "Single Livery (CIV)", priceUSD: 1.25, priceRobux: 100, deliveryDays: "2-3" },
              { id: "livery-3pack", name: "3-Vehicle Pack", priceUSD: 5.00, priceRobux: 400, deliveryDays: "4-6" },
              { id: "livery-5pack", name: "5-Vehicle Pack", priceUSD: 8.75, priceRobux: 700, deliveryDays: "5-7" },
            ]
          },
          {
            name: "Community & Discord",
            services: [
              { id: "discord-embeds", name: "Discord Embeds (per set)", priceUSD: 0.94, priceRobux: 75, deliveryDays: "1-2" },
              { id: "server-setup", name: "Server Setup", priceUSD: 6.25, priceRobux: 500, deliveryDays: "3-5" },
              { id: "complete-discord", name: "Complete Discord Package", priceUSD: 15.00, priceRobux: 1200, deliveryDays: "5-7" },
            ]
          },
        ],
        currency: "USD",
        robuxRate: "80 R$ = $1 USD",
        lastUpdated: "2026-02-08",
      }
    })
  }

  if (resource === "status") {
    return NextResponse.json({
      success: true,
      data: {
        operational: true,
        activeDesigners: 5,
        averageDelivery: "3 days",
        queueLength: 12,
        acceptingOrders: true,
      }
    })
  }

  return NextResponse.json({ error: "Unknown resource. Use ?resource=services or ?resource=status" }, { status: 400 })
}

// POST /api/partner - Create an order via the partner API
export async function POST(req: Request) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized. Provide a valid x-api-key header." }, { status: 401 })
  }

  const body = await req.json()
  const { serviceId, customerName, customerEmail, notes, rushOrder } = body

  if (!serviceId || !customerName || !customerEmail) {
    return NextResponse.json({
      error: "Missing required fields: serviceId, customerName, customerEmail",
    }, { status: 400 })
  }

  // Create real order in Supabase
  const order = await createOrder({
    user_id: null,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: null,
    service_type: serviceId,
    description: notes || null,
    status: "pending",
    priority: rushOrder ? "urgent" : "normal",
    assigned_to: null,
    estimated_completion: null,
    actual_completion: null,
    price: null,
    paid: false,
    payment_method: "partner_api",
    payment_date: null,
    tracking_number: null,
  })

  if (!order) {
    return NextResponse.json({ error: "Failed to create order. Please try again." }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    data: {
      orderId: order.id,
      serviceId,
      customerName,
      customerEmail,
      notes: notes || null,
      rushOrder: rushOrder || false,
      status: order.status,
      estimatedDelivery: rushOrder ? "1-2 days" : "3-5 days",
      createdAt: order.created_at,
      trackingUrl: `https://visoryx.design/orders/${order.id}`,
    }
  }, { status: 201 })
}
