import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch invoices for a user or specific invoice
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("id");
    const orderId = searchParams.get("orderId");

    let query = supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (invoiceId) {
      query = query.eq("id", invoiceId).single();
    } else if (orderId) {
      query = query.eq("order_id", orderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching invoices:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Invoice fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      order_id,
      billing_name,
      billing_email,
      billing_address,
      items,
      subtotal,
      tax_rate = 0,
      tax_amount = 0,
      discount_amount = 0,
      discount_description,
      total,
      due_date,
      notes,
      footer,
      terms,
    } = body;

    // Validate required fields
    if (!order_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Order ID and items are required" },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        user_id: user.id,
        order_id,
        invoice_number: invoiceNumber,
        billing_name,
        billing_email,
        billing_address,
        items,
        subtotal,
        tax_rate,
        tax_amount,
        discount_amount,
        discount_description,
        total,
        amount_due: total,
        due_date,
        notes,
        footer,
        terms,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating invoice:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
