import { Hono } from 'hono'
import Stripe from 'stripe'
import { getEnv } from '../lib/env'

function getStripe(): Stripe {
  return new Stripe(getEnv().STRIPE_SECRET_KEY)
}

export const billingRouter = new Hono()

billingRouter.post('/checkout', async (c) => {
  const { tier } = await c.req.json<{ tier: string }>()

  if (tier !== 'pro' && tier !== 'premium') {
    return c.json({ error: 'Invalid tier' }, 400)
  }

  const env = getEnv()
  const priceId =
    tier === 'premium' ? env.STRIPE_PREMIUM_PRICE_ID : env.STRIPE_PRO_PRICE_ID

  const userId = c.get('userId' as never) as string
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_URL}/dashboard?upgraded=true`,
    cancel_url: `${env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },
  })

  return c.json({ url: session.url })
})
