import { createClient } from '@/lib/supabase/client'
import { sendEmailNotification } from '@/lib/email-notifications'

export interface Order {
  id: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  service_type: string
  description: string | null
  status: OrderStatus
  priority: OrderPriority
  assigned_to: string | null
  assigned_to_name?: string
  estimated_completion: string | null
  actual_completion: string | null
  price: number | null
  paid: boolean
  payment_method: string | null
  payment_date: string | null
  tracking_number: string | null
  created_at: string
  updated_at: string
}

export interface OrderNote {
  id: string
  order_id: string
  user_id: string
  user_name: string
  note_type: 'note' | 'status_change' | 'assignment' | 'payment' | 'system'
  content: string
  is_internal: boolean
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  previous_status: string | null
  new_status: string
  changed_by: string
  changed_by_name: string
  reason: string | null
  created_at: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'review'
  | 'revision'
  | 'completed'
  | 'delivered'
  | 'cancelled'
  | 'on_hold'
  | 'test'

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent'

export const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-500' },
  { value: 'review', label: 'Under Review', color: 'bg-indigo-500' },
  { value: 'revision', label: 'Revision Requested', color: 'bg-orange-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-gray-500' },
  { value: 'test', label: 'Test Order', color: 'bg-pink-500' },
]

export const ORDER_PRIORITIES: { value: OrderPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-400' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-400' },
  { value: 'high', label: 'High', color: 'bg-orange-400' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
]

// Fetch all orders
export async function getOrders(filters?: {
  status?: OrderStatus
  priority?: OrderPriority
  userId?: string
  limit?: number
  offset?: number
}): Promise<Order[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority)
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data || []
}

// Fetch single order by ID
export async function getOrder(orderId: string): Promise<Order | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return data
}

// Create a new order
export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating order:', error)
    return null
  }
  
  return data
}

// Update an order
export async function updateOrder(
  orderId: string, 
  updates: Partial<Order>,
  userId?: string,
  userName?: string
): Promise<Order | null> {
  const supabase = createClient()
  
  // Get current order for status history
  const currentOrder = await getOrder(orderId)
  
  const { data, error } = await supabase
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating order:', error)
    return null
  }
  
  // If status changed, add to history
  if (updates.status && currentOrder && currentOrder.status !== updates.status && userId && userName) {
    await addStatusHistory(orderId, currentOrder.status, updates.status, userId, userName)
  }
  
  return data
}

// Update order status with reason
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  userId: string,
  userName: string,
  reason?: string
): Promise<boolean> {
  const supabase = createClient()
  
  // Get current order
  const currentOrder = await getOrder(orderId)
  if (!currentOrder) return false
  
  // Update the order
  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      status: newStatus, 
      updated_at: new Date().toISOString(),
      actual_completion: newStatus === 'completed' || newStatus === 'delivered' 
        ? new Date().toISOString() 
        : currentOrder.actual_completion
    })
    .eq('id', orderId)
  
  if (updateError) {
    console.error('Error updating order status:', updateError)
    return false
  }
  
  // Add status history
  await addStatusHistory(orderId, currentOrder.status, newStatus, userId, userName, reason)
  
  // Add a note about the status change
  await addOrderNote({
    order_id: orderId,
    user_id: userId,
    user_name: userName,
    note_type: 'status_change',
    content: `Status changed from "${currentOrder.status}" to "${newStatus}"${reason ? `: ${reason}` : ''}`,
    is_internal: false
  })
  
  // Send email notification for status update
  if (currentOrder.customer_email) {
    const template = newStatus === 'delivered' || newStatus === 'completed' 
      ? 'order_delivered' as const
      : 'order_status_update' as const;
    
    sendEmailNotification(template, {
      to: currentOrder.customer_email,
      data: {
        customerName: currentOrder.customer_name,
        orderId: orderId.slice(0, 8).toUpperCase(),
        status: newStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        statusMessage: reason || '',
        serviceName: currentOrder.service_type,
        designerName: currentOrder.assigned_to_name || 'your designer',
      },
    }).catch(() => { /* non-critical */ });

    // Send review request email when order is delivered/completed
    if (newStatus === 'delivered' || newStatus === 'completed') {
      sendEmailNotification("review_request", {
        to: currentOrder.customer_email,
        data: {
          customerName: currentOrder.customer_name,
          orderId: orderId.slice(0, 8).toUpperCase(),
          daysAgo: "0",
        },
      }).catch(() => { /* non-critical */ });
    }
  }
  
  return true
}

// Add status history entry
async function addStatusHistory(
  orderId: string,
  previousStatus: string,
  newStatus: string,
  changedBy: string,
  changedByName: string,
  reason?: string
): Promise<void> {
  const supabase = createClient()
  
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    previous_status: previousStatus,
    new_status: newStatus,
    changed_by: changedBy,
    changed_by_name: changedByName,
    reason: reason || null
  })
}

// Get order notes
export async function getOrderNotes(orderId: string, includeInternal = false): Promise<OrderNote[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('order_notes')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
  
  if (!includeInternal) {
    query = query.eq('is_internal', false)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching order notes:', error)
    return []
  }
  
  return data || []
}

// Add order note
export async function addOrderNote(note: Omit<OrderNote, 'id' | 'created_at'>): Promise<OrderNote | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('order_notes')
    .insert(note)
    .select()
    .single()
  
  if (error) {
    console.error('Error adding order note:', error)
    return null
  }
  
  return data
}

// Get order status history
export async function getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching order status history:', error)
    return []
  }
  
  return data || []
}

// Assign order to staff member
export async function assignOrder(
  orderId: string,
  assignedTo: string | null,
  assignedToName: string | null,
  assignedBy: string,
  assignedByName: string
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('orders')
    .update({ 
      assigned_to: assignedTo, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId)
  
  if (error) {
    console.error('Error assigning order:', error)
    return false
  }
  
  // Add note about assignment
  await addOrderNote({
    order_id: orderId,
    user_id: assignedBy,
    user_name: assignedByName,
    note_type: 'assignment',
    content: assignedTo 
      ? `Order assigned to ${assignedToName}` 
      : 'Order unassigned',
    is_internal: true
  })
  
  return true
}

// Mark order as paid
export async function markOrderPaid(
  orderId: string,
  paymentMethod: string,
  userId: string,
  userName: string
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('orders')
    .update({ 
      paid: true, 
      payment_method: paymentMethod,
      payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId)
  
  if (error) {
    console.error('Error marking order as paid:', error)
    return false
  }
  
  // Add note about payment
  await addOrderNote({
    order_id: orderId,
    user_id: userId,
    user_name: userName,
    note_type: 'payment',
    content: `Payment received via ${paymentMethod}`,
    is_internal: false
  })
  
  return true
}

// Delete an order
export async function deleteOrder(orderId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)
  
  if (error) {
    console.error('Error deleting order:', error)
    return false
  }
  
  return true
}

// Get order statistics
export async function getOrderStats(): Promise<{
  total: number
  pending: number
  inProgress: number
  completed: number
  revenue: number
}> {
  const supabase = createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('status, price, paid')
  
  if (!orders) {
    return { total: 0, pending: 0, inProgress: 0, completed: 0, revenue: 0 }
  }
  
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'in_progress', 'review', 'revision'].includes(o.status)).length,
    completed: orders.filter(o => ['completed', 'delivered'].includes(o.status)).length,
    revenue: orders.filter(o => o.paid).reduce((sum, o) => sum + (o.price || 0), 0)
  }
}
