import { createMiddleware } from 'hono/factory'

export const cronAuth = () =>
  createMiddleware(async (c, next) => {
    const secret = process.env.CRON_SECRET
    if (!secret) {
      return c.json({ error: 'CRON_SECRET not configured' }, 500)
    }

    const auth = c.req.header('authorization')
    if (auth !== `Bearer ${secret}`) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    await next()
  })
