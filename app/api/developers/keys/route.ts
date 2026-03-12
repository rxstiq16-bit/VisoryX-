import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomBytes, createHash } from "crypto"

// Generate a secure API key
function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `vx_${randomBytes(32).toString("hex")}`
  const hash = createHash("sha256").update(key).digest("hex")
  const prefix = key.substring(0, 10)
  return { key, hash, prefix }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: keys, error } = await supabase
      .from("api_keys")
      .select("id, name, key_prefix, permissions, last_used_at, created_at, expires_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ keys: keys || [] })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, permissions } = await request.json()

    if (!name || !permissions || permissions.length === 0) {
      return NextResponse.json({ error: "Name and permissions are required" }, { status: 400 })
    }

    // Check key limit (max 10 per user)
    const { count } = await supabase
      .from("api_keys")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true)

    if (count && count >= 10) {
      return NextResponse.json({ error: "Maximum API key limit reached" }, { status: 400 })
    }

    // Generate API key
    const { key, hash, prefix } = generateApiKey()

    // Store key (only store hash, not the actual key)
    const { data: apiKey, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        name,
        key_hash: hash,
        key_prefix: prefix,
        permissions,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "api_key_created",
      resource_type: "api_key",
      resource_id: apiKey.id,
      details: { name, permissions },
    })

    // Return the actual key only once - user must save it
    return NextResponse.json({ 
      id: apiKey.id,
      key, // Only time the full key is returned
      name: apiKey.name,
      permissions: apiKey.permissions,
    })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
