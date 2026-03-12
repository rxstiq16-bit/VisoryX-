"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Clock, 
  CheckCircle, 
  Package,
  Search,
  Plus,
  Eye,
  MoreHorizontal,
  DollarSign,
  Loader2,
  TrendingUp,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { 
  getOrders, 
  getOrderStats,
  ORDER_STATUSES,
  ORDER_PRIORITIES,
  type Order,
  type OrderStatus,
  type OrderPriority
} from "@/lib/orders";

export function OrdersAdmin() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<OrderPriority | "all">("all");

  useEffect(() => {
    if (!authLoading && user && profile) {
      loadOrders();
    }
  }, [authLoading, user, profile]);
  
  const loadOrders = async () => {
    setIsLoading(true);
    const [ordersData, statsData] = await Promise.all([
      getOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      }),
      getOrderStats()
    ]);
    setOrders(ordersData);
    setStats(statsData);
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (!authLoading && user && profile) {
      loadOrders();
    }
  }, [statusFilter, priorityFilter]);
  
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_email.toLowerCase().includes(query) ||
      order.service_type.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query)
    );
  });
  
  const getStatusColor = (status: OrderStatus) => {
    const map: Record<string, string> = {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      in_progress: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      review: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      delivered: "bg-green-500/10 text-green-400 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  const getStatusDot = (status: OrderStatus) => {
    const map: Record<string, string> = {
      pending: "bg-amber-400",
      confirmed: "bg-blue-400",
      in_progress: "bg-violet-400",
      review: "bg-cyan-400",
      completed: "bg-emerald-400",
      delivered: "bg-green-400",
      cancelled: "bg-red-400",
    };
    return map[status] || "bg-muted-foreground";
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Orders", value: stats.total, icon: Package, color: "text-primary", bg: "bg-primary/10" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-card/50 border-border/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[150px] h-9 bg-card/50 border-border/50">
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
            <SelectTrigger className="w-[140px] h-9 bg-card/50 border-border/50">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {ORDER_PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/orders/new">
            <Plus className="h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {/* Orders Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
              <Package className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">No orders found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "Create your first order to get started"}
            </p>
            <Button asChild size="sm" className="mt-4 gap-2">
              <Link href="/admin/orders/new">
                <Plus className="h-3.5 w-3.5" />
                New Order
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 bg-muted/30">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-border/30 transition-colors hover:bg-primary/5 cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-primary">
                        #{order.id.slice(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.service_type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(order.status)}`} />
                        {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {order.price ? `$${order.price.toFixed(2)}` : '-'}
                        </span>
                        {order.paid && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
                            <CheckCircle className="h-3 w-3 text-emerald-400" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
