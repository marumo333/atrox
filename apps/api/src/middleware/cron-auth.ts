import { createMiddleware } from 'hono/factory'
import { timingSafeEqual } from 'node:crypto'
import { requireEnv } from '../lib/env'

export const cronAuth = () =>
  createMiddleware(async (c, next) => {
    const expected = `Bearer ${requireEnv('CRON_SECRET')}`
    const auth = c.req.header('authorization') ?? ''

    if (!safeCompare(auth, expected)) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    await next()
  })

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return timingSafeEqual(bufA, bufB)
}
