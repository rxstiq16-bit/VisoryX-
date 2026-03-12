"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getOrders, ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/orders"
import { LoyaltyCard } from "@/components/loyalty-card"
import { ReferralCard } from "@/components/referral-card"
import { QuickReorder } from "@/components/quick-reorder"
import { SavedPaymentMethods } from "@/components/saved-payment-methods"
import { TwoFactorAuth } from "@/components/two-factor-auth"
import { StarterGuide } from "@/components/starter-guide"
import { Wishlist } from "@/components/wishlist"
import { RobuxCalculator } from "@/components/robux-calculator"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import {
  Package,
  CheckCircle,
  ArrowRight,
  Plus,
  User,
  ShoppingBag,
  CreditCard,
  Loader2,
  Shield,
  Gift,
  Users,
  Settings,
  Bell,
  Heart,
  Clock,
  Star,
  Award,
  TrendingUp,
  MessageSquare,
  FileText,
  Download,
} from "lucide-react"

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    in_progress: "bg-primary",
    review: "bg-purple-500",
    revision: "bg-orange-500",
    completed: "bg-green-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-destructive",
  }
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status] || "bg-muted-foreground"}`} />
}

export default function CustomerDashboard() {
  const { user, profile, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user) return
    async function loadData() {
      setLoading(true)
      const ordersData = await getOrders({ userId: user!.id, limit: 10 })
      setOrders(ordersData)
      setLoading(false)
    }
    loadData()
  }, [user])

  const activeOrders = orders.filter(o => !["completed", "delivered", "cancelled"].includes(o.status))
  const completedOrders = orders.filter(o => ["completed", "delivered"].includes(o.status))
  const totalSpent = orders.filter(o => o.paid).reduce((sum, o) => sum + (o.price || 0), 0)

  const getStatusLabel = (status: OrderStatus) => {
    const s = ORDER_STATUSES.find(st => st.value === status)
    return s?.label || status
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="border-b border-border bg-card pt-24">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-48 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-32 rounded bg-muted/60 animate-pulse" />
                </div>
              </div>
            </div>
          </section>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-muted/40 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="mt-6 h-96 rounded-xl bg-muted/30 animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <CardTitle>Sign in to access your dashboard</CardTitle>
              <CardDescription>View your orders, loyalty points, referrals, and more.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-up">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card pt-24">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {(profile?.display_name || profile?.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      Welcome back, {profile?.display_name || profile?.username}
                    </h1>
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Gold Member
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile"><Settings className="h-4 w-4 mr-1.5" />Settings</Link>
                </Button>
                <Button asChild size="sm" className="gap-1.5">
                  <Link href="/order"><Plus className="h-3.5 w-3.5" />New Order</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeOrders.length}</p>
                    <p className="text-xs text-muted-foreground">Active Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedOrders.length}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                    <CreditCard className="h-5 w-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalSpent.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1,250</p>
                    <p className="text-xs text-muted-foreground">Loyalty Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview" className="gap-1.5">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="gap-1.5">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Referrals</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Orders */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Recent Orders</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="#" onClick={() => setActiveTab("orders")}>View All</Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <ShoppingBag className="h-10 w-10 text-muted-foreground/50 mb-3" />
                          <p className="text-sm font-medium text-foreground">No orders yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Place your first order to get started.</p>
                          <Button size="sm" className="mt-4 gap-1.5" asChild>
                            <Link href="/order"><Plus className="h-3.5 w-3.5" />Browse Services</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {orders.slice(0, 5).map(order => (
                            <Link key={order.id} href={`/orders/${order.id}`} className="block">
                              <div className="flex items-center justify-between gap-3 p-3 rounded-lg transition-colors hover:bg-secondary/50">
                                <div className="flex items-center gap-3 min-w-0">
                                  <StatusDot status={order.status} />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{order.service_type}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {getStatusLabel(order.status)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  {order.price != null && (
                                    <span className="text-sm font-medium">${order.price.toFixed(2)}</span>
                                  )}
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Reorder */}
                  <QuickReorder />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Loyalty Preview */}
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Gold Member</span>
                        </div>
                        <Badge variant="secondary">1,250 pts</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Next tier: Platinum</span>
                          <span className="font-medium">750 pts to go</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "62.5%" }} />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setActiveTab("rewards")}>
                        View Rewards
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { href: "/order", icon: Plus, label: "Place New Order" },
                        { href: "/portfolio", icon: Package, label: "View Portfolio" },
                        { href: "/help", icon: MessageSquare, label: "Get Help" },
                        { href: "/contact", icon: User, label: "Contact Us" },
                      ].map(action => (
                        <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-lg p-2.5 text-sm transition-colors hover:bg-secondary/60">
                          <action.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{action.label}</span>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Referral Preview */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-sm">Refer & Earn</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Invite friends and earn 10% of their first order!
                      </p>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("referrals")}>
                        Get Referral Link
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Orders</CardTitle>
                    <Button asChild size="sm">
                      <Link href="/order"><Plus className="h-4 w-4 mr-1.5" />New Order</Link>
                    </Button>
                  </div>
                  <CardDescription>View and manage all your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="font-medium text-foreground">No orders yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Place your first order to get started.</p>
                      <Button className="mt-4 gap-1.5" asChild>
                        <Link href="/order"><Plus className="h-4 w-4" />Browse Services</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map(order => (
                        <Link key={order.id} href={`/orders/${order.id}`} className="block">
                          <Card className="transition-colors hover:border-primary/30">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                  <StatusDot status={order.status} />
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">{order.service_type}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{getStatusLabel(order.status)}</span>
                                      <span>-</span>
                                      <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  {order.price != null && (
                                    <span className="font-semibold">${order.price.toFixed(2)}</span>
                                  )}
                                  <Badge variant={order.paid ? "default" : "secondary"}>
                                    {order.paid ? "Paid" : "Unpaid"}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-6">
              <LoyaltyCard />
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals" className="space-y-6">
              <ReferralCard />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Account Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Display Name</p>
                        <p className="text-sm text-muted-foreground">{profile?.display_name || "Not set"}</p>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Username</p>
                        <p className="text-sm text-muted-foreground">@{profile?.username}</p>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{profile?.email}</p>
                      </div>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.created_at ? format(new Date(profile.created_at), "MMMM d, yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <TwoFactorAuth />

                {/* Payment Methods */}
                <div className="lg:col-span-2">
                  <SavedPaymentMethods />
                </div>

                {/* Connected Accounts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>Link external accounts for a better experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/10">
                          <svg className="h-5 w-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Discord</p>
                          <p className="text-sm text-muted-foreground">Get order notifications via DM</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                          <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.5 2.5h-13A3.5 3.5 0 0 0 2 6v12a3.5 3.5 0 0 0 3.5 3.5h13A3.5 3.5 0 0 0 22 18V6a3.5 3.5 0 0 0-3.5-3.5zM9 16.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm6 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Roblox</p>
                          <p className="text-sm text-muted-foreground">Pay with Robux, verify ownership</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Order Updates", description: "Get notified when order status changes", enabled: true },
                      { label: "Messages", description: "Get notified of new designer messages", enabled: true },
                      { label: "Promotions", description: "Receive promotional offers and discounts", enabled: false },
                      { label: "Newsletter", description: "Weekly design tips and updates", enabled: false },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{pref.label}</p>
                          <p className="text-sm text-muted-foreground">{pref.description}</p>
                        </div>
                        <Button variant={pref.enabled ? "default" : "outline"} size="sm">
                          {pref.enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
