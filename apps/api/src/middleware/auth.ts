import { createMiddleware } from 'hono/factory'
import { jwtVerify } from 'jose'
import { requireEnv } from '../lib/env'

function getSecret(): Uint8Array {
  return new TextEncoder().encode(requireEnv('AUTH_SECRET'))
}

interface TokenPayload {
  userId?: string
  sub?: string
  tier?: string
}

export const auth = () =>
  createMiddleware(async (c, next) => {
    const header = c.req.header('authorization')
    if (!header?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = header.slice(7)

    try {
      const { payload } = await jwtVerify(token, getSecret())
      const typed = payload as TokenPayload

      const userId = typed.userId ?? typed.sub
      if (!userId) {
        return c.json({ error: 'Invalid token' }, 401)
      }

      c.set('userId' as never, userId as never)
      if (typed.tier) {
        c.set('userTier' as never, typed.tier as never)
      }
    } catch {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    await next()
  })
