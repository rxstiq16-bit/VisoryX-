export type OrderStatus = "pending" | "in-progress" | "completed" | "cancelled";

export interface Order {
  id: string;
  service: string;
  package: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  description: string;
  status: OrderStatus;
  assignedDesigner?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "visoryx-orders";

// Sample orders for demonstration
const defaultOrders: Order[] = [];

export function getOrders(): Order[] {
  if (typeof window === "undefined") return defaultOrders;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }
  return JSON.parse(stored);
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function addOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<Omit<Order, "id" | "createdAt">>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveOrders(orders);
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  saveOrders(filtered);
  return true;
}

export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  const orders = getOrders();
  return orders.filter((o) => o.status === status);
}

export function getOrdersByDesigner(designerName: string): Order[] {
  const orders = getOrders();
  return orders.filter((o) => o.assignedDesigner === designerName);
}
