import { createClient } from "@supabase/supabase-js"
import { createClient as createBrowserClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Verify the caller is an executive/director
    const browserClient = await createBrowserClient()
    const { data: { user } } = await browserClient.auth.getUser()
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: callerProfile } = await browserClient
      .from("profiles")
      .select("roles")
      .eq("id", user.id)
      .single()

    if (!callerProfile?.roles?.some((r: string) => ["executive", "director"].includes(r))) {
      return Response.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { userId, show_on_team, team_title, team_bio, team_sort_order } = await request.json()
    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 })
    }

    // Use service role to bypass RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const updateData: Record<string, unknown> = {}
    if (typeof show_on_team === "boolean") updateData.show_on_team = show_on_team
    if (typeof team_title === "string") updateData.team_title = team_title
    if (typeof team_bio === "string") updateData.team_bio = team_bio
    if (typeof team_sort_order === "number") updateData.team_sort_order = team_sort_order

    const { error } = await adminClient
      .from("profiles")
      .update(updateData)
      .eq("id", userId)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
