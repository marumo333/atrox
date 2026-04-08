import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@atrox/db'
import { getLemonWebhookSecret } from '@/lib/env-api'
import { variantToTier, isEntitled } from '@/lib/lemon-tier'

export const runtime = 'nodejs'

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
  const hmac = crypto.createHmac('sha256', getLemonWebhookSecret())
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
  const sig = Buffer.from(signature, 'utf8')
  if (digest.length !== sig.length) return false
  return crypto.timingSafeEqual(digest, sig)
}

export async function POST(req: Request) {
  const signature = req.headers.get('x-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const rawBody = await req.text()
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(rawBody) as LemonPayload
  const event = payload.meta.event_name
  const attrs = payload.data.attributes
  const customerId = String(attrs.customer_id)
  const userId = payload.meta.custom_data?.user_id

  const resolveTier = () =>
    isEntitled(attrs.status, attrs.ends_at)
      ? variantToTier(attrs.variant_id)
      : 'free'

  switch (event) {
    case 'subscription_created':
    case 'subscription_updated':
    case 'subscription_resumed': {
      const tier = resolveTier()
      if (userId) {
        await db
          .update(schema.users)
          .set({
            tier,
            lemonCustomerId: customerId,
            subscribedAt: new Date(),
          })
          .where(eq(schema.users.id, userId))
      } else {
        await db
          .update(schema.users)
          .set({ tier, subscribedAt: new Date() })
          .where(eq(schema.users.lemonCustomerId, customerId))
      }
      break
    }
    case 'subscription_expired':
    case 'subscription_cancelled': {
      const tier = resolveTier()
      await db
        .update(schema.users)
        .set({ tier })
        .where(eq(schema.users.lemonCustomerId, customerId))
      break
    }
  }

  return NextResponse.json({ received: true })
}
