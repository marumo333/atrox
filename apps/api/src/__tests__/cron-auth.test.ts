import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { cronAuth } from '../middleware/cron-auth'

describe('cronAuth', () => {
  const originalEnv = process.env.CRON_SECRET

  const app = new Hono()
  app.use('*', cronAuth())
  app.get('/', (c) => c.json({ ok: true }))

  it('allows request with valid cron secret', async () => {
    process.env.CRON_SECRET = 'test-secret'
    const res = await app.request('/', {
      headers: { authorization: 'Bearer test-secret' },
    })
    expect(res.status).toBe(200)
    process.env.CRON_SECRET = originalEnv
  })

  it('rejects request without cron secret', async () => {
    process.env.CRON_SECRET = 'test-secret'
    const res = await app.request('/')
    expect(res.status).toBe(401)
    process.env.CRON_SECRET = originalEnv
  })

  it('rejects request with wrong cron secret', async () => {
    process.env.CRON_SECRET = 'test-secret'
    const res = await app.request('/', {
      headers: { authorization: 'Bearer wrong-secret' },
    })
    expect(res.status).toBe(401)
    process.env.CRON_SECRET = originalEnv
  })
})
