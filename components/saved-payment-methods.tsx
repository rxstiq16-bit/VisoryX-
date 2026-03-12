"use client"

import { useState, useEffect } from 'react'
import { CreditCard, Plus, Trash2, Star, Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank'
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: string
}

const CARD_BRAND_COLORS: Record<string, string> = {
  visa: 'bg-blue-600',
  mastercard: 'bg-orange-500',
  amex: 'bg-blue-400',
  discover: 'bg-orange-400',
  default: 'bg-gray-500'
}

const CARD_BRAND_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  default: 'Card'
}

export function SavedPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    setIsLoading(true)
    
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

    // Fetch saved payment methods
    const { data } = await supabase
      .from('saved_payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (data) {
      setPaymentMethods(data.map(pm => ({
        id: pm.id,
        type: pm.type,
        brand: pm.brand,
        last4: pm.last4,
        expiryMonth: pm.expiry_month,
        expiryYear: pm.expiry_year,
        isDefault: pm.is_default,
        createdAt: pm.created_at
      })))
    }

    setIsLoading(false)
  }

  const handleSetDefault = async (methodId: string) => {
    setIsProcessing(true)
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setIsProcessing(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsProcessing(false)
      return
    }

    // Remove default from all
    await supabase
      .from('saved_payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // Set new default
    const { error } = await supabase
      .from('saved_payment_methods')
      .update({ is_default: true })
      .eq('id', methodId)

    if (error) {
      setError('Failed to set default payment method')
    } else {
      setPaymentMethods(prev =>
        prev.map(pm => ({
          ...pm,
          isDefault: pm.id === methodId
        }))
      )
    }

    setIsProcessing(false)
  }

  const handleDelete = async () => {
    if (!selectedMethodId) return

    setIsProcessing(true)
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setIsProcessing(false)
      return
    }

    const { error } = await supabase
      .from('saved_payment_methods')
      .delete()
      .eq('id', selectedMethodId)

    if (error) {
      setError('Failed to delete payment method')
    } else {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== selectedMethodId))
      
      // If we deleted the default, set a new default
      const wasDefault = paymentMethods.find(pm => pm.id === selectedMethodId)?.isDefault
      if (wasDefault && paymentMethods.length > 1) {
        const newDefault = paymentMethods.find(pm => pm.id !== selectedMethodId)
        if (newDefault) {
          await handleSetDefault(newDefault.id)
        }
      }
    }

    setDeleteDialogOpen(false)
    setSelectedMethodId(null)
    setIsProcessing(false)
  }

  const handleAddCard = async () => {
    // In production, this would open Stripe's card element or similar
    // For demo, we'll simulate adding a card
    setIsProcessing(true)
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setIsProcessing(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsProcessing(false)
      return
    }

    // Simulate card addition
    await new Promise(resolve => setTimeout(resolve, 1500))

    const brands = ['visa', 'mastercard', 'amex']
    const randomBrand = brands[Math.floor(Math.random() * brands.length)]
    const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString()

    const { data, error } = await supabase
      .from('saved_payment_methods')
      .insert({
        user_id: user.id,
        type: 'card',
        brand: randomBrand,
        last4: randomLast4,
        expiry_month: Math.floor(1 + Math.random() * 12),
        expiry_year: 2025 + Math.floor(Math.random() * 5),
        is_default: paymentMethods.length === 0,
        stripe_payment_method_id: `pm_demo_${Date.now()}`
      })
      .select()
      .single()

    if (error) {
      setError('Failed to add payment method')
    } else if (data) {
      setPaymentMethods(prev => [
        ...prev,
        {
          id: data.id,
          type: data.type,
          brand: data.brand,
          last4: data.last4,
          expiryMonth: data.expiry_month,
          expiryYear: data.expiry_year,
          isDefault: data.is_default,
          createdAt: data.created_at
        }
      ])
      setAddDialogOpen(false)
    }

    setIsProcessing(false)
  }

  const isExpired = (month: number, year: number) => {
    const now = new Date()
    const expiry = new Date(year, month - 1)
    return expiry < now
  }

  const isExpiringSoon = (month: number, year: number) => {
    const now = new Date()
    const expiry = new Date(year, month - 1)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiry >= now && expiry <= threeMonthsFromNow
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new card to your account for faster checkout
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    In a production environment, this would show a secure card input form from Stripe or your payment provider.
                  </AlertDescription>
                </Alert>

                {/* Placeholder for Stripe Elements */}
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Stripe Card Element would appear here
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCard} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Card (Demo)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
            <CreditCard className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">No payment methods saved</p>
            <p className="text-sm text-muted-foreground">Add a card for faster checkout</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4",
                  method.isDefault && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-10 w-14 items-center justify-center rounded-md text-white",
                    CARD_BRAND_COLORS[method.brand] || CARD_BRAND_COLORS.default
                  )}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {CARD_BRAND_LABELS[method.brand] || 'Card'} ending in {method.last4}
                      </p>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}</span>
                      {isExpired(method.expiryMonth, method.expiryYear) && (
                        <Badge variant="destructive" className="text-xs">Expired</Badge>
                      )}
                      {isExpiringSoon(method.expiryMonth, method.expiryYear) && (
                        <Badge variant="secondary" className="text-xs text-yellow-600">Expiring soon</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={isProcessing}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setSelectedMethodId(method.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
