"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  ImageIcon,
  Star,
  Mail,
  Settings,
  Plus,
  MessageSquare,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { getOrders, getOrderStats, type Order } from "@/lib/orders"
import { createClient } from "@/lib/supabase/client"

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  inquiry_type: string
  status: string
  created_at: string
}

function StatCard({ label, value, icon: Icon, color, glowColor }: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  glowColor: string
}) {
  return (
    <div className="group relative rounded-xl border border-border/40 bg-card/80 p-5 transition-all hover:border-border/60 hover:shadow-lg">
      {/* Subtle glow on hover */}
      <div className={`absolute inset-0 rounded-xl ${glowColor} opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10`} />
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${color}`}>{value}</p>
    </div>
  )
}

export function AdminDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [contactMessages, setContactMessages] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [orderStats, orders] = await Promise.all([
          getOrderStats(),
          getOrders(),
        ])
        setStats({
          pendingOrders: orderStats.pending,
          totalOrders: orderStats.total,
          inProgressOrders: orderStats.inProgress,
          completedOrders: orderStats.completed,
          revenue: orderStats.revenue,
        })
        setRecentOrders(orders.slice(0, 6))

        // Load contact submissions
        try {
          const supabase = createClient()
          if (supabase) {
            const { data } = await supabase
              .from("contact_submissions")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(5)
            if (data) setContactMessages(data)
          }
        } catch { /* table may not exist */ }
      } catch {
        // Stats stay at 0
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (!profile) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/images/mascot/virox-face.png" alt="Loading" className="h-10 w-10 rounded-full animate-pulse" />
          <p className="text-xs text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: "Pending", value: stats.pendingOrders, icon: Clock, color: "text-amber-500", glowColor: "bg-amber-500/5" },
    { label: "In Progress", value: stats.inProgressOrders, icon: TrendingUp, color: "text-primary", glowColor: "bg-primary/5" },
    { label: "Completed", value: stats.completedOrders, icon: CheckCircle2, color: "text-emerald-500", glowColor: "bg-emerald-500/5" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-foreground", glowColor: "bg-foreground/5" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", glowColor: "bg-emerald-500/5" },
  ]

  const quickActions = [
    { href: "/admin/orders/new", label: "New Order", desc: "Create a manual order", icon: Plus, color: "text-primary", bg: "bg-primary/10" },
    { href: "/admin/portfolio", label: "Portfolio", desc: "Manage showcase work", icon: ImageIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
    { href: "/admin/reviews", label: "Reviews & Partners", desc: "Manage testimonials", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { href: "/admin/email", label: "Email Center", desc: "Send communications", icon: Mail, color: "text-sky-500", bg: "bg-sky-500/10" },
    { href: "/admin/settings", label: "Settings", desc: "Configure everything", icon: Settings, color: "text-muted-foreground", bg: "bg-muted/80" },
  ]

  function statusBadge(status: string) {
    const map: Record<string, { dot: string; text: string }> = {
      pending: { dot: "bg-amber-500", text: "text-amber-500" },
      in_progress: { dot: "bg-primary", text: "text-primary" },
      completed: { dot: "bg-emerald-500", text: "text-emerald-500" },
      delivered: { dot: "bg-emerald-500", text: "text-emerald-500" },
      cancelled: { dot: "bg-destructive", text: "text-destructive" },
    }
    return map[status] || { dot: "bg-muted-foreground", text: "text-muted-foreground" }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {profile.display_name || profile.username}
          </p>
        </div>
        <Link href="/admin/orders/new">
          <Button size="sm" className="gap-2 text-xs font-semibold">
            <Plus className="h-3.5 w-3.5" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/30 bg-card/50 p-5">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 rounded bg-muted/40" />
                <div className="h-9 w-9 rounded-lg bg-muted/30" />
              </div>
              <div className="mt-3 h-7 w-12 rounded bg-muted/50" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Orders - larger area */}
        <div className="lg:col-span-3 rounded-xl border border-border/40 bg-card/80">
          <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Recent Orders</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Latest activity across all orders</p>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-7 text-muted-foreground hover:text-foreground">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <img src="/images/mascot/virox-walking.png" alt="No orders" className="h-20 w-auto opacity-40 mb-3" />
                <p className="text-sm font-medium">No orders yet</p>
                <p className="text-xs mt-1">Orders will appear here once created</p>
              </div>
            ) : (
              <div>
                {recentOrders.map((order, i) => {
                  const badge = statusBadge(order.status)
                  return (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted/40 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground text-[10px] font-mono font-bold">
                          {order.id?.slice(0, 4).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[13px] truncate">{order.customer_name || "Unknown"}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{order.service_type || "Design"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {order.price != null && (
                          <span className="text-xs font-semibold text-muted-foreground">${order.price}</span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          <span className={`text-[11px] font-medium capitalize ${badge.text}`}>
                            {order.status?.replace(/_/g, " ")}
                          </span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-xl border border-border/40 bg-card/80">
          <div className="border-b border-border/30 px-5 py-4">
            <h2 className="text-sm font-semibold">Quick Actions</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Jump to common tasks</p>
          </div>
          <div className="p-2 space-y-0.5">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-muted/40 group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg} transition-transform group-hover:scale-105`}>
                  <action.icon className={`h-4.5 w-4.5 ${action.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Messages */}
      <div className="rounded-xl border border-border/40 bg-card/80">
        <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
              <MessageSquare className="h-4 w-4 text-sky-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Contact Messages</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Recent messages from the contact form</p>
            </div>
          </div>
          {contactMessages.length > 0 && (
            <Badge variant="secondary" className="text-[10px]">{contactMessages.length} recent</Badge>
          )}
        </div>
        <div className="p-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : contactMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Mail className="h-8 w-8 opacity-30 mb-2" />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs mt-1">Contact form submissions will appear here</p>
            </div>
          ) : (
            <div>
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/60">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-medium truncate">{msg.name}</p>
                      <span className="text-[10px] text-muted-foreground">{msg.email}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground/80 truncate">{msg.subject}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{msg.message}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <Badge variant={msg.status === "new" ? "default" : "secondary"} className="text-[9px] px-1.5 py-0">
                      {msg.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
