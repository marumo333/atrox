import { Hono } from 'hono'
import crypto from 'node:crypto'
import { db } from '@atrox/db'
import { users } from '@atrox/db/schema'
import { eq } from 'drizzle-orm'
import { getEnv } from '../lib/env'
import { variantToTier, isEntitled } from '../lib/tier-mapping'

interface LemonPayload {
  meta: { event_name: string; custom_data?: { user_id?: string } }
  data: {
    id: string
    attributes: {
      customer_id: number
      variant_id: number
      status: string
      ends_at: string | null
    }
  }
}

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = getEnv().LEMONSQUEEZY_WEBHOOK_SECRET
  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
  const sig = Buffer.from(signature, 'utf8')
  if (digest.length !== sig.length) return false
  return crypto.timingSafeEqual(digest, sig)
}

export const webhooksRouter = new Hono()

webhooksRouter.post('/lemonsqueezy', async (c) => {
  const signature = c.req.header('x-signature')
  if (!signature) return c.json({ error: 'Missing signature' }, 400)

  const rawBody = await c.req.text()
  if (!verifySignature(rawBody, signature)) {
    return c.json({ error: 'Invalid signature' }, 400)
  }

  const payload = JSON.parse(rawBody) as LemonPayload
  const event = payload.meta.event_name
  const attrs = payload.data.attributes
  const customerId = String(attrs.customer_id)
  const userId = payload.meta.custom_data?.user_id

  switch (event) {
    case 'subscription_created':
    case 'subscription_updated':
    case 'subscription_resumed': {
      const tier = isEntitled(attrs.status, attrs.ends_at)
        ? variantToTier(attrs.variant_id)
        : 'free'

      if (userId) {
        await db
          .update(users)
          .set({
            tier,
            lemonCustomerId: customerId,
            subscribedAt: new Date(),
          })
          .where(eq(users.id, userId))
      } else {
        await db
          .update(users)
          .set({ tier, subscribedAt: new Date() })
          .where(eq(users.lemonCustomerId, customerId))
      }
      break
    }
    case 'subscription_expired':
    case 'subscription_cancelled': {
      const tier = isEntitled(attrs.status, attrs.ends_at)
        ? variantToTier(attrs.variant_id)
        : 'free'
      await db
        .update(users)
        .set({ tier })
        .where(eq(users.lemonCustomerId, customerId))
      break
    }
  }

  return c.json({ received: true })
})
