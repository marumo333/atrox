import { Hono } from 'hono'

export const billingRouter = new Hono()

billingRouter.post('/checkout', async (c) => {
  const { tier } = await c.req.json<{ tier: 'pro' | 'premium' }>()

  if (tier !== 'pro' && tier !== 'premium') {
    return c.json({ error: 'Invalid tier' }, 400)
  }

  // TODO: wire up Stripe checkout session creation
  return c.json({ url: `${process.env.NEXT_PUBLIC_URL}/checkout?tier=${tier}` })
})
