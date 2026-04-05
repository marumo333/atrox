import { createMiddleware } from 'hono/factory'

export const auth = () =>
  createMiddleware(async (c, next) => {
    const authHeader = c.req.header('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.slice(7)
    // TODO: validate JWT token with Auth.js
    // For now, extract userId from token payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? '{}')) as {
        sub?: string
      }
      if (!payload.sub) {
        return c.json({ error: 'Invalid token' }, 401)
      }
      c.set('userId' as never, payload.sub as never)
    } catch {
      return c.json({ error: 'Invalid token' }, 401)
    }

    await next()
  })
