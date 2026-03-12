// Web Push Notifications - Stub Implementation
// NOTE: Full push notification support requires deployment with native Node.js
// The web-push package is not compatible with the preview environment

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  url?: string
  tag?: string
  actions?: { action: string; title: string }[]
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<{ success: boolean; error?: string }> {
  // In preview/development, log the notification instead of sending
  console.log("Push notification (preview mode):", {
    endpoint: subscription.endpoint.substring(0, 50) + "...",
    payload,
  })
  
  return { 
    success: false, 
    error: "Push notifications are available after deployment only" 
  }
}

// Pre-built notification templates
export const pushTemplates = {
  orderConfirmation: (orderNumber: string): PushPayload => ({
    title: "Order Confirmed!",
    body: `Your order ${orderNumber} has been received. We'll start working on it soon.`,
    icon: "/icon-192.png",
    url: `/orders/${orderNumber}`,
    tag: `order-${orderNumber}`,
    actions: [
      { action: "view", title: "View Order" }
    ]
  }),

  orderStarted: (orderNumber: string, designerName: string): PushPayload => ({
    title: "Work Started",
    body: `${designerName} has started working on your order ${orderNumber}.`,
    url: `/orders/${orderNumber}`,
    tag: `order-${orderNumber}`,
  }),

  orderReview: (orderNumber: string): PushPayload => ({
    title: "Ready for Review",
    body: `Your design for order ${orderNumber} is ready! Take a look and let us know what you think.`,
    url: `/orders/${orderNumber}`,
    tag: `order-${orderNumber}`,
    actions: [
      { action: "view", title: "Review Now" },
      { action: "approve", title: "Approve" }
    ]
  }),

  orderCompleted: (orderNumber: string): PushPayload => ({
    title: "Order Complete!",
    body: `Great news! Your order ${orderNumber} is finished. Download your files now.`,
    url: `/orders/${orderNumber}`,
    tag: `order-${orderNumber}`,
    actions: [
      { action: "download", title: "Download" }
    ]
  }),

  newMessage: (orderNumber: string, senderName: string): PushPayload => ({
    title: "New Message",
    body: `${senderName} sent you a message about order ${orderNumber}.`,
    url: `/orders/${orderNumber}#chat`,
    tag: `message-${orderNumber}`,
    actions: [
      { action: "reply", title: "Reply" }
    ]
  }),

  revisionStarted: (orderNumber: string): PushPayload => ({
    title: "Revision Started",
    body: `We're working on your revision request for order ${orderNumber}.`,
    url: `/orders/${orderNumber}`,
    tag: `order-${orderNumber}`,
  }),

  promoAlert: (title: string, discount: string, code: string): PushPayload => ({
    title,
    body: `${discount} off your next order! Use code: ${code}`,
    url: "/pricing",
    tag: "promo",
    actions: [
      { action: "shop", title: "Shop Now" }
    ]
  }),

  achievementUnlocked: (achievementName: string, points: number): PushPayload => ({
    title: "Achievement Unlocked!",
    body: `You earned "${achievementName}" and ${points} points!`,
    url: "/achievements",
    tag: "achievement",
  }),
}

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY || null
}
