import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const token = searchParams.get('token')

  // Public access by token -- no auth required
  if (token) {
    const { data, error } = await supabase
      .from('form_invitations')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    if (data.status === 'completed') {
      return NextResponse.json({ error: 'This form has already been completed', invitation: data }, { status: 410 })
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invitation has expired', invitation: data }, { status: 410 })
    }

    return NextResponse.json({ invitation: data })
  }

  // Admin listing -- requires auth
  let query = supabase
    .from('form_invitations')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') query = query.eq('status', status)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ invitations: data || [] })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const {
    form_type,
    recipient_name,
    recipient_email,
    recipient_discord,
    recipient_phone,
    sent_via,
    expires_in_days,
  } = body

  if (!form_type || !recipient_name) {
    return NextResponse.json(
      { error: 'Missing required fields: form_type, recipient_name' },
      { status: 400 }
    )
  }

  const { data: userData } = await supabase.auth.getUser()
  const token = crypto.randomBytes(32).toString('hex')

  const expiresAt = expires_in_days
    ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default 30 days

  const { data, error } = await supabase
    .from('form_invitations')
    .insert({
      token,
      form_type,
      recipient_name,
      recipient_email: recipient_email || null,
      recipient_discord: recipient_discord || null,
      recipient_phone: recipient_phone || null,
      sent_via: sent_via || 'link',
      sent_by: userData?.user?.id || null,
      status: 'pending',
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Build the form URL
  const baseUrl = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || ''
  const formUrl = `${baseUrl}/forms/${token}`

  return NextResponse.json({
    invitation: data,
    formUrl,
    shareMessage: buildShareMessage(form_type, recipient_name, formUrl),
  })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('form_invitations')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

function buildShareMessage(formType: string, name: string, url: string) {
  const formNames: Record<string, string> = {
    'new-hire-onboarding': 'New Hire Onboarding Packet',
    'nda': 'Non-Disclosure Agreement',
    'ip-assignment': 'Intellectual Property Assignment Agreement',
    'offer-letter': 'Employment Offer Letter',
    'leadership-agreement': 'Executive Operating & Leadership Agreement',
    'hiring-authorization': 'Hiring Authorization Form',
    'separation-departure': 'Separation & Departure Form',
  }
  const formName = formNames[formType] || formType

  return `Hi ${name},\n\nYou have a VisoryX form to complete: ${formName}\n\nPlease complete it using this link:\n${url}\n\nThis link is unique to you. Do not share it.\n\n-- VisoryX`
}
