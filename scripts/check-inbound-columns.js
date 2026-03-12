import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Test insert with resend_email_id to check if column exists
const testId = 'test-column-check-' + Date.now()
const { error: insertError } = await supabase.from('inbound_emails').insert({
  from_email: 'test@test.com',
  from_name: 'Test',
  to_email: 'test@test.com',
  subject: 'Column check',
  body_text: 'test',
  body_html: '',
  resend_email_id: testId,
  status: 'unread',
  starred: false,
})

if (insertError) {
  console.log('Insert with resend_email_id FAILED:', insertError.message)
  console.log('Error code:', insertError.code)
  
  // Try without resend_email_id
  const { error: insertError2, data: inserted } = await supabase.from('inbound_emails').insert({
    from_email: 'test@test.com',
    from_name: 'Test',
    to_email: 'test@test.com',
    subject: 'Column check no resend_id',
    body_text: 'test',
    body_html: '',
    status: 'unread',
    starred: false,
  }).select()
  
  if (insertError2) {
    console.log('Insert WITHOUT resend_email_id also FAILED:', insertError2.message)
  } else {
    console.log('Insert WITHOUT resend_email_id SUCCEEDED - column does not exist')
    // Clean up
    if (inserted?.[0]?.id) {
      await supabase.from('inbound_emails').delete().eq('id', inserted[0].id)
      console.log('Cleaned up test row')
    }
  }
} else {
  console.log('Insert with resend_email_id SUCCEEDED - column exists')
  // Clean up
  const { data: found } = await supabase.from('inbound_emails').select('id').eq('resend_email_id', testId).single()
  if (found?.id) {
    await supabase.from('inbound_emails').delete().eq('id', found.id)
    console.log('Cleaned up test row')
  }
}

// Also test the Resend API 
const RESEND_API_KEY = process.env.RESEND_API_KEY
if (RESEND_API_KEY) {
  console.log('\n--- Testing Resend Receiving API ---')
  const res = await fetch('https://api.resend.com/emails/receiving', {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  })
  console.log('Status:', res.status)
  const body = await res.text()
  console.log('Response:', body.slice(0, 500))
} else {
  console.log('No RESEND_API_KEY found')
}
