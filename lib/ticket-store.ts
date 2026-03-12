import { createClient } from "@/lib/supabase/client";

function getSupabase() {
  return createClient();
}

type SupabaseClient = ReturnType<typeof createClient>;

export type TicketStatus = "open" | "in-progress" | "closed" | "archived";

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  imageUrl?: string;
  isSystemMessage: boolean;
  createdAt: string;
  editedAt?: string;
}

export interface OrderDetails {
  service: string;
  package: string;
  projectName: string;
  description: string;
  additionalNotes?: string;
}

export type OrderType = "branding" | "community" | "gaming" | "business" | "marketing" | "ui-assets" | "courses";

export interface Ticket {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderType: OrderType;
  orderDetails: OrderDetails;
  assignedDesigners: string[];
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

interface DbTicket {
  id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  order_type: string;
  order_details: OrderDetails;
  assigned_designers: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface DbTicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string | null;
  image_url: string | null;
  is_system_message: boolean;
  created_at: string;
  edited_at: string | null;
}

function mapMessageFromDb(msg: DbTicketMessage): TicketMessage {
  return {
    id: msg.id,
    ticketId: msg.ticket_id,
    senderId: msg.sender_id,
    senderName: msg.sender_name,
    senderRole: msg.sender_role,
    content: msg.content || "",
    imageUrl: msg.image_url || undefined,
    isSystemMessage: msg.is_system_message,
    createdAt: msg.created_at,
    editedAt: msg.edited_at || undefined,
  };
}

function mapTicketFromDb(ticket: DbTicket, messages: TicketMessage[]): Ticket {
  return {
    id: ticket.id,
    orderId: ticket.order_id,
    customerId: ticket.customer_id,
    customerName: ticket.customer_name,
    customerEmail: ticket.customer_email,
    orderType: ticket.order_type as OrderType,
    orderDetails: ticket.order_details,
    assignedDesigners: ticket.assigned_designers || [],
    status: ticket.status as TicketStatus,
    messages,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
  };
}

export async function getTickets(): Promise<Ticket[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (ticketsError) {
    console.error("Error fetching tickets:", ticketsError);
    return [];
  }

  const { data: messages, error: messagesError } = await supabase
    .from("ticket_messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error fetching ticket messages:", messagesError);
    return [];
  }

  const messagesByTicket: Record<string, TicketMessage[]> = {};
  (messages || []).forEach((msg: DbTicketMessage) => {
    if (!messagesByTicket[msg.ticket_id]) {
      messagesByTicket[msg.ticket_id] = [];
    }
    messagesByTicket[msg.ticket_id].push(mapMessageFromDb(msg));
  });

  return (tickets || []).map((t: DbTicket) => 
    mapTicketFromDb(t, messagesByTicket[t.id] || [])
  );
}

export async function createTicket(
  orderId: string,
  customerId: string,
  customerName: string,
  customerEmail: string,
  orderType: OrderType,
  orderDetails: OrderDetails
): Promise<Ticket | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  const ticketId = `TKT-${Date.now()}`;
  
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      id: ticketId,
      order_id: orderId,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      order_type: orderType,
      order_details: orderDetails,
      assigned_designers: [],
      status: "open",
    })
    .select()
    .single();

  if (ticketError) {
    console.error("Error creating ticket:", ticketError);
    return null;
  }

  // Add system message
  const messageId = `MSG-${Date.now()}`;
  const { error: messageError } = await supabase
    .from("ticket_messages")
    .insert({
      id: messageId,
      ticket_id: ticketId,
      sender_id: "system",
      sender_name: "System",
      sender_role: "system",
      content: `New design order ticket created for ${customerName}. Order details are pinned above.`,
      is_system_message: true,
    });

  if (messageError) {
    console.error("Error creating system message:", messageError);
  }

  return mapTicketFromDb(ticket, [{
    id: messageId,
    ticketId,
    senderId: "system",
    senderName: "System",
    senderRole: "system",
    content: `New design order ticket created for ${customerName}. Order details are pinned above.`,
    isSystemMessage: true,
    createdAt: new Date().toISOString(),
  }]);
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (ticketError) {
    console.error("Error fetching ticket:", ticketError);
    return null;
  }

  if (!ticket) {
    return null;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error fetching ticket messages:", messagesError);
    return null;
  }

  return mapTicketFromDb(ticket, (messages || []).map(mapMessageFromDb));
}

export async function getTicketsByCustomer(customerId: string): Promise<Ticket[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (ticketsError) {
    console.error("Error fetching tickets by customer:", ticketsError);
    return [];
  }

  return tickets.map((t: DbTicket) => mapTicketFromDb(t, []));
}

export async function getCustomerTickets(customerId: string): Promise<Ticket[]> {
  return getTicketsByCustomer(customerId);
}

export async function getTicketsByEmail(email: string): Promise<Ticket[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .ilike("customer_email", `%${email.toLowerCase()}%`)
    .order("created_at", { ascending: false });

  if (ticketsError) {
    console.error("Error fetching tickets by email:", ticketsError);
    return [];
  }

  return tickets.map((t: DbTicket) => mapTicketFromDb(t, []));
}

export async function getTicketsByDesigner(designerName: string): Promise<Ticket[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .textSearch("assigned_designers", designerName)
    .order("created_at", { ascending: false });

  if (ticketsError) {
    console.error("Error fetching tickets by designer:", ticketsError);
    return [];
  }

  return tickets.map((t: DbTicket) => mapTicketFromDb(t, []));
}

export async function getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (ticketsError) {
    console.error("Error fetching tickets by status:", ticketsError);
    return [];
  }

  return tickets.map((t: DbTicket) => mapTicketFromDb(t, []));
}

export async function updateTicket(id: string, updates: Partial<Omit<Ticket, "id" | "createdAt" | "messages">>): Promise<Ticket | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  const dbUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  
  if (updates.orderId !== undefined) dbUpdates.order_id = updates.orderId;
  if (updates.customerId !== undefined) dbUpdates.customer_id = updates.customerId;
  if (updates.customerName !== undefined) dbUpdates.customer_name = updates.customerName;
  if (updates.customerEmail !== undefined) dbUpdates.customer_email = updates.customerEmail;
  if (updates.orderType !== undefined) dbUpdates.order_type = updates.orderType;
  if (updates.orderDetails !== undefined) dbUpdates.order_details = updates.orderDetails;
  if (updates.assignedDesigners !== undefined) dbUpdates.assigned_designers = updates.assignedDesigners;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const { error } = await supabase
    .from("tickets")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    console.error("Error updating ticket:", error);
    return null;
  }

  return getTicketById(id);
}

export async function assignDesigner(ticketId: string, designerName: string): Promise<Ticket | null> {
  const ticket = await getTicketById(ticketId);
  if (!ticket) return null;
  if (!ticket.assignedDesigners.includes(designerName)) {
    const updatedDesigners = [...ticket.assignedDesigners, designerName];
    return updateTicket(ticketId, { 
      assignedDesigners: updatedDesigners,
      status: ticket.status === "open" ? "in-progress" : ticket.status,
    });
  }
  return ticket;
}

export async function removeDesigner(ticketId: string, designerName: string): Promise<Ticket | null> {
  const ticket = await getTicketById(ticketId);
  if (!ticket) return null;
  const updatedDesigners = ticket.assignedDesigners.filter((d) => d !== designerName);
  return updateTicket(ticketId, { assignedDesigners: updatedDesigners });
}

export async function addMessage(
  ticketId: string,
  senderId: string,
  senderName: string,
  senderRole: string,
  content: string,
  isSystemMessage = false,
  imageUrl?: string
): Promise<TicketMessage | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  const messageId = `MSG-${Date.now()}`;
  
  const { data, error } = await supabase
    .from("ticket_messages")
    .insert({
      id: messageId,
      ticket_id: ticketId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      content: content || null,
      image_url: imageUrl || null,
      is_system_message: isSystemMessage,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding message:", error);
    return null;
  }

  // Update ticket's updated_at
  await supabase
    .from("tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  return mapMessageFromDb(data);
}

export async function editMessage(ticketId: string, messageId: string, newContent: string): Promise<TicketMessage | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from("ticket_messages")
    .update({
      content: newContent,
      edited_at: new Date().toISOString(),
    })
    .eq("id", messageId)
    .select()
    .single();

  if (error) {
    console.error("Error editing message:", error);
    return null;
  }

  // Update ticket's updated_at
  await supabase
    .from("tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  return mapMessageFromDb(data);
}

export async function deleteMessage(ticketId: string, messageId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  const { error } = await supabase
    .from("ticket_messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    console.error("Error deleting message:", error);
    return false;
  }

  // Update ticket's updated_at
  await supabase
    .from("tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  return true;
}

export async function closeTicket(id: string): Promise<Ticket | null> {
  return updateTicket(id, { status: "closed" });
}

export async function archiveTicket(id: string): Promise<Ticket | null> {
  return updateTicket(id, { status: "archived" });
}

export async function reopenTicket(id: string): Promise<Ticket | null> {
  return updateTicket(id, { status: "open" });
}

export function canAccessTicket(
  ticket: Ticket,
  userId: string,
  userRoles: string[]
): boolean {
  if (userRoles.some(r => ["executive", "director", "operations_manager", "community_moderator", "design_lead", "designer"].includes(r))) {
    return true;
  }
  if (ticket.customerId === userId) {
    return true;
  }
  return false;
}
