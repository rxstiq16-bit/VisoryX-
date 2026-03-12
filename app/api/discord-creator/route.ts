// Generation is handled client-side via templates.
// This route is kept as a stub in case AI-powered generation is re-enabled later.

import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Generation is handled locally. This API route is inactive." },
    { status: 501 }
  )
}
