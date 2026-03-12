'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

export async function startCheckoutSession(
  productId: string,
  customerEmail?: string,
  customerName?: string,
) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    metadata: {
      product_id: productId,
      product_name: product.name,
      ...(customerName ? { customer_name: customerName } : {}),
    },
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://visoryx.design'}/order/success?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret
}
