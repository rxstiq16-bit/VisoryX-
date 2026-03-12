"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Archive, ArchiveRestore, Trash2, Search, Calendar, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

interface ArchivedOrder {
  id: string
  orderNumber: string
  title: string
  service: string
  total: number
  archivedAt: string
  originalStatus: string
  customer: { name: string; email: string }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function OrderArchive() {
  const { data, mutate } = useSWR<{ orders: ArchivedOrder[] }>("/api/orders/archived", fetcher)
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<ArchivedOrder | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [processing, setProcessing] = useState(false)

  const orders = data?.orders || []
  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRestore = async () => {
    if (!selectedOrder) return
    setProcessing(true)
    try {
      await fetch(`/api/orders/${selectedOrder.id}/restore`, { method: "POST" })
      mutate()
      setShowRestoreDialog(false)
    } finally {
      setProcessing(false)
    }
  }

  const handlePermanentDelete = async () => {
    if (!selectedOrder) return
    setProcessing(true)
    try {
      await fetch(`/api/orders/${selectedOrder.id}/permanent-delete`, { method: "DELETE" })
      mutate()
      setShowDeleteDialog(false)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Orders
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search archived orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Archived</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{order.title}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.service}</Badge>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(order.archivedAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSelectedOrder(order); setShowRestoreDialog(true) }}
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => { setSelectedOrder(order); setShowDeleteDialog(true) }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No archived orders found
          </div>
        )}
      </CardContent>

      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Order</DialogTitle>
            <DialogDescription>
              This will restore the order to its previous status ({selectedOrder?.originalStatus}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>Cancel</Button>
            <Button onClick={handleRestore} disabled={processing}>
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Restore Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently Delete Order</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The order and all associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handlePermanentDelete} disabled={processing}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
