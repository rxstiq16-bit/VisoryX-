'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  productId: string
  customerEmail?: string
  customerName?: string
  onComplete?: () => void
}

export function StripeCheckout({ productId, customerEmail, customerName, onComplete }: StripeCheckoutProps) {
  const fetchClientSecret = useCallback(
    async () => {
      const secret = await startCheckoutSession(productId, customerEmail, customerName)
      if (!secret) throw new Error('Failed to create checkout session')
      return secret
    },
    [productId, customerEmail, customerName],
  )

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
