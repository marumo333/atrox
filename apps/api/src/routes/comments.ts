import { Hono } from 'hono'

export const commentsRouter = new Hono()

commentsRouter.get('/', async (c) => {
  const episodeId = c.req.query('episodeId')
  if (!episodeId) {
    return c.json({ error: 'episodeId is required' }, 400)
  }

  // TODO: wire up db query
  return c.json({ comments: [], episodeId })
})

commentsRouter.post('/', async (c) => {
  const body = await c.req.json<{ episodeId: string; body: string }>()

  if (!body.episodeId || !body.body) {
    return c.json({ error: 'episodeId and body are required' }, 400)
  }

  // TODO: wire up db insert with tier-based weight
  return c.json({ success: true }, 201)
})
