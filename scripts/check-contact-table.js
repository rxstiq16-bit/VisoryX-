const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check(table) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  console.log(`${table}: ${res.ok ? 'EXISTS' : 'MISSING'} (${res.status})`);
}

await check('contact_submissions');
await check('contact_messages');
