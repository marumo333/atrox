import { Hono } from 'hono'

export const episodesRouter = new Hono()

episodesRouter.get('/', async (c) => {
  const arcId = c.req.query('arcId')
  if (!arcId) {
    return c.json({ error: 'arcId is required' }, 400)
  }

  // TODO: wire up db query with tier-based filtering
  return c.json({ episodes: [], arcId })
})

episodesRouter.get('/:episodeNumber', async (c) => {
  const arcId = c.req.query('arcId')
  const episodeNumber = Number(c.req.param('episodeNumber'))

  if (!arcId) {
    return c.json({ error: 'arcId is required' }, 400)
  }

  // TODO: wire up db query
  return c.json({ episode: null, arcId, episodeNumber })
})
