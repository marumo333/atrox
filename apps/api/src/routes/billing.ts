import { Hono } from 'hono'
import {
  lemonSqueezySetup,
  createCheckout,
} from '@lemonsqueezy/lemonsqueezy.js'
import { getEnv } from '../lib/env'
import { auth } from '../middleware/auth'

let initialized = false
function ensureSetup() {
  if (initialized) return
  lemonSqueezySetup({ apiKey: getEnv().LEMONSQUEEZY_API_KEY })
  initialized = true
}

export const billingRouter = new Hono()

// All billing routes require authentication
billingRouter.use('*', auth())

billingRouter.post('/checkout', async (c) => {
  const { tier } = await c.req.json<{ tier: string }>()

  // MVP: only Pro is purchasable. Premium is reserved for a future release.
  if (tier !== 'pro') {
    return c.json({ error: 'Invalid tier' }, 400)
  }

  ensureSetup()
  const env = getEnv()
  const variantId = env.LEMONSQUEEZY_VARIANT_PRO
  const userId = c.get('userId' as never) as string

  const { data, error } = await createCheckout(
    env.LEMONSQUEEZY_STORE_ID,
    variantId,
    {
      checkoutData: {
        custom: { user_id: userId },
      },
      productOptions: {
        redirectUrl: `${env.NEXT_PUBLIC_URL}/dashboard?upgraded=true`,
        receiptButtonText: 'Return to Atrox',
      },
    },
  )

  if (error || !data) {
    return c.json({ error: 'Failed to create checkout' }, 500)
  }

  return c.json({ url: data.data.attributes.url })
})
