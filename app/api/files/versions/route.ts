import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get("fileId")

  if (!fileId) {
    return NextResponse.json({ error: "File ID required" }, { status: 400 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get file versions
  const { data: versions, error } = await supabase
    .from("file_versions")
    .select(`
      id,
      version,
      file_url,
      file_name,
      file_size,
      created_at,
      comment,
      is_current,
      created_by:profiles(id, display_name, avatar_url)
    `)
    .eq("file_id", fileId)
    .order("version", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    versions: versions.map((v) => ({
      id: v.id,
      version: v.version,
      fileUrl: v.file_url,
      fileName: v.file_name,
      fileSize: v.file_size,
      createdAt: v.created_at,
      comment: v.comment,
      isCurrent: v.is_current,
      createdBy: {
        id: v.created_by?.id,
        name: v.created_by?.display_name || "Unknown",
        avatar: v.created_by?.avatar_url,
      },
    })),
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { fileId, action, versionId, comment } = await request.json()

  if (action === "restore") {
    // Get version to restore
    const { data: version } = await supabase
      .from("file_versions")
      .select("*")
      .eq("id", versionId)
      .single()

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 })
    }

    // Mark all versions as not current
    await supabase
      .from("file_versions")
      .update({ is_current: false })
      .eq("file_id", fileId)

    // Get max version number
    const { data: maxVersion } = await supabase
      .from("file_versions")
      .select("version")
      .eq("file_id", fileId)
      .order("version", { ascending: false })
      .limit(1)
      .single()

    // Create new version based on restored version
    const { data: newVersion, error } = await supabase
      .from("file_versions")
      .insert({
        file_id: fileId,
        version: (maxVersion?.version || 0) + 1,
        file_url: version.file_url,
        file_name: version.file_name,
        file_size: version.file_size,
        created_by: user.id,
        comment: `Restored from version ${version.version}`,
        is_current: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update main file record
    await supabase
      .from("order_files")
      .update({
        file_url: version.file_url,
        file_name: version.file_name,
        file_size: version.file_size,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fileId)

    return NextResponse.json({ success: true, version: newVersion })
  }

  if (action === "delete") {
    const { error } = await supabase
      .from("file_versions")
      .delete()
      .eq("id", versionId)
      .eq("is_current", false) // Prevent deleting current version

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
