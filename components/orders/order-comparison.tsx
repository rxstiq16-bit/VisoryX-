"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GitCompare, X, Check, Minus, ArrowRight } from "lucide-react"
import useSWR from "swr"

interface Order {
  id: string
  orderNumber: string
  title: string
  service: string
  status: string
  total: number
  timeline: string
  revisions: number
  addons: string[]
  createdAt: string
  completedAt?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function OrderComparison() {
  const { data } = useSWR<{ orders: Order[] }>("/api/orders?limit=50", fetcher)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const orders = data?.orders || []
  const comparedOrders = orders.filter((o) => selectedOrders.includes(o.id))

  const addOrder = (orderId: string) => {
    if (selectedOrders.length < 4 && !selectedOrders.includes(orderId)) {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const removeOrder = (orderId: string) => {
    setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
  }

  const comparisonFields = [
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total", format: (v: number) => `$${v.toFixed(2)}` },
    { key: "timeline", label: "Timeline" },
    { key: "revisions", label: "Revisions" },
    { key: "addons", label: "Add-ons", format: (v: string[]) => v.length > 0 ? v.join(", ") : "None" },
    { key: "createdAt", label: "Created", format: (v: string) => new Date(v).toLocaleDateString() },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Compare Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select onValueChange={addOrder} value="">
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Add order to compare..." />
            </SelectTrigger>
            <SelectContent>
              {orders
                .filter((o) => !selectedOrders.includes(o.id))
                .map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.orderNumber} - {order.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {selectedOrders.length}/4 orders selected
          </span>
        </div>

        {comparedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Field</TableHead>
                  {comparedOrders.map((order) => (
                    <TableHead key={order.id} className="min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {order.title}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeOrder(order.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFields.map((field) => (
                  <TableRow key={field.key}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    {comparedOrders.map((order) => {
                      const value = order[field.key as keyof Order]
                      const formatted = field.format
                        ? field.format(value as any)
                        : value
                      return (
                        <TableCell key={order.id}>
                          {field.key === "status" ? (
                            <Badge variant="secondary">{formatted}</Badge>
                          ) : (
                            formatted
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select orders above to compare them side by side</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
