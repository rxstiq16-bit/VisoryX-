import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    // Get the calling user from their session cookie
    const cookieStore = await cookies();
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role key for all DB operations (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if requesting user is admin/executive
    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("roles")
      .eq("id", user.id)
      .single();

    if (
      !callerProfile?.roles?.some((r: string) =>
        ["executive", "director"].includes(r)
      )
    ) {
      return Response.json(
        { error: "Insufficient permissions -- only Executive or Director can change roles" },
        { status: 403 }
      );
    }

    const { userId, roles } = await request.json();

    if (!userId || !Array.isArray(roles) || roles.length === 0) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    // Prevent non-executives from assigning executive role
    if (
      roles.includes("executive") &&
      !callerProfile.roles.includes("executive")
    ) {
      return Response.json(
        { error: "Only Executives can assign the Executive role" },
        { status: 403 }
      );
    }

    // Prevent directors from demoting executives
    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("roles")
      .eq("id", userId)
      .single();

    if (
      targetProfile?.roles?.includes("executive") &&
      !callerProfile.roles.includes("executive")
    ) {
      return Response.json(
        { error: "Only Executives can modify other Executive accounts" },
        { status: 403 }
      );
    }

    // Use service key to bypass RLS and return updated data
    const { data, error } = await adminClient
      .from("profiles")
      .update({ roles })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("[Admin] Role update error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, profile: data[0] });
  } catch (err) {
    console.error("[Admin] Role update error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
