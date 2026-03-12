"use client"

import { useState, useEffect } from 'react'
import { RefreshCw, Package, Clock, ChevronRight, ArrowRight, Star, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface PreviousOrder {
  id: string
  serviceType: string
  description: string | null
  price: number | null
  status: string
  createdAt: string
  completedAt: string | null
}

export function QuickReorder() {
  const [previousOrders, setPreviousOrders] = useState<PreviousOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<PreviousOrder | null>(null)
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false)
  const [customDescription, setCustomDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPreviousOrders()
  }, [])

  const fetchPreviousOrders = async () => {
    const supabase = createClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return
    }

    // Fetch completed orders
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['completed', 'delivered'])
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setPreviousOrders(data.map(o => ({
        id: o.id,
        serviceType: o.service_type,
        description: o.description,
        price: o.price,
        status: o.status,
        createdAt: o.created_at,
        completedAt: o.actual_completion
      })))
    }

    setIsLoading(false)
  }

  const handleReorder = async () => {
    if (!selectedOrder) return

    setIsSubmitting(true)

    const supabase = createClient()
    if (!supabase) {
      setIsSubmitting(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsSubmitting(false)
      return
    }

    // Get user profile for customer info
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .single()

    // Create new order based on previous one
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: profile?.full_name || user.email?.split('@')[0] || 'Customer',
        customer_email: profile?.email || user.email,
        customer_phone: profile?.phone,
        service_type: selectedOrder.serviceType,
        description: customDescription || selectedOrder.description || `Reorder of Order #${selectedOrder.id.slice(0, 8).toUpperCase()}`,
        status: 'pending',
        priority: 'normal',
        price: selectedOrder.price,
        paid: false
      })
      .select()
      .single()

    if (!error && data) {
      // Redirect to new order
      window.location.href = `/dashboard/orders/${data.id}`
    }

    setIsSubmitting(false)
    setReorderDialogOpen(false)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  if (previousOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Quick Reorder
          </CardTitle>
          <CardDescription>Easily reorder from your previous orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
            <Package className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">No completed orders yet</p>
            <p className="text-sm text-muted-foreground">Complete an order to enable quick reorder</p>
            <Button asChild className="mt-4">
              <Link href="/order">Place Your First Order</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Quick Reorder
        </CardTitle>
        <CardDescription>Easily reorder from your previous orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {previousOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{order.serviceType}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(order.createdAt)}
                  {order.price && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-foreground">${order.price}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Dialog 
              open={reorderDialogOpen && selectedOrder?.id === order.id} 
              onOpenChange={(open) => {
                setReorderDialogOpen(open)
                if (open) {
                  setSelectedOrder(order)
                  setCustomDescription('')
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reorder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reorder Service</DialogTitle>
                  <DialogDescription>
                    Create a new order based on your previous order
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                  {/* Previous Order Summary */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Previous Order</span>
                    </div>
                    <p className="font-semibold">{order.serviceType}</p>
                    {order.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {order.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-muted-foreground">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      {order.price && (
                        <span className="font-semibold">${order.price}</span>
                      )}
                    </div>
                  </div>

                  {/* Custom Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add any changes or additional requirements for this order..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to use the same requirements as before
                    </p>
                  </div>

                  {/* Price Notice */}
                  {order.price && (
                    <div className="rounded-lg border border-dashed p-3">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Estimated Price:</span>{' '}
                        <span className="font-semibold">${order.price}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Final price may vary based on current rates and requirements
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setReorderDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReorder} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Create New Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}

        {/* View All Link */}
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/dashboard/orders">
            View All Orders
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
