import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { commentsRouter } from './routes/comments'
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

// Read-only data (episodes, characters) is served directly from Next.js
// Server Components via @atrox/db. This API handles mutations only.
app.route('/comments', commentsRouter)
app.route('/billing', billingRouter)
app.route('/webhooks', webhooksRouter)
