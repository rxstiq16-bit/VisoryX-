import Stripe from 'stripe'

// Only initialize stripe if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null as unknown as Stripe
