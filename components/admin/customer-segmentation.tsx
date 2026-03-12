"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Users, TrendingUp, DollarSign, ShoppingBag, Mail, Trash2, Edit, Filter } from "lucide-react"

interface Segment {
  id: string
  name: string
  description: string
  criteria: Array<{ field: string; operator: string; value: string }>
  customerCount: number
  totalRevenue: number
  avgOrderValue: number
  color: string
}

const segments: Segment[] = [
  {
    id: "1",
    name: "VIP Customers",
    description: "High-value customers with 5+ orders and $500+ lifetime spend",
    criteria: [
      { field: "order_count", operator: ">=", value: "5" },
      { field: "lifetime_value", operator: ">=", value: "500" },
    ],
    customerCount: 156,
    totalRevenue: 89420,
    avgOrderValue: 287,
    color: "bg-purple-500",
  },
  {
    id: "2",
    name: "Active Subscribers",
    description: "Users with active subscriptions",
    criteria: [{ field: "subscription_status", operator: "=", value: "active" }],
    customerCount: 423,
    totalRevenue: 52890,
    avgOrderValue: 79,
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "At-Risk",
    description: "Haven't ordered in 60+ days but ordered before",
    criteria: [
      { field: "days_since_order", operator: ">=", value: "60" },
      { field: "order_count", operator: ">=", value: "1" },
    ],
    customerCount: 234,
    totalRevenue: 28340,
    avgOrderValue: 121,
    color: "bg-yellow-500",
  },
  {
    id: "4",
    name: "ERLC Enthusiasts",
    description: "Customers who primarily order ERLC-related services",
    criteria: [{ field: "primary_category", operator: "=", value: "erlc" }],
    customerCount: 567,
    totalRevenue: 76540,
    avgOrderValue: 135,
    color: "bg-green-500",
  },
  {
    id: "5",
    name: "New Customers",
    description: "Signed up in the last 30 days",
    criteria: [{ field: "days_since_signup", operator: "<=", value: "30" }],
    customerCount: 189,
    totalRevenue: 12670,
    avgOrderValue: 67,
    color: "bg-pink-500",
  },
]

const fields = [
  { value: "order_count", label: "Order Count" },
  { value: "lifetime_value", label: "Lifetime Value" },
  { value: "days_since_order", label: "Days Since Last Order" },
  { value: "days_since_signup", label: "Days Since Signup" },
  { value: "subscription_status", label: "Subscription Status" },
  { value: "primary_category", label: "Primary Category" },
  { value: "loyalty_tier", label: "Loyalty Tier" },
  { value: "avg_order_value", label: "Average Order Value" },
]

const operators = [
  { value: "=", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: ">=", label: "greater than or equal" },
  { value: "<", label: "less than" },
  { value: "<=", label: "less than or equal" },
  { value: "contains", label: "contains" },
]

export function CustomerSegmentation() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    criteria: [{ field: "", operator: "=", value: "" }],
  })

  const addCriteria = () => {
    setNewSegment({
      ...newSegment,
      criteria: [...newSegment.criteria, { field: "", operator: "=", value: "" }],
    })
  }

  const removeCriteria = (index: number) => {
    setNewSegment({
      ...newSegment,
      criteria: newSegment.criteria.filter((_, i) => i !== index),
    })
  }

  const updateCriteria = (index: number, field: string, value: string) => {
    const updated = [...newSegment.criteria]
    updated[index] = { ...updated[index], [field]: value }
    setNewSegment({ ...newSegment, criteria: updated })
  }

  const totalCustomers = segments.reduce((sum, s) => sum + s.customerCount, 0)
  const totalRevenue = segments.reduce((sum, s) => sum + s.totalRevenue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Segments</h2>
          <p className="text-muted-foreground">Create and manage customer segments for targeted campaigns</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Segment</DialogTitle>
              <DialogDescription>Define criteria to group customers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Segment Name</Label>
                  <Input value={newSegment.name} onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })} placeholder="VIP Customers" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={newSegment.description} onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })} placeholder="High-value customers..." />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Criteria</Label>
                  <Button variant="outline" size="sm" onClick={addCriteria}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {newSegment.criteria.map((criteria, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select value={criteria.field} onValueChange={(v) => updateCriteria(index, "field", v)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((f) => (
                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={criteria.operator} onValueChange={(v) => updateCriteria(index, "operator", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input className="flex-1" value={criteria.value} onChange={(e) => updateCriteria(index, "value", e.target.value)} placeholder="Value" />
                      {newSegment.criteria.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeCriteria(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsCreateOpen(false)}>Create Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCustomers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Segmented</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Filter className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{segments.length}</p>
                <p className="text-sm text-muted-foreground">Active Segments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <TrendingUp className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${Math.round(totalRevenue / totalCustomers)}</p>
                <p className="text-sm text-muted-foreground">Avg per Customer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Order</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${segment.color}`} />
                      <div>
                        <p className="font-medium">{segment.name}</p>
                        <p className="text-sm text-muted-foreground">{segment.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {segment.customerCount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>${segment.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>${segment.avgOrderValue}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {segment.criteria.map((c, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {c.field} {c.operator} {c.value}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
