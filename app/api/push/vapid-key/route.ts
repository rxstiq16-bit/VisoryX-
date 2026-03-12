import { NextResponse } from "next/server"
import { VAPID_PUBLIC_KEY } from "@/lib/vapid"

export async function GET() {
  if (!VAPID_PUBLIC_KEY) {
    return NextResponse.json(
      { error: "Push notifications not configured", publicKey: null },
      { status: 200 }
    )
  }

  return NextResponse.json({ publicKey: VAPID_PUBLIC_KEY })
}
