// VAPID Keys for Web Push Notifications
// NOTE: Push notifications require deployment - not available in preview

// Public key - safe to expose to clients
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

// Check if VAPID is configured
export function isVapidConfigured(): boolean {
  return Boolean(VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
}
