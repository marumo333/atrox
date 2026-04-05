import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { tierGuardSimple } from '../middleware/tier-guard'

function createApp(requiredTier: 'free' | 'pro' | 'premium') {
  const app = new Hono()
  app.use('*', async (c, next) => {
    c.set('userTier' as never, 'pro')
    await next()
  })
  app.get('/', tierGuardSimple(requiredTier), (c) => c.json({ ok: true }))
  return app
}

describe('tierGuardSimple', () => {
  it('allows access when user tier meets requirement', async () => {
    const app = createApp('pro')
    const res = await app.request('/')
    expect(res.status).toBe(200)
  })

  it('allows access when user tier exceeds requirement', async () => {
    const app = createApp('free')
    const res = await app.request('/')
    expect(res.status).toBe(200)
  })

  it('blocks access when user tier is insufficient', async () => {
    const app = createApp('premium')
    const res = await app.request('/')
    expect(res.status).toBe(403)
  })
})
