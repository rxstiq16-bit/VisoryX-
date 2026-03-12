// SMS Notifications using Twilio
// Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER env vars

interface SMSMessage {
  to: string
  body: string
}

interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendSMS(message: SMSMessage): Promise<SMSResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("Twilio credentials not configured")
    return { success: false, error: "SMS not configured" }
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: message.to,
          From: fromNumber,
          Body: message.body,
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return { success: true, messageId: data.sid }
    } else {
      return { success: false, error: data.message || "Failed to send SMS" }
    }
  } catch (error) {
    console.error("SMS send error:", error)
    return { success: false, error: "Failed to send SMS" }
  }
}

// Pre-built message templates
export const smsTemplates = {
  orderConfirmation: (orderNumber: string) => 
    `VisoryX: Your order ${orderNumber} has been confirmed! We'll start working on it soon. Track at visoryx.com/orders`,
  
  orderStarted: (orderNumber: string) => 
    `VisoryX: Good news! Work has started on your order ${orderNumber}. You can follow along at visoryx.com/orders`,
  
  orderReview: (orderNumber: string) => 
    `VisoryX: Your design for order ${orderNumber} is ready for review! Please check visoryx.com/orders`,
  
  orderCompleted: (orderNumber: string) => 
    `VisoryX: Order ${orderNumber} is complete! Download your files at visoryx.com/orders`,
  
  revisionRequest: (orderNumber: string) => 
    `VisoryX: We received your revision request for order ${orderNumber}. We'll get right on it!`,
  
  newMessage: (orderNumber: string) => 
    `VisoryX: You have a new message for order ${orderNumber}. Check visoryx.com/orders to reply.`,
  
  paymentReceived: (amount: string) => 
    `VisoryX: Payment of ${amount} received. Thank you for your order!`,
  
  deliveryReminder: (orderNumber: string, hours: number) => 
    `VisoryX: Your order ${orderNumber} is expected to be delivered in ${hours} hours!`,
}

export async function sendOrderSMS(
  phoneNumber: string,
  template: keyof typeof smsTemplates,
  ...args: string[]
) {
  const templateFn = smsTemplates[template] as (...args: string[]) => string
  const body = templateFn(...args)
  return sendSMS({ to: phoneNumber, body })
}
