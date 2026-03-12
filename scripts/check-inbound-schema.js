import { createClient } from '@supabase/supabase-js';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Check inbound_emails columns
const { data: cols, error: colErr } = await admin.rpc('exec_sql', {
  query: `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'inbound_emails' ORDER BY ordinal_position`
});

if (colErr) {
  // Try alternate approach
  const { data: sample, error: sErr } = await admin.from('inbound_emails').select('*').limit(0);
  console.log("Sample query error:", sErr);
  
  // Just try inserting a test row and see what error we get
  const { error: insertErr } = await admin.from('inbound_emails').insert({
    from_email: 'test@test.com',
    from_name: 'Test',
    to_email: 'contact@visoryx.design',
    subject: 'Schema Test',
    body_text: 'test',
    body_html: '',
    resend_email_id: 'test_schema_check_123',
    status: 'unread',
    starred: false,
  });
  console.log("Test insert error:", insertErr);
  
  if (!insertErr) {
    // Clean up test row
    await admin.from('inbound_emails').delete().eq('resend_email_id', 'test_schema_check_123');
    console.log("Test insert succeeded - schema is valid, cleaned up test row");
  }
} else {
  console.log("Columns:", JSON.stringify(cols, null, 2));
}

// Also check what rows exist
const { data: rows, error: rowErr } = await admin.from('inbound_emails').select('*');
console.log("Existing rows:", rows?.length, "Error:", rowErr);
if (rows?.length) {
  console.log("First row keys:", Object.keys(rows[0]));
}
