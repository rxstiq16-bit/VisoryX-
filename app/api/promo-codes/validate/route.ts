import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validatePromoCode } from "@/lib/promo-codes"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const body = await request.json()
  const { code, orderTotal, serviceId } = body

  if (!code) {
    return NextResponse.json({ valid: false, error: "Code is required" }, { status: 400 })
  }

  const result = await validatePromoCode(code, user?.id, orderTotal, serviceId)

  return NextResponse.json(result)
}
