const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const res = await fetch(`${url}/rest/v1/reports?select=*&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` }
});
console.log("reports table:", res.status, res.status === 200 ? "EXISTS" : "MISSING");
if (res.status !== 200) {
  const body = await res.json();
  console.log("Error:", body.message);
}
