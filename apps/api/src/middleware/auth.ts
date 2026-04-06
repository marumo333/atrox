import { createMiddleware } from 'hono/factory'

interface JwtPayload {
  sub?: string
  userId?: string
  tier?: string
  exp?: number
}

export const auth = () =>
  createMiddleware(async (c, next) => {
    const authHeader = c.req.header('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.slice(7)
    const payload = decodeJwtPayload(token)

    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return c.json({ error: 'Token expired' }, 401)
    }

    const userId = payload.userId ?? payload.sub
    if (!userId) {
      return c.json({ error: 'Invalid token: no user ID' }, 401)
    }

    c.set('userId' as never, userId as never)
    if (payload.tier) {
      c.set('userTier' as never, payload.tier as never)
    }

    await next()
  })

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    if (!payload) return null

    return JSON.parse(atob(payload)) as JwtPayload
  } catch {
    return null
  }
}
