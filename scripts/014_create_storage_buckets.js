import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBuckets() {
  const buckets = ["avatars", "banners"];
  
  for (const bucket of buckets) {
    console.log(`Checking bucket: ${bucket}...`);
    const { data: existing } = await supabase.storage.getBucket(bucket);
    
    if (existing) {
      console.log(`  Bucket "${bucket}" already exists.`);
      // Make sure it's public
      const { error: updateErr } = await supabase.storage.updateBucket(bucket, { public: true });
      if (updateErr) console.log(`  Failed to update: ${updateErr.message}`);
      else console.log(`  Ensured public access.`);
    } else {
      console.log(`  Creating bucket "${bucket}"...`);
      const { error: createErr } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      });
      if (createErr) console.log(`  Failed to create: ${createErr.message}`);
      else console.log(`  Created successfully.`);
    }
  }
  
  console.log("\nDone! Now run the following SQL in your Supabase SQL Editor to add storage policies:\n");
  console.log(`
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update/overwrite their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow anyone to view avatars (public)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own banner
CREATE POLICY "Users can upload own banner" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'banners' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update/overwrite their own banner
CREATE POLICY "Users can update own banner" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'banners' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow anyone to view banners (public)
CREATE POLICY "Anyone can view banners" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'banners');
  `);
}

createBuckets();
