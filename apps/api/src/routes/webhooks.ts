import { Hono } from 'hono'
import Stripe from 'stripe'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import { getEnv } from '../lib/env'

function getStripe(): Stripe {
  return new Stripe(getEnv().STRIPE_SECRET_KEY)
}

function resolveTier(sub: Stripe.Subscription): 'pro' | 'premium' | 'free' {
  const env = getEnv()
  const priceId = sub.items.data[0]?.price.id
  if (priceId === env.STRIPE_PREMIUM_PRICE_ID) return 'premium'
  if (priceId === env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'free'
}

export const webhooksRouter = new Hono()

webhooksRouter.post('/stripe', async (c) => {
  const sig = c.req.header('stripe-signature')
  if (!sig) {
    return c.json({ error: 'Missing signature' }, 400)
  }

  const body = await c.req.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      getEnv().STRIPE_WEBHOOK_SECRET,
    )
  } catch {
    return c.json({ error: 'Invalid signature' }, 400)
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const tier = resolveTier(sub)
      const customerId = sub.customer as string
      await db
        .update(users)
        .set({ tier, subscribedAt: new Date() })
        .where(eq(users.stripeCustomerId, customerId))
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await db
        .update(users)
        .set({ tier: 'free' })
        .where(eq(users.stripeCustomerId, sub.customer as string))
      break
    }
  }

  return c.json({ received: true })
})
