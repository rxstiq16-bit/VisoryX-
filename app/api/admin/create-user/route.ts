import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";
import { sendEmailNotification } from "@/lib/email-notifications";

export async function POST(request: Request) {
  try {
    // Rate limit admin user creation
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(
      getRateLimitKey("admin-create-user", ip),
      RATE_LIMITS.apiGeneral
    );
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const { email, password, username, displayName, roles } = await request.json();

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create user using admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        display_name: displayName,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      username: username.toLowerCase(),
      email,
      display_name: displayName,
      roles: roles || ["customer"],
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile error:", profileError);
      // User was created but profile failed - still return success
      return NextResponse.json({
        success: true,
        userId: authData.user.id,
        warning: "User created but profile creation failed: " + profileError.message,
      });
    }

    // Determine if this is a staff account (any role other than "client")
    const isStaffAccount = roles && roles.length > 0 && !roles.every((r: string) => r === "client");
    const roleLabel = roles?.filter((r: string) => r !== "client").join(", ").replace(/_/g, " ") || "team member";

    // Send welcome email
    try {
      if (isStaffAccount) {
        await sendEmailNotification("staff_welcome", {
          to: email,
          data: {
            staffName: displayName || username,
            role: roleLabel,
            temporaryPassword: password,
          },
          fromName: "VisoryX",
          fromEmail: "support@visoryx.design",
        });
      } else {
        await sendEmailNotification("welcome", {
          to: email,
          data: {
            customerName: displayName || username,
          },
          fromName: "VisoryX",
          fromEmail: "support@visoryx.design",
        });
      }
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
      // Non-blocking -- account was still created
    }

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      email: authData.user.email,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
