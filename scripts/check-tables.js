import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  // Check applications table
  const { data: apps, error: appsErr } = await supabase.from("applications").select("id").limit(1);
  console.log("applications:", appsErr ? `ERROR: ${appsErr.message}` : `OK (${apps.length} rows sampled)`);

  // Check orders table 
  const { data: orders, error: ordersErr } = await supabase.from("orders").select("id").limit(1);
  console.log("orders:", ordersErr ? `ERROR: ${ordersErr.message}` : `OK (${orders.length} rows sampled)`);

  // Check profiles table
  const { data: profiles, error: profilesErr } = await supabase.from("profiles").select("id").limit(1);
  console.log("profiles:", profilesErr ? `ERROR: ${profilesErr.message}` : `OK (${profiles.length} rows sampled)`);

  // Check reviews table
  const { data: reviews, error: reviewsErr } = await supabase.from("reviews").select("id").limit(1);
  console.log("reviews:", reviewsErr ? `ERROR: ${reviewsErr.message}` : `OK (${reviews.length} rows sampled)`);

  // Check design_feedback table
  const { data: feedback, error: feedbackErr } = await supabase.from("design_feedback").select("id").limit(1);
  console.log("design_feedback:", feedbackErr ? `ERROR: ${feedbackErr.message}` : `OK (${feedback.length} rows sampled)`);

  // Check design_assets table
  const { data: assets, error: assetsErr } = await supabase.from("design_assets").select("id").limit(1);
  console.log("design_assets:", assetsErr ? `ERROR: ${assetsErr.message}` : `OK (${assets.length} rows sampled)`);
}

checkTables().catch(console.error);
