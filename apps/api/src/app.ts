import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { episodesRouter } from './routes/episodes'
import { commentsRouter } from './routes/comments'
import { billingRouter } from './routes/billing'
import { webhooksRouter } from './routes/webhooks'
import { charactersRouter } from './routes/characters'

export const app = new Hono()

app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/episodes', episodesRouter)
app.route('/comments', commentsRouter)
app.route('/billing', billingRouter)
app.route('/webhooks', webhooksRouter)
app.route('/characters', charactersRouter)
