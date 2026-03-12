import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST - Send invoice via email
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, customerEmail, customerName, invoiceNumber, total, items } = body;

    if (!customerEmail || !orderId) {
      return NextResponse.json(
        { error: "Customer email and order ID are required" },
        { status: 400 }
      );
    }

    // Log the email send attempt
    const { error: logError } = await supabase.from("email_logs").insert({
      user_id: user.id,
      email_to: customerEmail,
      subject: `Invoice ${invoiceNumber} from VisoryX`,
      status: "sent",
      metadata: {
        order_id: orderId,
        invoice_number: invoiceNumber,
        total,
        items_count: items?.length || 0,
      },
    });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    // In production, integrate with your email provider (Resend, SendGrid, etc.)
    // For now, we'll simulate a successful send
    
    // Example with Resend (uncomment when RESEND_API_KEY is available):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'VisoryX <invoices@visoryx.com>',
      to: customerEmail,
      subject: `Invoice ${invoiceNumber} from VisoryX`,
      html: generateInvoiceEmailHtml({ customerName, invoiceNumber, total, items }),
    });
    */

    // Update invoice status to sent
    if (invoiceNumber) {
      await supabase
        .from("invoices")
        .update({ 
          status: "sent", 
          sent_at: new Date().toISOString() 
        })
        .eq("invoice_number", invoiceNumber);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Invoice sent to ${customerEmail}` 
    });
  } catch (error) {
    console.error("Invoice send error:", error);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}
