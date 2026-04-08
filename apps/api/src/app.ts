import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { billingRouter } from './routes/billing'
import { webhooksRouter } from './routes/webhooks'

export const app = new Hono()

app.use(
  '*',
  cors({
    origin: process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
    credentials: true,
  }),
)

app.use('*', secureHeaders())

app.get('/health', (c) => c.json({ status: 'ok' }))

// NOTE: Read-only data (episodes, characters, comments GET) and mutations
// (comments POST, cron) are served from Next.js route handlers in apps/web.
// This Hono app is kept for future billing + webhook endpoints that may
// be deployed separately.
app.route('/billing', billingRouter)
app.route('/webhooks', webhooksRouter)
