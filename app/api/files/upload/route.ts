import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string
    const fileType = formData.get('fileType') as string || 'reference' // reference, delivery, revision

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const pathname = `orders/${orderId}/${fileType}/${timestamp}-${sanitizedName}`

    // Upload to Vercel Blob (private access)
    const blob = await put(pathname, file, {
      access: 'private',
    })

    // Store file record in database
    const { data: fileRecord, error: dbError } = await supabase
      .from('order_files')
      .insert({
        order_id: orderId,
        uploaded_by: user.id,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        mime_type: file.type,
        blob_pathname: blob.pathname,
        blob_url: blob.url,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save file record' }, { status: 500 })
    }

    return NextResponse.json({
      id: fileRecord.id,
      filename: file.name,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
