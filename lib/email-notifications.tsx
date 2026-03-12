// Email notification system for VisoryX
// This module provides email notification templates and sending logic.
// In production, integrate with a service like Resend, SendGrid, or AWS SES.

export type EmailTemplate =
  | "order_confirmation"
  | "order_status_update"
  | "order_delivered"
  | "payment_receipt"
  | "review_request"
  | "welcome"
  | "staff_welcome"
  | "password_reset"
  | "newsletter"
  | "ticket_response"
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "order_cancelled"
  | "refund_issued"
  | "account_suspended"
  | "account_reactivated"
  | "revision_request"
  | "promotion"
  | "admin_new_order"
  | "visoryx_intro"
  | "affiliation_request";

interface EmailPayload {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, string | number>;
  fromName?: string;
  fromEmail?: string;
}

export const EMAIL_TEMPLATES: Record<EmailTemplate, { subject: string; body: string }> = {
  order_confirmation: {
    subject: "Order Confirmed - VisoryX #{orderId}",
    body: `Hi {customerName},

Thank you for your order! We've received your request and our team is on it.

Order Details:
- Order ID: #{orderId}
- Service: {serviceName}
- Amount: ${"{amount}"}
- Estimated Delivery: {estimatedDelivery}

You can track your order status at: https://visoryx.design/orders?id={orderId}

Thanks for choosing VisoryX!
The VisoryX Team`,
  },
  order_status_update: {
    subject: "Order Update - VisoryX #{orderId}",
    body: `Hi {customerName},

Your order #{orderId} has been updated.

New Status: {status}
{statusMessage}

Track your order: https://visoryx.design/orders?id={orderId}

The VisoryX Team`,
  },
  order_delivered: {
    subject: "Your Design is Ready! - VisoryX #{orderId}",
    body: `Hi {customerName},

Great news! Your order #{orderId} has been completed and delivered.

Service: {serviceName}
Designer: {designerName}

Please review the delivery and let us know if you'd like any revisions.

We'd love to hear your feedback! Leave a review: https://visoryx.design/orders?id={orderId}&review=true

Thanks for choosing VisoryX!
The VisoryX Team`,
  },
  payment_receipt: {
    subject: "Payment Receipt - VisoryX #{orderId}",
    body: `Hi {customerName},

We've received your payment. Here's your receipt:

Order: #{orderId}
Service: {serviceName}
Amount: ${"{amount}"}
Payment Method: {paymentMethod}
Date: {date}

This receipt is for your records. No action is needed.

The VisoryX Team`,
  },
  review_request: {
    subject: "How was your experience? - VisoryX",
    body: `Hi {customerName},

Your order #{orderId} was delivered {daysAgo} days ago. We'd love to hear your feedback!

Leave a review: https://visoryx.design/orders?id={orderId}&review=true

Your review helps us improve and helps other customers make informed decisions.

Thanks!
The VisoryX Team`,
  },
  welcome: {
    subject: "Welcome to VisoryX!",
    body: `Hi {customerName},

Welcome to VisoryX - Design Beyond Vision!

Here's what you can do:
- Browse our services: https://visoryx.design/pricing
- View our portfolio: https://visoryx.design/portfolio
- Place an order: https://visoryx.design/order
- Take a course: https://visoryx.design/courses

If you need any help, reach out to us at https://visoryx.design/contact

The VisoryX Team`,
  },
  staff_welcome: {
    subject: "Welcome to the Team - VisoryX Staff Account",
    body: `Hi {staffName},

Your staff account has been created. Welcome to the VisoryX team!

Here are your login details:
- Email: {staffEmail}
- Temporary Password: {tempPassword}

Please change your password as soon as possible by visiting:
https://visoryx.design/profile

Next steps:
1. Log in at https://visoryx.design/login
2. Change your temporary password immediately
3. Set up your profile at https://visoryx.design/profile
4. Review any assigned tasks in the admin dashboard

If you have any questions, reach out to the team on Discord or open a ticket.

Welcome aboard!
The VisoryX Team`,
  },
  ticket_response: {
    subject: "Re: Your Support Ticket - VisoryX",
    body: `Hi {customerName},

We've responded to your support ticket.

{responseMessage}

If you have any follow-up questions, you can reply to this email or view your ticket at:
https://visoryx.design/tickets?id={ticketId}

The VisoryX Team`,
  },
  password_reset: {
    subject: "Reset Your Password - VisoryX",
    body: `Hi {customerName},

We received a request to reset your password. Click the link below:

Reset Password: {resetLink}

This link expires in 1 hour. If you didn't request this, you can safely ignore this email.

The VisoryX Team`,
  },
  newsletter: {
    subject: "{subject}",
    body: `{content}

---
You're receiving this because you subscribed to the VisoryX newsletter.
Unsubscribe: https://visoryx.design/unsubscribe?email={email}`,
  },
  application_received: {
    subject: "Application Received - VisoryX",
    body: `Hi {applicantName},

Thank you for applying to join VisoryX as a {role}!

We've received your application and our team will review it shortly. You'll receive another email once a decision has been made.

In the meantime, feel free to check out our portfolio and courses:
- Portfolio: https://visoryx.design/portfolio
- Courses: https://visoryx.design/courses

Thanks for your interest in VisoryX!
The VisoryX Team`,
  },
  application_accepted: {
    subject: "Welcome to the Team! - VisoryX",
    body: `Hi {applicantName},

Great news! Your application to join VisoryX as a {role} has been accepted!

Next steps:
1. Log in to your account at https://visoryx.design/auth/login
2. Complete your profile at https://visoryx.design/profile
3. Check out the training courses at https://visoryx.design/courses

{adminNotes}

We're excited to have you on board!
The VisoryX Team`,
  },
  application_rejected: {
    subject: "Application Update - VisoryX",
    body: `Hi {applicantName},

Thank you for your interest in joining VisoryX as a {role}.

After careful review, we've decided not to move forward with your application at this time. This doesn't mean the door is closed - we encourage you to:
- Build your portfolio and skills
- Take some of our courses: https://visoryx.design/courses
- Reapply in the future when you feel ready

{adminNotes}

We appreciate your interest and wish you the best!
The VisoryX Team`,
  },
  order_cancelled: {
    subject: "Order Cancelled - VisoryX #{orderId}",
    body: `Hi {customerName},

Your order #{orderId} has been cancelled.

Service: {serviceName}
Reason: {reason}

If you believe this was a mistake or have any questions, please contact us at https://visoryx.design/contact

If a refund is due, it will be processed within 5-7 business days.

The VisoryX Team`,
  },
  refund_issued: {
    subject: "Refund Issued - VisoryX #{orderId}",
    body: `Hi {customerName},

A refund has been issued for your order #{orderId}.

Refund Details:
- Order: #{orderId}
- Amount Refunded: {amount}
- Original Payment Method: {paymentMethod}
- Estimated Processing Time: 5-7 business days

{adminNotes}

If you have any questions about your refund, please reach out to us at https://visoryx.design/contact

The VisoryX Team`,
  },
  account_suspended: {
    subject: "Account Notice - VisoryX",
    body: `Hi {customerName},

Your VisoryX account has been temporarily suspended.

Reason: {reason}

If you believe this is an error, please contact our support team at https://visoryx.design/contact to resolve this matter.

The VisoryX Team`,
  },
  account_reactivated: {
    subject: "Account Reactivated - VisoryX",
    body: `Hi {customerName},

Great news! Your VisoryX account has been reactivated.

You now have full access to all VisoryX services. You can log in at: https://visoryx.design/auth/login

If you have any questions, don't hesitate to reach out.

Welcome back!
The VisoryX Team`,
  },
  revision_request: {
    subject: "Revision Requested - VisoryX #{orderId}",
    body: `Hi {designerName},

A revision has been requested for order #{orderId}.

Client: {customerName}
Service: {serviceName}
Revision Notes: {revisionNotes}

Please review the feedback and submit the updated delivery as soon as possible.

View order: https://visoryx.design/admin/orders/{orderId}

The VisoryX Team`,
  },
  promotion: {
    subject: "{subject}",
    body: `Hi {customerName},

{content}

Shop now: https://visoryx.design/pricing

Don't miss out - this offer won't last forever!

The VisoryX Team

---
You're receiving this because you have a VisoryX account.
Unsubscribe: https://visoryx.design/unsubscribe?email={email}`,
  },
  admin_new_order: {
    subject: "New Order Received - #{orderId} (${amount})",
    body: `New order alert!

Customer: {customerName} ({customerEmail})
Order: #{orderId}
Service: {serviceName}
Amount: ${"{amount}"}
Status: Paid and confirmed

View order: https://visoryx.design/admin/orders/{orderId}

This is an automated notification from VisoryX.`,
  },
  affiliation_request: {
    subject: "Affiliation Opportunity with VisoryX",
    body: `Hello,

My name is Jonathan Drake Jr, Founder of VisoryX -- a premium digital design studio specializing in structured branding systems, high-impact graphics, and ERLC live infrastructure visuals.

We're currently expanding our Affiliations Network and would like to explore a potential partnership with {recipientName}.

What an Affiliation Includes

As an official VisoryX affiliate partner, you would receive:

- Featured placement on our official website
- A dedicated custom channel inside the VisoryX Discord
- Cross-promotion to our community and clients
- Priority visibility during announcements or events
- Optional revenue opportunity (if clients choose to support or donate to your organization)
- Future collaboration opportunities as both brands grow

Our goal is to build structured, long-term partnerships -- not simple link exchanges.

Affiliation Requirements

To maintain brand quality and consistency, we ask that:

- If you operate a Discord server, VisoryX receives a dedicated channel within your server
- Your community maintains professional standards
- No NSFW, hate, or policy-violating content
- Active and engaged leadership
- Brand alignment with VisoryX values

If You're Interested

Please reply with the following:

- Owner Name
- Company / Server Name
- Primary Contact
- Link to Website (if applicable)
- Discord Invite (if applicable)
- Confirmation if you would like a custom channel in our Discord

If you would like a custom channel, please include the exact text you'd like displayed in that channel (description, links, branding message, etc.).

We're selective with our affiliations to ensure quality and long-term growth on both sides.

If this sounds like a good fit, we'd be excited to connect further.

Looking forward to your response.

--
Jonathan Drake Jr
Founder, VisoryX
https://visoryx.design`,
  },
  visoryx_intro: {
    subject: "Welcome to VisoryX -- Premium Design, Built for You",
    body: `Hey {recipientName},

Thanks for checking out VisoryX. We're a premium design studio specializing in branding, gaming assets, marketing creatives, and community building.

Here's what we can do for you:

- Branding & Identity -- Custom logos, brand kits, color palettes, and visual identities that make you unmistakable.
- Gaming & Liveries -- ERLC liveries, FiveM wraps, stream overlays, thumbnails, and full esports kits with pixel-perfect precision.
- Marketing & Social -- Social media graphics, ad creatives, banners, promo flyers, and email assets that demand attention.
- Community & Discord -- Full server setups, bot configuration, custom embeds, role systems, and branded Discord assets.

Why VisoryX?

- Fast turnaround -- Most projects delivered in 24-72 hours
- Unlimited revisions -- We're not done until you love it
- Transparent pricing -- No hidden fees, no surprises
- Direct communication -- Work with your designer 1-on-1

Ready to get started? Browse our services and pricing:
https://visoryx.design/pricing

Or jump straight into placing an order:
https://visoryx.design/order

Have questions? Just reply to this email or reach out at contact@visoryx.design.

Looking forward to creating something amazing with you.

-- The VisoryX Team
https://visoryx.design

To unsubscribe from future emails: https://visoryx.design/unsubscribe`,
  },
};

export function interpolate(
  template: string,
  data: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  return result;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const template = EMAIL_TEMPLATES[payload.template];
  if (!template) {
    console.error(`[Email] Unknown email template: ${payload.template}`);
    return false;
  }

  const subject = interpolate(template.subject, payload.data);
  const body = interpolate(template.body, payload.data);

  // Convert plain text body to professional HTML email
  const lines = body.split("\n");
  const htmlLines: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      htmlLines.push('<div style="height:12px;"></div>');
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        htmlLines.push('<ul style="margin:8px 0;padding-left:20px;">');
        inList = true;
      }
      htmlLines.push(
        `<li style="color:#374151;font-size:14px;line-height:1.7;margin-bottom:4px;">${trimmed.slice(2)}</li>`
      );
    } else if (
      trimmed.startsWith("Order Details:") ||
      trimmed.startsWith("Next steps:") ||
      trimmed.startsWith("Here's what you can do:")
    ) {
      htmlLines.push(
        `<p style="margin:16px 0 8px;color:#111827;font-size:14px;font-weight:600;line-height:1.6;">${trimmed}</p>`
      );
    } else if (trimmed.match(/^https?:\/\//) || trimmed.includes("https://")) {
      // Turn URLs into buttons
      const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const url = urlMatch[1];
        const label = trimmed.replace(url, "").replace(/[:\-]/g, "").trim() || "View Now";
        htmlLines.push(
          `<p style="margin:4px 0;font-size:14px;line-height:1.7;color:#374151;">${label} <a href="${url}" style="color:#2563eb;text-decoration:underline;font-weight:500;">${url.replace("https://visoryx.design", "visoryx.design")}</a></p>`
        );
      } else {
        htmlLines.push(
          `<p style="margin:4px 0;font-size:14px;line-height:1.7;color:#374151;">${trimmed}</p>`
        );
      }
    } else {
      htmlLines.push(
        `<p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.7;">${trimmed}</p>`
      );
    }
  }
  if (inList) htmlLines.push("</ul>");
  const htmlBody = htmlLines.join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#111827;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">VisoryX</h1>
          <p style="margin:4px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;">Design Beyond Vision</p>
        </td></tr>
        <!-- Accent bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#2563eb,#7c3aed,#2563eb);"></td></tr>
        <!-- Body -->
        <tr><td style="background:#ffffff;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          ${htmlBody}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
          <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;">VisoryX Design Studio</p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#9ca3af;">
            <a href="https://visoryx.design" style="color:#2563eb;text-decoration:none;">visoryx.design</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Use Resend if API key is available, otherwise fall back to logging
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: payload.fromName && payload.fromEmail
            ? `${payload.fromName} <${payload.fromEmail}>`
            : process.env.RESEND_FROM_EMAIL || "VisoryX <onboarding@resend.dev>",
          to: [payload.to],
          subject,
          html,
          text: body,
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error(`[Email] Resend error (${response.status}): ${responseText}`);
        return false;
      }

      console.log(`[Email] Sent via Resend to ${payload.to}: ${subject} | Response: ${responseText}`);
      return true;
    } catch (err) {
      console.error(`[Email] Failed to send via Resend:`, err);
      return false;
    }
  }

  // Fallback: log to console when no email provider is configured
  console.log(`[Email] (No RESEND_API_KEY) To: ${payload.to}`);
  console.log(`[Email] Subject: ${subject}`);
  return true;
}

// Unified send function used by the rest of the app
export async function sendEmailNotification(
  template: EmailTemplate,
  options: { to: string; data: Record<string, string | number>; fromName?: string; fromEmail?: string }
): Promise<boolean> {
  return sendEmail({
    to: options.to,
    subject: "",
    template,
    data: options.data,
    fromName: options.fromName,
    fromEmail: options.fromEmail,
  });
}

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  customerName: string,
  serviceName: string,
  amount: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "",
    template: "order_confirmation",
    data: {
      orderId,
      customerName,
      serviceName,
      amount,
      estimatedDelivery: "3-5 business days",
    },
  });
}

export async function sendStatusUpdate(
  email: string,
  orderId: string,
  customerName: string,
  status: string,
  statusMessage: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "",
    template: "order_status_update",
    data: { orderId, customerName, status, statusMessage },
  });
}

export async function sendDeliveryNotification(
  email: string,
  orderId: string,
  customerName: string,
  serviceName: string,
  designerName: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "",
    template: "order_delivered",
    data: { orderId, customerName, serviceName, designerName },
  });
}

export async function sendWelcomeEmail(
  email: string,
  customerName: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "",
    template: "welcome",
    data: { customerName },
  });
}
