"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Package,
  Star,
  Clock
} from "lucide-react"

// Mock data
const revenueData = [
  { month: "Jan", revenue: 4250, orders: 45 },
  { month: "Feb", revenue: 5100, orders: 52 },
  { month: "Mar", revenue: 4800, orders: 48 },
  { month: "Apr", revenue: 6200, orders: 65 },
  { month: "May", revenue: 5900, orders: 62 },
  { month: "Jun", revenue: 7100, orders: 78 },
  { month: "Jul", revenue: 8500, orders: 92 },
]

const serviceBreakdown = [
  { name: "Branding", value: 35, color: "#8b5cf6" },
  { name: "Discord", value: 25, color: "#3b82f6" },
  { name: "Gaming", value: 20, color: "#10b981" },
  { name: "Marketing", value: 12, color: "#f59e0b" },
  { name: "Business", value: 8, color: "#ef4444" },
]

const customerGrowth = [
  { week: "W1", new: 12, returning: 28 },
  { week: "W2", new: 15, returning: 32 },
  { week: "W3", new: 18, returning: 35 },
  { week: "W4", new: 14, returning: 38 },
]

const topServices = [
  { name: "Logo Design", orders: 156, revenue: 4680 },
  { name: "Discord Server Setup", orders: 98, revenue: 2940 },
  { name: "Gaming Banner Pack", orders: 87, revenue: 3045 },
  { name: "Social Media Kit", orders: 72, revenue: 2160 },
  { name: "Business Card Design", orders: 65, revenue: 1625 },
]

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  trend: "up" | "down"
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className={`flex items-center gap-1 mt-1 text-sm ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
              {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(change)}%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("30d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Business performance overview</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$41,850"
          change={12.5}
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Total Orders"
          value="442"
          change={8.2}
          trend="up"
          icon={<ShoppingBag className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="New Customers"
          value="128"
          change={15.3}
          trend="up"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Avg. Order Value"
          value="$94.68"
          change={-2.1}
          trend="down"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
            <CardDescription>Orders by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {serviceBreakdown.map((service) => (
                <div key={service.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: service.color }} 
                  />
                  <span className="text-xs text-muted-foreground">
                    {service.name} ({service.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New vs returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="new" name="New" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" name="Returning" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Best performing services this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-semibold">4.9/5</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-semibold">2.4 days</p>
                <p className="text-xs text-muted-foreground">Avg. Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-semibold">98.5%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-violet-500" />
              <div>
                <p className="font-semibold">67%</p>
                <p className="text-xs text-muted-foreground">Return Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
