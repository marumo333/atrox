import { createMiddleware } from 'hono/factory'
import { timingSafeEqual } from 'node:crypto'

export const cronAuth = () =>
  createMiddleware(async (c, next) => {
    const secret = process.env.CRON_SECRET
    if (!secret) {
      return c.json({ error: 'Internal server error' }, 500)
    }

    const auth = c.req.header('authorization') ?? ''
    const expected = `Bearer ${secret}`

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
