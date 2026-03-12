import { createBrowserClient } from '@supabase/ssr'

// Use globalThis to ensure true singleton across module re-evaluations
const SUPABASE_CLIENT_KEY = '__supabase_client__' as const

declare global {
  // eslint-disable-next-line no-var
  var __supabase_client__: ReturnType<typeof createBrowserClient> | undefined
}

export function createClient() {
  // Return existing global instance if available
  if (globalThis[SUPABASE_CLIENT_KEY]) {
    return globalThis[SUPABASE_CLIENT_KEY]!
  }
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    return null
  }
  
  // Create and cache globally
  const client = createBrowserClient(url, key)
  globalThis[SUPABASE_CLIENT_KEY] = client
  return client
}

// Export the same function with an alias for backward compatibility
export const getSupabaseClient = createClient
