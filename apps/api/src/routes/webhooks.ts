import { Hono } from 'hono'

export const webhooksRouter = new Hono()

webhooksRouter.post('/stripe', async (c) => {
  const sig = c.req.header('stripe-signature')
  if (!sig) {
    return c.json({ error: 'Missing stripe-signature header' }, 400)
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return c.json({ error: 'Webhook secret not configured' }, 500)
  }

  // TODO: wire up Stripe webhook verification + tier updates
  // Must use raw body (c.req.text()) for signature verification
  // Never skip signature verification

  return c.json({ received: true })
})
