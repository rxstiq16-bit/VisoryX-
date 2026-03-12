import { type NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch file record from database
    const { data: file, error } = await supabase
      .from("order_files")
      .select("*, orders!inner(user_id, assigned_to)")
      .eq("id", id)
      .single()

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if user has access to this file
    const isOwner = file.orders.user_id === user.id
    const isAssigned = file.orders.assigned_to === user.id
    const isUploader = file.uploaded_by === user.id

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.role === "admin" || profile?.role === "designer"

    if (!isOwner && !isAssigned && !isUploader && !isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Stream the file from Blob storage
    const result = await get(file.blob_pathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    })

    if (!result) {
      return NextResponse.json({ error: "File not found in storage" }, { status: 404 })
    }

    // Blob hasn't changed - use cached copy
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
        },
      })
    }

    // Return file with download headers
    const isDownload = request.nextUrl.searchParams.get("download") === "true"
    const headers: Record<string, string> = {
      "Content-Type": result.blob.contentType,
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
    }

    if (isDownload) {
      headers["Content-Disposition"] = `attachment; filename="${file.file_name}"`
    }

    return new NextResponse(result.stream, { headers })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch file record
    const { data: file, error } = await supabase
      .from("order_files")
      .select("*, orders!inner(user_id, assigned_to)")
      .eq("id", id)
      .single()

    if (error || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Only uploader or admin can delete
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.role === "admin"
    const isUploader = file.uploaded_by === user.id

    if (!isAdmin && !isUploader) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Delete from Blob storage
    const { del } = await import("@vercel/blob")
    await del(file.blob_url)

    // Delete from database
    await supabase.from("order_files").delete().eq("id", id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
