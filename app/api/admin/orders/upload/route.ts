import { put, del } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const orderId = formData.get("orderId") as string

    if (!file || !orderId) {
      return NextResponse.json({ error: "File and orderId are required" }, { status: 400 })
    }

    // Verify order exists
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Upload to Vercel Blob
    const blob = await put(`deliverables/${orderId}/${file.name}`, file, {
      access: "public",
    })

    // Store file reference in DB
    const { data: deliverable, error } = await supabaseAdmin
      .from("order_deliverables")
      .insert({
        order_id: orderId,
        file_name: file.name,
        file_url: blob.url,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: formData.get("uploadedBy") as string || "admin",
      })
      .select()
      .single()

    if (error) {
      // Clean up blob if DB insert fails
      await del(blob.url)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ deliverable })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, fileUrl } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Deliverable ID is required" }, { status: 400 })
    }

    // Delete from Vercel Blob
    if (fileUrl) {
      try { await del(fileUrl) } catch {}
    }

    // Delete from DB
    await supabaseAdmin.from("order_deliverables").delete().eq("id", id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
